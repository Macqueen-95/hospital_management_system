const db = require('../config/db');

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
 * GET /api/admissions
 * Get all admissions
 */
const getAllAdmissions = async (req, res) => {
  try {
    const [admissions] = await db.query(
      `SELECT 
        a.admission_id,
        a.patient_id,
        a.room_id,
        a.doctor_id,
        a.admission_date,
        a.reason,
        a.status,
        p.first_name as patient_first_name,
        p.last_name as patient_last_name,
        p.phone as patient_phone,
        d.specialization,
        u.full_name as doctor_name,
        r.room_number,
        r.room_type,
        r.floor
      FROM Admissions a
      INNER JOIN Patients p ON a.patient_id = p.patient_id
      INNER JOIN Doctors d ON a.doctor_id = d.doctor_id
      INNER JOIN Users u ON d.user_id = u.user_id
      INNER JOIN Rooms r ON a.room_id = r.room_id
      ORDER BY a.admission_date DESC, a.admission_id DESC`
    );

    res.json({
      success: true,
      admissions
    });

  } catch (error) {
    console.error('Get all admissions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admissions'
    });
  }
};

/**
 * GET /api/admissions/:id
 * Get admission by ID
 */
const getAdmissionById = async (req, res) => {
  try {
    const { id } = req.params;

    const [admissions] = await db.query(
      `SELECT 
        a.admission_id,
        a.patient_id,
        a.room_id,
        a.doctor_id,
        a.admission_date,
        a.reason,
        a.status,
        p.first_name as patient_first_name,
        p.last_name as patient_last_name,
        p.date_of_birth,
        p.gender,
        p.phone as patient_phone,
        p.email as patient_email,
        p.blood_group,
        p.address,
        p.status as patient_status,
        d.specialization,
        d.qualification,
        d.experience_years,
        u.full_name as doctor_name,
        u.phone as doctor_phone,
        u.email as doctor_email,
        r.room_number,
        r.room_type,
        r.floor,
        r.bed_count,
        r.price_per_day
      FROM Admissions a
      INNER JOIN Patients p ON a.patient_id = p.patient_id
      INNER JOIN Doctors d ON a.doctor_id = d.doctor_id
      INNER JOIN Users u ON d.user_id = u.user_id
      INNER JOIN Rooms r ON a.room_id = r.room_id
      WHERE a.admission_id = ?`,
      [id]
    );

    if (admissions.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Admission not found'
      });
    }

    res.json({
      success: true,
      admission: admissions[0]
    });

  } catch (error) {
    console.error('Get admission by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admission'
    });
  }
};

/**
 * POST /api/admissions
 * Create new admission
 */
const createAdmission = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const { patient_id, doctor_id, room_id, reason } = req.body;
    const userRole = req.user.role;

    // Only Admin and Receptionist can create admissions
    if (userRole !== 'Admin' && userRole !== 'Receptionist') {
      return res.status(403).json({
        success: false,
        message: 'Only Admin and Receptionist can create admissions'
      });
    }

    // Validate required fields
    if (!patient_id || !doctor_id || !room_id || !reason || !reason.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Patient, doctor, room, and reason are required'
      });
    }

    // Start transaction
    await connection.beginTransaction();

    // Verify patient exists and get current status
    const [patients] = await connection.query(
      'SELECT patient_id, status, first_name, last_name FROM Patients WHERE patient_id = ?',
      [patient_id]
    );

    if (patients.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    const patient = patients[0];

    // Check if patient is eligible for admission
    // Normally should be 'Consultation Completed' or 'Registered'
    if (patient.status === 'Admitted') {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: 'Patient is already admitted'
      });
    }

    // Verify doctor exists
    const [doctors] = await connection.query(
      'SELECT doctor_id FROM Doctors WHERE doctor_id = ?',
      [doctor_id]
    );

    if (doctors.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    // Verify room exists and is available
    const [rooms] = await connection.query(
      'SELECT room_id, is_available, room_number FROM Rooms WHERE room_id = ?',
      [room_id]
    );

    if (rooms.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    const room = rooms[0];

    if (!room.is_available) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: `Room ${room.room_number} is not available`
      });
    }

    // Insert admission
    const [admissionResult] = await connection.query(
      `INSERT INTO Admissions (patient_id, room_id, doctor_id, admission_date, reason, status)
       VALUES (?, ?, ?, CURDATE(), ?, 'Active')`,
      [patient_id, room_id, doctor_id, reason.trim()]
    );

    const admission_id = admissionResult.insertId;

    // Update room availability
    await connection.query(
      'UPDATE Rooms SET is_available = FALSE WHERE room_id = ?',
      [room_id]
    );

    // Update patient status
    await connection.query(
      'UPDATE Patients SET status = ? WHERE patient_id = ?',
      ['Admitted', patient_id]
    );

    // Log activity
    const description = `Patient ${patient.first_name} ${patient.last_name} admitted to room ${room.room_number}`;
    await connection.query(
      `INSERT INTO ActivityLogs (user_id, action, entity_type, entity_id, description)
       VALUES (?, ?, ?, ?, ?)`,
      [req.user.user_id, 'Patient Admitted', 'Admission', admission_id, description]
    );

    // Commit transaction
    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Admission created successfully',
      admission_id
    });

  } catch (error) {
    // Rollback on error
    await connection.rollback();
    console.error('Create admission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create admission'
    });
  } finally {
    connection.release();
  }
};

module.exports = {
  getAllAdmissions,
  getAdmissionById,
  createAdmission
};
