import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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

        {/* User Info Card */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Profile</h3>
          <div className="space-y-3">
            <div className="flex">
              <span className="w-32 text-gray-600 font-medium">User ID:</span>
              <span className="text-gray-800">{user?.user_id}</span>
            </div>
            <div className="flex">
              <span className="w-32 text-gray-600 font-medium">Username:</span>
              <span className="text-gray-800">{user?.username}</span>
            </div>
            <div className="flex">
              <span className="w-32 text-gray-600 font-medium">Role:</span>
              <span className="text-gray-800">{user?.role}</span>
            </div>
            <div className="flex">
              <span className="w-32 text-gray-600 font-medium">Email:</span>
              <span className="text-gray-800">{user?.email}</span>
            </div>
            <div className="flex">
              <span className="w-32 text-gray-600 font-medium">Phone:</span>
              <span className="text-gray-800">{user?.phone}</span>
            </div>
          </div>
        </div>

        {/* Phase Notice */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <p className="text-blue-800">
            <span className="font-semibold">Phase 3 Complete:</span> Authentication is working! 
            The full dashboard and HMS modules will be implemented in upcoming phases.
          </p>
        </div>

      </main>
    </div>
  );
};

export default HomePage;
