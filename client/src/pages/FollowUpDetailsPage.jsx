import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getFollowUpById, updateFollowUpStatus } from '../utils/api';
import Layout from '../components/Layout';
import Button from '../components/Button';
import Badge from '../components/Badge';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import { ArrowLeft, User, Stethoscope, Calendar, Clock, FileText, CheckCircle, XCircle, FileCheck } from 'lucide-react';

const FollowUpDetailsPage = () => {
  const [followup, setFollowup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [updating, setUpdating] = useState(false);
  
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchFollowUp();
  }, [id]);

  const fetchFollowUp = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getFollowUpById(id);
      setFollowup(data.followup);
    } catch (err) {
      setError(err.message || 'Failed to load follow-up details');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    const actionText = newStatus === 'Completed' ? 'complete' : 'cancel';
    
    if (!window.confirm(`Are you sure you want to ${actionText} this follow-up?`)) {
      return;
    }

    try {
      setUpdating(true);
      setError('');
      setSuccessMessage('');
      await updateFollowUpStatus(id, newStatus);
      setSuccessMessage(`Follow-up ${actionText}d successfully`);
      // Refresh follow-up data
      fetchFollowUp();
    } catch (err) {
      setError(err.message || `Failed to ${actionText} follow-up`);
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'Not specified';
    
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getStatusBadgeVariant = (status) => {
    switch(status) {
      case 'Scheduled': return 'primary';
      case 'Completed': return 'success';
      case 'Cancelled': return 'secondary';
      default: return 'secondary';
    }
  };

  const canUpdateStatus = followup?.status === 'Scheduled' && 
                          (user?.role === 'Admin' || user?.role === 'Receptionist' || user?.role === 'Doctor');

  return (
    <Layout>
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="secondary"
          onClick={() => navigate('/followups')}
          icon={ArrowLeft}
          className="mb-4"
        >
          Back to Follow-ups
        </Button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
              <Calendar size={32} className="text-blue-600" />
              Follow-up Details
            </h1>
            <p className="text-slate-600 mt-1">Follow-up ID: #{id}</p>
          </div>
          
          {followup && (
            <Badge variant={getStatusBadgeVariant(followup.status)} className="text-base px-4 py-2">
              {followup.status}
            </Badge>
          )}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="error" onClose={() => setError('')} className="mb-6">
          {error}
        </Alert>
      )}

      {/* Success Alert */}
      {successMessage && (
        <Alert variant="success" onClose={() => setSuccessMessage('')} className="mb-6">
          {successMessage}
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="large" />
        </div>
      )}

      {/* Follow-up Details */}
      {!loading && followup && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Patient Information */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
              <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2 mb-4">
                <User size={24} className="text-blue-600" />
                Patient Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Full Name</p>
                  <p className="text-base font-medium text-slate-800">
                    {followup.patient_first_name} {followup.patient_last_name}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-slate-600 mb-1">Patient ID</p>
                  <p className="text-base font-medium text-slate-800">#{followup.patient_id}</p>
                </div>
                
                <div>
                  <p className="text-sm text-slate-600 mb-1">Date of Birth</p>
                  <p className="text-base font-medium text-slate-800">
                    {formatDate(followup.date_of_birth)} ({calculateAge(followup.date_of_birth)} years)
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-slate-600 mb-1">Gender</p>
                  <p className="text-base font-medium text-slate-800">{followup.gender}</p>
                </div>
                
                <div>
                  <p className="text-sm text-slate-600 mb-1">Blood Group</p>
                  <p className="text-base font-medium text-slate-800">{followup.blood_group}</p>
                </div>
                
                <div>
                  <p className="text-sm text-slate-600 mb-1">Patient Status</p>
                  <Badge variant="secondary">
                    {followup.patient_status}
                  </Badge>
                </div>
                
                <div className="md:col-span-2">
                  <p className="text-sm text-slate-600 mb-1">Contact Phone</p>
                  <p className="text-base font-medium text-slate-800">{followup.patient_phone}</p>
                </div>
                
                <div className="md:col-span-2">
                  <p className="text-sm text-slate-600 mb-1">Email</p>
                  <p className="text-base font-medium text-slate-800">{followup.patient_email}</p>
                </div>
                
                <div className="md:col-span-2">
                  <p className="text-sm text-slate-600 mb-1">Address</p>
                  <p className="text-base font-medium text-slate-800">{followup.address}</p>
                </div>
              </div>
            </div>

            {/* Doctor Information */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
              <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2 mb-4">
                <Stethoscope size={24} className="text-green-600" />
                Assigned Doctor
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Doctor Name</p>
                  <p className="text-base font-medium text-slate-800">{followup.doctor_name}</p>
                </div>
                
                <div>
                  <p className="text-sm text-slate-600 mb-1">Doctor ID</p>
                  <p className="text-base font-medium text-slate-800">#{followup.doctor_id}</p>
                </div>
                
                <div>
                  <p className="text-sm text-slate-600 mb-1">Specialization</p>
                  <p className="text-base font-medium text-slate-800">{followup.specialization}</p>
                </div>
                
                <div>
                  <p className="text-sm text-slate-600 mb-1">Qualification</p>
                  <p className="text-base font-medium text-slate-800">{followup.qualification}</p>
                </div>
              </div>
            </div>

            {/* Follow-up Notes */}
            {followup.notes && (
              <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
                <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2 mb-4">
                  <FileText size={24} className="text-amber-600" />
                  Follow-up Notes
                </h2>
                
                <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                  <p className="text-base text-slate-800 whitespace-pre-wrap">{followup.notes}</p>
                </div>
              </div>
            )}

            {/* Discharge Information (if post-discharge follow-up) */}
            {followup.discharge_id && (
              <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
                <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2 mb-4">
                  <FileCheck size={24} className="text-purple-600" />
                  Discharge Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Discharge ID</p>
                    <p className="text-base font-medium text-slate-800">#{followup.discharge_id}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Discharge Date</p>
                    <p className="text-base font-medium text-slate-800">
                      {formatDate(followup.discharge_date)}
                    </p>
                  </div>
                  
                  {followup.admission_id && (
                    <>
                      <div>
                        <p className="text-sm text-slate-600 mb-1">Admission ID</p>
                        <p className="text-base font-medium text-slate-800">#{followup.admission_id}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-slate-600 mb-1">Admission Date</p>
                        <p className="text-base font-medium text-slate-800">
                          {formatDate(followup.admission_date)}
                        </p>
                      </div>
                    </>
                  )}
                  
                  {followup.discharge_summary && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-slate-600 mb-1">Discharge Summary (excerpt)</p>
                      <p className="text-sm text-slate-700 line-clamp-2">
                        {followup.discharge_summary}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Follow-up Schedule */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
              <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2 mb-4">
                <Calendar size={24} className="text-blue-600" />
                Schedule
              </h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Follow-up Date</p>
                  <p className="text-lg font-bold text-slate-800">
                    {formatDate(followup.followup_date)}
                  </p>
                </div>
                
                <div className="border-t border-slate-200 pt-3">
                  <p className="text-sm text-slate-600 mb-1">Follow-up Time</p>
                  <p className="text-base font-medium text-slate-800 flex items-center gap-2">
                    <Clock size={16} />
                    {formatTime(followup.followup_time)}
                  </p>
                </div>
                
                <div className="border-t border-slate-200 pt-3">
                  <p className="text-sm text-slate-600 mb-1">Source</p>
                  <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${
                    followup.discharge_id 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {followup.discharge_id ? 'Hospital Discharge' : 'Outpatient Consultation'}
                  </span>
                </div>
                
                <div className="border-t border-slate-200 pt-3">
                  <p className="text-sm text-slate-600 mb-1">Status</p>
                  <Badge variant={getStatusBadgeVariant(followup.status)}>
                    {followup.status}
                  </Badge>
                </div>
                
                <div className="border-t border-slate-200 pt-3">
                  <p className="text-sm text-slate-600 mb-1">Created On</p>
                  <p className="text-sm text-slate-700">
                    {formatDateTime(followup.created_at)}
                  </p>
                </div>
              </div>
            </div>

            {/* Status Actions */}
            {canUpdateStatus && (
              <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
                <p className="text-xs text-slate-600 mb-3 uppercase font-medium">Status Actions</p>
                <div className="space-y-2">
                  <Button
                    variant="success"
                    size="small"
                    className="w-full"
                    onClick={() => handleStatusUpdate('Completed')}
                    disabled={updating}
                    icon={CheckCircle}
                  >
                    {updating ? 'Updating...' : 'Mark Completed'}
                  </Button>
                  <Button
                    variant="secondary"
                    size="small"
                    className="w-full"
                    onClick={() => handleStatusUpdate('Cancelled')}
                    disabled={updating}
                    icon={XCircle}
                  >
                    {updating ? 'Updating...' : 'Cancel Follow-up'}
                  </Button>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
              <p className="text-xs text-slate-600 mb-3 uppercase font-medium">Quick Actions</p>
              <div className="space-y-2">
                <Button
                  variant="secondary"
                  size="small"
                  className="w-full"
                  onClick={() => navigate(`/patients/${followup.patient_id}`)}
                >
                  View Patient Profile
                </Button>
                {followup.discharge_id && (
                  <Button
                    variant="secondary"
                    size="small"
                    className="w-full"
                    onClick={() => navigate(`/discharges/${followup.discharge_id}`)}
                  >
                    View Discharge Record
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default FollowUpDetailsPage;
