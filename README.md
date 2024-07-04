# **Hospital Appointment Scheduler**

## Content

1. [Description](#description)
2. [Technical requirements](#technical-requirements)
3. [Data Models](#data-models)
4. [Base URL](#base-url)
5. [API Documentation](#api-documentation)
    - [Patients](#patients)
    - [Doctors](#doctors)
    - [Schedules](#schedules)
    - [Appointments](#appointments)
6. [Install](#install)
7. [Run](#run)

---

## Description

This project is a hospital appointment scheduling system. Patients can enter the required specialization (e.g., cardiology, surgery), and the system will find the nearest available appointment date with a doctor of the specified specialization.

- Add and list patients
- Add and list doctors
- Query medical specialties
- Schedule medical appointments
- View scheduled appointments

---

## Technical requirements

- Programming language: JavaScript
- Web application framework: Express.js
- Database: MySQL
- Docker

---

## Data Models
![Database Hospital Model](https://github.com/magalimou/hospital-appointment-scheduler/assets/101686843/e80a5079-160b-463b-bea3-d45c8f18e8c7)

---

## Base URL

`http://localhost:3000`

---

## API Documentation

### Patients

**GET** `/patients` - Fetch all patients

Response:
```json
[
  {
    "id": 1,
    "name": "John",
    "last_name": "Doe",
    "birthdate": "1990-05-15",
    "phone": "123456789",
    "email": "john@example.com"
  }
]
```

**GET** `/patients/:id` - Fetch a specific patient by ID

Response:
```json
{
  "id": 1,
  "name": "John",
  "last_name": "Doe",
  "birthdate": "1990-05-15",
  "phone": "123456789",
  "email": "john@example.com"
}
```

**POST** `/patients` - Create a new patient

Request:
```sh
curl -X POST 'http://localhost:3000/patients' \
-H 'Content-Type: application/json' \
-d '{
  "name": "John",
  "last_name": "Doe",
  "birthdate": "1990-05-15",
  "phone": "123456789",
  "email": "john@example.com"
}'
```

Response:
```json
{
  "id": 2,
  "name": "John",
  "last_name": "Doe",
  "birthdate": "1990-05-15",
  "phone": "123456789",
  "email": "john@example.com"
}
```

**DELETE** `/patients/:id` - Delete a patient by ID

Response:
```json
{
  "message": "Patient deleted successfully"
}
```

### Doctors

**GET** `/doctors` - Fetch all doctors

Response:
```json
[
  {
    "id": 1,
    "name": "Dr. Johnson",
    "specialty": "Cardiology"
  }
]
```

**GET** `/doctors/:id` - Fetch a specific doctor by ID

Response:
```json
{
  "id": 1,
  "name": "Dr. Johnson",
  "specialty": "Cardiology"
}
```

**POST** `/doctors` - Create a new doctor

Request:
```sh
curl -X POST 'http://localhost:3000/doctors' \
-H 'Content-Type: application/json' \
-d '{
  "name": "Dr. Johnson",
  "specialty": "Cardiology"
}'
```

Response:
```json
{
  "id": 1,
  "name": "Dr. Johnson",
  "specialty": "Cardiology"
}
```

**DELETE** `/doctors/:id` - Delete a doctor by ID

Response:
```json
{
  "message": "Doctor deleted successfully"
}
```

### Schedules

**GET** `/schedules` - Fetch all schedules

Response:
```json
[
  {
    "id": 1,
    "doctor_id": 1,
    "day": "Monday",
    "start_time": "08:00",
    "end_time": "12:00"
  }
]
```

**GET** `/schedules/:id` - Fetch a specific schedule by ID

Response:
```json
{
  "id": 1,
  "doctor_id": 1,
  "day": "Monday",
  "start_time": "08:00",
  "end_time": "12:00"
}
```

**POST** `/schedules` - Create a new schedule

Request:
```sh
curl -X POST 'http://localhost:3000/schedules' \
-H 'Content-Type: application/json' \
-d '{
  "doctor_id": 1,
  "day": "Monday",
  "start_time": "08:00",
  "end_time": "12:00"
}'
```

Response:
```json
{
  "id": 1,
  "doctor_id": 1,
  "day": "Monday",
  "start_time": "08:00",
  "end_time": "12:00"
}
```

**DELETE** `/schedules/:id` - Delete a schedule by ID

Response:
```json
{
  "message": "Schedule deleted successfully"
}
```

### Appointments

**GET** `/appointments` - Fetch all appointments

Response:
```json
[
  {
    "id": 1,
    "patient_id": 1,
    "doctor_id": 1,
    "date": "2024-07-10",
    "start_time": "10:00",
    "end_time": "11:00"
  }
]
```

**GET** `/appointments/:id` - Fetch a specific appointment by ID

Response:
```json
{
  "id": 1,
  "patient_id": 1,
  "doctor_id": 1,
  "date": "2024-07-10",
  "start_time": "10:00",
  "end_time": "11:00"
}
```

**POST** `/appointments` - Create a new appointment

Request:
```sh
curl -X POST 'http://localhost:3000/appointments' \
-H 'Content-Type: application/json' \
-d '{
  "patient_id": 1,
  "doctor_id": 1,
  "date": "2024-07-10",
  "start_time": "10:00",
  "end_time": "11:00"
}'
```

Response:
```json
{
  "id": 1,
  "patient_id": 1,
  "doctor_id": 1,
  "date": "2024-07-10",
  "start_time": "10:00",
  "end_time": "11:00"
}
```

**DELETE** `/appointments/:id` - Delete an appointment by ID

Response:
```json
{
  "message": "Appointment deleted successfully"
}
```

---

### Install

1. **Clone the repository:**
    ```sh
    git clone https://github.com/magalimou/hospital-appointment-scheduler.git
    cd hospital-appointment-scheduler
    ```
    
2. **Install dependencies:**
    ```sh
    npm install
    ```

---

### Run

1. **Start the application:**
    ```sh
    npm start
    ```

2. **Access the API:**
    - The API will be available at `http://localhost:3000`.


