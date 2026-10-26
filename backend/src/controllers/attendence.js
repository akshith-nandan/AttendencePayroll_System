const Attendence = require('../models/Attendence');
const Settings = require('../models/Settings');

const getBusinessDateKey = (date, timeZone) => {
    const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).formatToParts(date);
    const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
    return `${values.year}-${values.month}-${values.day}`;
};

const getTimeKey = (date, timeZone) => new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
}).format(date);

const isWithinWindow = (date, start, end, timeZone) => {
    const currentTime = getTimeKey(date, timeZone);
    return start <= end
        ? currentTime >= start && currentTime <= end
        : currentTime >= start || currentTime <= end;
};

const checkIn = async (req, res) => {
    try {
        const employeeId = req.user?.id;
        if (!employeeId) {
            return res.status(401).json({ message: 'Authentication is required' });
        }

        const now = new Date();
        const settings = await Settings.findOne();

        if (!settings) {
            return res.status(500).json({
                message: 'Attendance settings are not configured',
            });
        }

        const today = getBusinessDateKey(now, settings.timeZone);

        if (!isWithinWindow(now, settings.checkInStart, settings.checkInEnd, settings.timeZone)) {
            return res.status(400).json({
                message: 'Check-in is not allowed at this time',
            });
        }

        const existing = await Attendence.findOne({
            employeeId,
            date: today,
        });

        if (existing) {
            return res.status(409).json({
                message: 'Attendance already marked for today',
            });
        }

        const photoUrl = req.body.photoUrl;

        if (!photoUrl) {
            return res.status(400).json({
                message: 'Check-in photo is required',
            });
        }

        const attendence = await Attendence.create({
            employeeId,
            date: today,
            checkIn: { time: now, photoUrl },
            status: 'PRESENT',
        });

        return res.status(201).json({
            message: 'Check-in successful',
            attendence
        });
    } catch (error) {
        console.error('Check-in error:', error);
        return res.status(500).json({
            message: 'Failed to check in',
        });
    }
};


const checkOut = async (req, res) => {
    try {
        const employeeId = req.user?.id;
        if (!employeeId) {
            return res.status(401).json({ message: 'Authentication is required' });
        }

        const now = new Date();
        const settings = await Settings.findOne();

        if (!settings) {
            return res.status(500).json({
                message: 'Attendance settings are not configured',
            });
        }

        const today = getBusinessDateKey(now, settings.timeZone);

        if (!isWithinWindow(now, settings.checkOutStart, settings.checkOutEnd, settings.timeZone)) {
            return res.status(400).json({
                message: 'Check-out is not allowed at this time',
            });
        }

        const attendence = await Attendence.findOne({
            employeeId,
            date: today,
        });

        if (!attendence) {
            return res.status(404).json({
                message: 'Please check in before checking out',
            });
        }

        if (attendence.checkOut?.time) {
            return res.status(409).json({
                message: 'Already checked out today',
            });
        }

        if (now <= attendence.checkIn.time) {
            return res.status(400).json({
                message: 'Check-out must be after check-in',
            });
        }

        const photoUrl = req.body.photoUrl;

        if (!photoUrl) {
            return res.status(400).json({
                message: 'Check-out photo is required',
            });
        }

        const workedMinutes = Math.floor(
            (now.getTime() - attendence.checkIn.time.getTime()) / 60000
        );

        attendence.checkOut = { time: now, photoUrl };
        attendence.totalWorkingMinutes = workedMinutes;
        attendence.status = workedMinutes >= settings.requiredWorkingMinutes
            ? 'PRESENT'
            : workedMinutes >= settings.halfDayMinimumMinutes ? 'HALFDAY' : 'INCOMPLETE';

        await attendence.save();

        return res.status(200).json({
            message: 'Check-out successful',
            attendence
        });
    } catch (error) {
        console.error('Check-out error:', error);
        return res.status(500).json({
            message: 'Failed to check out'
        });
    }
};

module.exports = { checkIn,checkOut };