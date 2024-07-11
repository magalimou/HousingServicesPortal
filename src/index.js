require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;


app.use(express.json());

const patientsRouter = require('./routes/patients');

app.use('/api/patients', patientsRouter);

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

