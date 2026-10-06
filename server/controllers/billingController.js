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
 * GET /api/bills
 * Get all bills
 */
const getAllBills = async (req, res) => {
  try {
    const [bills] = await db.query(
      `SELECT 
        b.bill_id,
        b.patient_id,
        b.consultation_charge,
        b.room_charge,
        b.additional_charge,
        b.total_amount,
        b.payment_status,
        b.payment_date,
        b.generated_at,
        p.first_name as patient_first_name,
        p.last_name as patient_last_name,
        p.phone as patient_phone,
        u.full_name as generated_by_name
      FROM Bills b
      INNER JOIN Patients p ON b.patient_id = p.patient_id
      INNER JOIN Users u ON b.generated_by_user_id = u.user_id
      ORDER BY b.generated_at DESC, b.bill_id DESC`
    );

    res.json({
      success: true,
      bills
    });

  } catch (error) {
    console.error('Get all bills error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bills'
    });
  }
};

/**
 * GET /api/bills/:id
 * Get bill by ID
 */
const getBillById = async (req, res) => {
  try {
    const { id } = req.params;

    const [bills] = await db.query(
      `SELECT 
        b.bill_id,
        b.patient_id,
        b.generated_by_user_id,
        b.consultation_charge,
        b.room_charge,
        b.additional_charge,
        b.total_amount,
        b.payment_status,
        b.payment_date,
        b.generated_at,
        p.first_name as patient_first_name,
        p.last_name as patient_last_name,
        p.date_of_birth,
        p.gender,
        p.phone as patient_phone,
        p.email as patient_email,
        p.blood_group,
        p.address,
        u.full_name as generated_by_name,
        u.username as generated_by_username
      FROM Bills b
      INNER JOIN Patients p ON b.patient_id = p.patient_id
      INNER JOIN Users u ON b.generated_by_user_id = u.user_id
      WHERE b.bill_id = ?`,
      [id]
    );

    if (bills.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Bill not found'
      });
    }

    res.json({
      success: true,
      bill: bills[0]
    });

  } catch (error) {
    console.error('Get bill by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bill'
    });
  }
};

/**
 * POST /api/bills
 * Generate a new bill
 */
