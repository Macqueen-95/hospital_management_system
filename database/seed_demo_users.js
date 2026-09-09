const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: '../server/.env' });

/**
 * Seed demo users for development
 * Creates Admin, Receptionist, and Doctor accounts
 */
async function seedDemoUsers() {
  let connection;

  try {
    // Create database connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });

    console.log('Connected to database...');

    // Demo user credentials
    const demoUsers = [
      {
        username: 'admin',
        password: 'Admin@123',
        role: 'Admin',
        full_name: 'System Administrator',
        email: 'admin@hospital.com',
        phone: '1234567890'
      },
      {
        username: 'receptionist',
        password: 'Receptionist@123',
        role: 'Receptionist',
        full_name: 'Jane Smith',
        email: 'receptionist@hospital.com',
        phone: '2345678901'
      },
      {
        username: 'doctor',
        password: 'Doctor@123',
        role: 'Doctor',
        full_name: 'Dr. John Doe',
        email: 'doctor@hospital.com',
        phone: '3456789012'
      }
    ];

    // Check if users already exist
    for (const user of demoUsers) {
      const [existing] = await connection.query(
        'SELECT user_id FROM Users WHERE username = ?',
        [user.username]
      );

      if (existing.length > 0) {
        console.log(`User '${user.username}' already exists, skipping...`);
        continue;
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(user.password, salt);

      // Insert user
      const [result] = await connection.query(
        `INSERT INTO Users (username, password_hash, role, full_name, email, phone, is_active)
         VALUES (?, ?, ?, ?, ?, ?, true)`,
        [user.username, password_hash, user.role, user.full_name, user.email, user.phone]
      );

      console.log(`Created user: ${user.username} (${user.role})`);

      // If user is a Doctor, create corresponding Doctor profile
      if (user.role === 'Doctor') {
        await connection.query(
          `INSERT INTO Doctors (user_id, specialization, qualification, experience_years, consultation_fee, available_days, available_time_start, available_time_end)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            result.insertId,
            'General Medicine',
            'MBBS, MD',
            10,
            500.00,
            'Mon,Tue,Wed,Thu,Fri',
            '09:00:00',
            '17:00:00'
          ]
        );
        console.log(`Created Doctor profile for user_id: ${result.insertId}`);
      }
    }

    console.log('\n✅ Demo users seeded successfully!');
    console.log('\nDemo Credentials:');
    console.log('─────────────────────────────────');
    console.log('Admin:        username: admin        password: Admin@123');
    console.log('Receptionist: username: receptionist password: Receptionist@123');
    console.log('Doctor:       username: doctor       password: Doctor@123');
    console.log('─────────────────────────────────\n');

  } catch (error) {
    console.error('Error seeding demo users:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

seedDemoUsers();
