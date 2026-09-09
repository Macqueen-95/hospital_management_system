const express = require('express');
const router = express.Router();
const { getAllDoctors, getDoctorById } = require('../controllers/doctorController');
const { authenticate } = require('../middleware/authMiddleware');

// All routes require authentication
// GET /api/doctors - All authenticated users can view doctors
router.get('/', authenticate, getAllDoctors);

// GET /api/doctors/:id - All authenticated users can view doctor details
router.get('/:id', authenticate, getDoctorById);

module.exports = router;
