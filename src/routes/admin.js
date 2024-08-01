const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientsController');
const doctorController = require('../controllers/doctorController');
const scheduleController = require('../controllers/scheduleController');
const authenticate = require('../middleware/auth');
const { isAdmin } = require('../middleware/role');

router.get('/patients', authenticate, isAdmin, patientController.getAllPatients);
router.get('/patients/:id', authenticate, isAdmin, patientController.getPatientById);
router.post('/doctor', authenticate, isAdmin, doctorController.createDoctor);
router.delete('/doctor/:id', authenticate, isAdmin, doctorController.deleteDoctor);
router.post('/schedule', authenticate, isAdmin, scheduleController.createSchedule);

module.exports = router;
