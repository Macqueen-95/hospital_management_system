const express = require('express');
const router = express.Router();
const {
  getAllAdmissions,
  getAdmissionById,
  createAdmission
} = require('../controllers/admissionController');
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');

// All routes require authentication

// GET /api/admissions - All authenticated users can view admissions
router.get('/', authenticate, getAllAdmissions);

// GET /api/admissions/:id - All authenticated users can view admission details
router.get('/:id', authenticate, getAdmissionById);

// POST /api/admissions - Only Admin and Receptionist can create admissions
router.post('/', authenticate, authorizeRoles('Admin', 'Receptionist'), createAdmission);

module.exports = router;
