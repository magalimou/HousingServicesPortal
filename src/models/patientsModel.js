const db = require('./db');

exports.createPatient = async (patient) => {
    const { username, password, firstName, lastName, email, phone, birthdate } = patient;
    await db.query(
      'INSERT INTO patient (username, password, first_name, last_name, email, phone, birthdate) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [username, password, firstName, lastName, email, phone, birthdate]
    );
};

exports.findPatientByUsername = async (username) => {
    const [result] = await db.query('SELECT * FROM patient WHERE username = ?', [username]);
    return result[0];
};

exports.getPatientById = async (id, callback) => {
    const [result]= await db.query('SELECT id, username, first_name, last_name, birthdate, email, phone, role FROM patient WHERE id = ?', [id], callback);
    return result[0];
};

exports.getAllPatients = async () => {
    const [rows] = await db.query('SELECT id, username, first_name, last_name, birthdate, email, phone, role FROM patient');
    return rows;
  };

exports.updatePatient = async (id, updatedData) => {
    const { firstName, lastName, email, phone, birthdate } = updatedData;
    await db.query(
        'UPDATE patient SET first_name = ?, last_name = ?, email = ?, phone = ?, birthdate = ? WHERE id = ?',
        [firstName, lastName, email, phone, birthdate, id]
    );
};

exports.deletePatient = async (patientId) => {
    await db.query('DELETE FROM appointment WHERE patient_id = ?', [patientId]);

    const [result] = await db.query('DELETE FROM patient WHERE id = ?', [patientId]);

    return result.affectedRows > 0; // Return true if a row was deleted, otherwise false
};

exports.updateRoleToAdmin = async (patientId) => {
    try {
        const [result] = await db.query('UPDATE patient SET role = ? WHERE id = ?', ['admin', patientId]);
        return result;
    } catch (error) {
        console.error('Error updating patient role to admin:', error);
        throw error;
    }
};


