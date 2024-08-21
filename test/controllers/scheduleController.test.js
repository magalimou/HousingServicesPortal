const scheduleController = require('../../src/controllers/scheduleController');
const scheduleModel = require('../../src/models/scheduleModel');

jest.mock('../../src/models/scheduleModel');

describe('Schedule Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    describe('getAllSchedules', () => {
        it('should return all schedules with doctor names', async () => {
            const schedules = [
                { id: 1, doctorName: 'Dr. Smith', time: '09:00-12:00' },
                { id: 2, doctorName: 'Dr. Doe', time: '14:00-17:00' }
            ];

            scheduleModel.getAllSchedulesWithDoctorNames.mockResolvedValue(schedules);

            await scheduleController.getAllSchedules(req, res);

            expect(scheduleModel.getAllSchedulesWithDoctorNames).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith(schedules);
        });

        it('should return a server error if something goes wrong', async () => {
            scheduleModel.getAllSchedulesWithDoctorNames.mockRejectedValue(new Error('Database error'));

            await scheduleController.getAllSchedules(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Error fetching schedules' });
        });
    });

    describe('getSchedulesByDoctorId', () => {
        beforeEach(() => {
            req.params = { id: 1 };
        });

        it('should return schedules for a specific doctor', async () => {
            const schedules = [{ id: 1, time: '09:00-12:00' }];

            scheduleModel.getSchedulesByDoctorId.mockResolvedValue(schedules);

            await scheduleController.getSchedulesByDoctorId(req, res);

            expect(scheduleModel.getSchedulesByDoctorId).toHaveBeenCalledWith(1);
            expect(res.json).toHaveBeenCalledWith(schedules);
        });

        it('should return 404 if no schedules are found for a doctor', async () => {
            scheduleModel.getSchedulesByDoctorId.mockResolvedValue([]);

            await scheduleController.getSchedulesByDoctorId(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'No schedules found for this doctor' });
        });

        it('should return a server error if something goes wrong', async () => {
            scheduleModel.getSchedulesByDoctorId.mockRejectedValue(new Error('Database error'));

            await scheduleController.getSchedulesByDoctorId(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Error fetching schedules for doctor' });
        });
    });

    describe('createSchedule', () => {
        beforeEach(() => {
            req.body = { doctorId: 1, time: '09:00-12:00' };
        });

        it('should create a new schedule', async () => {
            scheduleModel.createSchedule.mockResolvedValue(true);

            await scheduleController.createSchedule(req, res);

            expect(scheduleModel.createSchedule).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ message: 'Schedule created successfully' });
        });

        it('should return a server error if something goes wrong', async () => {
            scheduleModel.createSchedule.mockRejectedValue(new Error('Database error'));

            await scheduleController.createSchedule(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Error creating schedule' });
        });
    });

    describe('deleteScheduleById', () => {
        beforeEach(() => {
            req.params = { id: 1 };
        });

        it('should delete a schedule by ID', async () => {
            scheduleModel.deleteScheduleById.mockResolvedValue({ affectedRows: 1 });

            await scheduleController.deleteScheduleById(req, res);

            expect(scheduleModel.deleteScheduleById).toHaveBeenCalledWith(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Schedule and associated appointments deleted successfully' });
        });

        it('should return 404 if the schedule is not found', async () => {
            scheduleModel.deleteScheduleById.mockResolvedValue({ affectedRows: 0 });

            await scheduleController.deleteScheduleById(req, res);

            expect(scheduleModel.deleteScheduleById).toHaveBeenCalledWith(1);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Schedule not found' });
        });

        it('should return a server error if something goes wrong', async () => {
            scheduleModel.deleteScheduleById.mockRejectedValue(new Error('Database error'));

            await scheduleController.deleteScheduleById(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error deleting schedule and appointments' });
        });
    });
});
