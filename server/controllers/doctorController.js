const db = require('../config/db');
const bcrypt = require('bcrypt');

/**
 * Log activity to ActivityLogs table
 */
const logActivity = async (userId, action, entityType, entityId, description) => {
  try {
    await db.query(
      `INSERT INTO ActivityLogs (user_id, action, entity_type, entity_id, description)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, action, entityType, entityId, description]
    );
  } catch (error) {
    console.error('Activity log error:', error);
  }
};

/**
 * GET /api/doctors
 * Get all doctors with their user information
 * Returns active doctors only for non-admin users
 */
const getAllDoctors = async (req, res) => {
  try {
    const isAdmin = req.user?.role === 'Admin';
    
    // Admin sees all doctors (active and inactive)
    // Others see only active doctors
    const whereClause = isAdmin ? '' : 'WHERE u.is_active = true';
    
    const [doctors] = await db.query(
      `SELECT 
        d.doctor_id, 
        d.user_id,
        d.specialization, 
        d.qualification, 
        d.experience_years, 
        d.consultation_fee,
        d.available_days,
        d.available_time_start,
        d.available_time_end,
        u.username,
        u.full_name,
        u.email,
        u.phone,
        u.is_active
       FROM Doctors d
       INNER JOIN Users u ON d.user_id = u.user_id
       ${whereClause}
       ORDER BY u.full_name ASC`
    );

    res.json({
      success: true,
      count: doctors.length,
      doctors
    });

  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch doctors'
    });
  }
};

/**
 * GET /api/doctors/active
 * Get only active doctors (for dropdowns in appointments, admissions, etc.)
 */
const getActiveDoctors = async (req, res) => {
  try {
    const [doctors] = await db.query(
      `SELECT 
        d.doctor_id, 
        d.specialization, 
        d.qualification, 
        d.experience_years, 
        d.consultation_fee,
        d.available_days,
        d.available_time_start,
        d.available_time_end,
        u.full_name,
        u.email,
        u.phone
       FROM Doctors d
       INNER JOIN Users u ON d.user_id = u.user_id
       WHERE u.is_active = true
       ORDER BY u.full_name ASC`
    );

    res.json({
      success: true,
      count: doctors.length,
      doctors
    });

  } catch (error) {
    console.error('Get active doctors error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch active doctors'
    });
  }
};

/**
 * GET /api/doctors/:id
 * Get single doctor by ID with user information
 */
const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;
    const isAdmin = req.user?.role === 'Admin';

    // Admin can view any doctor, others can only view active doctors
    const whereClause = isAdmin 
      ? 'WHERE d.doctor_id = ?' 
      : 'WHERE d.doctor_id = ? AND u.is_active = true';

    const [doctors] = await db.query(
      `SELECT 
        d.doctor_id, 
        d.user_id,
        d.specialization, 
        d.qualification, 
        d.experience_years, 
        d.consultation_fee,
        d.available_days,
        d.available_time_start,
        d.available_time_end,
        u.username,
        u.full_name,
        u.email,
        u.phone,
        u.is_active
       FROM Doctors d
       INNER JOIN Users u ON d.user_id = u.user_id
       ${whereClause}`,
      [id]
    );

    if (doctors.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    res.json({
      success: true,
      doctor: doctors[0]
    });

  } catch (error) {
    console.error('Get doctor error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch doctor'
    });
  }
};

/**
 * POST /api/doctors
 * Create a new doctor (Admin only)
 */
const createDoctor = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    const {
      username,
      password,
      full_name,
      email,
      phone,
      specialization,
      qualification,
      experience_years,
      consultation_fee,
      available_days,
      available_time_start,
      available_time_end
    } = req.body;

    // Validate required fields
    if (!username || !password || !full_name || !email || !specialization || !consultation_fee) {
      return res.status(400).json({
        success: false,
        message: 'Required fields: username, password, full_name, email, specialization, consultation_fee'
      });
    }

    // Validate experience years
    if (experience_years && (experience_years < 0 || !Number.isInteger(Number(experience_years)))) {
      return res.status(400).json({
        success: false,
        message: 'Experience years must be a non-negative integer'
      });
    }

    // Validate consultation fee
    if (consultation_fee < 0) {
      return res.status(400).json({
        success: false,
        message: 'Consultation fee must be non-negative'
      });
    }

    await connection.beginTransaction();

    // Check for duplicate username
    const [existingUsername] = await connection.query(
      'SELECT user_id FROM Users WHERE username = ?',
      [username]
    );

    if (existingUsername.length > 0) {
      await connection.rollback();
      return res.status(409).json({
        success: false,
        message: 'Username already exists'
      });
    }

    // Check for duplicate email
    const [existingEmail] = await connection.query(
      'SELECT user_id FROM Users WHERE email = ?',
      [email]
    );

    if (existingEmail.length > 0) {
      await connection.rollback();
      return res.status(409).json({
        success: false,
        message: 'Email already exists'
      });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Create User record
    const [userResult] = await connection.query(
      `INSERT INTO Users (username, password_hash, role, full_name, email, phone, is_active)
       VALUES (?, ?, 'Doctor', ?, ?, ?, true)`,
      [username, password_hash, full_name, email, phone]
    );

    const user_id = userResult.insertId;

    // Create Doctor record
    const [doctorResult] = await connection.query(
      `INSERT INTO Doctors (
        user_id, specialization, qualification, experience_years, 
        consultation_fee, available_days, available_time_start, available_time_end
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        specialization,
        qualification || null,
        experience_years || 0,
        consultation_fee,
        available_days || null,
        available_time_start || null,
        available_time_end || null
      ]
    );

    const doctor_id = doctorResult.insertId;

    // Log activity
    const description = `Doctor ${full_name} (${username}) added to the system`;
    await logActivity(req.user.user_id, 'Doctor Added', 'Doctor', doctor_id, description);

    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Doctor created successfully',
      doctor: {
        doctor_id,
        user_id,
        username,
        full_name,
        email,
        phone,
        specialization,
        qualification,
        experience_years: experience_years || 0,
        consultation_fee,
        available_days,
        available_time_start,
        available_time_end,
        is_active: true
      }
    });

  } catch (error) {
    await connection.rollback();
    console.error('Create doctor error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Failed to create doctor'
    });
  } finally {
    connection.release();
  }
};

