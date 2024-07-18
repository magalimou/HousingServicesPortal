const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');

router.get('/', doctorController.listAllDoctors);
router.get('/specialty/:specialty', doctorController.getDoctorsBySpecialty);
router.get('/:id/schedule', doctorController.getDoctorSchedule);


module.exports = router;