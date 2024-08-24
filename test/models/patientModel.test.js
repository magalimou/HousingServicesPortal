const db = require('../../src/models/db');
const patientModel = require('../../src/models/patientsModel');

jest.mock('../../src/models/db');

describe('Patient Model', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createPatient', () => {
        it('should create a new patient', async () => {
            const newPatient = {
                username: 'johnDoe',
                password: 'password123',
                firstName: 'John',
                lastName: 'Doe',
                email: 'johndoe@example.com',
                phone: '123456789',
                birthdate: '1990-01-01'
            };

            await patientModel.createPatient(newPatient);

            expect(db.query).toHaveBeenCalledWith(
                'INSERT INTO patient (username, password, first_name, last_name, email, phone, birthdate) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [newPatient.username, newPatient.password, newPatient.firstName, newPatient.lastName, newPatient.email, newPatient.phone, newPatient.birthdate]
            );
        });
    });

    describe('findPatientByUsername', () => {
        it('should find a patient by username', async () => {
            const mockPatient = {
                id: 1,
                username: 'johnDoe',
                first_name: 'John',
                last_name: 'Doe',
                email: 'johndoe@example.com'
            };

            db.query.mockResolvedValueOnce([[mockPatient]]);

            const result = await patientModel.findPatientByUsername('johnDoe');

            expect(result).toEqual(mockPatient);
            expect(db.query).toHaveBeenCalledWith('SELECT * FROM patient WHERE username = ?', ['johnDoe']);
        });
    });

    describe('getPatientById', () => {
        it('should get a patient by ID', async () => {
            const mockPatient = {
                id: 1,
                username: 'johnDoe',
                first_name: 'John',
                last_name: 'Doe',
                email: 'johndoe@example.com',
                phone: '123456789',
                birthdate: '1990-01-01',
                role: 'user'
            };

            db.query.mockResolvedValueOnce([[mockPatient]]);

            const result = await patientModel.getPatientById(1);

            expect(result).toEqual(mockPatient);
            expect(db.query).toHaveBeenCalledWith(
                'SELECT id, username, first_name, last_name, birthdate, email, phone, role FROM patient WHERE id = ?',
                [1]
            );
        });
    });

    describe('updatePatient', () => {
        it('should update a patient\'s details', async () => {
            const updatedData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'newemail@example.com',
                phone: '123456789',
                birthdate: '1990-01-01'
            };

            await patientModel.updatePatient(1, updatedData);

            expect(db.query).toHaveBeenCalledWith(
                'UPDATE patient SET first_name = ?, last_name = ?, email = ?, phone = ?, birthdate = ? WHERE id = ?',
                [updatedData.firstName, updatedData.lastName, updatedData.email, updatedData.phone, updatedData.birthdate, 1]
            );
        });
    });

    describe('deletePatient', () => {
        it('should delete a patient and associated appointments', async () => {
            db.query
                .mockResolvedValueOnce({}) // Delete appointments
                .mockResolvedValueOnce([{ affectedRows: 1 }]); // Delete patient

            const result = await patientModel.deletePatient(1);

            expect(result).toBe(true);
            expect(db.query).toHaveBeenCalledWith('DELETE FROM appointment WHERE patient_id = ?', [1]);
            expect(db.query).toHaveBeenCalledWith('DELETE FROM patient WHERE id = ?', [1]);
        });

        it('should return false if patient not found', async () => {
            db.query
                .mockResolvedValueOnce({}) // Delete appointments
                .mockResolvedValueOnce([{ affectedRows: 0 }]); // Delete patient

            const result = await patientModel.deletePatient(1);

            expect(result).toBe(false);
        });
    });

    describe('updateRoleToAdmin', () => {
        it('should update a patient\'s role to admin', async () => {
            db.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

            const result = await patientModel.updateRoleToAdmin(1);

            expect(result).toEqual([{ affectedRows: 1 }]);
            expect(db.query).toHaveBeenCalledWith(
                'UPDATE patient SET role = ? WHERE id = ?',
                ['admin', 1]
            );
        });

        it('should throw an error if the query fails', async () => {
            db.query.mockRejectedValueOnce(new Error('Database error'));

            await expect(patientModel.updateRoleToAdmin(1)).rejects.toThrow('Database error');
        });
    });
});

