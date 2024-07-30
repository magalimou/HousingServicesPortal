require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

const patientsRouter = require('./routes/patients');
const doctorsRouter = require('./routes/doctor');
const appointmentsRouter = require('./routes/appointment');
const schedulesRouter = require('./routes/schedule');
const adminRouter = require('./routes/admin');

app.use('/api/patients', patientsRouter);
app.use('/api/doctors', doctorsRouter);
app.use('/api/appointments', appointmentsRouter);
app.use('/api/schedules', schedulesRouter);
app.use('/api/admin', adminRouter);


app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

