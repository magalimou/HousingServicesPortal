const bcrypt = require('bcryptjs');
const {generateAccessToken} = require('../utils/jwt');
const patientsModel = require('../models/patientsModel');


exports.signup = async (req, res) => {

    const { username, password, firstName, lastName, email, phone, birthdate } = req.body;
  
    try {

      const existingUser = await patientsModel.findPatientByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: 'The user already exists. Please choose another username.' });
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
  
      res.status(201).json({ message: 'User registered successfully.' });
      
    } catch (err) {
      console.error('Error registering user:', err);
      res.status(500).json({ message: 'Error registering user. Please try again later.' });
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



