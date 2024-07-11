const bcrypt = require('bcryptjs');
const {generateAccessToken} = require('../utils/jwt');
const patientsModel = require('../models/patientsModel');

// Registro de paciente
exports.signup = async (req, res) => {
    const { username, password, firstName, lastName, email, phone, birthdate } = req.body;
  
    try {
      // Verificar si el usuario ya existe
      const existingUser = await patientsModel.findPatientByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: 'El usuario ya existe. Por favor, elige otro nombre de usuario.' });
      }
  
      // Hash de la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Crear nuevo paciente
      await patientsModel.createPatient({
        username,
        password: hashedPassword,
        firstName,
        lastName,
        email,
        phone,
        birthdate
      });
  
      res.status(201).json({ message: 'Usuario registrado exitosamente.' });
      
    } catch (err) {
      console.error('Error al registrar usuario:', err);
      res.status(500).json({ message: 'Error al registrar usuario. Por favor, inténtalo de nuevo más tarde.' });
    }
  };
  
  // Inicio de sesión de paciente
  exports.login = async (req, res) => {
    const { username, password } = req.body;
  
    try {
      // Verificar si el usuario existe
      const user = await patientsModel.findPatientByUsername(username);
      if (!user) {
        return res.status(401).json({ message: 'Credenciales inválidas. Por favor, verifica tu nombre de usuario y contraseña.' });
      }
  
      // Verificar contraseña
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: 'Credenciales inválidas. Por favor, verifica tu nombre de usuario y contraseña.' });
      }
  
      // Generar token JWT
      const token = generateAccessToken({ id: user.id, username: user.username });
  
      res.json({ token });
      
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      res.status(500).json({ message: 'Error al iniciar sesión. Por favor, inténtalo de nuevo más tarde.' });
    }
};



