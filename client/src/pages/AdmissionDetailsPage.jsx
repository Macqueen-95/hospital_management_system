import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAdmissionById, approveDischarge, finalizeDischarge } from '../utils/api';
import Layout from '../components/Layout';
import Button from '../components/Button';
import Badge from '../components/Badge';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import { ArrowLeft, User, Stethoscope, Bed, Calendar, FileText, CheckCircle, LogOut } from 'lucide-react';

const AdmissionDetailsPage = () => {
  const [admission, setAdmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [approving, setApproving] = useState(false);
  const [showDischargeModal, setShowDischargeModal] = useState(false);
  const [dischargeFormData, setDischargeFormData] = useState({
    discharge_summary: '',
    final_diagnosis: '',
    medications_prescribed: '',
    instructions: ''
  });
  const [finalizing, setFinalizing] = useState(false);
  
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAdmission();
  }, [id]);

  const fetchAdmission = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getAdmissionById(id);
      setAdmission(data.admission);
    } catch (err) {
      setError(err.message || 'Failed to load admission details');
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

  const handleApproveDischarge = async () => {
    if (!window.confirm('Are you sure you want to approve this patient for discharge? This will mark the patient as "Ready for Discharge".')) {
      return;
    }

    try {
      setApproving(true);
      setError('');
      setSuccessMessage('');
      await approveDischarge(id);
      setSuccessMessage('Discharge approved successfully. Patient is ready for discharge.');
      // Refresh admission data
      fetchAdmission();
    } catch (err) {
      setError(err.message || 'Failed to approve discharge');
    } finally {
      setApproving(false);
    }
  };

  const handleFinalizeDischarge = async (e) => {
    e.preventDefault();

    if (!dischargeFormData.discharge_summary.trim()) {
      setError('Discharge summary is required');
      return;
    }

    try {
      setFinalizing(true);
      setError('');
      setSuccessMessage('');
      const result = await finalizeDischarge(id, dischargeFormData);
      setSuccessMessage('Discharge finalized successfully!');
      setShowDischargeModal(false);
      
      // Navigate to discharge details page after a short delay
      setTimeout(() => {
        navigate(`/discharges/${result.discharge_id}`);
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to finalize discharge');
      setFinalizing(false);
    }
  };

  const canApproveDischarge = user?.role === 'Doctor' && 
                              admission?.status === 'Active' && 
                              admission?.patient_status !== 'Ready for Discharge';

  const canFinalizeDischarge = (user?.role === 'Admin' || user?.role === 'Receptionist') && 
                                admission?.status === 'Active' && 
                                admission?.patient_status === 'Ready for Discharge';

  return (
    <Layout>
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="secondary"
          onClick={() => navigate('/admissions')}
          icon={ArrowLeft}
          className="mb-4"
        >
          Back to Admissions
        </Button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
              <Bed size={32} className="text-blue-600" />
              Admission Details
            </h1>
            <p className="text-slate-600 mt-1">Admission ID: #{id}</p>
          </div>
          
          {admission && (
            <Badge
              variant={admission.status === 'Active' ? 'success' : 'secondary'}
              className="text-base px-4 py-2"
            >
              {admission.status}
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

      {/* Admission Details */}
      {!loading && admission && (
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
                    {admission.patient_first_name} {admission.patient_last_name}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-slate-600 mb-1">Patient ID</p>
                  <p className="text-base font-medium text-slate-800">#{admission.patient_id}</p>
                </div>
                
                <div>
                  <p className="text-sm text-slate-600 mb-1">Date of Birth</p>
                  <p className="text-base font-medium text-slate-800">
                    {formatDate(admission.date_of_birth)} ({calculateAge(admission.date_of_birth)} years)
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-slate-600 mb-1">Gender</p>
                  <p className="text-base font-medium text-slate-800">{admission.gender}</p>
                </div>
                
                <div>
                  <p className="text-sm text-slate-600 mb-1">Blood Group</p>
                  <p className="text-base font-medium text-slate-800">{admission.blood_group}</p>
                </div>
                
                <div>
                  <p className="text-sm text-slate-600 mb-1">Patient Status</p>
                  <Badge variant={admission.patient_status === 'Admitted' ? 'success' : 'secondary'}>
                    {admission.patient_status}
                  </Badge>
                </div>
                
                <div className="md:col-span-2">
                  <p className="text-sm text-slate-600 mb-1">Contact Phone</p>
                  <p className="text-base font-medium text-slate-800">{admission.patient_phone}</p>
                </div>
                
                <div className="md:col-span-2">
                  <p className="text-sm text-slate-600 mb-1">Email</p>
                  <p className="text-base font-medium text-slate-800">{admission.patient_email}</p>
                </div>
                
                <div className="md:col-span-2">
                  <p className="text-sm text-slate-600 mb-1">Address</p>
                  <p className="text-base font-medium text-slate-800">{admission.address}</p>
                </div>
              </div>
            </div>

            {/* Doctor Information */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
              <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2 mb-4">
                <Stethoscope size={24} className="text-green-600" />
                Admitting Doctor
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Doctor Name</p>
                  <p className="text-base font-medium text-slate-800">{admission.doctor_name}</p>
                </div>
                
                <div>
                  <p className="text-sm text-slate-600 mb-1">Doctor ID</p>
                  <p className="text-base font-medium text-slate-800">#{admission.doctor_id}</p>
                </div>
                
                <div>
                  <p className="text-sm text-slate-600 mb-1">Specialization</p>
                  <p className="text-base font-medium text-slate-800">{admission.specialization}</p>
                </div>
                
                <div>
                  <p className="text-sm text-slate-600 mb-1">Qualification</p>
                  <p className="text-base font-medium text-slate-800">{admission.qualification}</p>
                </div>
                
                <div>
                  <p className="text-sm text-slate-600 mb-1">Experience</p>
                  <p className="text-base font-medium text-slate-800">{admission.experience_years} years</p>
                </div>
                
                <div>
                  <p className="text-sm text-slate-600 mb-1">Contact Phone</p>
                  <p className="text-base font-medium text-slate-800">{admission.doctor_phone}</p>
                </div>
              </div>
            </div>

            {/* Admission Reason */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
              <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2 mb-4">
                <FileText size={24} className="text-amber-600" />
                Admission Reason
              </h2>
              
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-base text-slate-800 whitespace-pre-wrap">{admission.reason}</p>
              </div>
            </div>
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
                  <p className="text-2xl font-bold text-slate-800">{admission.room_number}</p>
                </div>
                
                <div className="border-t border-slate-200 pt-3">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-slate-600">Room Type</p>
                    <p className="text-sm font-medium text-slate-800">{admission.room_type}</p>
                  </div>
                  
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-slate-600">Floor</p>
                    <p className="text-sm font-medium text-slate-800">Floor {admission.floor}</p>
                  </div>
                  
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-slate-600">Bed Count</p>
                    <p className="text-sm font-medium text-slate-800">{admission.bed_count}</p>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-slate-600">Price Per Day</p>
                    <p className="text-sm font-semibold text-green-600">
                      ₹{admission.price_per_day.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Admission Timeline */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
              <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2 mb-4">
                <Calendar size={24} className="text-blue-600" />
                Timeline
              </h2>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Admission Date</p>
                  <p className="text-base font-medium text-slate-800">
                    {formatDate(admission.admission_date)}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-slate-600 mb-1">Status</p>
                  <Badge variant={admission.status === 'Active' ? 'success' : 'secondary'}>
                    {admission.status}
                  </Badge>
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
                  onClick={() => navigate(`/patients/${admission.patient_id}`)}
                >
                  View Patient Profile
                </Button>

                {canApproveDischarge && (
                  <Button
                    variant="primary"
                    size="small"
                    className="w-full"
                    onClick={handleApproveDischarge}
                    disabled={approving}
                    icon={CheckCircle}
                  >
                    {approving ? 'Approving...' : 'Approve Discharge'}
                  </Button>
                )}

                {canFinalizeDischarge && (
                  <Button
                    variant="success"
                    size="small"
                    className="w-full"
                    onClick={() => setShowDischargeModal(true)}
                    icon={LogOut}
                  >
                    Finalize Discharge
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Discharge Modal */}
      {showDischargeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Finalize Patient Discharge</h2>
              
              <form onSubmit={handleFinalizeDischarge}>
                <div className="space-y-4">
                  {/* Discharge Summary */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Discharge Summary <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={dischargeFormData.discharge_summary}
                      onChange={(e) => setDischargeFormData({ ...dischargeFormData, discharge_summary: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows="4"
                      placeholder="Enter discharge summary..."
                      required
                    />
                  </div>

                  {/* Final Diagnosis */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Final Diagnosis (Optional)
                    </label>
                    <textarea
                      value={dischargeFormData.final_diagnosis}
                      onChange={(e) => setDischargeFormData({ ...dischargeFormData, final_diagnosis: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows="3"
                      placeholder="Enter final diagnosis..."
                    />
                  </div>

                  {/* Medications Prescribed */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Medications Prescribed (Optional)
                    </label>
                    <textarea
                      value={dischargeFormData.medications_prescribed}
                      onChange={(e) => setDischargeFormData({ ...dischargeFormData, medications_prescribed: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows="3"
                      placeholder="Enter medications prescribed..."
                    />
                  </div>

                  {/* Instructions */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Discharge Instructions (Optional)
                    </label>
                    <textarea
                      value={dischargeFormData.instructions}
                      onChange={(e) => setDischargeFormData({ ...dischargeFormData, instructions: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows="3"
                      placeholder="Enter discharge instructions..."
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={finalizing}
                    className="flex-1"
                  >
                    {finalizing ? 'Finalizing...' : 'Finalize Discharge'}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setShowDischargeModal(false);
                      setError('');
                    }}
                    disabled={finalizing}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AdmissionDetailsPage;
