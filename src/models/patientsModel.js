const db = require('./db');

exports.getAllPatients = (callback) => {
    db.query('SELECT * FROM patients', callback);
};

exports.createPatient = async (patient) => {
    const { username, password, firstName, lastName, email, phone, birthdate } = patient;
    await db.query(
      'INSERT INTO patients (username, password, first_name, last_name, email, phone, birthdate) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [username, password, firstName, lastName, email, phone, birthdate]
    );
};

exports.findPatientByUsername = async (username) => {
    const [result] = await db.query('SELECT * FROM patients WHERE username = ?', [username]);
    return result[0];
};

exports.getPatientById = (id, callback) => {
    db.query('SELECT * FROM patients WHERE id = ?', [id], callback);
};
