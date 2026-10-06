const express = require('express');
const router = express.Router();
const {
  getAllRooms,
  getAvailableRooms,
  getRoomById
} = require('../controllers/roomController');
const { authenticate } = require('../middleware/authMiddleware');

// All routes require authentication
// All authenticated users can view rooms

// GET /api/rooms/available - Must come before /:id route
router.get('/available', authenticate, getAvailableRooms);

// GET /api/rooms - Get all rooms
router.get('/', authenticate, getAllRooms);

// GET /api/rooms/:id - Get room by ID
router.get('/:id', authenticate, getRoomById);

module.exports = router;
