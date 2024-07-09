const patientsModel = require('../models/patientsModel');

const getAllPatients = (req, res) => {
    patientsModel.getAllPatients((error, results) => {
        if (error) {
            return res.status(500).send({ error: 'An error occurred while fetching patients.' });
        }
        res.json(results);
    });
};

const createPatient = (req, res) => {
    const patientData = req.body;
    patientsModel.createPatient(patientData, (error, results) => {
        if (error) {
            return res.status(500).send(error);
        }
        res.status(201).send('Patient created successfully');
    });
};

const getPatientById = (req, res) => {
    const { id } = req.params;
    patientsModel.getPatientById(id, (error, results) => {
        if (error) {
            return res.status(500).send(error);
        }
        if (results.length === 0) {
            return res.status(404).send('Patient not found');
        }
        res.json(results[0]);
    });
};

const updatePatient = (req, res) => {
    const { id } = req.params;
    const patientData = req.body;
    patientsModel.updatePatient(id, patientData, (error, results) => {
        if (error) {
            return res.status(500).send(error);
        }
        res.send('Patient updated successfully');
    });
};

const deletePatient = (req, res) => {
    const { id } = req.params;
    patientsModel.deletePatient(id, (error, results) => {
        if (error) {
            return res.status(500).send(error);
        }
        res.send('Patient deleted successfully');
    });
};

module.exports = {
    getAllPatients,
    createPatient,
    getPatientById
};
