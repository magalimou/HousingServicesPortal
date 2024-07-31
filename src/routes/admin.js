const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientsController');
const doctorController = require('../controllers/doctorController');
const authenticate = require('../middleware/auth');
const { isAdmin } = require('../middleware/role');

router.get('/patients', authenticate, isAdmin, patientController.getAllPatients);
router.get('/patients/:id', authenticate, isAdmin, patientController.getPatientById);
router.post('/doctor', authenticate, isAdmin, doctorController.createDoctor);

module.exports = router;
