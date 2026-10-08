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
 * GET /api/appointments/:id/patient-history
 * Get patient information and history for consultation
 */
const getPatientHistory = async (req, res) => {
  try {
    const { id } = req.params; // appointment_id
    const userRole = req.user.role;

    // Only Doctors can access this
    if (userRole !== 'Doctor') {
      return res.status(403).json({
        success: false,
        message: 'Only doctors can access patient history'
      });
    }

    // Get doctor_id from authenticated user
    const [doctorRows] = await db.query(
      'SELECT doctor_id FROM Doctors WHERE user_id = ?',
      [req.user.user_id]
    );

    if (doctorRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found'
      });
    }

    const authenticatedDoctorId = doctorRows[0].doctor_id;

    // Get appointment and verify it belongs to this doctor
    const [appointments] = await db.query(
      `SELECT 
        a.appointment_id,
        a.doctor_id,
        a.patient_id,
        a.appointment_date,
        a.appointment_time,
        a.reason,
        a.status,
        p.first_name,
        p.last_name,
        p.date_of_birth,
        p.gender,
        p.phone,
        p.email,
        p.blood_group,
        p.status as patient_status,
        p.registered_at
      FROM Appointments a
      INNER JOIN Patients p ON a.patient_id = p.patient_id
      WHERE a.appointment_id = ?`,
      [id]
    );

    if (appointments.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    const appointment = appointments[0];

    // Verify appointment belongs to this doctor
    if (appointment.doctor_id !== authenticatedDoctorId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to access this appointment'
      });
    }

    // Get previous consultations for this patient
    const [previousConsultations] = await db.query(
      `SELECT 
        c.consultation_id,
        c.symptoms,
        c.diagnosis,
        c.prescription,
        c.notes,
        c.consultation_date,
        a.appointment_date
      FROM Consultations c
      INNER JOIN Appointments a ON c.appointment_id = a.appointment_id
      WHERE a.patient_id = ? AND a.doctor_id = ?
      ORDER BY c.consultation_date DESC
      LIMIT 5`,
      [appointment.patient_id, authenticatedDoctorId]
    );

    res.json({
      success: true,
      patient: {
        patient_id: appointment.patient_id,
        first_name: appointment.first_name,
        last_name: appointment.last_name,
        date_of_birth: appointment.date_of_birth,
        gender: appointment.gender,
        phone: appointment.phone,
        email: appointment.email,
        blood_group: appointment.blood_group,
        status: appointment.patient_status,
        registered_at: appointment.registered_at
      },
      appointment: {
        appointment_id: appointment.appointment_id,
        appointment_date: appointment.appointment_date,
        appointment_time: appointment.appointment_time,
        reason: appointment.reason,
        status: appointment.status
      },
      previousConsultations: previousConsultations || []
    });

  } catch (error) {
    console.error('Get patient history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch patient history'
    });
  }
};

/**
 * GET /api/appointments/:id/consultation
 * Get existing consultation for an appointment
 */
const getConsultation = async (req, res) => {
  try {
    const { id } = req.params; // appointment_id
    const userRole = req.user.role;

    // Only Doctors can access consultations
    if (userRole !== 'Doctor') {
      return res.status(403).json({
        success: false,
        message: 'Only doctors can access consultations'
      });
    }

    // Get doctor_id from authenticated user
    const [doctorRows] = await db.query(
      'SELECT doctor_id FROM Doctors WHERE user_id = ?',
      [req.user.user_id]
    );

    if (doctorRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found'
      });
    }

    const authenticatedDoctorId = doctorRows[0].doctor_id;

    // Get appointment and verify it belongs to this doctor
    const [appointments] = await db.query(
      'SELECT doctor_id FROM Appointments WHERE appointment_id = ?',
      [id]
    );

    if (appointments.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    if (appointments[0].doctor_id !== authenticatedDoctorId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to access this appointment'
      });
    }

    // Get consultation
    const [consultations] = await db.query(
      `SELECT 
        consultation_id,
        appointment_id,
        symptoms,
        diagnosis,
        prescription,
        notes,
        consultation_date
      FROM Consultations
      WHERE appointment_id = ?`,
      [id]
    );

    if (consultations.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No consultation found for this appointment'
      });
    }

    res.json({
      success: true,
      consultation: consultations[0]
    });

  } catch (error) {
    console.error('Get consultation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch consultation'
    });
  }
};

/**
 * POST /api/appointments/:id/consultation
 * Create consultation for an appointment
 */
const createConsultation = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    const { id } = req.params; // appointment_id
    const { symptoms, diagnosis, prescription, notes } = req.body;
    const userRole = req.user.role;

    // Only Doctors can create consultations
    if (userRole !== 'Doctor') {
      return res.status(403).json({
        success: false,
        message: 'Only doctors can create consultations'
      });
    }

    // Validate diagnosis is provided
    if (!diagnosis || !diagnosis.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Diagnosis is required'
      });
    }

    // Get doctor_id from authenticated user
    const [doctorRows] = await connection.query(
      'SELECT doctor_id FROM Doctors WHERE user_id = ?',
      [req.user.user_id]
    );

    if (doctorRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found'
      });
    }

    const authenticatedDoctorId = doctorRows[0].doctor_id;

    // Start transaction
    await connection.beginTransaction();

    // Get appointment and verify
    const [appointments] = await connection.query(
      'SELECT doctor_id, patient_id, status FROM Appointments WHERE appointment_id = ?',
      [id]
    );

    if (appointments.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    const appointment = appointments[0];

    // Verify appointment belongs to this doctor
    if (appointment.doctor_id !== authenticatedDoctorId) {
      await connection.rollback();
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to consult this appointment'
      });
    }

    // Verify appointment is Checked In
    if (appointment.status !== 'Checked In') {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: `Cannot create consultation for appointment with status: ${appointment.status}. Appointment must be Checked In.`
      });
    }

    // Check if consultation already exists
    const [existingConsultations] = await connection.query(
      'SELECT consultation_id FROM Consultations WHERE appointment_id = ?',
      [id]
    );

    if (existingConsultations.length > 0) {
      await connection.rollback();
      return res.status(409).json({
        success: false,
        message: 'Consultation already exists for this appointment'
      });
    }

    // Insert consultation
    const [result] = await connection.query(
      `INSERT INTO Consultations 
       (appointment_id, symptoms, diagnosis, prescription, notes)
       VALUES (?, ?, ?, ?, ?)`,
      [id, symptoms || null, diagnosis, prescription || null, notes || null]
    );

    const consultationId = result.insertId;

    // Update appointment status to Completed
    await connection.query(
      `UPDATE Appointments SET status = 'Completed' WHERE appointment_id = ?`,
      [id]
    );

    // Update patient status to Consultation Completed
    await connection.query(
      `UPDATE Patients SET status = 'Consultation Completed' WHERE patient_id = ?`,
      [appointment.patient_id]
    );

    // Commit transaction
    await connection.commit();

    // Log activity (after commit)
    await logActivity(
      req.user.user_id,
      'Consultation Recorded',
      'Consultation',
      consultationId,
      `Recorded consultation for appointment ID ${id}`
    );

    // Fetch the created consultation
    const [consultations] = await db.query(
      'SELECT * FROM Consultations WHERE consultation_id = ?',
      [consultationId]
    );

    res.status(201).json({
      success: true,
      message: 'Consultation recorded successfully',
      consultation: consultations[0]
    });

  } catch (error) {
    await connection.rollback();
    console.error('Create consultation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create consultation'
    });
  } finally {
    connection.release();
  }
};

module.exports = {
  getPatientHistory,
  getConsultation,
  createConsultation
};
