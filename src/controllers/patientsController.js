const bcrypt = require('bcryptjs');
const {generateAccessToken} = require('../utils/jwt');
const patientsModel = require('../models/patientsModel');

exports.signup = async (req, res) => {

    const { username, password, firstName, lastName, email, phone, birthdate } = req.body;
  
    try {

      const existingUser = await patientsModel.findPatientByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: 'The patient already exists. Please choose another username.' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new patient
      await patientsModel.createPatient({
        username,
        password: hashedPassword,
        firstName,
        lastName,
        email,
        phone,
        birthdate
      });
  
      res.status(201).json({ message: 'Patient registered successfully.' });
      
    } catch (err) {
      console.error('Error registering patient:', err);
      res.status(500).json({ message: 'Error registering patient. Please try again later.' });
    }
};
  
exports.login = async (req, res) => {
    const { username, password } = req.body;
  
    try {
    
      const user = await patientsModel.findPatientByUsername(username);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials. Please verify your username and password.' });
      }
  
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: 'Invalid credentials. Please verify your username and password.' });
      }
  
      const token = generateAccessToken({ id: user.id, username: user.username });
  
      res.json({ token });
      
    } catch (err) {
      console.error('Login error', err);
      res.status(500).json({ message: 'Login error. Please try again later.' });
    }
};

exports.updatePatient = async (req, res) => {
  const patientId = req.user.id;
  console.log('patientId :', patientId);
  const updatedData = req.body;

  try {
      await patientsModel.updatePatient(patientId, updatedData);
      res.status(200).json({ message: 'Patient information updated successfully.' });
  } catch (err) {
      console.error('Error updating patient information:', err);
      res.status(500).json({ message: 'Error updating patient information. Please try again later.' });
  }
};

exports.deletePatient = async (req, res) => {
  try {
      const patientId = req.user.id;
      await patientsModel.deletePatient(patientId);
      res.status(200).json({ message: 'Patient deleted successfully' });
  } catch (error) {
      console.error('Error deleting the patient:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};

// Admin functions
exports.getAllPatients = async (req, res) => {
  try {
    const patients = await patientsModel.getAllPatients();
    res.json(patients);
  } catch (error) {
    res.status(500).send('Server Error');
  }
};

exports.getPatientById = async (req, res) => {
  try {
    const patientId = req.params.id;
    const patient = await patientsModel.getPatientById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json(patient);
  } catch (error) {
    res.status(500).send('Server Error');
  }
}

exports.makeAdmin = async (req, res) => {
  const patientId = req.params.id;
  
  try {
      const result = await patientsModel.updateRoleToAdmin(patientId);
      if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'Patient not found' });
      }
      res.status(200).json({ message: 'Patient role updated to admin' });
  } catch (error) {
      res.status(500).json({ message: 'Error updating patient role to admin' });
  }
};



