USE hospital_db;

CREATE TABLE patients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  'password' VARCHAR(100) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  birthdate DATE,
  email VARCHAR(255),
  phone VARCHAR(20)
);

CREATE TABLE doctors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100),
  specialty VARCHAR(100)
);

CREATE TABLE schedules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  doctor_id INT,
  `date` DATE,
  start_time TIME,
  end_time TIME,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id)
);

CREATE TABLE appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT,
  doctor_id INT,
  `date` DATE,
  `time` TIME,
  duration INT,
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (doctor_id) REFERENCES doctors(id)
);
