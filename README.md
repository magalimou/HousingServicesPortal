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
![hospital database](https://github.com/user-attachments/assets/3bf7c497-a0a6-4894-bc96-4982c00c739e)



#### Tables:

1. **patient**

    - **Description**: Stores information about patients (users) who can register and log in to the system.
      
    | Column     | Type                                                                                               | Description                                                                                                  |
    |------------|----------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------|
    | id         | `INT AUTO_INCREMENT PRIMARY KEY`                                                                   | Unique identifier for each patient. It is automatically incremented.                                         |
    | username   | `VARCHAR(100) UNIQUE NOT NULL`                                                                     | Unique username for patient login. It cannot be null.                                                        |
    | password   | `VARCHAR(100) NOT NULL`                                                                            | Encrypted password for patient login. It cannot be null.                                                     |
    | first_name | `VARCHAR(100) NOT NULL`                                                                                     | First name of the patient.                                                                                   |
    | last_name  | `VARCHAR(100) NOT NULL`                                                                                     | Last name of the patient.                                                                                    |
    | birthdate  | `DATE`                                                                                             | Date of birth of the patient.                                                                                |
    | email      | `VARCHAR(255) UNIQUE NOT NULL`                                                                                     | Email address of the patient.                                                                                |
    | phone      | `VARCHAR(20)`                                                                                      | Phone number of the patient.                                                                                 |
    | role       | `ENUM('user', 'admin') NOT NULL DEFAULT 'user'`                                                    | The role of the patient in the system. It can be either 'user' or 'admin' and defaults to 'user'.            |

2. **doctor**

    - **Description**: Stores information about doctors available in the hospital.
      
    | Column    | Type          | Constraints         | Description                  |
    |-----------|---------------|---------------------|------------------------------|
    | id        | INT           | AUTO_INCREMENT, PRIMARY KEY | Unique identifier for each doctor |
    | name      | VARCHAR(100)  | NOT NULL                     | Name of the doctor           |
    | specialty | VARCHAR(100)  | NOT NULL                     | Specialty of the doctor      |

3. **schedule**

    - **Description**: Stores the available schedules for doctors.
      
    | Column      | Type                                                                                           | Description                                                                                              |
    |-------------|------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------|
    | id          | `INT AUTO_INCREMENT PRIMARY KEY`                                                               | The unique identifier for each schedule entry. It is automatically incremented.                           |
    | doctor_id   | `INT NOT NULL`                                                                                          | The identifier of the doctor to whom this schedule entry belongs. It is a foreign key referencing the `id` column in the `doctor` table. |
    | day_of_week | `ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday')`                                | The day of the week for the schedule entry. It can be one of the specified days: Monday, Tuesday, Wednesday, Thursday, or Friday. |
    | start_time  | `TIME NOT NULL`                                                                                | The start time of the schedule entry. It cannot be null.                                                  |
    | end_time    | `TIME NOT NULL`                                                                                | The end time of the schedule entry. It cannot be null.                                                    |


4. **appointment**

    - **Description**: Stores information about appointments scheduled between patients and doctors.
      
    | Column     | Type          | Constraints         | Description                  |
    |------------|---------------|---------------------|------------------------------|
    | id         | INT           | AUTO_INCREMENT, PRIMARY KEY | Unique identifier for each appointment |
    | patient_id | INT           | FOREIGN KEY NOT NULL         | Identifier for the patient associated with the appointment. References `patient(id)` |
    | doctor_id  | INT           | FOREIGN KEY NOT NULL         | Identifier for the doctor associated with the appointment. References `doctor(id)` |
    | date       | DATE          | NOT NULL                     | Date of the appointment      |
    | time       | TIME          | NOT NULL                     | Time of the appointment      |
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

**PATCH** `/api/patients/update` - Update patient information.

Requires authentication: Yes (JWT token).

Header:
```bash
{
   Authorization: Bearer <your-jwt-token>
}
```

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

**DELETE** `/api/patients/delete`

Description: This endpoint allows an authenticated patient to delete their account from the system. This action will also delete all appointments associated with the patient.

Requires authentication: Yes (JWT token).
Request Body: None

Header:
```bash
{
   Authorization: Bearer <your-jwt-token>
}
```

Responses: 
200 OK.
```json
{
    "message": "Patient deleted successfully"
}
```
401 Unauthorized.
```json
{
    "message": "Invalid or expired token."
}
```

### Doctors

**GET** `/api/doctors` - Fetch all doctors.

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

**GET** `/api/doctors/:specialty` - View Doctors by specialization.

This endpoint allows a patient to view all doctors with a specified specialization.

**URL Parameters:**
- `specialty` (string): The specialization of doctors to be retrieved (e.g., Neurology, Cardiology).

**Example**
```bash
GET /api/doctors/Cardiology
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Alice Smith",
    "specialization": "Cardiology"
  }, 
  {
    "id": 2,
    "name": "Jane Doe",
    "specialty": "Cardiology"
  }
]
```

### Schedules

**GET** `api/schedules` - View All Doctor's Schedule.

This endpoint allows a patient to view all the schedules of all doctors in the hospital.

**Response:**
```json
[
    {
        "id": 1,
        "doctor_id": 1,
        "day_of_week": "Monday",
        "start_time": "09:00:00",
        "end_time": "12:00:00",
        "doctor_name": "John Doe"
    },
    {
        "id": 2,
        "doctor_id": 1,
        "day_of_week": "Monday",
        "start_time": "14:00:00",
        "end_time": "17:00:00",
        "doctor_name": "John Doe"
    },
    {
        "id": 3,
        "doctor_id": 2,
        "day_of_week": "Tuesday",
        "start_time": "09:00:00",
        "end_time": "12:00:00",
        "doctor_name": "Jane Smith"
    },
    {
        "id": 4,
        "doctor_id": 2,
        "day_of_week": "Wednesday",
        "start_time": "10:00:00",
        "end_time": "13:00:00",
        "doctor_name": "Jane Smith"
    }
]
```

**GET** `api/schedules/:id` - View Doctor's Schedule.

This endpoint allows a patient to view the schedule of a specified doctor.

**URL Parameters:**
- `id` (int): The ID of the doctor whose schedule is to be retrieved.

**Example**
```bash
GET /api/schedules/1
```

**Response:**
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

### Appointments

**GET** `/api/appointments/nearest/specialty` - Finds the nearest available appointment date with a Doctor.

Description:
This endpoint allows patients to find the nearest available appointment date with a doctor of the specified specialization. The system will return the doctor’s details, the nearest available date, and the available time slots for that date.

Behavior:
1. The system will find the nearest available date starting from the day after the current date.
2. It will check the doctor’s schedule and existing appointments to determine the available time slots.
- If a date is found where the doctor is available, it returns the date along with the available time slots.
- If no dates are available for the specified specialty, the system will continue searching until it finds an available slot.

**URL Parameters:**
- `specialty`: The specialty of the doctor to search for (e.g., "Cardiology", "Neurology").

**Example**
```bash
GET /api/appointments/nearest/Cardiology
```

Response:
Success: 200 OK.
```json
{
    "doctor_id": 1,
    "doctor_name": "John Doe",
    "date": "2024-07-26",
    "time_slots": [
        {
            "start_time": "16:30:00",
            "end_time": "17:00:00"
        },
        {
            "start_time": "17:35:00",
            "end_time": "18:00:00"
        }
    ]
}
```

**POST** `/api/appointments/book` - Allows a patient to book an appointment with a doctor.

Requires authentication: Yes (JWT token).

Header:
```bash
{
   Authorization: Bearer <your-jwt-token>
}
```

Request:
```sh
-H 'Content-Type: application/json' \
-d '{
  "doctor_id": 1,
  "date": "2024-07-20",
  "time": "10:00:00",
  "duration": 30
}'
```

Response:
Success: 201 Created.
```json
{
  "message": "Appointment successfully scheduled.",
  "appointment": {
    "id": 1,
    "patient_id": 2,
    "doctor_id": 1,
    "date": "2024-08-01",
    "time": "10:00:00",
    "duration": 30
  }
}
```
Error: 400 Bad Request.
```json
{
    "message": "The doctor is not available on the specified date and time."
}
```

**GET** `/api/patients/appointments` - Allows a patient to view their own appointments.

Requires authentication: Yes (JWT token).

Header:
```bash
{
   Authorization: Bearer <your-jwt-token>
}
```

Response:
Success: 200 OK.
```json
{
  [
    {
        "id": 3,
        "patient_id": 1,
        "doctor_id": 1,
        "date": "2024-08-01T00:00:00.000Z",
        "time": "10:00:00",
        "duration": 30
    },
    {
        "id": 4,
        "patient_id": 1,
        "doctor_id": 1,
        "date": "2024-08-01T00:00:00.000Z",
        "time": "10:30:00",
        "duration": 30
    }
  ]
}
```

**DELETE** `/api/patients/appointments/:id` - Allows a patient to cancel their appointments by id.

**URL Parameters:**
- `id` (int): The ID of the appointment to cancel.

Requires authentication: Yes (JWT token).

Header:
```bash
{
   Authorization: Bearer <your-jwt-token>
}
```

Response:
Success: 200 OK.
```json
{
  "message": "Appointment cancelled successfully"
}
```
Failure: 404 Not Found.
```json
{
   "message": "Appointment not found or not yours to cancel"
}
```

---

### Install

1. **Clone the repository:**
    ```sh
    git clone https://github.com/magalimou/hospital-appointment-scheduler.git
    cd hospital-appointment-scheduler
    ```

2. **Install dependencies (for local development without Docker):**
    ```sh
    npm install
    ```

3. **Build Docker images and start containers (for Docker-based development):**
    ```sh
    docker-compose up --build
    ```
    
---

### Run

To run the application in a Docker container, ensure Docker is installed on your system. Execute the following commands:

1. **Build the Docker images and start the containers:**
    ```sh
    docker-compose up --build
    ```

2. **Access the API:**
    - The API will be available at `http://localhost:3000`.



