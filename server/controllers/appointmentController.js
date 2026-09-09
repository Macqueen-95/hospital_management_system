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
 * GET /api/appointments
 * Get all appointments
 * Doctor sees only their appointments
 * Admin/Receptionist see all appointments
 */
const getAllAppointments = async (req, res) => {
  try {
    const userRole = req.user.role;
    let query = `
      SELECT 
        a.appointment_id,
        a.appointment_date,
        a.appointment_time,
        a.reason,
        a.status,
        a.created_at,
        p.patient_id,
        p.first_name as patient_first_name,
        p.last_name as patient_last_name,
        p.phone as patient_phone,
        d.doctor_id,
        u.full_name as doctor_name,
        d.specialization
      FROM Appointments a
      INNER JOIN Patients p ON a.patient_id = p.patient_id
      INNER JOIN Doctors d ON a.doctor_id = d.doctor_id
      INNER JOIN Users u ON d.user_id = u.user_id
    `;

    let params = [];

    // Doctor sees only their own appointments
    if (userRole === 'Doctor') {
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

      query += ' WHERE a.doctor_id = ?';
      params.push(doctorRows[0].doctor_id);
    }

    query += ' ORDER BY a.appointment_date DESC, a.appointment_time DESC';

    const [appointments] = await db.query(query, params);

    res.json({
      success: true,
      count: appointments.length,
      appointments
    });

  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointments'
    });
  }
};

/**
 * GET /api/appointments/today
 * Get today's appointments
 * Doctor sees only their own today's appointments
 */
const getTodayAppointments = async (req, res) => {
  try {
    const userRole = req.user.role;
    // Get today's date in local timezone
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const today = `${year}-${month}-${day}`;

    let query = `
      SELECT 
        a.appointment_id,
        a.appointment_date,
        a.appointment_time,
        a.reason,
        a.status,
        p.patient_id,
        p.first_name as patient_first_name,
        p.last_name as patient_last_name,
        p.phone as patient_phone,
        p.date_of_birth as patient_dob,
        p.gender as patient_gender,
        d.doctor_id,
        u.full_name as doctor_name
      FROM Appointments a
      INNER JOIN Patients p ON a.patient_id = p.patient_id
      INNER JOIN Doctors d ON a.doctor_id = d.doctor_id
      INNER JOIN Users u ON d.user_id = u.user_id
      WHERE a.appointment_date = ?
    `;

    let params = [today];

    // Doctor sees only their own appointments
    if (userRole === 'Doctor') {
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

      query += ' AND a.doctor_id = ?';
      params.push(doctorRows[0].doctor_id);
    }

    query += ' ORDER BY a.appointment_time ASC';

    const [appointments] = await db.query(query, params);

    res.json({
      success: true,
      date: today,
      count: appointments.length,
      appointments
    });

  } catch (error) {
    console.error('Get today appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch today\'s appointments'
    });
  }
};

/**
 * GET /api/appointments/:id
 * Get single appointment by ID
 */
const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const userRole = req.user.role;

    let query = `
      SELECT 
        a.appointment_id,
        a.appointment_date,
        a.appointment_time,
        a.reason,
        a.status,
        a.created_at,
        p.patient_id,
        p.first_name as patient_first_name,
        p.last_name as patient_last_name,
        p.phone as patient_phone,
        p.email as patient_email,
        p.date_of_birth as patient_dob,
        p.gender as patient_gender,
        p.blood_group as patient_blood_group,
        d.doctor_id,
        u.full_name as doctor_name,
        d.specialization,
        d.consultation_fee
      FROM Appointments a
      INNER JOIN Patients p ON a.patient_id = p.patient_id
      INNER JOIN Doctors d ON a.doctor_id = d.doctor_id
      INNER JOIN Users u ON d.user_id = u.user_id
      WHERE a.appointment_id = ?
    `;

    let params = [id];

    // Doctor can only view their own appointments
    if (userRole === 'Doctor') {
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

      query += ' AND a.doctor_id = ?';
      params.push(doctorRows[0].doctor_id);
    }

    const [appointments] = await db.query(query, params);

    if (appointments.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.json({
      success: true,
      appointment: appointments[0]
    });

  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointment'
    });
  }
};

/**
 * POST /api/appointments
 * Create a new appointment
 */
