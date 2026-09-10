const express = require('express');
const router = express.Router();
const {
  getPatientHistory,
  getConsultation,
  createConsultation
} = require('../controllers/consultationController');
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');

// All routes require authentication and Doctor role

// GET /api/appointments/:id/patient-history
router.get('/:id/patient-history', authenticate, authorizeRoles('Doctor'), getPatientHistory);

// GET /api/appointments/:id/consultation
router.get('/:id/consultation', authenticate, authorizeRoles('Doctor'), getConsultation);

// POST /api/appointments/:id/consultation
router.post('/:id/consultation', authenticate, authorizeRoles('Doctor'), createConsultation);

module.exports = router;
