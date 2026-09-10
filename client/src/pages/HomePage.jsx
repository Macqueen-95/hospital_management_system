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
      blue: 'bg-[#e3f7ef] text-[#13805d]',
      green: 'bg-[#fff2d8] text-[#b27a1c]',
      purple: 'bg-[#eef0ff] text-[#6578c5]',
      amber: 'bg-[#ffebe7] text-[#c05b48]',
    };
    return colors[color] || colors.blue;
  };

  return (
    <Layout>
      
      {/* Welcome Section */}
      <div className="mb-8">
        <p className="text-sm font-semibold text-[#13805d] mb-2">Dashboard overview</p>
        <h1 className="text-3xl font-extrabold tracking-[-0.035em] text-[#18232c] mb-2">
          {getGreeting()}, {user?.full_name}!
        </h1>
        <p className="text-[#6b7b83]">
          Your {user?.role.toLowerCase()} dashboard is ready for the day.
        </p>
      </div>

      {/* Quick Stats - Optional if we had real data */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[#6b7b83] mb-2">Your role</p>
              <p className="text-2xl font-extrabold tracking-[-0.03em] text-[#18232c]">{user?.role}</p>
            </div>
            <div className="w-12 h-12 bg-[#e3f7ef] rounded-2xl flex items-center justify-center">
              <Users className="text-[#13805d]" size={24} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[#6b7b83] mb-2">Status</p>
              <p className="text-2xl font-extrabold tracking-[-0.03em] text-[#13805d]">Active</p>
            </div>
            <div className="w-12 h-12 bg-[#fff2d8] rounded-2xl flex items-center justify-center">
              <Clock className="text-[#b27a1c]" size={24} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[#6b7b83] mb-2">Quick access</p>
              <p className="text-2xl font-extrabold tracking-[-0.03em] text-[#18232c]">{quickActions.length}</p>
            </div>
            <div className="w-12 h-12 bg-[#eef0ff] rounded-2xl flex items-center justify-center">
              <Stethoscope className="text-[#6578c5]" size={24} />
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <div className="flex items-end justify-between mb-5">
          <div>
            <p className="text-sm font-semibold text-[#13805d] mb-1">Shortcuts</p>
            <h2 className="text-xl font-bold text-[#18232c]">Quick actions</h2>
          </div>
          <span className="hidden sm:block text-xs text-[#8a9a94]">{quickActions.length} available</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Card key={index} className="group hover:shadow-md transition-shadow">
                <div className="flex flex-col h-full">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${getColorClasses(action.color)}`}>
                    <Icon size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-[#18232c] mb-2">
                    {action.title}
                  </h3>
                  <p className="text-sm leading-6 text-[#6b7b83] mb-5 flex-grow">
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
