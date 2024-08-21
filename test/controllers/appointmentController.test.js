const appointmentController = require('../../src/controllers/appointmentController');
const appointmentModel = require('../../src/models/appointmentModel');

// Mocking appointmentModel methods
jest.mock('../../src/models/appointmentModel');

describe('bookAppointment', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {
                doctor_id: 1,
                date: '2024-08-20',
                time: '10:00',
                duration: 30
            },
            user: {
                id: 1
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    it('should return an error if the date is in the past', async () => {
        req.body.date = '2023-01-01'; // Date in the past

        await appointmentController.bookAppointment(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'You cannot book appointments for past dates.' });
    });

    it('should return an error if the doctor is not available at the specified date and time', async () => {
        const doctorId = 1;
        const patientId = 1;
        const date = '2024-08-21';
        const time = '10:00';
        const duration = 60;
    
        req.body = { doctor_id: doctorId, date, time, duration };
        req.user = { id: patientId };
    
        appointmentModel.isDoctorAvailable.mockResolvedValue(false);
    
        await appointmentController.bookAppointment(req, res);
    
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'The doctor is not available on the specified date and time.' });
    });

    it('should successfully schedule an appointment', async () => {
        const doctorId = 1;
        const patientId = 1;
        const date = '2024-08-21';
        const time = '10:00';
        const duration = 60;
    
        req.body = { doctor_id: doctorId, date, time, duration };
        req.user = { id: patientId };
    
        appointmentModel.isDoctorAvailable.mockResolvedValue(true);
        appointmentModel.createAppointment.mockResolvedValue({
            id: 1,
            patient_id: patientId,
            doctor_id: doctorId,
            date,
            time,
            duration
        });
    
        await appointmentController.bookAppointment(req, res);
    
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Appointment successfully scheduled.',
            appointment: expect.objectContaining({
                id: expect.any(Number),
                patient_id: patientId,
                doctor_id: doctorId,
                date,
                time,
                duration
            })
        });
    });

    it('should return a server error if an exception is thrown', async () => {
        const doctorId = 1;
        const patientId = 1;
        const date = '2024-08-21';
        const time = '10:00';
        const duration = 60;
    
        req.body = { doctor_id: doctorId, date, time, duration };
        req.user = { id: patientId };
    
        appointmentModel.isDoctorAvailable.mockRejectedValue(new Error('Database error'));
    
        await appointmentController.bookAppointment(req, res);
    
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Error when scheduling the appointment. Please try again later.' });
    });
});

describe('findNearestAvailableDate', () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: {
                specialty: 'Cardiology'
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    it('should return available date and time slots if available', async () => {
        appointmentModel.findNearestAvailableDateWithDoctorInfo.mockResolvedValue({
            doctor_id: 1,
            doctor_name: 'Dr. Smith',
            date: '2024-08-20'
        });
        appointmentModel.getAvailableTimeSlots.mockResolvedValue(['09:00', '10:00', '11:00']);

        await appointmentController.findNearestAvailableDate(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            doctor_id: 1,
            doctor_name: 'Dr. Smith',
            date: '2024-08-20',
            time_slots: ['09:00', '10:00', '11:00']
        });
    });

    it('should return a 404 error if no available dates are found', async () => {
        appointmentModel.findNearestAvailableDateWithDoctorInfo.mockResolvedValue(null);

        await appointmentController.findNearestAvailableDate(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'No available dates found for this specialty' });
    });

    it('should return a 500 error if an exception is thrown', async () => {
        appointmentModel.findNearestAvailableDateWithDoctorInfo.mockRejectedValue(new Error('Database error'));

        await appointmentController.findNearestAvailableDate(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
});

describe('cancelAppointment', () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: {
                id: 1
            },
            user: {
                id: 1
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    it('should successfully cancel an appointment', async () => {
        appointmentModel.cancelAppointment.mockResolvedValue(true); // Simulate successful cancellation

        await appointmentController.cancelAppointment(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Appointment cancelled successfully' });
    });

    it('should return an error if the appointment is not found or not owned by the patient', async () => {
        appointmentModel.cancelAppointment.mockResolvedValue(false); // Simulate failed cancellation

        await appointmentController.cancelAppointment(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Appointment not found or not yours to cancel' });
    });

    it('should return a server error if an exception is thrown', async () => {
        appointmentModel.cancelAppointment.mockRejectedValue(new Error('Database error')); // Simulate error

        await appointmentController.cancelAppointment(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
});

// Mock request and response objects
const mockRequest = (params = {}) => ({
    params
});

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('getAppointmentsByDoctorId', () => {
    it('should return appointments for the specified doctor', async () => {
        const req = mockRequest({ doctorId: '1' });
        const res = mockResponse();

        // Mock the model function to return fake data
        const appointments = [
            { id: 1, date: '2024-08-20', time: '10:00 AM', patientName: 'John Doe' },
            { id: 2, date: '2024-08-21', time: '11:00 AM', patientName: 'Jane Doe' },
        ];
        appointmentModel.getAppointmentsByDoctorId = jest.fn().mockResolvedValue(appointments);

        await appointmentController.getAppointmentsByDoctorId(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(appointments);
    });

    it('should return a 404 if no appointments are found', async () => {
        const req = mockRequest({ doctorId: '1' });
        const res = mockResponse();

        // Mock the model function to return an empty array
        appointmentModel.getAppointmentsByDoctorId = jest.fn().mockResolvedValue([]);

        await appointmentController.getAppointmentsByDoctorId(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'No appointments found for this doctor.' });
    });

    it('should return a 500 error if an exception is thrown', async () => {
        const req = mockRequest({ doctorId: '1' });
        const res = mockResponse();

        // Mock the model function to throw an error
        appointmentModel.getAppointmentsByDoctorId = jest.fn().mockRejectedValue(new Error('Database error'));

        await appointmentController.getAppointmentsByDoctorId(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Error retrieving appointments. Please try again later.' });
    });
});