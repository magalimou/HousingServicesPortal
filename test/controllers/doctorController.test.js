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

    // Repeat for other functions (getDoctorsBySpecialty, createDoctor, deleteDoctor, updateDoctor)
});