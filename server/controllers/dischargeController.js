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
 * GET /api/discharges
 * Get all discharges
 */
const getAllDischarges = async (req, res) => {
  try {
    const doctorFilter = req.user.role === 'Doctor' ? 'WHERE u.user_id = ?' : '';
    const params = req.user.role === 'Doctor' ? [req.user.user_id] : [];
    const [discharges] = await db.query(
      `SELECT 
        d.discharge_id,
        d.admission_id,
        d.discharge_date,
        d.discharge_summary,
        d.final_diagnosis,
        d.medications_prescribed,
        d.instructions,
        a.admission_date,
        a.reason as admission_reason,
        p.patient_id,
        p.first_name as patient_first_name,
        p.last_name as patient_last_name,
        p.phone as patient_phone,
        doc.doctor_id,
        u.full_name as doctor_name,
        doc.specialization,
        r.room_number,
        r.room_type
      FROM Discharges d
      INNER JOIN Admissions a ON d.admission_id = a.admission_id
      INNER JOIN Patients p ON a.patient_id = p.patient_id
      INNER JOIN Doctors doc ON a.doctor_id = doc.doctor_id
      INNER JOIN Users u ON doc.user_id = u.user_id
      INNER JOIN Rooms r ON a.room_id = r.room_id
      ${doctorFilter}
      ORDER BY d.discharge_date DESC, d.discharge_id DESC`,
      params
    );

    res.json({
      success: true,
      discharges
    });

  } catch (error) {
    console.error('Get all discharges error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch discharges'
    });
  }
};

/**
 * GET /api/discharges/:id
 * Get discharge by ID
 */
const getDischargeById = async (req, res) => {
  try {
    const { id } = req.params;

    const doctorFilter = req.user.role === 'Doctor' ? 'AND u.user_id = ?' : '';
    const params = req.user.role === 'Doctor' ? [id, req.user.user_id] : [id];
    const [discharges] = await db.query(
      `SELECT 
        d.discharge_id,
        d.admission_id,
        d.discharge_date,
        d.discharge_summary,
        d.final_diagnosis,
        d.medications_prescribed,
        d.instructions,
        a.admission_date,
        a.reason as admission_reason,
        a.status as admission_status,
        p.patient_id,
        p.first_name as patient_first_name,
        p.last_name as patient_last_name,
        p.date_of_birth,
        p.gender,
        p.phone as patient_phone,
        p.email as patient_email,
        p.blood_group,
        p.address,
        doc.doctor_id,
        u.full_name as doctor_name,
        u.phone as doctor_phone,
        u.email as doctor_email,
        doc.specialization,
        doc.qualification,
        doc.experience_years,
        r.room_id,
        r.room_number,
        r.room_type,
        r.floor,
        r.price_per_day
      FROM Discharges d
      INNER JOIN Admissions a ON d.admission_id = a.admission_id
      INNER JOIN Patients p ON a.patient_id = p.patient_id
      INNER JOIN Doctors doc ON a.doctor_id = doc.doctor_id
      INNER JOIN Users u ON doc.user_id = u.user_id
      INNER JOIN Rooms r ON a.room_id = r.room_id
      WHERE d.discharge_id = ? ${doctorFilter}`,
      params
    );

    if (discharges.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Discharge record not found'
      });
    }

    res.json({
      success: true,
      discharge: discharges[0]
    });

  } catch (error) {
    console.error('Get discharge by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch discharge'
    });
  }
};

/**
 * POST /api/admissions/:id/approve-discharge
 * Doctor approves discharge for their own admission
 */
const approveDischarge = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const { id } = req.params; // admission_id
    const userRole = req.user.role;
    const userId = req.user.user_id;

    // Only Doctor can approve discharge
    if (userRole !== 'Doctor') {
      return res.status(403).json({
        success: false,
        message: 'Only Doctors can approve discharge'
      });
    }

    await connection.beginTransaction();

    // Get admission details
    const [admissions] = await connection.query(
      `SELECT 
        a.admission_id,
        a.patient_id,
        a.doctor_id,
        a.status,
        d.user_id as doctor_user_id,
        p.first_name,
        p.last_name,
        p.status as patient_status
      FROM Admissions a
      INNER JOIN Doctors d ON a.doctor_id = d.doctor_id
      INNER JOIN Patients p ON a.patient_id = p.patient_id
      WHERE a.admission_id = ?`,
      [id]
    );

    if (admissions.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: 'Admission not found'
      });
    }

    const admission = admissions[0];

    // Verify admission is Active
    if (admission.status !== 'Active') {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: 'Only active admissions can be approved for discharge'
      });
    }

    // Verify Doctor owns this admission
    if (admission.doctor_user_id !== userId) {
      await connection.rollback();
      return res.status(403).json({
        success: false,
        message: 'You can only approve discharge for your own patients'
      });
    }

    // Check if already approved
    if (admission.patient_status === 'Ready for Discharge') {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: 'Patient is already approved for discharge'
      });
    }

    // Update patient status to Ready for Discharge
    await connection.query(
      'UPDATE Patients SET status = ? WHERE patient_id = ?',
      ['Ready for Discharge', admission.patient_id]
    );

    // Log activity
    const description = `Doctor approved discharge for ${admission.first_name} ${admission.last_name}`;
    await logActivity(connection, userId, 'Discharge Approved', 'Admission', admission.admission_id, description);

    await connection.commit();

    res.json({
      success: true,
      message: 'Discharge approved successfully. Patient is ready for discharge.'
    });

  } catch (error) {
    await connection.rollback();
    console.error('Approve discharge error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve discharge'
    });
  } finally {
    connection.release();
  }
};

