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

exports.findNearestAvailableDateWithDoctorInfo = async (specialty) => {
    let currentDate = new Date();
    let nearestDate = null;

    while (!nearestDate) {
        currentDate.setDate(currentDate.getDate() + 1); // Avanzar al siguiente día
        const dayOfWeek = currentDate.toLocaleDateString('en-US', { weekday: 'long' });

        const query = `
            SELECT d.id AS doctor_id, d.name AS doctor_name, s.day_of_week, ? AS date
            FROM doctor d
            JOIN schedule s ON d.id = s.doctor_id
            LEFT JOIN appointment a ON d.id = a.doctor_id 
            AND a.date = ? 
            AND (
                a.time BETWEEN s.start_time AND s.end_time
            )
            WHERE d.specialty = ?
            AND s.day_of_week = ?
            ORDER BY s.start_time ASC
            LIMIT 1
        `;

        const [rows] = await db.query(query, [currentDate.toISOString().split('T')[0], currentDate.toISOString().split('T')[0], specialty, dayOfWeek]);

        if (rows.length > 0) {
            nearestDate = rows[0];
        }
    }

    return nearestDate;
};

exports.getAvailableTimeSlots = async (doctorId, date) => {
    const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });

    // Get the doctor's schedules for the requested day
    const [schedule] = await db.query(
        'SELECT start_time, end_time FROM schedule WHERE doctor_id = ? AND day_of_week = ?',
        [doctorId, dayOfWeek]
    );

    // Get existing appointments for the doctor on the requested date
    const [appointments] = await db.query(
        'SELECT time, duration FROM appointment WHERE doctor_id = ? AND date = ?',
        [doctorId, date]
    );

    // Process available slots
    let availableSlots = [];

    for (const slot of schedule) {
        let slotStart = new Date(`1970-01-01T${slot.start_time}Z`);
        let slotEnd = new Date(`1970-01-01T${slot.end_time}Z`);

        // Check for existing appointments that may affect this slot
        let currentStart = slotStart;
        let isSlotAvailable = true;

        for (const appointment of appointments) {
            let appointmentStart = new Date(`1970-01-01T${appointment.time}Z`);
            let appointmentEnd = new Date(appointmentStart.getTime() + appointment.duration * 60000);

            if ((appointmentStart < slotEnd) && (appointmentEnd > slotStart)) {
                // Slot is partially occupied, adjust available time
                if (appointmentStart > currentStart) {
                    availableSlots.push({
                        start_time: currentStart.toISOString().substr(11, 8),
                        end_time: appointmentStart.toISOString().substr(11, 8)
                    });
                }
                currentStart = appointmentEnd;
            }
        }

        // Add the remaining slot if valid
        if (currentStart < slotEnd) {
            availableSlots.push({
                start_time: currentStart.toISOString().substr(11, 8),
                end_time: slotEnd.toISOString().substr(11, 8)
            });
        }
    }

    return availableSlots;
};
