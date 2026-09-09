const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /api/health
// Simple check to confirm the Express server is running
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// GET /api/db-test
// Checks whether Express can successfully communicate with MySQL
router.get('/db-test', async (req, res) => {
  try {
    // Run a simple query — if this succeeds, the DB connection works
    await db.query('SELECT 1');
    res.json({
      success: true,
      message: 'Database connection successful'
    });
  } catch (error) {
    // Do not expose internal error details to the client
    console.error('Database connection error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Database connection failed'
    });
  }
});

module.exports = router;
