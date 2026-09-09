const bcrypt = require('bcrypt');
const db = require('../config/db');
const { generateToken } = require('../utils/jwt');

/**
 * POST /api/auth/login
 * Authenticate user and return JWT
 */
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate required fields
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    // Find user by username
    const [users] = await db.query(
      'SELECT user_id, username, password_hash, role, full_name, email, phone, is_active FROM Users WHERE username = ?',
      [username]
    );

    // Check if user exists
    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const user = users[0];

    // Check if user is active
    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: 'Account is inactive. Please contact administrator.'
      });
    }

    // Compare password with hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = generateToken({
      user_id: user.user_id,
      username: user.username,
      role: user.role
    });

    // Return success response (do not return password_hash)
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        user_id: user.user_id,
        username: user.username,
        role: user.role,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * GET /api/auth/me
 * Get currently authenticated user's information
 * Requires authentication middleware
 */
const getMe = async (req, res) => {
  try {
    // req.user is set by authentication middleware
    const userId = req.user.user_id;

    // Fetch fresh user data from database
    const [users] = await db.query(
      'SELECT user_id, username, role, full_name, email, phone, is_active FROM Users WHERE user_id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: users[0]
    });

  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * GET /api/auth/admin-test
 * Test endpoint for Admin role authorization
 * Requires authentication + Admin role
 */
const adminTest = (req, res) => {
  res.json({
    success: true,
    message: 'Admin access granted',
    user: {
      user_id: req.user.user_id,
      username: req.user.username,
      role: req.user.role
    }
  });
};

module.exports = {
  login,
  getMe,
  adminTest
};
