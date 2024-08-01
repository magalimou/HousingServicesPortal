const db = require('./db');


exports.listAllDoctors = async () => {
    const [result] = await db.query('SELECT * FROM doctor');
    return result;
}

exports.getDoctorsBySpecialty = async (specialty) => {
    const [result] = await db.query('SELECT * FROM doctor WHERE specialty = ?', [specialty]);
    return result;
}

exports.createDoctor = async (doctor) => {
    const { name, specialty} = doctor;
    await db.query(
        'INSERT INTO doctor (name, specialty) VALUES (?, ?)',
        [name, specialty]
    );
}

exports.deleteDoctor = async (doctorId) => {
    try {
        // Start transaction
        await db.query('START TRANSACTION');

        // Delete schedules associated with the doctor
        await db.query('DELETE FROM schedule WHERE doctor_id = ?', [doctorId]);

        // Delete appointments associated with the doctor
        await db.query('DELETE FROM appointment WHERE doctor_id = ?', [doctorId]);

        // Delete the doctor
        const [result] = await db.query('DELETE FROM doctor WHERE id = ?', [doctorId]);

        // Commit transaction
        await db.query('COMMIT');

        if (result.affectedRows === 0) {
            return { success: false, message: 'Doctor not found' };
        }

        return { success: true, message: 'Doctor and related schedules and appointments deleted successfully' };
    } catch (error) {
        // Rollback transaction in case of error
        await db.query('ROLLBACK');
        console.error('Error deleting doctor:', error);
        return { success: false, message: 'Error deleting doctor' };
    }
};

exports.updateDoctor = async (doctorId, doctorData) => {
    try {
        const { name, specialty } = doctorData;
        const [result] = await db.query(
            'UPDATE doctor SET name = ?, specialty = ? WHERE id = ?',
            [name, specialty, doctorId]
        );

        if (result.affectedRows === 0) {
            return { success: false, message: 'Doctor not found' };
        }

        return { success: true, message: 'Doctor updated successfully' };
    } catch (error) {
        console.error('Error updating doctor:', error);
        return { success: false, message: 'Error updating doctor' };
    }
};