const createAppointment = async (req, res) => {
  try {
    const { patient_id, doctor_id, appointment_date, appointment_time, reason } = req.body;

    // Validate required fields
    if (!patient_id || !doctor_id || !appointment_date || !appointment_time) {
      return res.status(400).json({
        success: false,
        message: 'Required fields: patient_id, doctor_id, appointment_date, appointment_time'
      });
    }

    // Validate patient exists
    const [patients] = await db.query(
      'SELECT patient_id FROM Patients WHERE patient_id = ?',
      [patient_id]
    );

    if (patients.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // Validate doctor exists
    const [doctors] = await db.query(
      'SELECT doctor_id FROM Doctors WHERE doctor_id = ?',
      [doctor_id]
    );

    if (doctors.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    // Validate date is not in the past
    const appointmentDate = new Date(appointment_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (appointmentDate < today) {
      return res.status(400).json({
        success: false,
        message: 'Cannot book appointment for a past date'
      });
    }

    // Check for duplicate appointment (same doctor, date, time)
    const [existing] = await db.query(
      `SELECT appointment_id FROM Appointments 
       WHERE doctor_id = ? 
       AND appointment_date = ? 
       AND appointment_time = ?
       AND status != 'Cancelled'`,
      [doctor_id, appointment_date, appointment_time]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'This time slot is already booked for the selected doctor'
      });
    }

    // Create appointment with status 'Scheduled'
    const [result] = await db.query(
      `INSERT INTO Appointments 
       (patient_id, doctor_id, appointment_date, appointment_time, reason, status)
       VALUES (?, ?, ?, ?, ?, 'Scheduled')`,
      [patient_id, doctor_id, appointment_date, appointment_time, reason || null]
    );

    const appointmentId = result.insertId;

    // Update patient status to 'Appointment Scheduled'
    await db.query(
      `UPDATE Patients SET status = 'Appointment Scheduled' WHERE patient_id = ?`,
      [patient_id]
    );

    // Log activity
    await logActivity(
      req.user.user_id,
      'Appointment Booked',
      'Appointment',
      appointmentId,
      `Booked appointment for patient ID ${patient_id} with doctor ID ${doctor_id}`
    );

    // Fetch the created appointment with full details
    const [appointments] = await db.query(
      `SELECT 
        a.*,
        p.first_name as patient_first_name,
        p.last_name as patient_last_name,
        u.full_name as doctor_name
       FROM Appointments a
       INNER JOIN Patients p ON a.patient_id = p.patient_id
       INNER JOIN Doctors d ON a.doctor_id = d.doctor_id
       INNER JOIN Users u ON d.user_id = u.user_id
       WHERE a.appointment_id = ?`,
      [appointmentId]
    );

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      appointment: appointments[0]
    });

  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create appointment'
    });
  }
};

/**
 * PUT /api/appointments/:id/check-in
 * Check in a scheduled appointment
 */
const checkInAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    // Get appointment details
    const [appointments] = await db.query(
      'SELECT appointment_id, patient_id, status FROM Appointments WHERE appointment_id = ?',
      [id]
    );

    if (appointments.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    const appointment = appointments[0];

    // Only Scheduled appointments can be checked in
    if (appointment.status !== 'Scheduled') {
      return res.status(400).json({
        success: false,
        message: `Cannot check in appointment with status: ${appointment.status}`
      });
    }

    // Update appointment status to 'Checked In'
    await db.query(
      `UPDATE Appointments SET status = 'Checked In' WHERE appointment_id = ?`,
      [id]
    );

    // Update patient status to 'Checked In'
    await db.query(
      `UPDATE Patients SET status = 'Checked In' WHERE patient_id = ?`,
      [appointment.patient_id]
    );

    // Log activity
    await logActivity(
      req.user.user_id,
      'Appointment Checked In',
      'Appointment',
      id,
      `Checked in appointment ID ${id}`
    );

    // Fetch updated appointment
    const [updated] = await db.query(
      `SELECT 
        a.*,
        p.first_name as patient_first_name,
        p.last_name as patient_last_name,
        u.full_name as doctor_name
       FROM Appointments a
       INNER JOIN Patients p ON a.patient_id = p.patient_id
       INNER JOIN Doctors d ON a.doctor_id = d.doctor_id
       INNER JOIN Users u ON d.user_id = u.user_id
       WHERE a.appointment_id = ?`,
      [id]
    );

    res.json({
      success: true,
      message: 'Appointment checked in successfully',
      appointment: updated[0]
    });

  } catch (error) {
    console.error('Check in appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check in appointment'
    });
  }
};

module.exports = {
  getAllAppointments,
  getTodayAppointments,
  getAppointmentById,
  createAppointment,
  checkInAppointment
};
