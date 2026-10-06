const db = require('../config/db');

/**
 * Log activity to ActivityLogs table
 */
const logActivity = async (connection, userId, action, entityType, entityId, description) => {
  try {
    await connection.query(
      `INSERT INTO ActivityLogs (user_id, action, entity_type, entity_id, description)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, action, entityType, entityId, description]
    );
  } catch (error) {
    console.error('Activity log error:', error);
  }
};

/**
 * GET /api/followups
 * Get all follow-ups (filtered by doctor for Doctor role)
 */
const getAllFollowUps = async (req, res) => {
  try {
    const userRole = req.user.role;
    const userId = req.user.user_id;

    let query = `
      SELECT 
        f.followup_id,
        f.discharge_id,
        f.patient_id,
        f.doctor_id,
        f.followup_date,
        f.followup_time,
        f.notes,
        f.status,
        f.created_at,
        p.first_name as patient_first_name,
        p.last_name as patient_last_name,
        p.phone as patient_phone,
        p.status as patient_status,
        d.specialization,
        u.full_name as doctor_name,
        dis.discharge_date
      FROM FollowUps f
      INNER JOIN Patients p ON f.patient_id = p.patient_id
      INNER JOIN Doctors d ON f.doctor_id = d.doctor_id
      INNER JOIN Users u ON d.user_id = u.user_id
      LEFT JOIN Discharges dis ON f.discharge_id = dis.discharge_id
    `;

    const params = [];

    // Doctor can only see their own follow-ups
    if (userRole === 'Doctor') {
      // Get doctor_id from user_id
      const [doctorRows] = await db.query(
        'SELECT doctor_id FROM Doctors WHERE user_id = ?',
        [userId]
      );

      if (doctorRows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Doctor profile not found'
        });
      }

      query += ' WHERE f.doctor_id = ?';
      params.push(doctorRows[0].doctor_id);
    }

    query += ' ORDER BY f.followup_date DESC, f.followup_time DESC, f.followup_id DESC';

    const [followups] = await db.query(query, params);

    res.json({
      success: true,
      followups
    });

  } catch (error) {
    console.error('Get all follow-ups error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch follow-ups'
    });
  }
};

/**
 * GET /api/followups/:id
 * Get follow-up by ID (with authorization check for Doctor)
 */
const getFollowUpById = async (req, res) => {
  try {
    const { id } = req.params;
    const userRole = req.user.role;
    const userId = req.user.user_id;

    const [followups] = await db.query(
      `SELECT 
        f.followup_id,
        f.discharge_id,
        f.patient_id,
        f.doctor_id,
        f.followup_date,
        f.followup_time,
        f.notes,
        f.status,
        f.created_at,
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
        doc_user.user_id as doctor_user_id,
        dis.discharge_id as discharge_record_id,
        dis.discharge_date,
        dis.discharge_summary,
        adm.admission_id,
        adm.admission_date
      FROM FollowUps f
      INNER JOIN Patients p ON f.patient_id = p.patient_id
      INNER JOIN Doctors d ON f.doctor_id = d.doctor_id
      INNER JOIN Users u ON d.user_id = u.user_id
      INNER JOIN Users doc_user ON d.user_id = doc_user.user_id
      LEFT JOIN Discharges dis ON f.discharge_id = dis.discharge_id
      LEFT JOIN Admissions adm ON dis.admission_id = adm.admission_id
      WHERE f.followup_id = ?`,
      [id]
    );

    if (followups.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Follow-up not found'
      });
    }

    const followup = followups[0];

    // Doctor can only access their own follow-ups
    if (userRole === 'Doctor' && followup.doctor_user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only access your own follow-ups'
      });
    }

    res.json({
      success: true,
      followup
    });

  } catch (error) {
    console.error('Get follow-up by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch follow-up'
    });
  }
};

/**
 * POST /api/followups
 * Create new follow-up
 */
const createFollowUp = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const { patient_id, doctor_id, discharge_id, followup_date, followup_time, notes } = req.body;
    const userRole = req.user.role;
    const userId = req.user.user_id;

    // Only Admin, Receptionist, and Doctor can create follow-ups
    if (userRole !== 'Admin' && userRole !== 'Receptionist' && userRole !== 'Doctor') {
      return res.status(403).json({
        success: false,
        message: 'Only Admin, Receptionist, and Doctor can schedule follow-ups'
      });
    }

    // Validate required fields
    if (!patient_id || !doctor_id || !followup_date) {
      return res.status(400).json({
        success: false,
        message: 'Patient, doctor, and follow-up date are required'
      });
    }

    // Validate date is not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const followupDateObj = new Date(followup_date);
    
    if (followupDateObj < today) {
      return res.status(400).json({
        success: false,
        message: 'Follow-up date cannot be in the past'
      });
    }

    await connection.beginTransaction();

    // Verify patient exists
    const [patients] = await connection.query(
      'SELECT patient_id, first_name, last_name, status FROM Patients WHERE patient_id = ?',
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

    // Verify doctor exists
    const [doctors] = await connection.query(
      'SELECT doctor_id, user_id FROM Doctors WHERE doctor_id = ?',
      [doctor_id]
    );

    if (doctors.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    // If discharge_id is provided, verify it exists and belongs to the patient
    if (discharge_id) {
      const [discharges] = await connection.query(
        `SELECT d.discharge_id, a.patient_id
         FROM Discharges d
         INNER JOIN Admissions a ON d.admission_id = a.admission_id
         WHERE d.discharge_id = ?`,
        [discharge_id]
      );

      if (discharges.length === 0) {
        await connection.rollback();
        return res.status(404).json({
          success: false,
          message: 'Discharge record not found'
        });
      }

      if (discharges[0].patient_id !== patient_id) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: 'Discharge record does not belong to the selected patient'
        });
      }
    }

    // Check for duplicate follow-up slot (same doctor, date, time for Scheduled status)
    if (followup_time) {
      const [conflicts] = await connection.query(
        `SELECT followup_id 
         FROM FollowUps 
         WHERE doctor_id = ? 
         AND followup_date = ? 
         AND followup_time = ? 
         AND status = 'Scheduled'`,
        [doctor_id, followup_date, followup_time]
      );

      if (conflicts.length > 0) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: 'Doctor already has a scheduled follow-up at this date and time'
        });
      }
    }

    // Insert follow-up
    const [followupResult] = await connection.query(
      `INSERT INTO FollowUps (
        patient_id, 
        doctor_id, 
        discharge_id, 
        followup_date, 
        followup_time, 
        notes, 
        status
      ) VALUES (?, ?, ?, ?, ?, ?, 'Scheduled')`,
      [
        patient_id,
        doctor_id,
        discharge_id || null,
        followup_date,
        followup_time || null,
        notes?.trim() || null
      ]
    );

    const followup_id = followupResult.insertId;

    // Update patient status to Follow-up Scheduled if appropriate
    // Only update if patient is in a state where follow-up scheduling makes sense
    const eligibleStatuses = ['Consultation Completed', 'Discharged'];
    if (eligibleStatuses.includes(patient.status)) {
      await connection.query(
        'UPDATE Patients SET status = ? WHERE patient_id = ?',
        ['Follow-up Scheduled', patient_id]
      );
    }

    // Log activity
    const description = `Follow-up scheduled for ${patient.first_name} ${patient.last_name}${discharge_id ? ' (post-discharge)' : ' (outpatient)'}`;
    await logActivity(connection, userId, 'Follow-up Scheduled', 'FollowUp', followup_id, description);

    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Follow-up scheduled successfully',
      followup_id
    });

  } catch (error) {
    await connection.rollback();
    console.error('Create follow-up error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to schedule follow-up'
    });
  } finally {
    connection.release();
  }
};

/**
 * PUT /api/followups/:id/status
 * Update follow-up status
 */
const updateFollowUpStatus = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const { id } = req.params;
    const { status } = req.body;
    const userRole = req.user.role;
    const userId = req.user.user_id;

    // Validate status
    const validStatuses = ['Scheduled', 'Completed', 'Cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be Scheduled, Completed, or Cancelled'
      });
    }

    await connection.beginTransaction();

    // Get follow-up details
    const [followups] = await connection.query(
      `SELECT 
        f.followup_id,
        f.patient_id,
        f.doctor_id,
        f.status as current_status,
        d.user_id as doctor_user_id,
        p.first_name,
        p.last_name
      FROM FollowUps f
      INNER JOIN Doctors d ON f.doctor_id = d.doctor_id
      INNER JOIN Patients p ON f.patient_id = p.patient_id
      WHERE f.followup_id = ?`,
      [id]
    );

    if (followups.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: 'Follow-up not found'
      });
    }

    const followup = followups[0];

    // Doctor can only update their own follow-ups
    if (userRole === 'Doctor' && followup.doctor_user_id !== userId) {
      await connection.rollback();
      return res.status(403).json({
        success: false,
        message: 'You can only update your own follow-ups'
      });
    }

    // Validate status transitions
    const currentStatus = followup.current_status;

    // Once Completed or Cancelled, no further changes allowed
    if (currentStatus === 'Completed' || currentStatus === 'Cancelled') {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: `Cannot change status of a ${currentStatus.toLowerCase()} follow-up`
      });
    }

    // Only allow Scheduled → Completed or Scheduled → Cancelled
    if (currentStatus === 'Scheduled' && status === 'Scheduled') {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: 'Follow-up is already scheduled'
      });
    }

    // Update status
    await connection.query(
      'UPDATE FollowUps SET status = ? WHERE followup_id = ?',
      [status, id]
    );

    // Log activity
    let action, description;
    if (status === 'Completed') {
      action = 'Follow-up Completed';
      description = `Follow-up completed for ${followup.first_name} ${followup.last_name}`;
    } else if (status === 'Cancelled') {
      action = 'Follow-up Cancelled';
      description = `Follow-up cancelled for ${followup.first_name} ${followup.last_name}`;
    }

    await logActivity(connection, userId, action, 'FollowUp', id, description);

    await connection.commit();

    res.json({
      success: true,
      message: `Follow-up ${status.toLowerCase()} successfully`
    });

  } catch (error) {
    await connection.rollback();
    console.error('Update follow-up status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update follow-up status'
    });
  } finally {
    connection.release();
  }
};

module.exports = {
  getAllFollowUps,
  getFollowUpById,
  createFollowUp,
  updateFollowUpStatus
};
