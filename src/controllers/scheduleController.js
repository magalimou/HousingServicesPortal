const scheduleModel = require('../models/scheduleModel');

exports.getAllSchedules = async (req, res) => {
    try {
        const schedules = await scheduleModel.getAllSchedulesWithDoctorNames();
        res.json(schedules);
    } catch (error) {
        console.error('Error fetching schedules:', error);
        res.status(500).json({ error: 'Error fetching schedules' });
    }
};

exports.getSchedulesByDoctorId = async (req, res) => {
    const doctorId = req.params.id;
    try {
        const schedules = await scheduleModel.getSchedulesByDoctorId(doctorId);
        if (schedules.length === 0) {
            return res.status(404).json({ error: 'No schedules found for this doctor' });
        }
        res.json(schedules);
    } catch (error) {
        console.error('Error fetching schedules for doctor:', error);
        res.status(500).json({ error: 'Error fetching schedules for doctor' });
    }
};