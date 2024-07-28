const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');

router.get('/', doctorController.listAllDoctors);
router.get('/:specialty', doctorController.getDoctorsBySpecialty);

module.exports = router;