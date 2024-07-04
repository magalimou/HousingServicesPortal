const express = require('express');
const app = express();
const port = 3000;
require('dotenv').config();

app.use(express.json());

const patientsRouter = require('./routes/patients');
const doctorsRouter = require('./routes/doctors');
const schedulesRouter = require('./routes/schedules');
const appointmentsRouter = require('./routes/appointments');

app.use('/patients', patientsRouter);
/*app.use('/doctors', doctorsRouter);
app.use('/schedules', schedulesRouter);
app.use('/appointments', appointmentsRouter);*/

app.get('/', (req, res) => {
    res.send('Hello, everyone!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

