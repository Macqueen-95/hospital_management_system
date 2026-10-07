const express = require('express');
const router = express.Router();
const { 
  getAllDoctors, 
  getActiveDoctors,
  getDoctorById, 
  createDoctor, 
  updateDoctor, 
  updateDoctorStatus 
} = require('../controllers/doctorController');
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');

// All routes require authentication

// GET /api/doctors - All authenticated users can view doctors
// Admin sees all (active + inactive), others see only active
router.get('/', authenticate, getAllDoctors);

// GET /api/doctors/active - Get only active doctors (for dropdowns)
router.get('/active', authenticate, getActiveDoctors);

// GET /api/doctors/:id - All authenticated users can view doctor details
router.get('/:id', authenticate, getDoctorById);

// POST /api/doctors - Create new doctor (Admin only)
router.post('/', authenticate, authorizeRoles('Admin'), createDoctor);

// PUT /api/doctors/:id - Update doctor (Admin only)
router.put('/:id', authenticate, authorizeRoles('Admin'), updateDoctor);

// PATCH /api/doctors/:id/status - Activate/deactivate doctor (Admin only)
router.patch('/:id/status', authenticate, authorizeRoles('Admin'), updateDoctorStatus);

module.exports = router;
