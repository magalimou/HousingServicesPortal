const db = require('./db');

const getDoctorSchedule = async (doctorId, dayOfWeek) => {
    const [rows] = await db.query(
        'SELECT * FROM schedule WHERE doctor_id = ? AND day_of_week = ?',
        [doctorId, dayOfWeek]
    );
    return rows;
};

exports.isDoctorAvailable = async (doctorId, date, startTime, duration) => {
    // Convert date to day of the week
    const dayOfWeek = new Date(date).toLocaleString('en-US', { weekday: 'long' });

    // Get doctor's schedule for the specified day
    const schedule = await getDoctorSchedule(doctorId, dayOfWeek);
    if (schedule.length === 0) {
        return false; // Doctor is not available on this day
    }

    // Convert the duration from minutes to a time string
    const endTime = new Date(`1970-01-01T${startTime}Z`);
    endTime.setMinutes(endTime.getMinutes() + duration);
    const endTimeStr = endTime.toISOString().substr(11, 8);

    // Check if the appointment is within the doctor's working hours
    const isWithinWorkingHours = schedule.some(slot => {
        return startTime >= slot.start_time && endTimeStr <= slot.end_time;
    });

    if (!isWithinWorkingHours) {
        return false; // Appointment is not within working hours
    }

    // Check for existing appointments
    const [rows] = await db.query(
        `SELECT COUNT(*) AS count 
         FROM appointment 
         WHERE doctor_id = ? 
         AND date = ? 
         AND (
             (time <= ? AND ADDTIME(time, SEC_TO_TIME(duration * 60)) > ?) OR
             (time < ADDTIME(?, SEC_TO_TIME(? * 60)) AND ADDTIME(time, SEC_TO_TIME(duration * 60)) >= ADDTIME(?, SEC_TO_TIME(? * 60)))
         )`,
        [doctorId, date, startTime, startTime, startTime, duration, startTime, duration]
    );

    return rows[0].count === 0;
};

exports.createAppointment = async (patientId, doctorId, date, time, duration) => {
    const [result] = await db.query(
        'INSERT INTO appointment (patient_id, doctor_id, date, time, duration) VALUES (?, ?, ?, ?, ?)',
        [patientId, doctorId, date, time, duration]
    );

    return {
        id: result.insertId,
        patientId,
        doctorId,
        date,
        time,
        duration
    };
};

exports.getAppointmentsByPatientId = async (patientId) => {
    const [rows] = await db.query(
        'SELECT * FROM appointment WHERE patient_id = ?',
        [patientId]
    );
    return rows;
};

exports.cancelAppointment = async (appointmentId, patientId) => {
    const [result] = await db.query(
        'DELETE FROM appointment WHERE id = ? AND patient_id = ?',
        [appointmentId, patientId]
    );
    return result.affectedRows > 0;
};