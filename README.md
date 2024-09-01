# **Hospital Appointment Scheduler**

## Content

1. [Description](#description)
2. [Technical requirements](#technical-requirements)
3. [Database Schema](#database-schema)
4. [Base URL](#base-url)
5. [API Documentation](#api-documentation)
    - [Patients](#patients)
    - [Administrator](#administrator)
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
- Testing: Jest
- Docker

---

## Database Schema
![hospital database](https://github.com/user-attachments/assets/3bf7c497-a0a6-4894-bc96-4982c00c739e)



#### Tables:

1. **patient**

    - **Description**: Stores information about patients (users) who can register and log in to the system.
    <br>
      
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
    <br>
      
    | Column    | Type          | Constraints         | Description                  |
    |-----------|---------------|---------------------|------------------------------|
    | id        | INT           | AUTO_INCREMENT, PRIMARY KEY | Unique identifier for each doctor |
    | name      | VARCHAR(100)  | NOT NULL                     | Name of the doctor           |
    | specialty | VARCHAR(100)  | NOT NULL                     | Specialty of the doctor      |

3. **schedule**

    - **Description**: Stores the available schedules for doctors.
    <br>
      
    | Column      | Type                                                                                           | Description                                                                                              |
    |-------------|------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------|
    | id          | `INT AUTO_INCREMENT PRIMARY KEY`                                                               | The unique identifier for each schedule entry. It is automatically incremented.                           |
    | doctor_id   | `INT NOT NULL`                                                                                          | The identifier of the doctor to whom this schedule entry belongs. It is a foreign key referencing the `id` column in the `doctor` table. |
    | day_of_week | `ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday')`                                | The day of the week for the schedule entry. It can be one of the specified days: Monday, Tuesday, Wednesday, Thursday, or Friday. |
    | start_time  | `TIME NOT NULL`                                                                                | The start time of the schedule entry. It cannot be null.                                                  |
    | end_time    | `TIME NOT NULL`                                                                                | The end time of the schedule entry. It cannot be null.                                                    |


4. **appointment**

    - **Description**: Stores information about appointments scheduled between patients and doctors.
    <br>
      
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

**POST** `/api/patients/signup` 
<br>
- Registers a new patient in the system.

Request:
```json
{
  "username": "johndoe",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "email": "johndoe@example.com",
  "phone": "1234567890",
  "birthdate": "1990-01-01"
}
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

**POST** `/api/patients/login` 
<br>
- Logs in an existing patient and returns a JWT token.

Request:
```json
{
  "username": "johndoe",
  "password": "password123"
}
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

**PATCH** `/api/patients/update` 
<br>
- Update patient information.

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
<br>
- This endpoint allows an authenticated patient to delete their account from the system. This action will also delete all appointments associated with the patient.

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
---

### Administrator

To access the admin functionalities, the patient must have the role of 'admin'. 
Admin functionalities are protected and require a valid JWT token with an admin role to access. Ensure that the role field in the patient's record is set to 'admin'.

**PATCH** `/api/admin/make-admin/:patientid` 
<br>
- Allows an admin to update the role of a patient to "admin".

Requires authentication: Yes (JWT token).

Header:
```bash
{
   Authorization: Bearer <admin-jwt-token>
}
```

Responses:

- 200 OK: Returns an array of all patients.
  ```json
  {
    "message": "Patient role updated to admin"
  }
  ```
- 404 Not Found: Patient not found.
- 500 Internal Server Error: Error updating patient role to admin.


**GET** `/api/admin/patients` 
<br>
- View all patients registered.

Requires authentication: Yes (JWT token).

Header:
```bash
{
   Authorization: Bearer <admin-jwt-token>
}
```
Response:

- 200 OK: Returns an array of all patients.
  ```json
    [
      {
          "id": 1,
          "username": "john_doe",
          "first_name": "John",
          "last_name": "Doe",
          "birthdate": "2003-12-01T00:00:00.000Z",
          "email": "johndoe@example.com",
          "phone": "1234567890",
          "role": "user"
      },
      {
          "id": 2,
          "username": "jane_smith",
          "first_name": "Jane",
          "last_name": "Smith",
          "birthdate": "1990-01-01T00:00:00.000Z",
          "email": "janesmith@example.com",
          "phone": "0987654321",
          "role": "user"
      }
    ]
  ```
- 401 Unauthorized: If the JWT token is missing or invalid.
   ```json
  {
    "message": "Invalid or expired token."
  }
  ```
- 403 Forbidden: If the user does not have the admin role.
  ```json
  {
    "message": "Access Denied."
  }
  ```

**POST** `/api/admin/doctor` 
<br>
- Creates a new doctor.

Requires authentication: Yes (JWT token).

Header:
```bash
{
   Authorization: Bearer <admin-jwt-token>
}
```
Request:
```json
  {
    "name": "Jane Smith",
    "specialty": "Cardiology"
  }
```
Response:
  - 200 OK.
  ```json
  {
    "message": "Doctor created successfully"
  }
  ```

**DELETE** `/api/admin/doctor/:id` 
<br>
- Allows an admin to delete a doctor by ID. This will also delete all related schedules and appointments.

Requires authentication: Yes (JWT token).

Header:
```bash
{
   Authorization: Bearer <admin-jwt-token>
}
```
Response:
  - 200 OK.
  ```json
  {
    "message": "Doctor and related schedules and appointments deleted successfully"
  }
  ```
Error Responses:
  - 404 Not Found: Doctor not found.
  - 500 Internal Server Error: Error deleting doctor.
  

**PUT** `/api/admin/doctor/:id` 
<br>
- Allows an admin to update the information of a doctor by ID.

Headers:
```bash
Authorization: Bearer <JWT_TOKEN> (A valid JWT token with an admin role is required).
```
Request:
```json
  {
    "name": "Updated Doctor Name",
    "specialty": "Updated Specialty"
  }
```
Response:
  - 200 OK.
    ```json
    {
      "message": "Doctor updated successfully"
    }
    ```
  - 404 Not Found: Doctor not found.
  - 500 Internal Server Error: Error updating doctor.

**POST** `/api/admin/schedule` 
<br>
- Creates a new schedule.

Requires authentication: Yes (JWT token).

Header:
```bash
{
   Authorization: Bearer <admin-jwt-token>
}
```
Request:
```json
  {
    "doctor_id": 5,
    "day_of_week": "Friday",
    "start_time": "09:00:00",
    "end_time": "13:00:00"
  }
```
Response:
  - 200 OK.
  ```json
  {
    "message": "Schedule created successfully"
  }
  ```

**GET** `/api/admin/appointments/:doctorid` 
<br>
- Allows an admin to view all appointments of a doctor by their ID.

Requires authentication: Yes (JWT token).

Header:
```bash
{
   Authorization: Bearer <admin-jwt-token>
}
```
Response:
  - 200 OK.
  ```json
  [
    {
        "id": 1,
        "patient_id": 2,
        "doctor_id": 3,
        "date": "2024-07-26T00:00:00.000Z",
        "time": "10:00:00",
        "duration": 30
    },
    {
        "id": 2,
        "patient_id": 4,
        "doctor_id": 3,
        "date": "2024-07-28T00:00:00.000Z",
        "time": "11:00:00",
        "duration": 30
    }
  ]
  ```

---

### Doctors

**GET** `/api/doctors` 
<br>
- Fetch all doctors.

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

**GET** `/api/doctors/:specialty` 
<br>
- View Doctors by specialization.

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

---

### Schedules

**GET** `api/schedules` 
<br>
- View All Doctor's Schedule.

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

**GET** `api/schedules/:id` 
<br>
- View Doctor's Schedule.

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
---

### Appointments

**GET** `/api/appointments/nearest/specialty` 
<br>
- Finds the nearest available appointment date with a Doctor.

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

**POST** `/api/appointments/book` 
<br>
- Allows a patient to book an appointment with a doctor.

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
- Success: 201 Created.
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
- Error: 400 Bad Request (If the date is in the past).
    ```json
    {
        "message": "You cannot book appointments for past dates."
    }
    ```
- Error: 400 Bad Request (If the doctor is not available).
    ```json
    {
        "message": "The doctor is not available on the specified date and time."
    }
    ```

**GET** `/api/appointments` 
<br>
- Allows a patient to view their own appointments.

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

**DELETE** `/api/appointments/:id` 
<br>
- Allows a patient to cancel their appointments by id.

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

__Prerequisites__
Before setting up the project, ensure you have the following installed:

- Node.js (version 18 or higher)
- Docker and Docker Compose
- Git (optional, for cloning the repository)

1. **Clone the repository:**
    ```sh
    git clone https://github.com/magalimou/hospital-appointment-scheduler.git
    cd hospital-appointment-scheduler
    ```

2. **Install dependencies:**
    ```sh
    npm install
    ```

3. **Set Up Environment Variables**
You need to create a `.env` file at the root of the project directory. This file should contain the necessary environment variables for connecting to the database and JWT configuration.

Create a .env file with the following structure:
  ```bash
  # MySQL Database Configuration
  DB_HOST=your-database-host
  DB_USER=your-database-username
  DB_PASSWORD=your-database-password
  DB_NAME=your-database-name

  # JWT Secret
  JWT_SECRET=your-jwt-secret
  ```
  **Note**: The actual credentials should match your local MySQL setup or any other database you're using.

4. **Build Docker images and start containers:**
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

**Running the Application Locally**
<br>
If you prefer to run the application locally without Docker:

1. Start your MySQL server and ensure it matches the credentials in your `.env` file.
2. Run database migrations (if any) using a migration tool or manually.
3. Start the Node.js server:
    ```sh
    npm start
    ```

