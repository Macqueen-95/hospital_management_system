const express = require('express');
const router = express.Router();
const { getReportSummary } = require('../controllers/reportController');
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');

// GET /api/reports/summary - Admin only
router.get('/summary', authenticate, authorizeRoles('Admin'), getReportSummary);

module.exports = router;
