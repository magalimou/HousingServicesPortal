const bcrypt = require('bcryptjs');
const {generateAccessToken} = require('../../src/utils/jwt');
const patientController = require('../../src/controllers/patientsController');
const patientsModel = require('../../src/models/patientsModel');

jest.mock('../../src/models/patientsModel');
jest.mock('bcryptjs');

describe('Patient Controller - Signup', () => {
    it('should register a new patient successfully', async () => {
        const req = {
            body: {
                username: 'newUser',
                password: 'password123',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                phone: '123456789',
                birthdate: '1990-01-01'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        patientsModel.findPatientByUsername.mockResolvedValue(null);
        bcrypt.hash.mockResolvedValue('hashedPassword');
        patientsModel.createPatient.mockResolvedValue(true);

        await patientController.signup(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: 'Patient registered successfully.' });
    });

    it('should return an error if the patient already exists', async () => {
        const req = {
            body: {
                username: 'existingUser',
                password: 'password123',
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        patientsModel.findPatientByUsername.mockResolvedValue({ id: 1 });

        await patientController.signup(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'The patient already exists. Please choose another username.' });
    });

    it('should return a server error if something goes wrong', async () => {
        const req = {
            body: {
                username: 'newUser',
                password: 'password123',
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        patientsModel.findPatientByUsername.mockRejectedValue(new Error('Database error'));

        await patientController.signup(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Error registering patient. Please try again later.' });
    });
});

describe('Patient Controller - Login', () => {
    it('should log in a patient successfully', async () => {
        const req = {
            body: {
                username: 'existingUser',
                password: 'password123'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const user = {
            id: 1,
            username: 'existingUser',
            password: 'hashedPassword'
        };

        patientsModel.findPatientByUsername.mockResolvedValue(user);
        bcrypt.compare.mockResolvedValue(true);

        await patientController.login(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            token: expect.any(String)
        }));
    });

    it('should return an error if the patient does not exist', async () => {
        const req = {
            body: {
                username: 'nonExistingUser',
                password: 'password123'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        patientsModel.findPatientByUsername.mockResolvedValue(null);

        await patientController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials. Please verify your username and password.' });
    });

    it('should return an error if the password is incorrect', async () => {
        const req = {
            body: {
                username: 'existingUser',
                password: 'wrongPassword'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const user = {
            id: 1,
            username: 'existingUser',
            password: 'hashedPassword'
        };

        patientsModel.findPatientByUsername.mockResolvedValue(user);
        bcrypt.compare.mockResolvedValue(false);

        await patientController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials. Please verify your username and password.' });
    });

    it('should return a server error if something goes wrong', async () => {
        const req = {
            body: {
                username: 'existingUser',
                password: 'password123'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        patientsModel.findPatientByUsername.mockRejectedValue(new Error('Database error'));

        await patientController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Login error. Please try again later.' });
    });
});

describe('Patient Controller - Update Patient', () => {
    it('should update patient information successfully', async () => {
        const req = {
            user: { id: 1 },
            body: { email: 'newemail@example.com' }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        patientsModel.updatePatient.mockResolvedValue(true);

        await patientController.updatePatient(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Patient information updated successfully.' });
    });

    it('should return a server error if something goes wrong', async () => {
        const req = {
            user: { id: 1 },
            body: { email: 'newemail@example.com' }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        patientsModel.updatePatient.mockRejectedValue(new Error('Database error'));

        await patientController.updatePatient(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Error updating patient information. Please try again later.' });
    });
});

describe('Patient Controller - Get All Patients', () => {
    let req, res;

    beforeEach(() => {
        req = {};

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn(), 
        };
    });

    it('should return all patients', async () => {

        const patients = [{ id: 1, name: 'John Doe' }];
        patientsModel.getAllPatients.mockResolvedValue(patients);

        await patientController.getAllPatients(req, res);

        expect(res.json).toHaveBeenCalledWith(patients);
    });

    it('should return a server error if something goes wrong', async () => {
        patientsModel.getAllPatients.mockRejectedValue(new Error('Database error'));
    
        await patientController.getAllPatients(req, res);
    
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith('Server Error'); 
    });
});

