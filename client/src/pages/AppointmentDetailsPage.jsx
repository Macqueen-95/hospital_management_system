import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAppointmentById, checkInAppointment } from '../utils/api';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';

const AppointmentDetailsPage = () => {
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);
  const [error, setError] = useState('');
  
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const canCheckIn = user?.role === 'Admin' || user?.role === 'Receptionist';

  useEffect(() => {
    fetchAppointment();
  }, [id]);

  const fetchAppointment = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getAppointmentById(id);
      setAppointment(data.appointment);
    } catch (err) {
      setError(err.message || 'Failed to load appointment details');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!window.confirm('Check in this patient?')) return;

    try {
      setCheckingIn(true);
      setError('');
      await checkInAppointment(id);
      fetchAppointment(); // Reload appointment
    } catch (err) {
      setError(err.message || 'Failed to check in appointment');
    } finally {
      setCheckingIn(false);
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

  const getStatusColor = (status) => {
    const colors = {
      'Scheduled': 'bg-blue-100 text-blue-800',
      'Checked In': 'bg-purple-100 text-purple-800',
      'Completed': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <Layout><LoadingSpinner text="Loading appointment details..." /></Layout>
    );
  }

  if (error && !appointment) {
    return (
      <Layout>
        <button onClick={() => navigate('/appointments')} className="mb-5 text-sm font-semibold text-[#13805d]">← Back to Appointments</button>
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <p className="text-red-600 text-lg">{error}</p>
          </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-5">
        <button onClick={() => navigate(user?.role === 'Doctor' ? '/appointments/today' : '/appointments')} className="mb-4 text-sm font-semibold text-[#13805d]">
          ← Back to {user?.role === 'Doctor' ? "Today's Appointments" : 'Appointments'}
        </button>
        <h1 className="text-3xl font-extrabold text-[#18232c]">Appointment Details</h1>
      </div>
      <main className="max-w-5xl">
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Appointment Header */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Appointment #{appointment.appointment_id}
              </h2>
              <p className="text-gray-600">{formatDate(appointment.appointment_date)} at {formatTime(appointment.appointment_time)}</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`px-4 py-2 text-sm font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                {appointment.status}
              </span>
              {canCheckIn && appointment.status === 'Scheduled' && (
                <button
                  onClick={handleCheckIn}
                  disabled={checkingIn}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                >
                  {checkingIn ? 'Checking In...' : 'Check In Patient'}
                </button>
              )}
              {user?.role === 'Doctor' && appointment.status === 'Checked In' && (
                <button
                  onClick={() => navigate(`/appointments/${id}/consultation`)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Start Consultation
                </button>
              )}
              {user?.role === 'Doctor' && appointment.status === 'Completed' && (
                <button
                  onClick={() => navigate(`/appointments/${id}/consultation`)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                >
                  View Consultation
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          
          {/* Patient Information */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Patient Information
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-500">Name</span>
                <p className="font-semibold text-gray-800">{appointment.patient_first_name} {appointment.patient_last_name}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Patient ID</span>
                <p className="text-gray-800">#{appointment.patient_id}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Phone</span>
                <p className="text-gray-800">{appointment.patient_phone}</p>
              </div>
              {appointment.patient_email && (
                <div>
                  <span className="text-sm text-gray-500">Email</span>
                  <p className="text-gray-800">{appointment.patient_email}</p>
                </div>
              )}
              <div>
                <span className="text-sm text-gray-500">Gender</span>
                <p className="text-gray-800">{appointment.patient_gender}</p>
              </div>
              {appointment.patient_blood_group && (
                <div>
                  <span className="text-sm text-gray-500">Blood Group</span>
                  <p className="text-gray-800">{appointment.patient_blood_group}</p>
                </div>
              )}
              <button
                onClick={() => navigate(`/patients/${appointment.patient_id}`)}
                className="mt-4 w-full px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
              >
                View Full Patient Profile
              </button>
            </div>
          </div>

          {/* Doctor & Appointment Info */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Appointment Information
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-500">Doctor</span>
                <p className="font-semibold text-gray-800">{appointment.doctor_name}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Specialization</span>
                <p className="text-gray-800">{appointment.specialization}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Consultation Fee</span>
                <p className="text-gray-800">₹{appointment.consultation_fee}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Booked On</span>
                <p className="text-gray-800">{formatDate(appointment.created_at)}</p>
              </div>
            </div>
          </div>

        </div>

        {/* Reason */}
        {appointment.reason && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Reason for Visit</h3>
            <p className="text-gray-700">{appointment.reason}</p>
          </div>
        )}

        {/* Placeholder for Consultation */}
        {appointment.status === 'Checked In' && (
          <div className="bg-blue-50 border-2 border-dashed border-blue-300 rounded-xl p-8 text-center">
            <p className="text-blue-800">
              <strong>Phase 6:</strong> Consultation recording will be available here once the patient is checked in.
            </p>
          </div>
        )}

      </main>
    </Layout>
  );
};

export default AppointmentDetailsPage;
