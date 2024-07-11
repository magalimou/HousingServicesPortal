const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientsController');

router.post('/signup', patientController.signup);
router.post('/login', patientController.login);

module.exports = router;
