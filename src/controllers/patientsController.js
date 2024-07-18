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



