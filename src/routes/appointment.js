const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const authenticate = require('../middleware/auth');

router.post('/book', authenticate, appointmentController.bookAppointment);
router.get('/nearest/:specialty', appointmentController.findNearestAvailableDate);


module.exports = router;