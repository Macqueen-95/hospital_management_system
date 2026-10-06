const express = require('express');
const router = express.Router();
const {
  getAllDischarges,
  getDischargeById,
  approveDischarge,
  finalizeDischarge
} = require('../controllers/dischargeController');
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');

// All routes require authentication

// GET /api/discharges - All authenticated users can view discharges
router.get('/', authenticate, getAllDischarges);

// GET /api/discharges/:id - All authenticated users can view discharge details
router.get('/:id', authenticate, getDischargeById);

// POST /api/admissions/:id/approve-discharge - Only Doctor can approve discharge
router.post('/admissions/:id/approve-discharge', authenticate, authorizeRoles('Doctor'), approveDischarge);

// POST /api/admissions/:id/discharge - Only Admin and Receptionist can finalize discharge
router.post('/admissions/:id/discharge', authenticate, authorizeRoles('Admin', 'Receptionist'), finalizeDischarge);

module.exports = router;
