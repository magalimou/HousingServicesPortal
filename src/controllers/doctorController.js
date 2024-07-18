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