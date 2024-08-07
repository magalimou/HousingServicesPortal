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

//Admin functions
exports.createSchedule = async (req, res) => {
    try {
        const schedule = req.body;
        await scheduleModel.createSchedule(schedule);
        res.status(201).json({ message: 'Schedule created successfully' });
    } catch (error) {
        console.error('Error creating schedule:', error);
        res.status(500).json({ error: 'Error creating schedule' });
    }
};

exports.deleteScheduleById = async (req, res) => {
    const scheduleId = req.params.id;

    try {
        const result = await scheduleModel.deleteScheduleById(scheduleId);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: result.message });
        }
        res.status(200).json({ message: 'Schedule and associated appointments deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting schedule and appointments' });
    }
};