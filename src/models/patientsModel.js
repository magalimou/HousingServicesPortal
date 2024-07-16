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

exports.updatePatient = async (patientId, patientData) => {
    const { first_name, last_name, email, phone, birthdate } = patientData;

    const query = `
        UPDATE patient 
        SET 
            first_name = ?, 
            last_name = ?, 
            email = ?, 
            phone = ?, 
            birthdate = ?
        WHERE id = ?;
    `;

    const values = [first_name, last_name, email, phone, birthdate, patientId];

    try {
        await db.query(query, values);
    } catch (err) {
        throw new Error('Error updating patient information: ' + err.message);
    }
};
