require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

const patientsRouter = require('./routes/patients');
const doctorsRouter = require('./routes/doctor');
const appointmentsRouter = require('./routes/appointment');

app.use('/api/patients', patientsRouter);
app.use('/api/doctors', doctorsRouter);
app.use('/api/appointments', appointmentsRouter);


app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

