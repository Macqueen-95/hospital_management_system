import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getTodayAppointments } from '../utils/api';

const TodayAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [todayDate, setTodayDate] = useState('');
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTodayAppointments();
  }, []);

  const fetchTodayAppointments = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getTodayAppointments();
      setAppointments(data.appointments);
      setTodayDate(data.date);
    } catch (err) {
      setError(err.message || 'Failed to load today\'s appointments');
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button onClick={() => navigate('/dashboard')} className="text-gray-600 hover:text-gray-800">
              ← Back to Dashboard
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Today's Appointments</h1>
          </div>
          <button onClick={() => { logout(); navigate('/login'); }} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                {todayDate && new Date(todayDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </h2>
              <p className="text-sm text-gray-600 mt-1">Welcome, Dr. {user?.full_name}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-blue-600">{appointments.length}</p>
              <p className="text-sm text-gray-600">Total Appointments</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {loading && (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading appointments...</p>
          </div>
        )}

        {!loading && appointments.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {appointments.map((appointment) => (
              <div key={appointment.appointment_id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-gray-500">#{appointment.appointment_id}</p>
                    <p className="text-2xl font-bold text-gray-800">{formatTime(appointment.appointment_time)}</p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                    {appointment.status}
                  </span>
                </div>
                <div className="space-y-2 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Patient</p>
                    <p className="font-semibold text-gray-800">
                      {appointment.patient_first_name} {appointment.patient_last_name}
                    </p>
                  </div>
                  {appointment.reason && (
                    <div>
                      <p className="text-sm text-gray-500">Reason</p>
                      <p className="text-sm text-gray-700">{appointment.reason}</p>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => navigate(`/appointments/${appointment.appointment_id}`)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}

        {!loading && appointments.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-600">No appointments scheduled for today</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default TodayAppointmentsPage;
