const appointmentModel = require('../../src/models/appointmentModel');
const db = require('../../src/models/db');

jest.mock('../../src/models/db');

describe('Appointment Model', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('isDoctorAvailable', () => {
        it('should return true if the doctor is available', async () => {
            db.query.mockResolvedValueOnce([[{
                start_time: '09:00:00',
                end_time: '17:00:00'
            }]]);

            db.query.mockResolvedValueOnce([[{ count: 0 }]]);

            const result = await appointmentModel.isDoctorAvailable(1, '2024-08-22', '10:00:00', 60);

            expect(result).toBe(true);
            expect(db.query).toHaveBeenCalledTimes(2);
        });

        it('should return false if the doctor is not available on that day', async () => {
            db.query.mockResolvedValueOnce([[]]);

            const result = await appointmentModel.isDoctorAvailable(1, '2024-08-22', '10:00:00', 60);

            expect(result).toBe(false);
            expect(db.query).toHaveBeenCalledTimes(1);
        });

        it('should return false if the appointment is outside the doctor\'s working hours', async () => {
            db.query.mockResolvedValueOnce([[{
                start_time: '09:00:00',
                end_time: '17:00:00'
            }]]);

            const result = await appointmentModel.isDoctorAvailable(1, '2024-08-22', '18:00:00', 60);

            expect(result).toBe(false);
            expect(db.query).toHaveBeenCalledTimes(1);
        });

        it('should return false if there is an overlapping appointment', async () => {
            db.query.mockResolvedValueOnce([[{
                start_time: '09:00:00',
                end_time: '17:00:00'
            }]]);

            db.query.mockResolvedValueOnce([[{ count: 1 }]]);

            const result = await appointmentModel.isDoctorAvailable(1, '2024-08-22', '10:00:00', 60);

            expect(result).toBe(false);
            expect(db.query).toHaveBeenCalledTimes(2);
        });
    });

    describe('createAppointment', () => {
        it('should create a new appointment and return it', async () => {
            db.query.mockResolvedValueOnce([{ insertId: 1 }]);
    
            const result = await appointmentModel.createAppointment(1, 2, '2024-08-22', '10:00:00', 60);
    
            expect(result).toEqual({
                id: 1,
                patientId: 1,
                doctorId: 2,
                date: '2024-08-22',
                time: '10:00:00',
                duration: 60
            });
            expect(db.query).toHaveBeenCalledWith(
                'INSERT INTO appointment (patient_id, doctor_id, date, time, duration) VALUES (?, ?, ?, ?, ?)',
                [1, 2, '2024-08-22', '10:00:00', 60]
            );
        });
    });

    describe('getAppointmentsByPatientId', () => {
        it('should return all appointments for a given patient ID', async () => {
            const mockAppointments = [
                { id: 1, patient_id: 1, doctor_id: 2, date: '2024-08-22', time: '10:00:00', duration: 60 },
                { id: 2, patient_id: 1, doctor_id: 3, date: '2024-08-23', time: '11:00:00', duration: 30 }
            ];
    
            db.query.mockResolvedValueOnce([mockAppointments]);
    
            const result = await appointmentModel.getAppointmentsByPatientId(1);
    
            expect(result).toEqual(mockAppointments);
            expect(db.query).toHaveBeenCalledWith('SELECT * FROM appointment WHERE patient_id = ?', [1]);
        });
    });

    describe('cancelAppointment', () => {
        it('should cancel the appointment and return true if successful', async () => {
            db.query.mockResolvedValueOnce({ affectedRows: 1 });
    
            const result = await appointmentModel.cancelAppointment(1, 1);
    
            expect(result).toBe(true);
            expect(db.query).toHaveBeenCalledWith('DELETE FROM appointment WHERE id = ? AND patient_id = ?', [1, 1]);
        });
    
        it('should return false if no appointment was deleted', async () => {
            db.query.mockResolvedValueOnce({ affectedRows: 0 });
    
            const result = await appointmentModel.cancelAppointment(1, 1);
    
            expect(result).toBe(false);
            expect(db.query).toHaveBeenCalledWith('DELETE FROM appointment WHERE id = ? AND patient_id = ?', [1, 1]);
        });
    });

    describe('findNearestAvailableDateWithDoctorInfo', () => {
        it('should return the nearest available date with doctor information for a given specialty', async () => {
            const mockResult = {
                doctor_id: 1,
                doctor_name: 'Dr. Smith',
                day_of_week: 'Monday',
                date: '2024-08-26'
            };
    
            db.query.mockResolvedValueOnce([ [mockResult] ]);
    
            const result = await appointmentModel.findNearestAvailableDateWithDoctorInfo('Cardiology');
    
            expect(result).toEqual(mockResult);
            expect(db.query).toHaveBeenCalled();
        });
    });

    describe('getAvailableTimeSlots', () => {
        it('should return available time slots for a given doctor on a specific date', async () => {
            const mockSchedule = [
                { start_time: '09:00:00', end_time: '17:00:00' }
            ];
    
            const mockAppointments = [
                { time: '10:00:00', duration: 60 },
                { time: '14:00:00', duration: 30 }
            ];
    
            db.query.mockResolvedValueOnce([mockSchedule]);
            db.query.mockResolvedValueOnce([mockAppointments]);
    
            const result = await appointmentModel.getAvailableTimeSlots(1, '2024-08-22');
    
            expect(result).toEqual([
                { start_time: '09:00:00', end_time: '10:00:00' },
                { start_time: '11:00:00', end_time: '14:00:00' },
                { start_time: '14:30:00', end_time: '17:00:00' }
            ]);
            expect(db.query).toHaveBeenCalledTimes(2);
        });
    });
    
    
});