/**
 * POST /api/admissions/:id/discharge
 * Finalize discharge (Receptionist/Admin only)
 */
const finalizeDischarge = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const { id } = req.params; // admission_id
    const { discharge_summary, final_diagnosis, medications_prescribed, instructions } = req.body || {};
    const userRole = req.user.role;
    const userId = req.user.user_id;

    // Only Admin and Receptionist can finalize discharge
    if (userRole !== 'Admin' && userRole !== 'Receptionist') {
      return res.status(403).json({
        success: false,
        message: 'Only Admin and Receptionist can finalize discharge'
      });
    }

    // Validate required fields (at least discharge_summary needed)
    if (!discharge_summary || !discharge_summary.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Discharge summary is required'
      });
    }

    await connection.beginTransaction();

    // Get admission details with patient and room info
    const [admissions] = await connection.query(
      `SELECT 
        a.admission_id,
        a.patient_id,
        a.room_id,
        a.doctor_id,
        a.status,
        p.first_name,
        p.last_name,
        p.status as patient_status,
        r.room_number
      FROM Admissions a
      INNER JOIN Patients p ON a.patient_id = p.patient_id
      INNER JOIN Rooms r ON a.room_id = r.room_id
      WHERE a.admission_id = ?`,
      [id]
    );

    if (admissions.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: 'Admission not found'
      });
    }

    const admission = admissions[0];

    // Verify admission is Active
    if (admission.status !== 'Active') {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: 'Admission is already discharged'
      });
    }

    // Verify patient is Ready for Discharge
    if (admission.patient_status !== 'Ready for Discharge') {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: 'Patient must be approved by doctor before discharge can be finalized'
      });
    }

    // Check if discharge record already exists
    const [existingDischarges] = await connection.query(
      'SELECT discharge_id FROM Discharges WHERE admission_id = ?',
      [id]
    );

    if (existingDischarges.length > 0) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: 'Discharge record already exists for this admission'
      });
    }

    // Verify bill payment status
    const [bills] = await connection.query(
      `SELECT bill_id, payment_status, total_amount
       FROM Bills
       WHERE patient_id = ?
       ORDER BY generated_at DESC
       LIMIT 1`,
      [admission.patient_id]
    );

    if (bills.length > 0 && bills[0].payment_status === 'Pending') {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: 'Patient has pending bill. Payment must be completed before discharge.',
        bill_id: bills[0].bill_id,
        total_amount: bills[0].total_amount
      });
    }

    // Create discharge record
    const [dischargeResult] = await connection.query(
      `INSERT INTO Discharges (
        admission_id,
        discharge_date,
        discharge_summary,
        final_diagnosis,
        medications_prescribed,
        instructions
      ) VALUES (?, CURRENT_TIMESTAMP, ?, ?, ?, ?)`,
      [
        id,
        discharge_summary.trim(),
        final_diagnosis?.trim() || null,
        medications_prescribed?.trim() || null,
        instructions?.trim() || null
      ]
    );

    const discharge_id = dischargeResult.insertId;

    // Update admission status to Discharged
    await connection.query(
      'UPDATE Admissions SET status = ? WHERE admission_id = ?',
      ['Discharged', id]
    );

    // Update patient status to Discharged
    await connection.query(
      'UPDATE Patients SET status = ? WHERE patient_id = ?',
      ['Discharged', admission.patient_id]
    );

    // Release room (set is_available = TRUE)
    await connection.query(
      'UPDATE Rooms SET is_available = TRUE WHERE room_id = ?',
      [admission.room_id]
    );

    // Log activity
    const description = `Patient ${admission.first_name} ${admission.last_name} discharged from room ${admission.room_number}`;
    await logActivity(connection, userId, 'Patient Discharged', 'Discharge', discharge_id, description);

    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Discharge finalized successfully',
      discharge_id
    });

  } catch (error) {
    await connection.rollback();
    console.error('Finalize discharge error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to finalize discharge'
    });
  } finally {
    connection.release();
  }
};

module.exports = {
  getAllDischarges,
  getDischargeById,
  approveDischarge,
  finalizeDischarge
};
