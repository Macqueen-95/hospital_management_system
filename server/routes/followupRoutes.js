const express = require('express');
const router = express.Router();
const {
  getAllFollowUps,
  getFollowUpById,
  createFollowUp,
  updateFollowUpStatus
} = require('../controllers/followupController');
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');

// All routes require authentication

// GET /api/followups - All authenticated users can view follow-ups (Doctor sees only own)
router.get('/', authenticate, getAllFollowUps);

// GET /api/followups/:id - All authenticated users can view follow-up details (Doctor ownership checked in controller)
router.get('/:id', authenticate, getFollowUpById);

// POST /api/followups - Admin, Receptionist, and Doctor can create follow-ups
router.post('/', authenticate, authorizeRoles('Admin', 'Receptionist', 'Doctor'), createFollowUp);

// PUT /api/followups/:id/status - Admin, Receptionist, and Doctor can update status (Doctor ownership checked in controller)
router.put('/:id/status', authenticate, authorizeRoles('Admin', 'Receptionist', 'Doctor'), updateFollowUpStatus);

module.exports = router;