/**
 * PUT /api/doctors/:id
 * Update doctor information (Admin only)
 */
const updateDoctor = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    const { id } = req.params;
    const {
      full_name,
      email,
      phone,
      specialization,
      qualification,
      experience_years,
      consultation_fee,
      available_days,
      available_time_start,
      available_time_end,
      password // Optional password update
    } = req.body;

    // Validate required fields
    if (!full_name || !email || !specialization || consultation_fee === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Required fields: full_name, email, specialization, consultation_fee'
      });
    }

    // Validate experience years
    if (experience_years !== undefined && (experience_years < 0 || !Number.isInteger(Number(experience_years)))) {
      return res.status(400).json({
        success: false,
        message: 'Experience years must be a non-negative integer'
      });
    }

    // Validate consultation fee
    if (consultation_fee < 0) {
      return res.status(400).json({
        success: false,
        message: 'Consultation fee must be non-negative'
      });
    }

    await connection.beginTransaction();

    // Get doctor's user_id
    const [doctors] = await connection.query(
      'SELECT user_id FROM Doctors WHERE doctor_id = ?',
      [id]
    );

    if (doctors.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    const user_id = doctors[0].user_id;

    // Check for duplicate email (excluding current user)
    const [existingEmail] = await connection.query(
      'SELECT user_id FROM Users WHERE email = ? AND user_id != ?',
      [email, user_id]
    );

    if (existingEmail.length > 0) {
      await connection.rollback();
      return res.status(409).json({
        success: false,
        message: 'Email already exists'
      });
    }

    // Update User record
    let updateUserQuery = `UPDATE Users SET full_name = ?, email = ?, phone = ?`;
    let updateUserParams = [full_name, email, phone];

    // If password is provided, hash and update it
    if (password && password.trim() !== '') {
      const password_hash = await bcrypt.hash(password, 10);
      updateUserQuery += `, password_hash = ?`;
      updateUserParams.push(password_hash);
    }

    updateUserQuery += ` WHERE user_id = ?`;
    updateUserParams.push(user_id);

    await connection.query(updateUserQuery, updateUserParams);

    // Update Doctor record
    await connection.query(
      `UPDATE Doctors SET 
        specialization = ?,
        qualification = ?,
        experience_years = ?,
        consultation_fee = ?,
        available_days = ?,
        available_time_start = ?,
        available_time_end = ?
       WHERE doctor_id = ?`,
      [
        specialization,
        qualification || null,
        experience_years || 0,
        consultation_fee,
        available_days || null,
        available_time_start || null,
        available_time_end || null,
        id
      ]
    );

    // Log activity
    const description = `Doctor ${full_name} information updated`;
    await logActivity(req.user.user_id, 'Doctor Updated', 'Doctor', id, description);

    await connection.commit();

    res.json({
      success: true,
      message: 'Doctor updated successfully'
    });

  } catch (error) {
    await connection.rollback();
    console.error('Update doctor error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Failed to update doctor'
    });
  } finally {
    connection.release();
  }
};

/**
 * PATCH /api/doctors/:id/status
 * Activate or deactivate a doctor (Admin only)
 */
const updateDoctorStatus = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    // Validate is_active
    if (typeof is_active !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'is_active must be a boolean value'
      });
    }

    await connection.beginTransaction();

    // Get doctor's user_id and current status
    const [doctors] = await connection.query(
      `SELECT d.user_id, u.is_active, u.full_name 
       FROM Doctors d
       INNER JOIN Users u ON d.user_id = u.user_id
       WHERE d.doctor_id = ?`,
      [id]
    );

    if (doctors.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    const { user_id, is_active: currentStatus, full_name } = doctors[0];

    // Check if already in desired state
    if (currentStatus === is_active) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: `Doctor is already ${is_active ? 'active' : 'inactive'}`
      });
    }

    // Update user status
    await connection.query(
      'UPDATE Users SET is_active = ? WHERE user_id = ?',
      [is_active, user_id]
    );

    // Log activity
    const action = is_active ? 'Doctor Reactivated' : 'Doctor Deactivated';
    const description = `Doctor ${full_name} ${is_active ? 'reactivated' : 'deactivated'}`;
    await logActivity(req.user.user_id, action, 'Doctor', id, description);

    await connection.commit();

    res.json({
      success: true,
      message: `Doctor ${is_active ? 'activated' : 'deactivated'} successfully`
    });

  } catch (error) {
    await connection.rollback();
    console.error('Update doctor status error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Failed to update doctor status'
    });
  } finally {
    connection.release();
  }
};

module.exports = {
  getAllDoctors,
  getActiveDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  updateDoctorStatus
};
