const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientsController');
const authenticate = require('../middleware/auth');
const { isAdmin } = require('../middleware/role');

router.get('/patients', authenticate, isAdmin, patientController.getAllPatients);
router.get('/patients/:id', authenticate, isAdmin, patientController.getPatientById);

module.exports = router;
