import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import { Users, Calendar, UserPlus, CalendarPlus, Stethoscope, Clock } from 'lucide-react';

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const canManagePatients = user?.role === 'Admin' || user?.role === 'Receptionist';

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const quickActions = [];

  if (canManagePatients) {
    quickActions.push(
      {
        title: 'Patient Management',
        description: 'View, register, and manage patient records',
        icon: Users,
        color: 'blue',
        path: '/patients',
        buttonText: 'View Patients',
      },
      {
        title: 'Register Patient',
        description: 'Add a new patient to the system',
        icon: UserPlus,
        color: 'green',
        path: '/patients/register',
        buttonText: 'Register Now',
      },
      {
        title: 'Appointments',
        description: 'Book and manage patient appointments',
        icon: Calendar,
        color: 'purple',
        path: '/appointments',
        buttonText: 'View Appointments',
      },
      {
        title: 'Book Appointment',
        description: 'Schedule a new appointment',
        icon: CalendarPlus,
        color: 'amber',
        path: '/appointments/book',
        buttonText: 'Book Now',
      }
    );
  }

  if (user?.role === 'Doctor') {
    quickActions.push(
      {
        title: 'Patient Records',
        description: 'View and search patient information',
        icon: Users,
        color: 'blue',
        path: '/patients',
        buttonText: 'View Patients',
      },
      {
        title: "Today's Appointments",
        description: 'View and manage your appointments for today',
        icon: Clock,
        color: 'green',
        path: '/appointments/today',
        buttonText: 'View Schedule',
      },
      {
        title: 'Consultations',
        description: 'Access patient consultation records',
        icon: Stethoscope,
        color: 'purple',
        path: '/appointments/today',
        buttonText: 'Start Consultation',
      }
    );
  }

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      amber: 'bg-amber-100 text-amber-600',
    };
    return colors[color] || colors.blue;
  };

  return (
    <Layout>
      
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          {getGreeting()}, {user?.full_name}!
        </h1>
        <p className="text-slate-600">
          Welcome to your {user?.role} dashboard
        </p>
      </div>

      {/* Quick Stats - Optional if we had real data */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Your Role</p>
              <p className="text-2xl font-bold text-slate-800">{user?.role}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="text-blue-600" size={24} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Status</p>
              <p className="text-2xl font-bold text-green-600">Active</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Clock className="text-green-600" size={24} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Quick Access</p>
              <p className="text-2xl font-bold text-slate-800">{quickActions.length}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Stethoscope className="text-purple-600" size={24} />
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <div className="flex flex-col h-full">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${getColorClasses(action.color)}`}>
                    <Icon size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">
                    {action.title}
                  </h3>
                  <p className="text-sm text-slate-600 mb-4 flex-grow">
                    {action.description}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(action.path)}
                    className="w-full"
                  >
                    {action.buttonText}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

    </Layout>
  );
};

export default HomePage;
