const db = require('./db');


exports.listAllDoctors = async () => {
    const [result] = await db.query('SELECT * FROM doctor');
    return result;
}

exports.getDoctorsBySpecialty = async (specialty) => {
    const [result] = await db.query('SELECT * FROM doctor WHERE specialty = ?', [specialty]);
    return result;
}




