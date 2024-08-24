const db = require('../../src/models/db');
const doctorModel = require('../../src/models/doctorModel');

jest.mock('../../src/models/db');

describe('Doctor Model', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('listAllDoctors', () => {
        it('should return all doctors', async () => {
            const mockDoctors = [
                { id: 1, name: 'Dr. John Doe', specialty: 'Cardiology' },
                { id: 2, name: 'Dr. Jane Smith', specialty: 'Neurology' }
            ];

            db.query.mockResolvedValueOnce([mockDoctors]);

            const result = await doctorModel.listAllDoctors();

            expect(result).toEqual(mockDoctors);
            expect(db.query).toHaveBeenCalledWith('SELECT * FROM doctor');
        });
    });

    describe('getDoctorsBySpecialty', () => {
        it('should return doctors by specialty', async () => {
            const specialty = 'Cardiology';
            const mockDoctors = [
                { id: 1, name: 'Dr. John Doe', specialty: 'Cardiology' }
            ];

            db.query.mockResolvedValueOnce([mockDoctors]);

            const result = await doctorModel.getDoctorsBySpecialty(specialty);

            expect(result).toEqual(mockDoctors);
            expect(db.query).toHaveBeenCalledWith('SELECT * FROM doctor WHERE specialty = ?', [specialty]);
        });
    });

    describe('createDoctor', () => {
        it('should create a new doctor', async () => {
            const newDoctor = { name: 'Dr. John Doe', specialty: 'Cardiology' };

            await doctorModel.createDoctor(newDoctor);

            expect(db.query).toHaveBeenCalledWith(
                'INSERT INTO doctor (name, specialty) VALUES (?, ?)',
                [newDoctor.name, newDoctor.specialty]
            );
        });
    });

    describe('deleteDoctor', () => {
        it('should delete the doctor and related data successfully', async () => {
            db.query
                .mockResolvedValueOnce({}) // START TRANSACTION
                .mockResolvedValueOnce({}) // DELETE FROM schedule
                .mockResolvedValueOnce({}) // DELETE FROM appointment
                .mockResolvedValueOnce([{ affectedRows: 1 }]) // DELETE FROM doctor
                .mockResolvedValueOnce({}); // COMMIT

            const result = await doctorModel.deleteDoctor(1);

            expect(result).toEqual({
                success: true,
                message: 'Doctor and related schedules and appointments deleted successfully'
            });
            expect(db.query).toHaveBeenCalledTimes(5);
        });

        it('should return error message if doctor not found', async () => {
            db.query
                .mockResolvedValueOnce({}) // START TRANSACTION
                .mockResolvedValueOnce({}) // DELETE FROM schedule
                .mockResolvedValueOnce({}) // DELETE FROM appointment
                .mockResolvedValueOnce([{ affectedRows: 0 }]) // DELETE FROM doctor
                .mockResolvedValueOnce({}); // COMMIT

            const result = await doctorModel.deleteDoctor(1);

            expect(result).toEqual({
                success: false,
                message: 'Doctor not found'
            });
            expect(db.query).toHaveBeenCalledTimes(5);
        });

        it('should rollback and return error message if an error occurs', async () => {
            db.query
                .mockResolvedValueOnce({}) // START TRANSACTION
                .mockRejectedValueOnce(new Error('Database error')) // Error in DELETE FROM schedule
                .mockResolvedValueOnce({}); // ROLLBACK

            const result = await doctorModel.deleteDoctor(1);

            expect(result).toEqual({
                success: false,
                message: 'Error deleting doctor'
            });
            expect(db.query).toHaveBeenCalledTimes(3);
        });
    });

    describe('updateDoctor', () => {
        it('should update the doctor successfully', async () => {
            const updatedDoctor = { name: 'Dr. John Doe', specialty: 'Cardiology' };

            db.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

            const result = await doctorModel.updateDoctor(1, updatedDoctor);

            expect(result).toEqual({
                success: true,
                message: 'Doctor updated successfully'
            });
            expect(db.query).toHaveBeenCalledWith(
                'UPDATE doctor SET name = ?, specialty = ? WHERE id = ?',
                [updatedDoctor.name, updatedDoctor.specialty, 1]
            );
        });

        it('should return error message if doctor not found', async () => {
            const updatedDoctor = { name: 'Dr. John Doe', specialty: 'Cardiology' };

            db.query.mockResolvedValueOnce([{ affectedRows: 0 }]);

            const result = await doctorModel.updateDoctor(1, updatedDoctor);

            expect(result).toEqual({
                success: false,
                message: 'Doctor not found'
            });
        });

        it('should return error message if an error occurs', async () => {
            const updatedDoctor = { name: 'Dr. John Doe', specialty: 'Cardiology' };

            db.query.mockRejectedValueOnce(new Error('Database error'));

            const result = await doctorModel.updateDoctor(1, updatedDoctor);

            expect(result).toEqual({
                success: false,
                message: 'Error updating doctor'
            });
        });
    });
});

