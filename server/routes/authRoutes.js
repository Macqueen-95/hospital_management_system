const express = require('express');
const router = express.Router();
const { login, getMe, adminTest } = require('../controllers/authController');
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');

// POST /api/auth/login - Public route
router.post('/login', login);

// GET /api/auth/me - Protected route (requires valid JWT)
router.get('/me', authenticate, getMe);

// GET /api/auth/admin-test - Protected route (requires Admin role)
router.get('/admin-test', authenticate, authorizeRoles('Admin'), adminTest);

module.exports = router;
