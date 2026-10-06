const db = require('../config/db');

/**
 * Get all activity logs with optional filtering
 * Admin only
 */
const getActivityLogs = async (req, res) => {
  try {
    const { user, action, entity_type, date, page = 1, limit = 50 } = req.query;
    
    let query = `
      SELECT 
        a.log_id,
        a.user_id,
        u.full_name as user_name,
        u.username,
        a.action,
        a.entity_type,
        a.entity_id,
        a.description,
        a.ip_address,
        a.created_at
      FROM ActivityLogs a
      LEFT JOIN Users u ON a.user_id = u.user_id
      WHERE 1=1
    `;

    const params = [];

    // Apply filters
    if (user) {
      query += ' AND (u.full_name LIKE ? OR u.username LIKE ?)';
      params.push(`%${user}%`, `%${user}%`);
    }

    if (action) {
      query += ' AND a.action LIKE ?';
      params.push(`%${action}%`);
    }

    if (entity_type) {
      query += ' AND a.entity_type = ?';
      params.push(entity_type);
    }

    if (date) {
      query += ' AND DATE(a.created_at) = ?';
      params.push(date);
    }

    // Order by newest first
    query += ' ORDER BY a.created_at DESC, a.log_id DESC';

    // Pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [logs] = await db.query(query, params);

    // Get total count for pagination
    let countQuery = `
      SELECT COUNT(*) as total
      FROM ActivityLogs a
      LEFT JOIN Users u ON a.user_id = u.user_id
      WHERE 1=1
    `;
    const countParams = [];

    if (user) {
      countQuery += ' AND (u.full_name LIKE ? OR u.username LIKE ?)';
      countParams.push(`%${user}%`, `%${user}%`);
    }

    if (action) {
      countQuery += ' AND a.action LIKE ?';
      countParams.push(`%${action}%`);
    }

    if (entity_type) {
      countQuery += ' AND a.entity_type = ?';
      countParams.push(entity_type);
    }

    if (date) {
      countQuery += ' AND DATE(a.created_at) = ?';
      countParams.push(date);
    }

    const [countResult] = await db.query(countQuery, countParams);
    const total = countResult[0].total;
    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages
      }
    });

  } catch (error) {
    console.error('Get activity logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch activity logs'
    });
  }
};

module.exports = {
  getActivityLogs
};
