const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientsController');
const authenticate = require('../middleware/auth');
const { isAdmin } = require('../middleware/role');

router.get('/patients', authenticate, isAdmin, patientController.getAllPatients);

module.exports = router;
