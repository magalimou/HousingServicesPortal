const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientsController');
const doctorController = require('../controllers/doctorController');
const scheduleController = require('../controllers/scheduleController');
const appointmentController = require('../controllers/appointmentController');
const authenticate = require('../middleware/auth');
const { isAdmin } = require('../middleware/role');

router.get('/patients', authenticate, isAdmin, patientController.getAllPatients);
router.get('/patients/:id', authenticate, isAdmin, patientController.getPatientById);
router.patch('/make-admin/:id', authenticate, isAdmin, patientController.makeAdmin);
router.post('/doctor', authenticate, isAdmin, doctorController.createDoctor);
router.delete('/doctor/:id', authenticate, isAdmin, doctorController.deleteDoctor);
router.put('/doctor/:id', authenticate, isAdmin, doctorController.updateDoctor);
router.post('/schedule', authenticate, isAdmin, scheduleController.createSchedule);
router.get('/appointments/:id', authenticate, isAdmin, appointmentController.getAppointmentsByDoctorId);

module.exports = router;
