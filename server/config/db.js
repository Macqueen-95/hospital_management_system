const mysql = require('mysql2');
require('dotenv').config();

// Create a connection pool instead of a single connection.
// A pool manages multiple connections and reuses them efficiently.
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Wrap pool in promise API so we can use async/await
const db = pool.promise();

module.exports = db;
