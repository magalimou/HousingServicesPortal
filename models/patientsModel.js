const db = require('./db');

exports.getAllPatients = (callback) => {
    db.query('SELECT * FROM patients', callback);
};

exports.createPatient = (patientData, callback) => {
    const { first_name, last_name, birthdate, email, phone } = patientData;
    db.query('INSERT INTO patients (first_name, last_name, birthdate, email, phone) VALUES (?, ?, ?, ?, ?)', 
             [first_name, last_name, birthdate, email, phone], callback);
};

exports.getPatientById = (id, callback) => {
    db.query('SELECT * FROM patients WHERE id = ?', [id], callback);
};

exports.updatePatient = (id, patientData, callback) => {
    const { first_name, last_name, birthdate, email, phone } = patientData;
    db.query('UPDATE patients SET first_name = ?, last_name = ?, birthdate = ?, email = ?, phone = ? WHERE id = ?', 
             [first_name, last_name, birthdate, email, phone, id], callback);
};

exports.deletePatient = (id, callback) => {
    db.query('DELETE FROM patients WHERE id = ?', [id], callback);
};
