const doctorModel = require('../models/doctorModel');

exports.listAllDoctors = async (req, res) => {
    try {
        const doctors = await doctorModel.listAllDoctors();
        res.json(doctors);
    } catch (err) {
        console.error('Error listing doctors', err);
        res.status(500).json({ message: 'Error listing doctors. Please try again later.' });
    }
}

exports.getDoctorsBySpecialty = async (req, res) => {
    try {
        const doctors = await doctorModel.getDoctorsBySpecialty(req.params.specialty);
        res.json(doctors);
    } catch (err) {
        console.error('Error getting doctors by specialty', err);
        res.status(500).json({ message: 'Error getting doctors by specialty. Please try again later.' });
    }
}

//Admin functions
exports.createDoctor = async (req, res) => {
    try {
        const doctor = req.body;
        await doctorModel.createDoctor(doctor);
        res.status(201).json({ message: 'Doctor created successfully' });
    } catch (err) {
        console.error('Error creating doctor', err);
        res.status(500).json({ message: 'Error creating doctor. Please try again later.' });
    }
}

exports.deleteDoctor = async (req, res) => {
    const doctorId = req.params.id;

    const result = await doctorModel.deleteDoctor(doctorId);

    if (result.success) {
        res.status(200).json({ message: result.message });
    } else {
        res.status(500).json({ message: result.message });
    }
};

exports.updateDoctor = async (req, res) => {
    const doctorId = req.params.id;
    const doctorData = req.body;

    const result = await doctorModel.updateDoctor(doctorId, doctorData);

    if (result.success) {
        res.status(200).json({ message: result.message });
    } else {
        res.status(500).json({ message: result.message });
    }
};
