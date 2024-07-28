const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');

router.get('/', scheduleController.getAllSchedules);
router.get('/:id', scheduleController.getSchedulesByDoctorId);

module.exports = router;
