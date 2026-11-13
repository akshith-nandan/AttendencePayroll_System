const Payroll = require('../models/Payroll');
const Attendence = require('../models/Attendence');
const User = require('../models/User'); 

const roundMoney = (amount) => {
    return Math.round((amount + Number.EPSILON) * 100) / 100;
}

const isValidPeriod = (month, year) =>{
    return (
        Number.isInteger(month) && 
        month >= 1 && 
        month <= 12 && 
        Number.isInteger(year) &&
        year >= 2000 &&
        year <= 2100 
    );
};

const getWorkingDates = (year, month) => {
    const dates = [];
    const daysInMonth = new Date(
        Date.UTC(year, month, 0)
    ).getUTCDate();

    for (let day = 1; day <= daysInMonth; day++){
        const date = new Date(Date.UTC(
            year, month - 1, day
        ));

        const weekDay = date.getUTCDay();
        if (weekDay !== 0 && weekDay !== 6){
            dates.push(
                `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
            );
        }

    }

    return dates;
}

const generatePayroll = async(req,res) => {
    try {
        const { employeeId, month, year } = req.body;
        const payrollMonth = Number(month);
        const payrollYear = Number(year);
        
        if (!isValidPeriod(payrollMonth,payrollYear)){
            return res.status(400).json({
                message: "Invalid month or year"
            });
        }

        const employee = await User.findById(employeeId);

        if (!employee || employee.role !== "employee"){
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        const existingPayroll = await Payroll.findOne({
            employee: employeeId,
            month: payrollMonth,
            year: payrollYear,
        });

        if (existingPayroll) {
            return res.status(409).json({
                message: "Payroll already generated"
            });
        }

        const monthlySalary = Number(employee.salary);

        if (
            !Number.isFinite(monthlySalary) ||
            monthlySalary < 0
        ) {
            return res.status(400).json({
                message: "Employee salary is not configured"
            });
        }

        const workingDays = getWorkingDates(
            payrollYear,
            payrollMonth
        );

        const attendenceRecords = await Attendence.find({
            employee: employeeId,
            date: { $in:workingDays }
        });

        const presentDates = new Set(
            attendenceRecords
            .filter((records) => records.status === "present")
            .map((record) => record.date)
        );

        const presentDays = presentDates.size;

        const absentDays = workingDays - presentDays;

        const earnedSalary = roundMoney(
            (monthlySalary / workingDays) * presentDays
        );
        
        const payroll = await Payroll.create({
            employee: employeeId,
            month: payrollMonth,
            year: payrollYear,
            monthlySalary,
            workingDays,
            presentDays,
            absentDays,
            earnedSalary,
            bonus: 0,
            deductions: 0,
            netSalary: earnedSalary,
            status: "pending"
        });

        return res.status(200).json({
            message: "Payroll Generated successfully"
        })
    }catch ( error ){
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Payroll already existed"
            });
        }

        return res.status(500).json({
            message: "Failed to generate payroll",
            error: error.message
        });
    }
};

const getAllPayrolls = async(req, res) => {
    try {
        const filter = {};

        if (month !== undefined){
            filter.month = Number(month);
        }

        if (year !== undefined){
            filter.year = Number(year)
        }

        const payrolls = await Payroll.find(filter)
        .populate(
            "employee",
            "name email employeeId department"
        )
        .sort({ year: -1, month: -1});

        return res.status(200).json({
            total: payroll.length,
            payrolls
        });

    } catch( error ){
        return res.status(500).json({
            message:"Failed to fetch  payrolls",
            error: error.message
        });
    }
};

const getEmployeePayroll = async(req, res) =>{
    try{
        const { employeeId } = req.params;

        const payroll = await Payroll.find({
            employee: employeeId
        })
        .populate("employee", "name email employeeId department")
        .sort({ year: -1, month: -1});
        
        return res.status(200).json({
            total: payroll.length,
            payroll
        });
    } catch( error ){
        return res.status(500).json({
            message: "Failed to fetch employee payrolls",
            error: error.message
        });
    }
};

const updatePayroll = async(req, res) => {
    try {
        const { bonus,deductions } = req.body;

        const payroll = await Payroll.findById(req.params.id);

        if (!payroll){
            return res.status(404).json({
                message:"payroll not found"
            });
        }

        if (payroll.status === "paid"){
            return res.status(400).json({
                message: "Paid Payroll cannot be modified"
            });
        }

        if ( bonus !== undefined){
            const value = Number(bonus);

            if (!Number.isFinite(value) || value < 0){
                return res.status(400).json({
                    message: "Invalid bonus"
                });
            }

            payroll.bonus = value;
        }

        if ( deductions !== undefined){
            const value = Number(deductions);

            if (!Number.isFinite(value) || value < 0){
                return res.status(400).json({
                    message: "Invalid Deduction"
                });
            }

            payroll.deductions = value;
        }

        payroll.netSalary = roundMoney(
            Math.max(
                0,
                payroll.earnedSalary + 
                payroll.bonus - 
                payroll.deductions
            )
        );
        
        await payroll.save();

        return res.status(200).json({
            message: "Payroll updated successfully",
            payroll
        });

    } catch( error ){
        return res.status(500).json({
            message: "Failed to update payroll"
        });
    }
};

const makePayrollPaid = async(req, res) => {
    try {
        const payroll = await Payroll.findOneAndUpdate(
            {
                _id: req.params.id,
                status: "pending",
            },
            {
                $set: {
                    status: "paid",
                    paidAt: new Date(),
                }
            },
            {
                new: true,
            }
        );

        return res.status(200).json({
            message:"Payroll make as paid"
        });

    } catch( error ){
        return res.status(500).json({
            message: "Failed to update payment status",
            error: error.message
        });
    }
};

module.exports = {
    generatePayroll,
    getAllPayrolls,
    getEmployeePayroll,
    updatePayroll,
    makePayrollPaid
}
