/**
 * seed_demo_users.js
 * Inserts demo users with properly bcrypt-hashed passwords.
 * Called by reset.sh after the Users/Doctors tables are cleared.
 * Exits 0 on success, 1 on failure.
 */

const bcrypt = require('bcrypt');
const db = require('./config/db');

const SALT_ROUNDS = 10;

const DEMO_USERS = [
  {
    username: 'admin',
    password: 'Admin@123',
    full_name: 'Admin User',
    email: 'admin@hospital.com',
    phone: '9999999999',
    role: 'Admin',
    doctor: null
  },
  {
    username: 'receptionist',
    password: 'Receptionist@123',
    full_name: 'Jane Smith',
    email: 'receptionist@hospital.com',
    phone: '9999999998',
    role: 'Receptionist',
    doctor: null
  },
  {
    username: 'doctor1',
    password: 'Doctor@123',
    full_name: 'Dr. John Doe',
    email: 'doctor1@hospital.com',
    phone: '9999999997',
    role: 'Doctor',
    doctor: {
      specialization: 'Cardiology',
      qualification: 'MBBS, MD (Cardiology)',
      experience_years: 15,
      consultation_fee: 500.00,
      available_days: 'Monday, Tuesday, Wednesday, Thursday, Friday',
      available_time_start: '09:00:00',
      available_time_end: '17:00:00'
    }
  },
  {
    username: 'doctor2',
    password: 'Doctor@123',
    full_name: 'Dr. Sarah Johnson',
    email: 'doctor2@hospital.com',
    phone: '9999999996',
    role: 'Doctor',
    doctor: {
      specialization: 'Orthopedics',
      qualification: 'MBBS, MS (Orthopedics)',
      experience_years: 10,
      consultation_fee: 600.00,
      available_days: 'Monday, Wednesday, Friday',
      available_time_start: '10:00:00',
      available_time_end: '16:00:00'
    }
  },
  {
    username: 'doctor3',
    password: 'Doctor@123',
    full_name: 'Dr. Michael Chen',
    email: 'doctor3@hospital.com',
    phone: '9999999995',
    role: 'Doctor',
    doctor: {
      specialization: 'Pediatrics',
      qualification: 'MBBS, MD (Pediatrics)',
      experience_years: 8,
      consultation_fee: 450.00,
      available_days: 'Tuesday, Thursday, Saturday',
      available_time_start: '08:00:00',
      available_time_end: '14:00:00'
    }
  }
];

async function seed() {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    for (const u of DEMO_USERS) {
      const hash = await bcrypt.hash(u.password, SALT_ROUNDS);

      const [result] = await connection.query(
        `INSERT INTO Users (username, password_hash, role, full_name, email, phone, is_active)
         VALUES (?, ?, ?, ?, ?, ?, TRUE)`,
        [u.username, hash, u.role, u.full_name, u.email, u.phone]
      );

      if (u.doctor) {
        await connection.query(
          `INSERT INTO Doctors
             (user_id, specialization, qualification, experience_years, consultation_fee,
              available_days, available_time_start, available_time_end)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            result.insertId,
            u.doctor.specialization,
            u.doctor.qualification,
            u.doctor.experience_years,
            u.doctor.consultation_fee,
            u.doctor.available_days,
            u.doctor.available_time_start,
            u.doctor.available_time_end
          ]
        );
      }

      console.log(`  ✓ ${u.role}: ${u.username}`);
    }

    await connection.commit();
    console.log('\nSeed complete.');
    process.exit(0);
  } catch (err) {
    await connection.rollback();
    console.error('Seed failed:', err.message);
    process.exit(1);
  } finally {
    connection.release();
    process.exit(0);
  }
}

seed();
