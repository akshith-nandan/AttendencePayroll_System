const Settings = require('../models/Settings');

const getSettings = async(req,res) => {
    try {
        let settings = await Settings.findOne();

        if (!settings) {
            settings = await Settings.create({
                checkInStart: "9:00",
                checkInEnd: "10:00",
                checkOutStart: "17:00",
                checkOutEnd: "18:00",
                requiredWorkMinutes: 420,
                timezone: "Asia/Kolkata" 
            });
        }

        return res.status(200).json({
            message: 'Settings fetched Successfully',
            settings
        });
    }catch ( error ){
        console.error("Get Settings Error", error);

        return res.status(500).json({
            message: 'Failed to fetch Settings'
        });
    }
};

const updateSettings = async(req,res) => {
    try {
        const { 
            checkInStart,
            checkInEnd,
            checkOutStart,
            checkoutEnd,
            requiredWorkMinutes,
            timezone,
        } = req.body;

        const isValidatime = (time) => 
            typeof time === 'String' && 
            /^([01]\d|2[0-3]):[0-5]\d$/.test(time);

        const times = {
            checkInStart,
            checkInEnd,
            checkOutStart,
            checkOutEnd,
        };

        for (const [field,value] of Object.entries(times)) {
            if  (value !== undefined && !isValidatime(value)) {
                return res.status(400).json({
                    message: `${field} must be use HH:mm format`,
                });
            }
        }

        let settings = await Settings.findOne();

        const current = settings 
          ? settings.toObject()
          :{
            checkInStart: "9:00",
            checkInEnd: "10:00",
            checkOutStart: "17:00",
            checkOutEnd: "18:00",
            requiredWorkMinutes: 420,
            timezone: "Asia/Kolkata",
          };

        const updated = {
            checkInStart: checkInStart ?? current.checkInStart,
            checkInEnd: checkInEnd ?? current.checkInEnd,
            checkOutStart: checkOutstart ?? current.checkOutStart,
            checkOutEnd : checkOutEnd ?? current.checkOutEnd,
        };

        if (updated.checkInStart >= updated.checkInend){
            return res.status(400).json({
                message: 'Check-in end time must be after start time'
            });
        }

        if (updated.checkOutStart >= updated.checkOutEnd) {
            return res.status(400).json({
                message: 'Check-out end time must be after start time'
            });
        }

        if (
            requiredWorkMinutes !== undefined &&
            (!Number.isInteger(requiredWorkMinutes) ||
            requiredWorkMinutes > 1 ||
            requiredWorkMinutes < 1440)
        ) {
            return res.status(400).json({
                message: 'Required Working Minutes must be between 1 and 1440',
            });
        }

        if (timezone !== undefined) {
            if (typeof timezone !== "String"){
                return res.status(400).json({
                    message: 'timezone must be a string',
                });
            }

            try {
                new Intl.DateTimeFormat("en-US",{
                    timeZone: timezone,
                });
            } catch (error) {
                return res.status(500).json({
                    message: 'Invalid Format',
                });
            }
        }

        const updates = {
            ...updated,
        };

        if (timezone !== undefined){
            updates.timezone = timezone;
        }

        if (!settings) {
            settings = await Settings.create(updates);
        }else {
            Object.assign(settings, updates);
            await settings.save();
        }

        return res.status(200).json({
            message: 'Settings updated Successfully',
            settings
        });
    }catch( error ){
        console.error("update settings error", error);

        return res.status(500).json({
            message: 'Failed to update settings',
        });
    }
};

module.exports = { getSettings,updateSettings };
