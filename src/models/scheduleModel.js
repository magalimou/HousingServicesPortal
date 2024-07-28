const db = require('./db');

exports.getAllSchedulesWithDoctorNames = async () => {
    const [rows] = await db.query(`
        SELECT 
            s.id, 
            s.doctor_id, 
            s.day_of_week, 
            s.start_time, 
            s.end_time, 
            d.name as doctor_name
        FROM schedule s
        JOIN doctor d ON s.doctor_id = d.id
    `);
    return rows;
};

exports.getSchedulesByDoctorId = async (doctorId) => {
    const [rows] = await db.query(`
        SELECT 
            s.id, 
            s.doctor_id, 
            s.day_of_week, 
            s.start_time, 
            s.end_time, 
            d.name as doctor_name
        FROM schedule s
        JOIN doctor d ON s.doctor_id = d.id
        WHERE s.doctor_id = ?
    `, [doctorId]);
    return rows;
};