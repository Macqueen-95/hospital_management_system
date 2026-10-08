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
    // Don't throw - activity logging failure shouldn't break the main operation
  }
};

/**
 * GET /api/patients
 * Get all patients
 */
const getAllPatients = async (req, res) => {
  try {
    const doctorFilter = req.user.role === 'Doctor'
      ? `WHERE EXISTS (
          SELECT 1 FROM Doctors doc
          WHERE doc.user_id = ?
          AND (
            EXISTS (SELECT 1 FROM Appointments ap WHERE ap.patient_id = Patients.patient_id AND ap.doctor_id = doc.doctor_id)
            OR EXISTS (SELECT 1 FROM Admissions ad WHERE ad.patient_id = Patients.patient_id AND ad.doctor_id = doc.doctor_id)
            OR EXISTS (SELECT 1 FROM FollowUps fu WHERE fu.patient_id = Patients.patient_id AND fu.doctor_id = doc.doctor_id)
          )
        )`
      : '';
    const params = req.user.role === 'Doctor' ? [req.user.user_id] : [];
    const [patients] = await db.query(
      `SELECT patient_id, first_name, last_name, date_of_birth, gender, phone, email, 
              blood_group, status, registered_at
       FROM Patients
       ${doctorFilter}
       ORDER BY registered_at DESC`,
      params
    );

    res.json({
      success: true,
      count: patients.length,
      patients
    });

  } catch (error) {
    console.error('Get patients error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch patients'
    });
  }
};

/**
 * GET /api/patients/:id
 * Get single patient by ID
 */
const getPatientById = async (req, res) => {
  try {
    const { id } = req.params;

    const doctorFilter = req.user.role === 'Doctor'
      ? `AND EXISTS (
          SELECT 1 FROM Doctors doc
          WHERE doc.user_id = ?
          AND (
            EXISTS (SELECT 1 FROM Appointments ap WHERE ap.patient_id = Patients.patient_id AND ap.doctor_id = doc.doctor_id)
            OR EXISTS (SELECT 1 FROM Admissions ad WHERE ad.patient_id = Patients.patient_id AND ad.doctor_id = doc.doctor_id)
            OR EXISTS (SELECT 1 FROM FollowUps fu WHERE fu.patient_id = Patients.patient_id AND fu.doctor_id = doc.doctor_id)
          )
        )`
      : '';
    const params = req.user.role === 'Doctor' ? [id, req.user.user_id] : [id];
    const [patients] = await db.query(
      `SELECT patient_id, first_name, last_name, date_of_birth, gender, phone, email,
              address, emergency_contact_name, emergency_contact_phone, blood_group,
              status, registered_at
       FROM Patients
       WHERE patient_id = ? ${doctorFilter}`,
      params
    );

    if (patients.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.json({
      success: true,
      patient: patients[0]
    });

  } catch (error) {
    console.error('Get patient error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch patient'
    });
  }
};

/**
 * POST /api/patients
 * Register a new patient
 */
const registerPatient = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      date_of_birth,
      gender,
      phone,
      email,
      address,
      emergency_contact_name,
      emergency_contact_phone,
      blood_group
    } = req.body;

    // Validate required fields
    if (!first_name || !last_name || !date_of_birth || !gender || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Required fields: first_name, last_name, date_of_birth, gender, phone'
      });
    }

    // Validate gender
    const validGenders = ['Male', 'Female', 'Other'];
    if (!validGenders.includes(gender)) {
      return res.status(400).json({
        success: false,
        message: 'Gender must be Male, Female, or Other'
      });
    }

    // Validate date_of_birth is a valid date
    const dob = new Date(date_of_birth);
    if (isNaN(dob.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date of birth'
      });
    }

    // Insert patient with status 'Registered'
    const [result] = await db.query(
      `INSERT INTO Patients 
       (first_name, last_name, date_of_birth, gender, phone, email, address,
        emergency_contact_name, emergency_contact_phone, blood_group, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Registered')`,
      [
        first_name,
        last_name,
        date_of_birth,
        gender,
        phone,
        email || null,
        address || null,
        emergency_contact_name || null,
        emergency_contact_phone || null,
        blood_group || null
      ]
    );

    const patientId = result.insertId;

    // Log activity
    await logActivity(
      req.user.user_id,
      'Patient Registered',
      'Patient',
      patientId,
      `Registered patient: ${first_name} ${last_name}`
    );

    // Fetch the created patient
    const [patients] = await db.query(
      'SELECT * FROM Patients WHERE patient_id = ?',
      [patientId]
    );

    res.status(201).json({
      success: true,
      message: 'Patient registered successfully',
      patient: patients[0]
    });

  } catch (error) {
    console.error('Register patient error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register patient'
    });
  }
};

