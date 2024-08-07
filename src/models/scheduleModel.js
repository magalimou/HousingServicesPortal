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

exports.createSchedule = async (schedule) => {
    const { doctor_id, day_of_week, start_time, end_time } = schedule;
    await db.query(
        'INSERT INTO schedule (doctor_id, day_of_week, start_time, end_time) VALUES (?, ?, ?, ?)',
        [doctor_id, day_of_week, start_time, end_time]
    );
}

exports.deleteScheduleById = async (scheduleId) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // Find the schedule to get its details
        const [schedules] = await connection.query(
            'SELECT doctor_id, day_of_week, start_time, end_time FROM schedule WHERE id = ?',
            [scheduleId]
        );

        if (schedules.length === 0) {
            await connection.rollback();
            return { message: 'Schedule not found' };
        }

        const schedule = schedules[0];

        // Delete appointments associated with the schedule
        await connection.query(
            'DELETE FROM appointment WHERE doctor_id = ? AND DAYOFWEEK(date) = ? AND time BETWEEN ? AND ?',
            [schedule.doctor_id, getDayOfWeekNumber(schedule.day_of_week), schedule.start_time, schedule.end_time]
        );

        // Delete the schedule
        const [result] = await connection.query(
            'DELETE FROM schedule WHERE id = ?',
            [scheduleId]
        );

        await connection.commit();
        return result;
    } catch (error) {
        await connection.rollback();
        console.error('Error deleting schedule and appointments:', error);
        throw error;
    } finally {
        connection.release();
    }
};

function getDayOfWeekNumber(dayOfWeek) {
    const days = {
        'Sunday': 1,
        'Monday': 2,
        'Tuesday': 3,
        'Wednesday': 4,
        'Thursday': 5,
        'Friday': 6,
        'Saturday': 7
    };
    return days[dayOfWeek];
}