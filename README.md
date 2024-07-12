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
- List doctors
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

## Database Schema
![hospital database](https://github.com/user-attachments/assets/13c15c87-9fbc-4acb-96f8-12fd6d8c2711)

#### Tables:

1. **patients**
    - **Description**: Stores information about patients who can register and log in to the system.
      

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