/**
 * PUT /api/patients/:id
 * Update existing patient
 */
const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      first_name,
      last_name,
      date_of_birth,
      gender,
      phone,
      email,
      address,
      emergency_contact_name,
      emergency_contact_phone,
      blood_group
    } = req.body;

    // Check if patient exists
    const [existing] = await db.query(
      'SELECT patient_id FROM Patients WHERE patient_id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // Validate required fields
    if (!first_name || !last_name || !date_of_birth || !gender || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Required fields: first_name, last_name, date_of_birth, gender, phone'
      });
    }

    // Validate gender
    const validGenders = ['Male', 'Female', 'Other'];
    if (!validGenders.includes(gender)) {
      return res.status(400).json({
        success: false,
        message: 'Gender must be Male, Female, or Other'
      });
    }

    // Validate date_of_birth
    const dob = new Date(date_of_birth);
    if (isNaN(dob.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date of birth'
      });
    }

    // Update patient (do not allow status, patient_id, or registered_at changes)
    await db.query(
      `UPDATE Patients
       SET first_name = ?, last_name = ?, date_of_birth = ?, gender = ?,
           phone = ?, email = ?, address = ?,
           emergency_contact_name = ?, emergency_contact_phone = ?, blood_group = ?
       WHERE patient_id = ?`,
      [
        first_name,
        last_name,
        date_of_birth,
        gender,
        phone,
        email || null,
        address || null,
        emergency_contact_name || null,
        emergency_contact_phone || null,
        blood_group || null,
        id
      ]
    );

    // Log activity
    await logActivity(
      req.user.user_id,
      'Patient Updated',
      'Patient',
      id,
      `Updated patient: ${first_name} ${last_name}`
    );

    // Fetch updated patient
    const [patients] = await db.query(
      'SELECT * FROM Patients WHERE patient_id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Patient updated successfully',
      patient: patients[0]
    });

  } catch (error) {
    console.error('Update patient error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update patient'
    });
  }
};

/**
 * GET /api/patients/search?q=...
 * Search patients
 */
const searchPatients = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    // Search by patient_id (exact), first_name, last_name, or phone (partial match)
    const searchTerm = `%${q}%`;
    const doctorFilter = req.user.role === 'Doctor'
      ? `AND EXISTS (
          SELECT 1 FROM Doctors doc
          WHERE doc.user_id = ?
          AND (
            EXISTS (SELECT 1 FROM Appointments ap WHERE ap.patient_id = Patients.patient_id AND ap.doctor_id = doc.doctor_id)
            OR EXISTS (SELECT 1 FROM Admissions ad WHERE ad.patient_id = Patients.patient_id AND ad.doctor_id = doc.doctor_id)
            OR EXISTS (SELECT 1 FROM FollowUps fu WHERE fu.patient_id = Patients.patient_id AND fu.doctor_id = doc.doctor_id)
          )
        )`
      : '';
    const params = req.user.role === 'Doctor'
      ? [q, searchTerm, searchTerm, searchTerm, req.user.user_id]
      : [q, searchTerm, searchTerm, searchTerm];
    const [patients] = await db.query(
      `SELECT patient_id, first_name, last_name, date_of_birth, gender, phone, email,
              blood_group, status, registered_at
       FROM Patients
       WHERE (patient_id = ?
          OR first_name LIKE ?
          OR last_name LIKE ?
          OR phone LIKE ?)
       ${doctorFilter}
       ORDER BY registered_at DESC
       LIMIT 50`,
      params
    );

    res.json({
      success: true,
      count: patients.length,
      patients
    });

  } catch (error) {
    console.error('Search patients error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search patients'
    });
  }
};

module.exports = {
  getAllPatients,
  getPatientById,
  registerPatient,
  updatePatient,
  searchPatients
};
