# **Hospital Appointment Scheduler**

## Content

1. [Description](#description)
2. [Technical requirements](#technical-requirements)
3. [Database Schema](#database-schema)
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

- Sign up and log in patients
- List doctors by medical specialties
- Schedule medical appointments
- View scheduled appointments
- Cancel scheduled appointments

---

## Technical requirements

- Programming language: JavaScript
- Web application framework: Express.js
- Database: MySQL
- Docker

---

## Database Schema
![hospital database](https://github.com/user-attachments/assets/13c15c87-9fbc-4acb-96f8-12fd6d8c2711)

#### Tables:

1. **patients**
    - **Description**: Stores information about patients (users) who can register and log in to the system.
      

    | Column      | Type             | Constraints         | Description                   |
    |-------------|------------------|---------------------|-------------------------------|
    | id          | INT              | AUTO_INCREMENT, PRIMARY KEY | Unique identifier for each patient |
    | username    | VARCHAR(100)     | UNIQUE, NOT NULL    | Unique username for patient login  |
    | password    | VARCHAR(100)     | NOT NULL            | Encrypted password for patient login |
    | first_name  | VARCHAR(100)     |                     | First name of the patient     |
    | last_name   | VARCHAR(100)     |                     | Last name of the patient      |
    | birthdate   | DATE             |                     | Date of birth of the patient  |
    | email       | VARCHAR(255)     |                     | Email address of the patient  |
    | phone       | VARCHAR(20)      |                     | Phone number of the patient   |

2. **doctors**
    - **Description**: Stores information about doctors available in the hospital.
      

    | Column    | Type          | Constraints         | Description                  |
    |-----------|---------------|---------------------|------------------------------|
    | id        | INT           | AUTO_INCREMENT, PRIMARY KEY | Unique identifier for each doctor |
    | name      | VARCHAR(100)  |                     | Name of the doctor           |
    | specialty | VARCHAR(100)  |                     | Specialty of the doctor      |

3. **schedules**
    - **Description**: Stores the available schedules for doctors.
      

    | Column     | Type          | Constraints         | Description                  |
    |------------|---------------|---------------------|------------------------------|
    | id         | INT           | AUTO_INCREMENT, PRIMARY KEY | Unique identifier for each schedule |
    | doctor_id  | INT           | FOREIGN KEY         | Identifier for the doctor associated with the schedule. References `doctors(id)` |
    | date       | DATE          |                     | Date of the schedule         |
    | start_time | TIME          |                     | Start time of the schedule   |
    | end_time   | TIME          |                     | End time of the schedule     |

4. **appointments**
    - **Description**: Stores information about appointments scheduled between patients and doctors.
      

    | Column     | Type          | Constraints         | Description                  |
    |------------|---------------|---------------------|------------------------------|
    | id         | INT           | AUTO_INCREMENT, PRIMARY KEY | Unique identifier for each appointment |
    | patient_id | INT           | FOREIGN KEY         | Identifier for the patient associated with the appointment. References `patients(id)` |
    | doctor_id  | INT           | FOREIGN KEY         | Identifier for the doctor associated with the appointment. References `doctors(id)` |
    | date       | DATE          |                     | Date of the appointment      |
    | time       | TIME          |                     | Time of the appointment      |
    | duration   | INT           |                     | Duration of the appointment in minutes |

---

## Base URL

`http://localhost:3000`

---

## API Documentation

### Patients

**POST** `/api/patients/signup` - Registers a new patient in the system.

Request:
```sh
-H 'Content-Type: application/json' \
-d '{
  "username": "johndoe",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "email": "johndoe@example.com",
  "phone": "1234567890",
  "birthdate": "1990-01-01"
}
'
```
Response:
- Success (201 Created):
```json
{
  "message": "Patient registered successfully"
}
```
- Error (400 Bad Request): 
```json
{
  "message": "The patient already exists. Please choose another username."
}
```
- Error (500 Internal Server Error):
```json
{
  "message": "Error registering patient. Please try again later."
}
```

**POST** `/api/patients/login` - Logs in an existing patient and returns a JWT token.

Request:
```sh
-H 'Content-Type: application/json' \
-d '{
  "username": "johndoe",
  "password": "password123"
}'
```
Response:
- Success (201 Created):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJqb2huZG9lIiwiaWF0IjoxNjIzODc2NDEwfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
}
```
- Error (400 Bad Request): 
```json
{
  "message": "Invalid credentials. Please verify your username and password."
}
```
- Error (500 Internal Server Error):
```json
{
  "message": "'Login error. Please try again later."
}
```

**PUT** `/api/patients/:id` - Update patient information

Request:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "0987654321",
  "birthdate": "1990-01-01"
}
```

Response:
```json
{
   "message": "Patient information updated successfully"
}
```

### Doctors

**GET** `/api/doctors` - Fetch all doctors

Response:
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "specialty": "Cardiology"
  },
  { 
    "id": 2,
    "name": "Bob Jones",
    "specialization": "Neurology"
  }
]
```

**GET** `/api/doctors?specialization=Cardiology` - View doctors by specialization

Response:
```json
[
  {
    "id": 1,
    "firstName": "Alice",
    "lastName": "Smith",
    "specialization": "Cardiology"
  }
]
```

**GET** `api/doctors/:id/schedule` - View Doctor's Schedule
This endpoint allows a patient to view the schedule of a specified doctor.
URL Parameters: id (int): The ID of the doctor whose schedule is to be retrieved.
Response:
```json
[
  {
    "id": 1,
    "doctor_id": 1,
    "day": "Monday",
    "start_time": "10:00:00",
    "end_time": "12:00:00"
  },
  {
    "id": 2,
    "doctor_id": 1,
    "day": "Wednesday",
    "start_time": "14:00:00",
    "end_time": "16:00:00"
  }
]

```

### Schedules


### Appointments

**POST** `/api/appointments` - Allows a patient to book an appointment with a doctor.

Request:
```sh
-H 'Content-Type: application/json' \
-d '{
  "doctor_id": 1,
  "date": "2024-07-20",
  "time": "10:00",
  "duration": 30
}'
```

Response:
Success: 201 Created
```json
{
  "message": "Appointment booked successfully",
  "appointment": {
    "id": 1,
    "patient_id": 2,
    "doctor_id": 1,
    "date": "2024-07-20",
    "time": "10:00",
    "duration": 30
  }
}
```

**GET** `/api/appointments` - Allows a patient to view their own appointments.
Request: Authorization: Bearer jwt token

Response:
Success: 200 OK
```json
{
  "appointments": [
    {
      "id": 1,
      "doctor_id": 1,
      "date": "2024-07-20",
      "time": "10:00",
      "duration": 30
    },
    {
      "id": 2,
      "doctor_id": 2,
      "date": "2024-07-22",
      "time": "14:00",
      "duration": 30
    }
  ]
}
```

**DELETE** `/api/appointments/:id` - Allows a patient to cancel their own appointment.
Request: Authorization: Bearer jwt_token_here

Response:
Success: 200 OK
```json
{
  "message": "Appointment deleted successfully"
}
```
Failure: 400 Bad Request
```json
{
  "message": "Error cancelling appointment"
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


