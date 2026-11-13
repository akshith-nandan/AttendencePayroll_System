const Attendence = require('../models/Attendence');
const User = require('../models/User');
const USer = require('../models/User');

const isValidDate = (value) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")){
        return false
    }
    const date = new Date(`${value}T00:00:00:000Z`);

    return (
        !Number.isNaN(date.getTime()) &&
        date.toISOString().slice(0,10) === value
    )
}

const getSummary = (records) => {
    return {
        totalRecords: records.length,
        present: records.filter(
            (r) => r.status === "present"
        ).length,
        shortHours: records.filter(
            (r) => r.status === "short-hours"
        ).length,
        totalWorkingMinutes: records.reduce(
            (total, r) => total + (r.workingMinutes || 0),
            0
        ),
    };
};

const getDailyReport = async(req,res) => {
    try {
        const { date } = req.query;

        if (!isValidDate(date)) {
            return res.status(400).json({
                message: "Provide a valid date in YYYY-MM-DD format"
            });
        }

        const records = await Attendence.find({date})
        .populate("employee", "name email employeeId department")
        .sort({ checkIn: 1});

        return res.status(200).json({
            date,
            summary: getSummary(records),
            records,
        });
    } catch (error){
        console.error("Daily Report error", error)

        return res.status(500).json({
            message: "Failed to get Daily Report"
        });
    }
};

const getWeeklyReport = async(req,res) => {
    try {
        const { startDate } = req.query;

        if (!isValidateDate(startDate)){
            return res.status(400).json({
                message: "Provide a valid startDate in YYYY-MM-DD format"
            });
        }

        const start = new Date(`${startDate}T00:00:00:000z`);

        if (start.getUTCDate() !== 1){
            return res.status.json({
                message: "startDate must be Monday"
            });
        }

        const end = new Date(start);
        end.setUTCDate(end.getUTCDate() + 7);

        const endDate = end.toISOString().slice(0,10);

        const records = await Attendence.find({
            date: { $gte: startDate, $lt: endDate},
        })
        .populate("employee","name email employeeId department")
        .sort({ date: 1, checkIn: 1})

        return res.status(200).json({
            startDate,
            endDate: new Date(end.gettime() - 86400000)
            .toISOString()
            .slice(0, 10),
            summary: getSummary(records),
            records
        });
    }catch ( error ){
        console.error("Weekly report error", error);

        return res.status(500).json({
            message: "Failed to get Weekly Report",
        });
    }
};

const getMonthlyReport = async(req,res) => {
    try {
        const { year, month } = req.query;

        const y = Number(year);
        const m = Number(month);

        if (
            !Number.isInteger(y) || 
            y < 2000 ||
            y > 9999 ||
            !Number.isInteger(m) ||
            m < 1 ||
            m > 12
        ) {
            return res.status(400).json({
                message: "Provide a valid year and month (1-12)"
            });
        }

        const startDate = `${y}-${String(m).padStart(2, "0")}-01`;

        const nextMonth = new Date(
            Date.UTC(y, m, 1)
        );

        const endDate = nextMonth.toISOString().slice(0,10);

        const records = await Attendence.find({
            date: { $gte: startDate, $lt: endDate },
        })
        .populate("employee", "name email employeeId department")
        .sort({ date: 1 });

        return res.status(200).json({
            year: y,
            month: m,
            summary: getSummary(records),
            records,
        });
    }catch ( error ){
        console.error("Monthly report error", error);

        return res.status(500).json({
            message: "Failed to generate Monthly Report"
        });
    }
};

const getEmployeeReport = async(req,res) => {
    try {
        const { employeeId } = req.params;
        const{ startDate, endDate } = req.query;

        if (
            !isValidDate(startDate) ||
            !isValidDate(endDate) ||
            startDate > endDate
        ) {
            return res.status(400).json({
                message: "Provide a valid date range"
            });
        }
        
        const employee = await User.findOne({
            _id: employeeId,
            role: "employee",
        }).select("name email employeeId department");

        if (!employee){
            return res.status(400).json({
                message: "Employee not Found"
            });
        }

        const records = await Attendence.find({
            employee: employee._id,
            date: { $gte: startDate, $lt:endDate },
        }).sort({ date: 1})

        return res.status(200).json({
            employee,
            startDate,
            endDate,
            summary: getSummary(records),
            records,
        });
    }catch ( error ){
        console.error("Get Employee Report Error",error);

        if (error.name === "CastError"){
            return res.status(400).json({
                message: "Invalid employee ID"
            });
        }

        return res.status(500).json({
            message: "Failed to generate Employee report"
        });
    }
};

module.exports = { getDailyReport, getWeeklyReport, getMonthlyReport, getEmployeeReport};