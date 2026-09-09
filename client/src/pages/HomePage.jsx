import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const canManagePatients = user?.role === 'Admin' || user?.role === 'Receptionist';

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Hospital Management System</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Welcome Card */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome, {user?.full_name}!
          </h2>
          <p className="text-gray-600">You are logged in as <span className="font-semibold text-blue-600">{user?.role}</span></p>
        </div>

        {/* Dashboard Modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Patient Management */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Patient Management</h3>
            </div>
            <p className="text-gray-600 mb-4">
              {canManagePatients 
                ? 'View, register, and manage patient records'
                : 'View and search patient records'
              }
            </p>
            <button
              onClick={() => navigate('/patients')}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Open Patient Management
            </button>
          </div>

          {/* Appointment Management */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Appointments</h3>
            </div>
            <p className="text-gray-600 mb-4">
              {user?.role === 'Doctor'
                ? 'View and manage your appointments'
                : 'Book and manage patient appointments'
              }
            </p>
            <button
              onClick={() => navigate(user?.role === 'Doctor' ? '/appointments/today' : '/appointments')}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              {user?.role === 'Doctor' ? "Today's Appointments" : 'Manage Appointments'}
            </button>
          </div>

          {/* Placeholder modules */}
          <div className="bg-gray-100 rounded-xl shadow-md p-6 opacity-50">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-600">Consultation</h3>
            </div>
            <p className="text-gray-500 mb-4">Coming in Phase 6</p>
            <button disabled className="w-full px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed">
              Not Available
            </button>
          </div>

          <div className="bg-gray-100 rounded-xl shadow-md p-6 opacity-50">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-600">Billing</h3>
            </div>
            <p className="text-gray-500 mb-4">Coming in Phase 9</p>
            <button disabled className="w-full px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed">
              Not Available
            </button>
          </div>

        </div>

      </main>
    </div>
  );
};

export default HomePage;
