const db = require('../config/db');

/**
 * Get comprehensive report summary
 * Admin only
 */
const getReportSummary = async (req, res) => {
  try {
    // Patient Summary
    const [patientStats] = await db.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'Registered' THEN 1 ELSE 0 END) as registered,
        SUM(CASE WHEN status = 'Appointment Scheduled' THEN 1 ELSE 0 END) as appointmentScheduled,
        SUM(CASE WHEN status = 'Checked In' THEN 1 ELSE 0 END) as checkedIn,
        SUM(CASE WHEN status = 'Consultation Completed' THEN 1 ELSE 0 END) as consultationCompleted,
        SUM(CASE WHEN status = 'Admitted' THEN 1 ELSE 0 END) as admitted,
        SUM(CASE WHEN status = 'Ready for Discharge' THEN 1 ELSE 0 END) as readyForDischarge,
        SUM(CASE WHEN status = 'Discharged' THEN 1 ELSE 0 END) as discharged,
        SUM(CASE WHEN status = 'Follow-up Scheduled' THEN 1 ELSE 0 END) as followUpScheduled
      FROM Patients
    `);

    // Appointment Summary
    const [appointmentStats] = await db.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'Scheduled' THEN 1 ELSE 0 END) as scheduled,
        SUM(CASE WHEN status = 'Checked In' THEN 1 ELSE 0 END) as checkedIn,
        SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 'Cancelled' THEN 1 ELSE 0 END) as cancelled
      FROM Appointments
    `);

    // Admission Summary
    const [admissionStats] = await db.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'Active' THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN status = 'Discharged' THEN 1 ELSE 0 END) as discharged
      FROM Admissions
    `);

    // Billing Summary
    const [billingStats] = await db.query(`
      SELECT 
        COUNT(*) as totalBills,
        SUM(CASE WHEN payment_status = 'Pending' THEN 1 ELSE 0 END) as pendingBills,
        SUM(CASE WHEN payment_status = 'Paid' THEN 1 ELSE 0 END) as paidBills,
        COALESCE(SUM(total_amount), 0) as totalBilledAmount,
        COALESCE(SUM(CASE WHEN payment_status = 'Paid' THEN total_amount ELSE 0 END), 0) as totalPaidBillValue
      FROM Bills
    `);

    // Follow-up Summary
    const [followUpStats] = await db.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'Scheduled' THEN 1 ELSE 0 END) as scheduled,
        SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 'Cancelled' THEN 1 ELSE 0 END) as cancelled
      FROM FollowUps
    `);

    res.json({
      success: true,
      summary: {
        patients: {
          total: patientStats[0].total || 0,
          registered: patientStats[0].registered || 0,
          appointmentScheduled: patientStats[0].appointmentScheduled || 0,
          checkedIn: patientStats[0].checkedIn || 0,
          consultationCompleted: patientStats[0].consultationCompleted || 0,
          admitted: patientStats[0].admitted || 0,
          readyForDischarge: patientStats[0].readyForDischarge || 0,
          discharged: patientStats[0].discharged || 0,
          followUpScheduled: patientStats[0].followUpScheduled || 0
        },
        appointments: {
          total: appointmentStats[0].total || 0,
          scheduled: appointmentStats[0].scheduled || 0,
          checkedIn: appointmentStats[0].checkedIn || 0,
          completed: appointmentStats[0].completed || 0,
          cancelled: appointmentStats[0].cancelled || 0
        },
        admissions: {
          total: admissionStats[0].total || 0,
          active: admissionStats[0].active || 0,
          discharged: admissionStats[0].discharged || 0
        },
        billing: {
          totalBills: billingStats[0].totalBills || 0,
          pendingBills: billingStats[0].pendingBills || 0,
          paidBills: billingStats[0].paidBills || 0,
          totalBilledAmount: parseFloat(billingStats[0].totalBilledAmount) || 0,
          totalPaidBillValue: parseFloat(billingStats[0].totalPaidBillValue) || 0
        },
        followUps: {
          total: followUpStats[0].total || 0,
          scheduled: followUpStats[0].scheduled || 0,
          completed: followUpStats[0].completed || 0,
          cancelled: followUpStats[0].cancelled || 0
        }
      }
    });

  } catch (error) {
    console.error('Get report summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch report summary'
    });
  }
};

module.exports = {
  getReportSummary
};
