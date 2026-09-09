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
