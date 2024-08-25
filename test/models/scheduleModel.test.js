const db = require('../../src/models/db');
const scheduleModel = require('../../src/models/scheduleModel');

jest.mock('../../src/models/db', () => ({
    query: jest.fn(),
    getConnection: jest.fn()
}));

describe('Schedule Model', () => {

    beforeEach(() => {
        jest.clearAllMocks(); 
    });

    describe('getAllSchedulesWithDoctorNames', () => {
        it('should retrieve all schedules with doctor names', async () => {
            const mockSchedules = [
                { id: 1, doctor_id: 1, day_of_week: 'Monday', start_time: '09:00', end_time: '17:00', doctor_name: 'Dr. Smith' },
                { id: 2, doctor_id: 2, day_of_week: 'Tuesday', start_time: '10:00', end_time: '18:00', doctor_name: 'Dr. Johnson' }
            ];
            
            db.query.mockResolvedValueOnce([mockSchedules]);

            const result = await scheduleModel.getAllSchedulesWithDoctorNames();

            expect(result).toEqual(mockSchedules);
            expect(db.query).toHaveBeenCalledWith(`
        SELECT 
            s.id, 
            s.doctor_id, 
            s.day_of_week, 
            s.start_time, 
            s.end_time, 
            d.name as doctor_name
        FROM schedule s
        JOIN doctor d ON s.doctor_id = d.id
    `);
        });
    });

    describe('getSchedulesByDoctorId', () => {
        it('should retrieve schedules by doctor ID', async () => {
            const mockSchedules = [
                { id: 1, doctor_id: 1, day_of_week: 'Monday', start_time: '09:00', end_time: '17:00', doctor_name: 'Dr. Smith' }
            ];
            
            db.query.mockResolvedValueOnce([mockSchedules]);

            const result = await scheduleModel.getSchedulesByDoctorId(1);

            expect(result).toEqual(mockSchedules);
            expect(db.query).toHaveBeenCalledWith(`
        SELECT 
            s.id, 
            s.doctor_id, 
            s.day_of_week, 
            s.start_time, 
            s.end_time, 
            d.name as doctor_name
        FROM schedule s
        JOIN doctor d ON s.doctor_id = d.id
        WHERE s.doctor_id = ?
    `, [1]);
        });
    });

    describe('createSchedule', () => {
        it('should create a new schedule', async () => {
            const mockSchedule = { doctor_id: 1, day_of_week: 'Monday', start_time: '09:00', end_time: '17:00' };
            
            db.query.mockResolvedValueOnce([{ insertId: 1 }]);

            await scheduleModel.createSchedule(mockSchedule);

            expect(db.query).toHaveBeenCalledWith(
                'INSERT INTO schedule (doctor_id, day_of_week, start_time, end_time) VALUES (?, ?, ?, ?)',
                [1, 'Monday', '09:00', '17:00']
            );
        });
    });

    describe('deleteScheduleById', () => {
        let connection;
    
        beforeEach(() => {
            connection = {
                beginTransaction: jest.fn(),
                query: jest.fn(),
                commit: jest.fn(),
                rollback: jest.fn(),
                release: jest.fn(),
            };
            db.getConnection.mockResolvedValue(connection);
        });
    
        afterEach(() => {
            jest.clearAllMocks();
        });
    
        it('should delete a schedule by ID and associated appointments', async () => {
            const scheduleId = 1;
            const mockSchedules = [
                { doctor_id: 1, day_of_week: 'Monday', start_time: '08:00:00', end_time: '10:00:00' }
            ];
            const mockResult = { affectedRows: 1 };
    
            connection.query
                .mockResolvedValueOnce([mockSchedules])  // Response for SELECT query to find schedule
                .mockResolvedValueOnce([{ affectedRows: 1 }])  // Response for DELETE query on appointments
                .mockResolvedValueOnce([mockResult]);  // Response for DELETE query on schedule
    
            const result = await scheduleModel.deleteScheduleById(scheduleId);
    
            expect(connection.beginTransaction).toHaveBeenCalled();
            expect(connection.query).toHaveBeenCalledTimes(3);
            expect(connection.query).toHaveBeenCalledWith(
                'SELECT doctor_id, day_of_week, start_time, end_time FROM schedule WHERE id = ?',
                [scheduleId]
            );
            expect(connection.query).toHaveBeenCalledWith(
                'DELETE FROM appointment WHERE doctor_id = ? AND DAYOFWEEK(date) = ? AND time BETWEEN ? AND ?',
                [1, 2, '08:00:00', '10:00:00']
            );
            expect(connection.query).toHaveBeenCalledWith(
                'DELETE FROM schedule WHERE id = ?',
                [scheduleId]
            );
            expect(connection.commit).toHaveBeenCalled();
            expect(result).toEqual(mockResult);
        });
    
        it('should rollback if schedule is not found', async () => {
            const scheduleId = 1;
    
            connection.query.mockResolvedValueOnce([[]]);  // Empty response for SELECT query
    
            const result = await scheduleModel.deleteScheduleById(scheduleId);
    
            expect(connection.beginTransaction).toHaveBeenCalled();
            expect(connection.query).toHaveBeenCalledTimes(1);
            expect(connection.rollback).toHaveBeenCalled();
            expect(result).toEqual({ message: 'Schedule not found' });
        });
    
        it('should rollback and throw an error if any error occurs during the transaction', async () => {
            const scheduleId = 1;
    
            connection.query.mockRejectedValueOnce(new Error('Query failed'));
    
            await expect(scheduleModel.deleteScheduleById(scheduleId)).rejects.toThrow('Query failed');
            expect(connection.beginTransaction).toHaveBeenCalled();
            expect(connection.query).toHaveBeenCalledTimes(1);
            expect(connection.rollback).toHaveBeenCalled();
        });
    });
    
});

