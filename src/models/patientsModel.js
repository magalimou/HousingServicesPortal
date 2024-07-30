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

exports.getPatientById = (id, callback) => {
    db.query('SELECT * FROM patient WHERE id = ?', [id], callback);
};

exports.getAllPatients = async () => {
    const [rows] = await db.query('SELECT * FROM patient');
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


