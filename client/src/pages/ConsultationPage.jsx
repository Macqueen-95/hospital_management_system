import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getPatientHistory, getConsultation, createConsultation } from '../utils/api';

const ConsultationPage = () => {
  const [patientHistory, setPatientHistory] = useState(null);
  const [existingConsultation, setExistingConsultation] = useState(null);
  const [formData, setFormData] = useState({
    symptoms: '',
    diagnosis: '',
    prescription: '',
    notes: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const { id } = useParams(); // appointment_id
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch patient history
      const historyData = await getPatientHistory(id);
      setPatientHistory(historyData);

      // Try to fetch existing consultation
      try {
        const consultationData = await getConsultation(id);
        setExistingConsultation(consultationData.consultation);
      } catch (err) {
        // No existing consultation - this is fine
        setExistingConsultation(null);
      }

    } catch (err) {
      setError(err.message || 'Failed to load consultation data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await createConsultation(id, formData);
      setSuccess(true);
      // Reload to show completed state
      setTimeout(() => {
        fetchData();
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to save consultation');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return timeString.substring(0, 5);
  };

  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading consultation...</p>
        </div>
      </div>
    );
  }

  if (error && !patientHistory) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <button onClick={() => navigate('/appointments/today')} className="text-gray-600 hover:text-gray-800">
              ← Back to Appointments
            </button>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <p className="text-red-600 text-lg">{error}</p>
          </div>
        </main>
      </div>
    );
  }

  const isCompleted = existingConsultation !== null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button onClick={() => navigate('/appointments/today')} className="text-gray-600 hover:text-gray-800">
              ← Back to Appointments
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Consultation</h1>
          </div>
          <button onClick={() => { logout(); navigate('/login'); }} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-600 font-semibold">✓ Consultation recorded successfully!</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Patient Info */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Patient Information */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Patient Information
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-500">Patient ID</span>
                  <p className="font-semibold text-gray-800">#{patientHistory.patient.patient_id}</p>
                </div>
                <div>
                  <span className="text-gray-500">Name</span>
                  <p className="font-semibold text-gray-800">
                    {patientHistory.patient.first_name} {patientHistory.patient.last_name}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Age / Gender</span>
                  <p className="text-gray-800">
                    {calculateAge(patientHistory.patient.date_of_birth)} years / {patientHistory.patient.gender}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Blood Group</span>
                  <p className="text-gray-800">{patientHistory.patient.blood_group || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-gray-500">Phone</span>
                  <p className="text-gray-800">{patientHistory.patient.phone}</p>
                </div>
              </div>
            </div>

            {/* Appointment Information */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Appointment
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-500">Appointment ID</span>
                  <p className="text-gray-800">#{patientHistory.appointment.appointment_id}</p>
                </div>
                <div>
                  <span className="text-gray-500">Date & Time</span>
                  <p className="text-gray-800">
                    {formatDate(patientHistory.appointment.appointment_date)}<br/>
                    {formatTime(patientHistory.appointment.appointment_time)}
                  </p>
                </div>
                {patientHistory.appointment.reason && (
                  <div>
                    <span className="text-gray-500">Reason</span>
                    <p className="text-gray-800">{patientHistory.appointment.reason}</p>
                  </div>
                )}
                <div>
                  <span className="text-gray-500">Status</span>
                  <p className="font-semibold text-gray-800">{patientHistory.appointment.status}</p>
                </div>
              </div>
            </div>

            {/* Previous Consultations */}
            {patientHistory.previousConsultations && patientHistory.previousConsultations.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Previous Consultations</h3>
                <div className="space-y-4">
                  {patientHistory.previousConsultations.map((prev) => (
                    <div key={prev.consultation_id} className="border-l-4 border-blue-200 pl-3 text-sm">
                      <p className="text-xs text-gray-500">{formatDate(prev.consultation_date)}</p>
                      <p className="font-semibold text-gray-800 mt-1">{prev.diagnosis}</p>
                      {prev.prescription && (
                        <p className="text-gray-600 mt-1">Rx: {prev.prescription}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Column - Consultation Form/Display */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-8">
              
              {isCompleted ? (
                // Display completed consultation
                <>
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-bold text-gray-800">Consultation Completed</h2>
                      <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        Completed
                      </span>
                    </div>
                    <p className="text-gray-600">
                      Recorded on {formatDate(existingConsultation.consultation_date)}
                    </p>
                  </div>

                  <div className="space-y-6">
                    {existingConsultation.symptoms && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Symptoms</h3>
                        <p className="text-gray-800 bg-gray-50 p-4 rounded-lg">{existingConsultation.symptoms}</p>
                      </div>
                    )}

                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">Diagnosis</h3>
                      <p className="text-gray-800 bg-gray-50 p-4 rounded-lg">{existingConsultation.diagnosis}</p>
                    </div>

                    {existingConsultation.prescription && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Prescription</h3>
                        <p className="text-gray-800 bg-gray-50 p-4 rounded-lg whitespace-pre-line">{existingConsultation.prescription}</p>
                      </div>
                    )}

                    {existingConsultation.notes && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Notes</h3>
                        <p className="text-gray-800 bg-gray-50 p-4 rounded-lg">{existingConsultation.notes}</p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                // Consultation Form
                <>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Record Consultation</h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Symptoms
                      </label>
                      <textarea
                        name="symptoms"
                        value={formData.symptoms}
                        onChange={handleChange}
                        rows="4"
                        placeholder="Record patient's symptoms..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Diagnosis <span className="text-red-600">*</span>
                      </label>
                      <textarea
                        name="diagnosis"
                        value={formData.diagnosis}
                        onChange={handleChange}
                        required
                        rows="4"
                        placeholder="Enter diagnosis..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prescription
                      </label>
                      <textarea
                        name="prescription"
                        value={formData.prescription}
                        onChange={handleChange}
                        rows="6"
                        placeholder="List medications, dosage, and instructions..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Notes
                      </label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows="4"
                        placeholder="Additional notes or recommendations..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>

                    <div className="flex space-x-4 pt-4">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                      >
                        {submitting ? 'Saving Consultation...' : 'Save Consultation'}
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate('/appointments/today')}
                        className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
                      >
                        Cancel
                      </button>
                    </div>

                  </form>
                </>
              )}

            </div>
          </div>

        </div>

      </main>
    </div>
  );
};

export default ConsultationPage;
