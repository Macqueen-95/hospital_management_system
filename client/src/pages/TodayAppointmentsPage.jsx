import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getTodayAppointments } from '../utils/api';
import Layout from '../components/Layout';
import Badge from '../components/Badge';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Alert from '../components/Alert';
import Button from '../components/Button';
import Card from '../components/Card';
import { Calendar, Clock, User, FileText, Stethoscope, Eye } from 'lucide-react';

const TodayAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [todayDate, setTodayDate] = useState('');
  
  const { user } = useAuth();
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

  const getActionButton = (appointment) => {
    if (appointment.status === 'Checked In') {
      return {
        text: 'Start Consultation',
        variant: 'primary',
        icon: Stethoscope,
      };
    }
    if (appointment.status === 'Completed') {
      return {
        text: 'View Consultation',
        variant: 'secondary',
        icon: Eye,
      };
    }
    return {
      text: 'View Details',
      variant: 'outline',
      icon: Eye,
    };
  };

  return (
    <Layout>
      
      {/* Header Card */}
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="text-blue-600" size={28} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-800">
                {todayDate && new Date(todayDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </h2>
              <p className="text-sm text-slate-600 mt-1">Welcome, Dr. {user?.full_name}</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{appointments.length}</p>
              <p className="text-sm text-slate-600">Appointments</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-amber-600">
                {appointments.filter(a => a.status === 'Checked In').length}
              </p>
              <p className="text-sm text-slate-600">Waiting</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {appointments.filter(a => a.status === 'Completed').length}
              </p>
              <p className="text-sm text-slate-600">Completed</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Error Message */}
      {error && (
        <div className="mb-6">
          <Alert type="error">{error}</Alert>
        </div>
      )}

      {/* Loading State */}
      {loading && <LoadingSpinner text="Loading today's appointments..." />}

      {/* Appointments Grid */}
      {!loading && appointments.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appointments.map((appointment) => {
            const action = getActionButton(appointment);
            const ActionIcon = action.icon;
            
            return (
              <div
                key={appointment.appointment_id}
                className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Clock className="text-blue-600" size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">#{appointment.appointment_id}</p>
                        <p className="text-xl font-bold text-slate-800">{formatTime(appointment.appointment_time)}</p>
                      </div>
                    </div>
                    <Badge>{appointment.status}</Badge>
                  </div>

                  {/* Patient Info */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-start gap-2">
                      <User className="text-slate-400 mt-0.5" size={16} />
                      <div>
                        <p className="text-xs text-slate-500">Patient</p>
                        <p className="font-medium text-slate-800">
                          {appointment.patient_first_name} {appointment.patient_last_name}
                        </p>
                      </div>
                    </div>
                    {appointment.reason && (
                      <div className="flex items-start gap-2">
                        <FileText className="text-slate-400 mt-0.5" size={16} />
                        <div>
                          <p className="text-xs text-slate-500">Reason</p>
                          <p className="text-sm text-slate-700 line-clamp-2">{appointment.reason}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <Button
                    onClick={() => navigate(`/appointments/${appointment.appointment_id}`)}
                    variant={action.variant}
                    icon={ActionIcon}
                    className="w-full"
                  >
                    {action.text}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!loading && appointments.length === 0 && (
        <EmptyState
          icon={Calendar}
          title="No appointments today"
          description="You have no scheduled appointments for today"
        />
      )}

    </Layout>
  );
};

export default TodayAppointmentsPage;
