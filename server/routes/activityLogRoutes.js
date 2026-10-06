const express = require('express');
const router = express.Router();
const { getActivityLogs } = require('../controllers/activityLogController');
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');

// GET /api/activity-logs - Admin only
router.get('/', authenticate, authorizeRoles('Admin'), getActivityLogs);

module.exports = router;
