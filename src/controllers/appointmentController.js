const appointmentModel = require('../models/appointmentModel');

exports.bookAppointment = async (req, res) => {
    const { doctorId, date, time, duration } = req.body;
    const patientId = req.user.id; // Extract Patient ID from JWT Token
    console.log('Patient ID:', patientId);

    try {
        // Check if the doctor is available on the specified date and time
        const isAvailable = await appointmentModel.isDoctorAvailable(doctorId, date, time, duration);

        if (!isAvailable) {
            return res.status(400).json({ message: 'The doctor is not available on the specified date and time.' });
        }

        //Create appointment
        const appointment = await appointmentModel.createAppointment(patientId, doctorId, date, time, duration);

        res.status(201).json({ message: 'Appointment successfully scheduled.', appointment });

    } catch (err) {
        console.error('Error scheduling the appointment:', err);
        res.status(500).json({ message: 'Error when scheduling the appointment. Please try again later.' });
    }
};

exports.findNearestAvailableDate = async (req, res) => {
    try {
        const { specialty } = req.params;
        const availableDate = await appointmentModel.findNearestAvailableDateWithDoctorInfo(specialty);

        if (availableDate) {
            const availableTimeSlots = await appointmentModel.getAvailableTimeSlots(
                availableDate.doctor_id,
                availableDate.date
            );

            res.status(200).json({
                doctor_id: availableDate.doctor_id,
                doctor_name: availableDate.doctor_name,
                date: availableDate.date,
                time_slots: availableTimeSlots
            });
        } else {
            res.status(404).json({ message: 'No available dates found for this specialty' });
        }
    } catch (error) {
        console.error('Error finding nearest available date:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
