const mongoose = require('mongoose');
const SettingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true,
    },
    timeZone: {
        type: String,
        default: 'Asia/Kolkata'
    },
    checkInStart: {
        type: String,
        required: true,
        match:  [/^([01]\d|2[0-3]):[0-5]\d$/, 'Time must be in HH:mm format']
    },
    checkInEnd: {
        type: String,
        required: true,
        match: [/^([01]\d|2[0-3]):[0-5]\d$/, 'Time must be in HH:mm format']
    },
    checkOutStart: {
        type: String,
        required: true,
        match: [/^([01]\d|2[0-3]):[0-5]\d$/,'Time must be in HH:mm format']
    },
    checkOutEnd: {
        type: String,
        required: true,
        match: [/^([01]\d|2[0-3]):[0-5]\d$/,'Time must be in HH:mm format']
    },
    requiredWorkingMinutes: {
        type: Number,
        required: true,
    },
    halfDayMinimumMinutes: {
        type: Number,
        required: true,
    },
    lateToleranceMinutes: {
        type: Number,
        required: true,
    },
    overTimeEnabled: {
        type: Boolean,
        default: false,
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
}, { timestamps: true });

module.exports = mongoose.model('Settings',SettingSchema);