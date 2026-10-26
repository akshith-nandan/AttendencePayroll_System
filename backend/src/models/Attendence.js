const mongoose = require('mongoose');
const AttendenceSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    checkIn: {
        time: {
            type: Date,
            required: true,
            default: Date.now,
        },
        photoUrl: {
            type: String,
            trim: true,
        },
        storageKey: {
            type: String,
            trim: true,
        },
    },
    checkOut: {
        time: {
            type: Date,
        },
        photoUrl: {
            type: String,
            trim: true,
        },
        storageKey: {
            type: String,
            trim: true,
        },
    },
    totalWorkingMinutes: {
        type: Number,
        min: 0,
    },
    OverTimeMinutes: {
        type: Number,
        min: 0,
    },
    status: {
        type: String,
        enum: ['PRESENT','HALFDAY','ABSENT','INCOMPLETE','LEAVE'],
        required: true,
    }
}, { timestamps: true });

AttendenceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendence', AttendenceSchema);