const generateBill = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const { patient_id, additional_charge } = req.body;
    const userRole = req.user.role;

    // Only Admin and Receptionist can generate bills
    if (userRole !== 'Admin' && userRole !== 'Receptionist') {
      return res.status(403).json({
        success: false,
        message: 'Only Admin and Receptionist can generate bills'
      });
    }

    // Validate required fields
    if (!patient_id) {
      return res.status(400).json({
        success: false,
        message: 'Patient ID is required'
      });
    }

    // Validate additional charge
    const additionalChargeValue = parseFloat(additional_charge) || 0;
    if (additionalChargeValue < 0) {
      return res.status(400).json({
        success: false,
        message: 'Additional charge cannot be negative'
      });
    }

    // Start transaction
    await connection.beginTransaction();

    // Verify patient exists
    const [patients] = await connection.query(
      'SELECT patient_id, first_name, last_name FROM Patients WHERE patient_id = ?',
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

    // Check if there's already a Pending bill for this patient
    const [existingBills] = await connection.query(
      'SELECT bill_id FROM Bills WHERE patient_id = ? AND payment_status = ?',
      [patient_id, 'Pending']
    );

    if (existingBills.length > 0) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: 'Patient already has a pending bill. Please complete payment for existing bill first.'
      });
    }

    // Calculate consultation charge
    // Get the most recent consultation for this patient
    let consultationCharge = 0;
    const [consultations] = await connection.query(
      `SELECT c.consultation_id, a.doctor_id
       FROM Consultations c
       INNER JOIN Appointments a ON c.appointment_id = a.appointment_id
       WHERE a.patient_id = ?
       ORDER BY c.consultation_date DESC
       LIMIT 1`,
      [patient_id]
    );

    if (consultations.length > 0) {
      const doctorId = consultations[0].doctor_id;
      
      // Get doctor's consultation fee
      const [doctors] = await connection.query(
        'SELECT consultation_fee FROM Doctors WHERE doctor_id = ?',
        [doctorId]
      );

      if (doctors.length > 0) {
        consultationCharge = parseFloat(doctors[0].consultation_fee) || 0;
      }
    }

    // Calculate room charge
    // Get the most recent active admission for this patient
    let roomCharge = 0;
    const [admissions] = await connection.query(
      `SELECT a.admission_id, a.admission_date, r.price_per_day
       FROM Admissions a
       INNER JOIN Rooms r ON a.room_id = r.room_id
       WHERE a.patient_id = ? AND a.status = 'Active'
       ORDER BY a.admission_date DESC
       LIMIT 1`,
      [patient_id]
    );

    if (admissions.length > 0) {
      const admissionDate = new Date(admissions[0].admission_date);
      const currentDate = new Date();
      const pricePerDay = parseFloat(admissions[0].price_per_day) || 0;

      // Calculate number of days
      const timeDiff = currentDate.getTime() - admissionDate.getTime();
      let numberOfDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
      
      // Ensure at least 1 day for same-day admissions
      if (numberOfDays < 1) {
        numberOfDays = 1;
      }

      roomCharge = pricePerDay * numberOfDays;
    }

    // Calculate total amount (backend is authoritative)
    const totalAmount = consultationCharge + roomCharge + additionalChargeValue;

    // Insert bill
    const [billResult] = await connection.query(
      `INSERT INTO Bills (
        patient_id, 
        generated_by_user_id, 
        consultation_charge, 
        room_charge, 
        additional_charge, 
        total_amount, 
        payment_status
      )
      VALUES (?, ?, ?, ?, ?, ?, 'Pending')`,
      [
        patient_id,
        req.user.user_id,
        consultationCharge,
        roomCharge,
        additionalChargeValue,
        totalAmount
      ]
    );

    const bill_id = billResult.insertId;

    // Log activity
    const description = `Bill generated for patient ${patient.first_name} ${patient.last_name}`;
    await connection.query(
      `INSERT INTO ActivityLogs (user_id, action, entity_type, entity_id, description)
       VALUES (?, ?, ?, ?, ?)`,
      [req.user.user_id, 'Bill Generated', 'Bill', bill_id, description]
    );

    // Commit transaction
    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Bill generated successfully',
      bill_id,
      consultation_charge: consultationCharge,
      room_charge: roomCharge,
      additional_charge: additionalChargeValue,
      total_amount: totalAmount
    });

  } catch (error) {
    // Rollback on error
    await connection.rollback();
    console.error('Generate bill error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate bill'
    });
  } finally {
    connection.release();
  }
};

/**
 * PUT /api/bills/:id/payment
 * Record payment for a bill
 */
const recordPayment = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const { id } = req.params;
    const userRole = req.user.role;

    // Only Admin and Receptionist can record payments
    if (userRole !== 'Admin' && userRole !== 'Receptionist') {
      return res.status(403).json({
        success: false,
        message: 'Only Admin and Receptionist can record payments'
      });
    }

    // Start transaction
    await connection.beginTransaction();

    // Get bill details
    const [bills] = await connection.query(
      `SELECT b.bill_id, b.payment_status, p.first_name, p.last_name
       FROM Bills b
       INNER JOIN Patients p ON b.patient_id = p.patient_id
       WHERE b.bill_id = ?`,
      [id]
    );

    if (bills.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: 'Bill not found'
      });
    }

    const bill = bills[0];

    // Check if bill is already paid
    if (bill.payment_status === 'Paid') {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: 'Bill is already paid'
      });
    }

    // Update bill payment status
    await connection.query(
      `UPDATE Bills 
       SET payment_status = 'Paid', payment_date = CURRENT_TIMESTAMP
       WHERE bill_id = ?`,
      [id]
    );

    // Log activity
    const description = `Payment recorded for bill #${id} - Patient ${bill.first_name} ${bill.last_name}`;
    await connection.query(
      `INSERT INTO ActivityLogs (user_id, action, entity_type, entity_id, description)
       VALUES (?, ?, ?, ?, ?)`,
      [req.user.user_id, 'Payment Recorded', 'Bill', id, description]
    );

    // Commit transaction
    await connection.commit();

    res.json({
      success: true,
      message: 'Payment recorded successfully'
    });

  } catch (error) {
    // Rollback on error
    await connection.rollback();
    console.error('Record payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record payment'
    });
  } finally {
    connection.release();
  }
};

module.exports = {
  getAllBills,
  getBillById,
  generateBill,
  recordPayment
};
