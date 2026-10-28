const bcrypt = require('bcrypt');
const User = require('../models/User');

const createEmployee = async(req,res) => {
    try {
        const {
            name,
            email,
            password,
            employeeId,
            department,
            designation,
            salary,
        } = req.body;

        if (!name || !email || !password || !employeeId){
            return res.status(400).json({
                message: 'Name,Email,Password,EmployeeId',
            });
        }

        const existingEmail = await User.findOne({
            email: email.trim().toLowerCase()
        });

        if (existingEmail) {
            return res.status(409).json({
                message: 'Email already exists',
            });
        }

        const hashPassword = await bcrypt.hash(password,12);

        const employee = await User.create({
            name: name.trim(),
            email: existingEmail,
            password: hashPassword,
            employeeId,
            department,
            designation,
            salary,
            role: "employee",
            isActive: true,
        });

        return res.status(201).json({
            message: 'Employee created Successful',
            employee: {
                id: employee._id,
                name: employee.name,
                email: employee.email,
                employeeId: employee.employeeId,
                department: employee.department,
                designation: employee.designation,
                role: employee.role,
            },
        });
    }catch ( error ){
        console.error('Create Employee error', error );

        return res.status(500).json({
            message: 'Failed to create Employee'
        });
    }
};

const getEmployees = async(req,res) => {
    try {
        const employees = await User.find({ role: "employee" })
            .select("-password")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            count: employees.length,
            employees,
        });
    } catch( error ){
        console.error('Get Employees Error', error);

        return res.status(500).json({
            message: 'Failed to Fetch Employees',
        });
    }
};

const  getEmployeeById = async(req,res) => {
    try {
        const employee = await User.findOne({
            _id: req.params.id,
            role: "employee",
        }).select("-password");

        if (!employee) {
            return res.status(404).json({
                message: 'Employee not Found',
            });
        }

        return res.status(200).json({ employee })
    }catch ( error ){
        if (error.name === 'CastError') {
            return res.status(400).json({
                message: 'Invalid employee ID',
            });
        }

        return res.status(500).json({
            message: 'Failed to fetch Employee',
        });
    }
};

const updateEmployee = async(req,res) => {
    try {
        const allowedFields = [
            "name",
            "department",
            "designation",
        ];

        const updates = {};
        for (const field of allowedFields){
            if (req.body[field] !== undefined){
                updates[field] = req.body[field];
            }
        }

        const employee = await User.findOneAndUpdate(
            {
                _id: req.params.id,
                role: "employee",
            },
            { $set: updates },
            {
                new: true,
                runValidators: true,
            }
        ).select("-password");

        if (!employee){
            return res.status(404).json({
                message: 'Employee not Found',
            });
        }

        return res.status(200).json({
            message: 'Employee Updated Successful',
            employee
        });
    } catch ( error ){
        if ( error.name === "CastError"){
            return res.status(400).json({
                message: 'Invalid employee ID'
            });
        }

        return res.status(500).json({
            message: 'Failed to update employee'
        });
    }
};

const deactivateEmployee = async(req,res) => {
    try {
        const employee = await User.findOneAndUpdate(
            {
                _id: req.params.id,
                role: "employee",
            },
            { $set: {isActive: false} },
            { new: true }
        ).select("-password");

        if (!employee) {
            return res.status(404).json({
                message: 'Employee not found'
            });
        }

        return res.status(200).json({
            message: 'Employee Deactivated Successfully'
        });
    }catch ( error ){
        return res.status(500).json({
            message: 'Failed to Deactivate Employee'
        });
    }
};

module.exports = { createEmployee,getEmployees,getEmployeeById,updateEmployee,deactivateEmployee };
