import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDischargeById } from '../utils/api';
import Layout from '../components/Layout';
import Button from '../components/Button';
import Badge from '../components/Badge';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import { ArrowLeft, User, Stethoscope, Bed, Calendar, FileText, Pill, ClipboardList } from 'lucide-react';

const DischargeDetailsPage = () => {
  const [discharge, setDischarge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDischarge();
  }, [id]);

  const fetchDischarge = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getDischargeById(id);
      setDischarge(data.discharge);
    } catch (err) {
      setError(err.message || 'Failed to load discharge details');
    } finally {
      setLoading(false);
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

  const calculateStayDuration = (admissionDate, dischargeDate) => {
    const admission = new Date(admissionDate);
    const discharged = new Date(dischargeDate);
    const diffTime = Math.abs(discharged - admission);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 0 ? '1 day' : `${diffDays} day${diffDays > 1 ? 's' : ''}`;
  };

  return (
    <Layout>
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="secondary"
          onClick={() => navigate('/discharges')}
          icon={ArrowLeft}
          className="mb-4"
        >
          Back to Discharges
        </Button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
              <FileText size={32} className="text-blue-600" />
              Discharge Summary
            </h1>
            <p className="text-slate-600 mt-1">Discharge ID: #{id}</p>
          </div>
          
          {discharge && (
            <Badge variant="success" className="text-base px-4 py-2">
              Discharged
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

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="large" />
        </div>
      )}

      {/* Discharge Details */}
      {!loading && discharge && (
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
                    {discharge.patient_first_name} {discharge.patient_last_name}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-slate-600 mb-1">Patient ID</p>
                  <p className="text-base font-medium text-slate-800">#{discharge.patient_id}</p>
                </div>
                
                <div>
                  <p className="text-sm text-slate-600 mb-1">Date of Birth</p>
                  <p className="text-base font-medium text-slate-800">
                    {formatDate(discharge.date_of_birth)} ({calculateAge(discharge.date_of_birth)} years)
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-slate-600 mb-1">Gender</p>
                  <p className="text-base font-medium text-slate-800">{discharge.gender}</p>
                </div>
                
                <div>
                  <p className="text-sm text-slate-600 mb-1">Blood Group</p>
                  <p className="text-base font-medium text-slate-800">{discharge.blood_group}</p>
                </div>
                
                <div>
                  <p className="text-sm text-slate-600 mb-1">Contact Phone</p>
                  <p className="text-base font-medium text-slate-800">{discharge.patient_phone}</p>
                </div>
                
                <div className="md:col-span-2">
                  <p className="text-sm text-slate-600 mb-1">Email</p>
                  <p className="text-base font-medium text-slate-800">{discharge.patient_email}</p>
                </div>
                
                <div className="md:col-span-2">
                  <p className="text-sm text-slate-600 mb-1">Address</p>
                  <p className="text-base font-medium text-slate-800">{discharge.address}</p>
                </div>
              </div>
            </div>

            {/* Doctor Information */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
              <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2 mb-4">
                <Stethoscope size={24} className="text-green-600" />
                Treating Doctor
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Doctor Name</p>
                  <p className="text-base font-medium text-slate-800">{discharge.doctor_name}</p>
                </div>
                
                <div>
                  <p className="text-sm text-slate-600 mb-1">Doctor ID</p>
                  <p className="text-base font-medium text-slate-800">#{discharge.doctor_id}</p>
                </div>
                
                <div>
                  <p className="text-sm text-slate-600 mb-1">Specialization</p>
                  <p className="text-base font-medium text-slate-800">{discharge.specialization}</p>
                </div>
                
                <div>
                  <p className="text-sm text-slate-600 mb-1">Qualification</p>
                  <p className="text-base font-medium text-slate-800">{discharge.qualification}</p>
                </div>
              </div>
            </div>

            {/* Admission Reason */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
              <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2 mb-4">
                <ClipboardList size={24} className="text-amber-600" />
                Admission Reason
              </h2>
              
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-base text-slate-800 whitespace-pre-wrap">{discharge.admission_reason}</p>
              </div>
            </div>

            {/* Discharge Summary */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
              <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2 mb-4">
                <FileText size={24} className="text-blue-600" />
                Discharge Summary
              </h2>
              
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-base text-slate-800 whitespace-pre-wrap">{discharge.discharge_summary}</p>
              </div>
            </div>

            {/* Final Diagnosis */}
            {discharge.final_diagnosis && (
              <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
                <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2 mb-4">
                  <ClipboardList size={24} className="text-purple-600" />
                  Final Diagnosis
                </h2>
                
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <p className="text-base text-slate-800 whitespace-pre-wrap">{discharge.final_diagnosis}</p>
                </div>
              </div>
            )}

            {/* Medications Prescribed */}
            {discharge.medications_prescribed && (
              <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
                <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2 mb-4">
                  <Pill size={24} className="text-green-600" />
                  Medications Prescribed
                </h2>
                
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <p className="text-base text-slate-800 whitespace-pre-wrap">{discharge.medications_prescribed}</p>
                </div>
              </div>
            )}

            {/* Instructions */}
            {discharge.instructions && (
              <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
                <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2 mb-4">
                  <FileText size={24} className="text-orange-600" />
                  Discharge Instructions
                </h2>
                
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <p className="text-base text-slate-800 whitespace-pre-wrap">{discharge.instructions}</p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Room Information */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
              <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2 mb-4">
                <Bed size={24} className="text-purple-600" />
                Room Details
              </h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Room Number</p>
                  <p className="text-2xl font-bold text-slate-800">{discharge.room_number}</p>
                </div>
                
                <div className="border-t border-slate-200 pt-3">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-slate-600">Room Type</p>
                    <p className="text-sm font-medium text-slate-800">{discharge.room_type}</p>
                  </div>
                  
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-slate-600">Floor</p>
                    <p className="text-sm font-medium text-slate-800">Floor {discharge.floor}</p>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-slate-600">Price Per Day</p>
                    <p className="text-sm font-semibold text-green-600">
                      ₹{discharge.price_per_day.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
              <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2 mb-4">
                <Calendar size={24} className="text-blue-600" />
                Timeline
              </h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Admission ID</p>
                  <p className="text-base font-medium text-slate-800">#{discharge.admission_id}</p>
                </div>
                
                <div className="border-t border-slate-200 pt-3">
                  <p className="text-sm text-slate-600 mb-1">Admission Date</p>
                  <p className="text-base font-medium text-slate-800">
                    {formatDate(discharge.admission_date)}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-slate-600 mb-1">Discharge Date</p>
                  <p className="text-base font-medium text-slate-800">
                    {formatDateTime(discharge.discharge_date)}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-slate-600 mb-1">Stay Duration</p>
                  <p className="text-base font-semibold text-blue-600">
                    {calculateStayDuration(discharge.admission_date, discharge.discharge_date)}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
              <p className="text-xs text-slate-600 mb-3 uppercase font-medium">Quick Actions</p>
              <div className="space-y-2">
                <Button
                  variant="secondary"
                  size="small"
                  className="w-full"
                  onClick={() => navigate(`/patients/${discharge.patient_id}`)}
                >
                  View Patient Profile
                </Button>
                <Button
                  variant="secondary"
                  size="small"
                  className="w-full"
                  onClick={() => navigate(`/admissions/${discharge.admission_id}`)}
                >
                  View Admission Details
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default DischargeDetailsPage;
