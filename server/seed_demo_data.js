/**
 * Seed realistic demo records after seed_demo_users.js.
 *
 * Run directly with:
 *   node seed_demo_data.js
 *
 * Use --replace only when intentionally replacing existing transactional
 * records, such as from reset.sh.
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

const connectionOptions = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'hospital_management_system',
  port: process.env.DB_PORT || 3306
};

const patients = [
  {
    firstName: 'Aarav',
    lastName: 'Mehta',
    dateOfBirth: '1982-04-18',
    gender: 'Male',
    phone: '9876501001',
    email: 'aarav.mehta@example.com',
    address: '12 Park Street, New Delhi',
    emergencyName: 'Nisha Mehta',
    emergencyPhone: '9876501101',
    bloodGroup: 'B+',
    status: 'Consultation Completed',
    doctor: 'doctor1',
    appointmentOffset: -2,
    appointmentTime: '09:30:00',
    reason: 'Chest discomfort and shortness of breath after exertion',
    symptoms: 'Mild chest discomfort, fatigue, shortness of breath on exertion',
    diagnosis: 'Stable angina; hypertension under evaluation',
    prescription: 'Amlodipine 5 mg once daily; Aspirin 75 mg once daily',
    notes: 'Advised low-sodium diet and a follow-up ECG.',
    consultationCharge: 500,
    additionalCharge: 150,
    paymentStatus: 'Paid'
  },
  {
    firstName: 'Meera',
    lastName: 'Kapoor',
    dateOfBirth: '1991-11-06',
    gender: 'Female',
    phone: '9876501002',
    email: 'meera.kapoor@example.com',
    address: '8 Lake View Road, New Delhi',
    emergencyName: 'Raj Kapoor',
    emergencyPhone: '9876501102',
    bloodGroup: 'O+',
    status: 'Admitted',
    doctor: 'doctor2',
    appointmentOffset: -1,
    appointmentTime: '11:00:00',
    reason: 'Fall with severe pain and swelling in the right ankle',
    symptoms: 'Right ankle pain, swelling, reduced range of motion',
    diagnosis: 'Closed right ankle fracture',
    prescription: 'Paracetamol 650 mg as needed; limb elevation',
    notes: 'X-ray confirms fracture. Admitted for observation and orthopedic management.',
    admissionReason: 'Observation and treatment for closed right ankle fracture',
    room: '201',
    consultationCharge: 600,
    roomCharge: 2400,
    additionalCharge: 300,
    paymentStatus: 'Pending'
  },
  {
    firstName: 'Kabir',
    lastName: 'Rao',
    dateOfBirth: '2012-08-23',
    gender: 'Male',
    phone: '9876501003',
    email: 'kabir.rao@example.com',
    address: '44 Green Avenue, New Delhi',
    emergencyName: 'Priya Rao',
    emergencyPhone: '9876501103',
    bloodGroup: 'A+',
    status: 'Appointment Scheduled',
    doctor: 'doctor3',
    appointmentOffset: 1,
    appointmentTime: '10:00:00',
    reason: 'Recurring wheezing and night-time cough',
    consultationCharge: 450,
    additionalCharge: 0,
    paymentStatus: 'Pending'
  },
  {
    firstName: 'Ananya',
    lastName: 'Iyer',
    dateOfBirth: '1976-02-14',
    gender: 'Female',
    phone: '9876501004',
    email: 'ananya.iyer@example.com',
    address: '19 Rose Garden Lane, New Delhi',
    emergencyName: 'Vikram Iyer',
    emergencyPhone: '9876501104',
    bloodGroup: 'AB+',
    status: 'Follow-up Scheduled',
    doctor: 'doctor1',
    appointmentOffset: -12,
    appointmentTime: '14:00:00',
    reason: 'Uncontrolled blood sugar and increased thirst',
    symptoms: 'Increased thirst, frequent urination, fatigue',
    diagnosis: 'Type 2 diabetes mellitus, newly diagnosed',
    prescription: 'Metformin 500 mg with dinner; diabetic diet plan',
    notes: 'Discharged in stable condition. Review glucose log at follow-up.',
    admissionReason: 'Diabetes stabilization and patient education',
    room: '202',
    consultationCharge: 500,
    roomCharge: 3600,
    additionalCharge: 250,
    paymentStatus: 'Paid',
    dischargeSummary: 'Blood glucose stabilized with medication and dietary counselling.',
    finalDiagnosis: 'Type 2 diabetes mellitus',
    medications: 'Metformin 500 mg with dinner',
    instructions: 'Monitor blood glucose twice daily and return for review.',
    followupOffset: 5,
    followupTime: '10:30:00'
  },
  {
    firstName: 'Rohan',
    lastName: 'Singh',
    dateOfBirth: '2004-06-30',
    gender: 'Male',
    phone: '9876501005',
    email: 'rohan.singh@example.com',
    address: '27 Sunrise Colony, New Delhi',
    emergencyName: 'Neha Singh',
    emergencyPhone: '9876501105',
    bloodGroup: 'O-',
    status: 'Consultation Completed',
    doctor: 'doctor3',
    appointmentOffset: -4,
    appointmentTime: '12:30:00',
    reason: 'Fever, sore throat, and body ache for two days',
    symptoms: 'Fever, sore throat, body ache, mild nasal congestion',
    diagnosis: 'Viral upper respiratory tract infection',
    prescription: 'Paracetamol 500 mg as needed; oral fluids and rest',
    notes: 'No respiratory distress. Return if fever persists beyond three days.',
    consultationCharge: 450,
    additionalCharge: 75,
    paymentStatus: 'Pending'
  }
];

async function findId(connection, query, params, label) {
  const [rows] = await connection.query(query, params);
  if (rows.length === 0) {
    throw new Error(`Unable to find ${label}`);
  }
  return rows[0];
}

async function seedDemoData() {
  const connection = await mysql.createConnection(connectionOptions);
  try {
    const [existingPatients] = await connection.query('SELECT COUNT(*) AS count FROM Patients');
    if (Number(existingPatients[0].count) > 0 && !process.argv.includes('--replace')) {
      throw new Error('Patients already exist. Use --replace only to intentionally replace demo records.');
    }

    await connection.beginTransaction();

    if (process.argv.includes('--replace')) {
      await connection.query('SET FOREIGN_KEY_CHECKS = 0');
      for (const table of ['ActivityLogs', 'FollowUps', 'Discharges', 'Bills', 'Consultations', 'Admissions', 'Appointments', 'Patients']) {
        await connection.query(`TRUNCATE TABLE ${table}`);
      }
      await connection.query('SET FOREIGN_KEY_CHECKS = 1');
    }

    await connection.query(
      `INSERT INTO Rooms (room_number, room_type, floor, bed_count, price_per_day, is_available)
       VALUES
         ('101', 'General', 1, 4, 800.00, TRUE),
         ('201', 'Semi-Private', 2, 2, 1200.00, TRUE),
         ('202', 'Private', 2, 1, 1800.00, TRUE),
         ('301', 'ICU', 3, 1, 3500.00, TRUE)
       ON DUPLICATE KEY UPDATE room_number = VALUES(room_number)`
    );

    const admin = await findId(
      connection,
      'SELECT user_id FROM Users WHERE username = ?',
      ['admin'],
      'admin user'
    );
    const doctors = {};
    for (const username of ['doctor1', 'doctor2', 'doctor3']) {
      const row = await findId(
        connection,
        `SELECT d.doctor_id, d.user_id
         FROM Doctors d
         INNER JOIN Users u ON u.user_id = d.user_id
         WHERE u.username = ?`,
        [username],
        `${username} profile`
      );
      doctors[username] = row;
    }

    const rooms = {};
    for (const roomNumber of ['201', '202']) {
      rooms[roomNumber] = await findId(
        connection,
        'SELECT room_id FROM Rooms WHERE room_number = ?',
        [roomNumber],
        `room ${roomNumber}`
      );
    }

    for (const patient of patients) {
      const doctor = doctors[patient.doctor];
      const [patientResult] = await connection.query(
        `INSERT INTO Patients
          (first_name, last_name, date_of_birth, gender, phone, email, address,
           emergency_contact_name, emergency_contact_phone, blood_group, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          patient.firstName,
          patient.lastName,
          patient.dateOfBirth,
          patient.gender,
          patient.phone,
          patient.email,
          patient.address,
          patient.emergencyName,
          patient.emergencyPhone,
          patient.bloodGroup,
          patient.status
        ]
      );
      const patientId = patientResult.insertId;

      const [appointmentResult] = await connection.query(
        `INSERT INTO Appointments
          (patient_id, doctor_id, appointment_date, appointment_time, reason, status)
         VALUES (?, ?, DATE_ADD(CURDATE(), INTERVAL ? DAY), ?, ?, ?)`,
        [
          patientId,
          doctor.doctor_id,
          patient.appointmentOffset,
          patient.appointmentTime,
          patient.reason,
          patient.status === 'Appointment Scheduled' ? 'Scheduled' : 'Completed'
        ]
      );
      const appointmentId = appointmentResult.insertId;

      if (patient.diagnosis) {
        await connection.query(
          `INSERT INTO Consultations
            (appointment_id, symptoms, diagnosis, prescription, notes)
           VALUES (?, ?, ?, ?, ?)`,
          [
            appointmentId,
            patient.symptoms,
            patient.diagnosis,
            patient.prescription,
            patient.notes
          ]
        );
      }

      let admissionId;
      if (patient.admissionReason) {
        const room = rooms[patient.room];
        const [admissionResult] = await connection.query(
          `INSERT INTO Admissions
            (patient_id, room_id, doctor_id, admission_date, reason, status)
           VALUES (?, ?, ?, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL ? DAY), ?, ?)`,
          [
            patientId,
            room.room_id,
            doctor.doctor_id,
            patient.status === 'Admitted' ? 1 : 12,
            patient.admissionReason,
            patient.status === 'Admitted' ? 'Active' : 'Discharged'
          ]
        );
        admissionId = admissionResult.insertId;
        await connection.query(
          'UPDATE Rooms SET is_available = ? WHERE room_id = ?',
          [patient.status !== 'Admitted', room.room_id]
        );
      }

      let dischargeId;
      if (patient.dischargeSummary) {
        const [dischargeResult] = await connection.query(
          `INSERT INTO Discharges
            (admission_id, discharge_date, discharge_summary, final_diagnosis,
             medications_prescribed, instructions)
           VALUES (?, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 2 DAY), ?, ?, ?, ?)`,
          [
            admissionId,
            patient.dischargeSummary,
            patient.finalDiagnosis,
            patient.medications,
            patient.instructions
          ]
        );
        dischargeId = dischargeResult.insertId;
      }

      await connection.query(
        `INSERT INTO Bills
          (patient_id, generated_by_user_id, consultation_charge, room_charge,
           additional_charge, total_amount, payment_status, payment_date)
         VALUES (?, ?, ?, ?, ?, ?, ?, CASE WHEN ? = 'Paid' THEN CURRENT_TIMESTAMP ELSE NULL END)`,
        [
          patientId,
          admin.user_id,
          patient.consultationCharge,
          patient.roomCharge || 0,
          patient.additionalCharge,
          patient.consultationCharge + (patient.roomCharge || 0) + patient.additionalCharge,
          patient.paymentStatus,
          patient.paymentStatus
        ]
      );

      if (patient.followupOffset) {
        await connection.query(
          `INSERT INTO FollowUps
            (discharge_id, patient_id, doctor_id, followup_date, followup_time, notes, status)
           VALUES (?, ?, ?, DATE_ADD(CURDATE(), INTERVAL ? DAY), ?, ?, 'Scheduled')`,
          [
            dischargeId,
            patientId,
            doctor.doctor_id,
            patient.followupOffset,
            patient.followupTime,
            'Review symptoms, medication adherence, and progress.'
          ]
        );
      }

      await connection.query(
        `INSERT INTO ActivityLogs (user_id, action, entity_type, entity_id, description)
         VALUES (?, 'Demo Data Seeded', 'Patient', ?, ?)`,
        [admin.user_id, patientId, `Created demo record for ${patient.firstName} ${patient.lastName}`]
      );
    }

    await connection.commit();
    console.log(`Seeded ${patients.length} patients with appointments, consultations, admissions, billing, and follow-up data.`);
  } catch (error) {
    await connection.rollback();
    console.error('Demo data seed failed:', error.message);
    process.exitCode = 1;
  } finally {
    await connection.end();
  }
}

seedDemoData();
