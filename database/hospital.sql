-- ============================================
-- Hospital Management System (HMS)
-- Database Schema - Phase 2
-- ============================================

-- Create database
CREATE DATABASE IF NOT EXISTS hospital_management_system;
USE hospital_management_system;

-- ============================================
-- Table 1: Users
-- Purpose: Stores all system users (Admin, Receptionist, Doctor)
-- ============================================
CREATE TABLE Users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('Admin', 'Receptionist', 'Doctor') NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(15),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Table 2: Doctors
-- Purpose: Additional doctor-specific information beyond the base User table
-- ============================================
CREATE TABLE Doctors (
  doctor_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNIQUE NOT NULL,
  specialization VARCHAR(100) NOT NULL,
  qualification VARCHAR(200),
  experience_years INT CHECK (experience_years >= 0),
  consultation_fee DECIMAL(10,2) NOT NULL CHECK (consultation_fee >= 0),
  available_days VARCHAR(100),
  available_time_start TIME,
  available_time_end TIME,
  FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE RESTRICT
);

-- ============================================
-- Table 3: Patients
-- Purpose: Core patient demographics and current status
-- ============================================
CREATE TABLE Patients (
  patient_id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  date_of_birth DATE NOT NULL,
  gender ENUM('Male', 'Female', 'Other') NOT NULL,
  phone VARCHAR(15) NOT NULL,
  email VARCHAR(100),
  address TEXT,
  emergency_contact_name VARCHAR(100),
  emergency_contact_phone VARCHAR(15),
  blood_group VARCHAR(5),
  status ENUM(
    'Registered',
    'Appointment Scheduled',
    'Checked In',
    'Consultation Completed',
    'Admitted',
    'Ready for Discharge',
    'Discharged',
    'Follow-up Scheduled'
  ) DEFAULT 'Registered',
  registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Table 4: Rooms
-- Purpose: Available rooms for patient admission
-- ============================================
CREATE TABLE Rooms (
  room_id INT AUTO_INCREMENT PRIMARY KEY,
  room_number VARCHAR(10) UNIQUE NOT NULL,
  room_type ENUM('General', 'Semi-Private', 'Private', 'ICU') NOT NULL,
  floor INT,
  bed_count INT NOT NULL CHECK (bed_count >= 0),
  price_per_day DECIMAL(10,2) NOT NULL CHECK (price_per_day >= 0),
  is_available BOOLEAN DEFAULT TRUE
);

-- ============================================
-- Table 5: Appointments
-- Purpose: Tracks scheduled appointments between patients and doctors
-- ============================================
CREATE TABLE Appointments (
  appointment_id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  doctor_id INT NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  reason TEXT,
  status ENUM('Scheduled', 'Checked In', 'Completed', 'Cancelled') DEFAULT 'Scheduled',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES Patients(patient_id) ON DELETE RESTRICT,
  FOREIGN KEY (doctor_id) REFERENCES Doctors(doctor_id) ON DELETE RESTRICT
);

-- ============================================
-- Table 6: Consultations
-- Purpose: Medical records from doctor-patient consultations
-- ============================================
CREATE TABLE Consultations (
  consultation_id INT AUTO_INCREMENT PRIMARY KEY,
  appointment_id INT UNIQUE NOT NULL,
  symptoms TEXT,
  diagnosis TEXT NOT NULL,
  prescription TEXT,
  notes TEXT,
  consultation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (appointment_id) REFERENCES Appointments(appointment_id) ON DELETE RESTRICT
);

-- ============================================
-- Table 7: Admissions
-- Purpose: Tracks patient admissions to rooms
-- ============================================
CREATE TABLE Admissions (
  admission_id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  room_id INT NOT NULL,
  doctor_id INT NOT NULL,
  admission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reason TEXT NOT NULL,
  status ENUM('Active', 'Discharged') DEFAULT 'Active',
  FOREIGN KEY (patient_id) REFERENCES Patients(patient_id) ON DELETE RESTRICT,
  FOREIGN KEY (room_id) REFERENCES Rooms(room_id) ON DELETE RESTRICT,
  FOREIGN KEY (doctor_id) REFERENCES Doctors(doctor_id) ON DELETE RESTRICT
);

-- ============================================
-- Table 8: Bills
-- Purpose: Tracks billing for consultations and inpatient admissions,
--          including consultation, room, and additional charges
-- ============================================
CREATE TABLE Bills (
  bill_id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  generated_by_user_id INT NOT NULL,
  consultation_charge DECIMAL(10,2) DEFAULT 0 CHECK (consultation_charge >= 0),
  room_charge DECIMAL(10,2) DEFAULT 0 CHECK (room_charge >= 0),
  additional_charge DECIMAL(10,2) DEFAULT 0 CHECK (additional_charge >= 0),
  total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
  payment_status ENUM('Pending', 'Paid') DEFAULT 'Pending',
  payment_date TIMESTAMP NULL,
  generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES Patients(patient_id) ON DELETE RESTRICT,
  FOREIGN KEY (generated_by_user_id) REFERENCES Users(user_id) ON DELETE RESTRICT
);

-- ============================================
-- Table 9: Discharges
-- Purpose: Final medical summary when patient leaves hospital
-- ============================================
CREATE TABLE Discharges (
  discharge_id INT AUTO_INCREMENT PRIMARY KEY,
  admission_id INT UNIQUE NOT NULL,
  discharge_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  discharge_summary TEXT NOT NULL,
  final_diagnosis TEXT,
  medications_prescribed TEXT,
  instructions TEXT,
  FOREIGN KEY (admission_id) REFERENCES Admissions(admission_id) ON DELETE RESTRICT
);

-- ============================================
-- Table 10: FollowUps
-- Purpose: Scheduled follow-up appointments after outpatient
--          consultation or hospital discharge
-- ============================================
CREATE TABLE FollowUps (
  followup_id INT AUTO_INCREMENT PRIMARY KEY,
  discharge_id INT NULL,
  patient_id INT NOT NULL,
  doctor_id INT NOT NULL,
  followup_date DATE NOT NULL,
  followup_time TIME,
  notes TEXT,
  status ENUM('Scheduled', 'Completed', 'Cancelled') DEFAULT 'Scheduled',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (discharge_id) REFERENCES Discharges(discharge_id) ON DELETE RESTRICT,
  FOREIGN KEY (patient_id) REFERENCES Patients(patient_id) ON DELETE RESTRICT,
  FOREIGN KEY (doctor_id) REFERENCES Doctors(doctor_id) ON DELETE RESTRICT
);

-- ============================================
-- Table 11: ActivityLogs
-- Purpose: Records all significant system actions for audit and security
-- ============================================
CREATE TABLE ActivityLogs (
  log_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id INT,
  description TEXT,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE RESTRICT
);

-- ============================================
-- Indexes for Performance
-- ============================================
CREATE INDEX idx_appointments_patient ON Appointments(patient_id);
CREATE INDEX idx_appointments_doctor ON Appointments(doctor_id);
CREATE INDEX idx_appointments_date ON Appointments(appointment_date);
CREATE INDEX idx_admissions_patient ON Admissions(patient_id);
CREATE INDEX idx_bills_patient ON Bills(patient_id);
CREATE INDEX idx_followups_patient ON FollowUps(patient_id);
CREATE INDEX idx_activitylogs_user ON ActivityLogs(user_id);

-- ============================================
-- Schema creation complete
-- ============================================
