# **Hospital Appointment Scheduler**

## Content

1. Description
2. Technical requirements
3. Data Models
4. Base URL
5. API Documentation
   5.1 Patients
   5.2 Doctors
   5.3 Schedules
   5.4 Appointments
7. Install
8. Run

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
- Database: MySQL
- Docker

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


