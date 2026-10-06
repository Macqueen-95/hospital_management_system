const db = require('../config/db');

/**
 * GET /api/rooms
 * Get all rooms
 */
const getAllRooms = async (req, res) => {
  try {
    const [rooms] = await db.query(
      `SELECT 
        room_id,
        room_number,
        room_type,
        floor,
        bed_count,
        price_per_day,
        is_available
      FROM Rooms
      ORDER BY floor, room_number`
    );

    res.json({
      success: true,
      rooms
    });

  } catch (error) {
    console.error('Get all rooms error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch rooms'
    });
  }
};

/**
 * GET /api/rooms/available
 * Get all available rooms
 */
const getAvailableRooms = async (req, res) => {
  try {
    const [rooms] = await db.query(
      `SELECT 
        room_id,
        room_number,
        room_type,
        floor,
        bed_count,
        price_per_day,
        is_available
      FROM Rooms
      WHERE is_available = TRUE
      ORDER BY floor, room_number`
    );

    res.json({
      success: true,
      rooms
    });

  } catch (error) {
    console.error('Get available rooms error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch available rooms'
    });
  }
};

/**
 * GET /api/rooms/:id
 * Get room by ID
 */
const getRoomById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rooms] = await db.query(
      `SELECT 
        room_id,
        room_number,
        room_type,
        floor,
        bed_count,
        price_per_day,
        is_available
      FROM Rooms
      WHERE room_id = ?`,
      [id]
    );

    if (rooms.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    res.json({
      success: true,
      room: rooms[0]
    });

  } catch (error) {
    console.error('Get room by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch room'
    });
  }
};

module.exports = {
  getAllRooms,
  getAvailableRooms,
  getRoomById
};
