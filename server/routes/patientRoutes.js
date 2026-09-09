const express = require('express');
const router = express.Router();
const {
  getAllPatients,
  getPatientById,
  registerPatient,
  updatePatient,
  searchPatients
} = require('../controllers/patientController');
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');

// All routes require authentication
// GET /api/patients/search - Must come before /:id route
router.get('/search', authenticate, searchPatients);

// GET /api/patients - All roles can view patients
router.get('/', authenticate, getAllPatients);

// GET /api/patients/:id - All roles can view patient details
router.get('/:id', authenticate, getPatientById);

// POST /api/patients - Admin and Receptionist can register patients
router.post('/', authenticate, authorizeRoles('Admin', 'Receptionist'), registerPatient);

// PUT /api/patients/:id - Admin and Receptionist can update patients
router.put('/:id', authenticate, authorizeRoles('Admin', 'Receptionist'), updatePatient);

module.exports = router;
