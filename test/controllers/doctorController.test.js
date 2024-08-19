const doctorController = require('../../src/controllers/doctorController');   
const doctorModel = require('../../src/models/doctorModel');

jest.mock('../../src/models/doctorModel'); 

describe('Doctor Controller', () => {
    
    describe('listAllDoctors', () => {
        it('should return a list of doctors', async () => {
            const mockDoctors = [{ id: 1, name: 'Dr. Smith' }];
            doctorModel.listAllDoctors.mockResolvedValue(mockDoctors);

            const req = {};
            const res = { 
                json: jest.fn() 
            };

            await doctorController.listAllDoctors(req, res);

            expect(res.json).toHaveBeenCalledWith(mockDoctors);
        });

        it('should handle errors', async () => {
            doctorModel.listAllDoctors.mockRejectedValue(new Error('Database Error'));

            const req = {};
            const res = { 
                status: jest.fn().mockReturnThis(),
                json: jest.fn() 
            };

            await doctorController.listAllDoctors(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error listing doctors. Please try again later.' });
        });
    });

    describe('getDoctorsBySpecialty', () => {

        it('should return a list of doctors filtered by specialty', async () => {
            //test data
            const specialty = 'Cardiology';
            const mockDoctors = [
                { id: 1, name: 'Dr. John Doe', specialty: 'Cardiology' },
                { id: 2, name: 'Dr. Jane Smith', specialty: 'Cardiology' }
            ];

            doctorModel.getDoctorsBySpecialty.mockResolvedValue(mockDoctors);

            const req = { params: { specialty } };
            const res = {
                json: jest.fn()
            };

            await doctorController.getDoctorsBySpecialty(req, res);

            expect(doctorModel.getDoctorsBySpecialty).toHaveBeenCalledWith(specialty);

            expect(res.json).toHaveBeenCalledWith(mockDoctors);
        });

        it('should handle errors', async () => {
            const specialty = 'Cardiology';

            const mockError = new Error('Database Error');
            doctorModel.getDoctorsBySpecialty.mockRejectedValue(mockError);

            const req = { params: { specialty } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await doctorController.getDoctorsBySpecialty(req, res);

            expect(res.status).toHaveBeenCalledWith(500);

            expect(res.json).toHaveBeenCalledWith({ message: 'Error getting doctors by specialty. Please try again later.' });
        });

    });

    describe('createDoctor', () => {
        it('should create a doctor successfully', async () => {
        
            const mockDoctor = { name: 'Dr. Strange', specialty: 'Surgery' };

            doctorModel.createDoctor.mockResolvedValueOnce();

            const req = { body: mockDoctor };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await doctorController.createDoctor(req, res);

            expect(doctorModel.createDoctor).toHaveBeenCalledWith(mockDoctor);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ message: 'Doctor created successfully' });
        });

        it('should handle errors during doctor creation', async () => {
            const mockError = new Error('Database Error');
            doctorModel.createDoctor.mockRejectedValueOnce(mockError);

            const req = { body: { name: 'Dr. Strange', specialty: 'Surgery' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await doctorController.createDoctor(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error creating doctor. Please try again later.' });
        });
    });

    describe('deleteDoctor', () => {
        it('should delete a doctor successfully', async () => {
            const mockDeleteResult = { success: true, message: 'Doctor deleted successfully' };
            
            doctorModel.deleteDoctor.mockResolvedValue(mockDeleteResult);
    
            const req = { params: { id: '1' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
    
            await doctorController.deleteDoctor(req, res);
    
            expect(doctorModel.deleteDoctor).toHaveBeenCalledWith('1');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Doctor deleted successfully' });
        });
    
        it('should handle errors during doctor deletion', async () => {
            const mockDeleteResult = { success: false, message: 'Error deleting doctor' };
            
            doctorModel.deleteDoctor.mockResolvedValue(mockDeleteResult);
    
            const req = { params: { id: '1' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
    
            await doctorController.deleteDoctor(req, res);
    
            expect(doctorModel.deleteDoctor).toHaveBeenCalledWith('1');
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error deleting doctor' });
        });
    });

    describe('updateDoctor', () => {
        it('should update a doctor successfully', async () => {
            const mockUpdateResult = { success: true, message: 'Doctor updated successfully' };
            
            doctorModel.updateDoctor.mockResolvedValue(mockUpdateResult);
    
            const req = { params: { id: '1' }, body: { name: 'Updated Doctor', specialty: 'Updated Specialty' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
    
            await doctorController.updateDoctor(req, res);
    
            expect(doctorModel.updateDoctor).toHaveBeenCalledWith('1', { name: 'Updated Doctor', specialty: 'Updated Specialty' });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Doctor updated successfully' });
        });
    
        it('should handle errors during doctor update', async () => {
            const mockUpdateResult = { success: false, message: 'Error updating doctor' };
            
            doctorModel.updateDoctor.mockResolvedValue(mockUpdateResult);
    
            const req = { params: { id: '1' }, body: { name: 'Updated Doctor', specialty: 'Updated Specialty' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
    
            await doctorController.updateDoctor(req, res);
    
            expect(doctorModel.updateDoctor).toHaveBeenCalledWith('1', { name: 'Updated Doctor', specialty: 'Updated Specialty' });
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error updating doctor' });
        });
    });
 
});