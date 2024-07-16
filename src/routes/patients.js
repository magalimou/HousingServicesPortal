const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientsController');


router.post('/signup', patientController.signup);
router.post('/login', patientController.login);
/*router.put('/:id', patientController.updatePatient);*/

module.exports = router;
