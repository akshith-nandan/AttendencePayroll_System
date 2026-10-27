const mongoose = require('mongoose');
const PayrollSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        unique: true,
        required: true,
    },
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    month: {
        type: String,
        required: true,
        match: [/^\d{4}-(0[1-9]|1[0-2])$/, 'month must be in YYYY-MM format']
    },
    year: {
        type: String,
        required: true,
        match: [/^\d{4}$/, 'year must be in YYYY format']
    },
    monthlySalary: {
        type: mongoose.Schema.Types.Decimal128,
        required: true,
    },
    payableDays: {
        type: Number,
        required: true,
        min: 0
    },
    presentDays: {
        type: Number,
        required: true,
        min: 0
    },
    halfDays: {
        type: Number,
        required: true,
        min: 0,
    },
    absentDays: {
        type: Number,
        required: true,
        min: 0,
    },
    leaveDays: {
        type: Number,
        required: true,
        min: 0,
    },
    totalWorkingMinutes: {
        type: Number,
        required: true,
        min: 0
    },
    netSalary: {
        type: mongoose.Schema.Types.Decimal128,
        required: true,
    },
    deduction: {
        type: mongoose.Schema.Types.Decimal128,
        required: true,
    },
    bonus: {
        type: mongoose.Schema.Types.Decimal128,
        required: true,
    },
    status: {
        type: String,
        enum: ['DRAFT','APPROVED','PAID'],
        required: true,
    },
    calculatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    paidAt: {
        type: Date,
        required: function() {
            return this.status === 'PAID';
        }
    },
}, { timestamps: true });

module.exports = mongoose.model('Payroll', PayrollSchema);