const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Get auth headers with token
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

/**
 * Login user
 */
export const login = async (username, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }

  return data;
};

/**
 * Get current user info
 */
export const getCurrentUser = async (token) => {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch user');
  }

  return data;
};

/**
 * Test admin access
 */
export const testAdminAccess = async (token) => {
  const response = await fetch(`${API_BASE_URL}/auth/admin-test`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Access denied');
  }

  return data;
};

// ============================================
// Patient API
// ============================================

/**
 * Get all patients
 */
export const getAllPatients = async () => {
  const response = await fetch(`${API_BASE_URL}/patients`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch patients');
  }

  return data;
};

/**
 * Get patient by ID
 */
export const getPatientById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch patient');
  }

  return data;
};

/**
 * Register new patient
 */
export const registerPatient = async (patientData) => {
  const response = await fetch(`${API_BASE_URL}/patients`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(patientData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to register patient');
  }

  return data;
};

/**
 * Update patient
 */
export const updatePatient = async (id, patientData) => {
  const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(patientData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to update patient');
  }

  return data;
};

/**
 * Search patients
 */
export const searchPatients = async (query) => {
  const response = await fetch(`${API_BASE_URL}/patients/search?q=${encodeURIComponent(query)}`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to search patients');
  }

  return data;
};


// ============================================
// Doctor API
// ============================================

/**
 * Get all doctors
 */
export const getAllDoctors = async () => {
  const response = await fetch(`${API_BASE_URL}/doctors`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch doctors');
  }

  return data;
};

/**
 * Get doctor by ID
 */
export const getDoctorById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/doctors/${id}`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch doctor');
  }

  return data;
};

// ============================================
// Appointment API
// ============================================

/**
 * Get all appointments
 */
export const getAllAppointments = async () => {
  const response = await fetch(`${API_BASE_URL}/appointments`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch appointments');
  }

  return data;
};

/**
 * Get today's appointments
 */
export const getTodayAppointments = async () => {
  const response = await fetch(`${API_BASE_URL}/appointments/today`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch today\'s appointments');
  }

  return data;
};

/**
 * Get appointment by ID
 */
export const getAppointmentById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch appointment');
  }

  return data;
};

/**
 * Create new appointment
 */
export const createAppointment = async (appointmentData) => {
  const response = await fetch(`${API_BASE_URL}/appointments`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(appointmentData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to create appointment');
  }

  return data;
};

/**
 * Check in appointment
 */
export const checkInAppointment = async (id) => {
  const response = await fetch(`${API_BASE_URL}/appointments/${id}/check-in`, {
    method: 'PUT',
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to check in appointment');
  }

  return data;
};


// ============================================
// Consultation API
// ============================================

/**
 * Get patient history for consultation
 */
export const getPatientHistory = async (appointmentId) => {
  const response = await fetch(`${API_BASE_URL}/appointments/${appointmentId}/patient-history`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch patient history');
  }

  return data;
};

/**
 * Get consultation for appointment
 */
export const getConsultation = async (appointmentId) => {
  const response = await fetch(`${API_BASE_URL}/appointments/${appointmentId}/consultation`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch consultation');
  }

  return data;
};

/**
 * Create consultation
 */
export const createConsultation = async (appointmentId, consultationData) => {
  const response = await fetch(`${API_BASE_URL}/appointments/${appointmentId}/consultation`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(consultationData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to create consultation');
  }

  return data;
};

// ============================================
// Room API
// ============================================

/**
 * Get all rooms
 */
export const getAllRooms = async () => {
  const response = await fetch(`${API_BASE_URL}/rooms`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch rooms');
  }

  return data;
};

/**
 * Get available rooms
 */
export const getAvailableRooms = async () => {
  const response = await fetch(`${API_BASE_URL}/rooms/available`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch available rooms');
  }

  return data;
};

/**
 * Get room by ID
 */
export const getRoomById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/rooms/${id}`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch room');
  }

  return data;
};

// ============================================
// Admission API
// ============================================

/**
 * Get all admissions
 */
export const getAllAdmissions = async () => {
  const response = await fetch(`${API_BASE_URL}/admissions`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch admissions');
  }

  return data;
};

/**
 * Get admission by ID
 */
export const getAdmissionById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/admissions/${id}`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch admission');
  }

  return data;
};

/**
 * Create new admission
 */
export const createAdmission = async (admissionData) => {
  const response = await fetch(`${API_BASE_URL}/admissions`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(admissionData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to create admission');
  }

  return data;
};

// ============================================
// Billing API
// ============================================

/**
 * Get all bills
 */
export const getAllBills = async () => {
  const response = await fetch(`${API_BASE_URL}/bills`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch bills');
  }

  return data;
};

/**
 * Get bill by ID
 */
export const getBillById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/bills/${id}`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch bill');
  }

  return data;
};

/**
 * Generate new bill
 */
export const generateBill = async (billData) => {
  const response = await fetch(`${API_BASE_URL}/bills`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(billData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to generate bill');
  }

  return data;
};

/**
 * Record payment for a bill
 */
export const recordPayment = async (billId) => {
  const response = await fetch(`${API_BASE_URL}/bills/${billId}/payment`, {
    method: 'PUT',
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to record payment');
  }

  return data;
};

// ============================================
// Discharge API
// ============================================

/**
 * Get all discharges
 */
export const getAllDischarges = async () => {
  const response = await fetch(`${API_BASE_URL}/discharges`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch discharges');
  }

  return data;
};

/**
 * Get discharge by ID
 */
export const getDischargeById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/discharges/${id}`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch discharge');
  }

  return data;
};

/**
 * Approve discharge (Doctor only)
 */
export const approveDischarge = async (admissionId) => {
  const response = await fetch(`${API_BASE_URL}/admissions/${admissionId}/approve-discharge`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to approve discharge');
  }

  return data;
};

/**
 * Finalize discharge (Admin/Receptionist only)
 */
export const finalizeDischarge = async (admissionId, dischargeData) => {
  const response = await fetch(`${API_BASE_URL}/admissions/${admissionId}/discharge`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(dischargeData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to finalize discharge');
  }

  return data;
};

// ============================================
// Follow-up API
// ============================================

/**
 * Get all follow-ups
 */
export const getAllFollowUps = async () => {
  const response = await fetch(`${API_BASE_URL}/followups`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch follow-ups');
  }

  return data;
};

/**
 * Get follow-up by ID
 */
export const getFollowUpById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/followups/${id}`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch follow-up');
  }

  return data;
};

/**
 * Create follow-up
 */
export const createFollowUp = async (followupData) => {
  const response = await fetch(`${API_BASE_URL}/followups`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(followupData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to schedule follow-up');
  }

  return data;
};

/**
 * Update follow-up status
 */
export const updateFollowUpStatus = async (followupId, status) => {
  const response = await fetch(`${API_BASE_URL}/followups/${followupId}/status`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to update follow-up status');
  }

  return data;
};
