const mysql = require('mysql2/promise');
require('dotenv').config();

async function resetDatabase() {
  let connection;
  
  try {
    // Connect to database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'hospital_management_system'
    });

    console.log('Connected to database...');

    // Disable foreign key checks
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    console.log('Disabled foreign key checks');

    // Truncate all tables in correct order
    const tables = [
      'ActivityLogs',
      'FollowUps',
      'Discharges',
      'Consultations',
      'Bills',
      'Admissions',
      'Appointments',
      'Patients',
      'Doctors',
      'Rooms',
      'Users'
    ];

    console.log('\nClearing all tables...');
    for (const table of tables) {
      await connection.query(`TRUNCATE TABLE ${table}`);
      console.log(`✓ Cleared ${table}`);
    }

    // Re-enable foreign key checks
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('\nRe-enabled foreign key checks');

    console.log('\n✅ Database reset complete!');
    console.log('\nNext step: Run "node seed_demo_users.js" to create demo users');

  } catch (error) {
    console.error('❌ Error resetting database:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

resetDatabase();
