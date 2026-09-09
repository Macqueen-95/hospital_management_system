const express = require('express');
const router = express.Router();
const {
  getAllAppointments,
  getTodayAppointments,
  getAppointmentById,
  createAppointment,
  checkInAppointment
} = require('../controllers/appointmentController');
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');

// All routes require authentication

// GET /api/appointments/today - Must come before /:id route
router.get('/today', authenticate, getTodayAppointments);

// GET /api/appointments - All authenticated users
router.get('/', authenticate, getAllAppointments);

// GET /api/appointments/:id - All authenticated users
router.get('/:id', authenticate, getAppointmentById);

// POST /api/appointments - Only Admin and Receptionist can book appointments
router.post('/', authenticate, authorizeRoles('Admin', 'Receptionist'), createAppointment);

// PUT /api/appointments/:id/check-in - Only Admin and Receptionist can check in
router.put('/:id/check-in', authenticate, authorizeRoles('Admin', 'Receptionist'), checkInAppointment);

module.exports = router;
