const db = require('../config/db');

/**
 * GET /api/doctors
 * Get all doctors with their user information
 */
const getAllDoctors = async (req, res) => {
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
    console.error('Get doctors error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch doctors'
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
       WHERE d.doctor_id = ? AND u.is_active = true`,
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

module.exports = {
  getAllDoctors,
  getDoctorById
};
