import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getPatientById } from '../utils/api';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';

const PatientDetailsPage = () => {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const canManagePatients = user?.role === 'Admin' || user?.role === 'Receptionist';

  useEffect(() => {
    fetchPatient();
  }, [id]);

  const fetchPatient = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getPatientById(id);
      setPatient(data.patient);
    } catch (err) {
      setError(err.message || 'Failed to load patient details');
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

  const getStatusColor = (status) => {
    const colors = {
      'Registered': 'bg-blue-100 text-blue-800',
      'Appointment Scheduled': 'bg-yellow-100 text-yellow-800',
      'Checked In': 'bg-purple-100 text-purple-800',
      'Consultation Completed': 'bg-green-100 text-green-800',
      'Admitted': 'bg-orange-100 text-orange-800',
      'Ready for Discharge': 'bg-indigo-100 text-indigo-800',
      'Discharged': 'bg-gray-100 text-gray-800',
      'Follow-up Scheduled': 'bg-pink-100 text-pink-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <Layout><LoadingSpinner text="Loading patient details..." /></Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <button onClick={() => navigate('/patients')} className="mb-5 text-sm font-semibold text-[#13805d]">← Back to Patients</button>
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <p className="text-red-600 text-lg">{error}</p>
          </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-5">
        <button onClick={() => navigate('/patients')} className="mb-4 text-sm font-semibold text-[#13805d]">← Back to Patients</button>
        <h1 className="text-3xl font-extrabold text-[#18232c]">Patient Details</h1>
      </div>
      <main className="max-w-5xl">
        
        {/* Patient Header Card */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {patient.first_name} {patient.last_name}
              </h2>
              <p className="text-gray-600">Patient ID: #{patient.patient_id}</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`px-4 py-2 text-sm font-medium rounded-full ${getStatusColor(patient.status)}`}>
                {patient.status}
              </span>
              {canManagePatients && (
                <button
                  onClick={() => navigate(`/patients/${id}/edit`)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Edit Patient
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Patient Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          
          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
            <div className="space-y-3">
              <div className="flex">
                <span className="w-40 text-gray-600 font-medium">Date of Birth:</span>
                <span className="text-gray-800">{formatDate(patient.date_of_birth)}</span>
              </div>
              <div className="flex">
                <span className="w-40 text-gray-600 font-medium">Gender:</span>
                <span className="text-gray-800">{patient.gender}</span>
              </div>
              <div className="flex">
                <span className="w-40 text-gray-600 font-medium">Blood Group:</span>
                <span className="text-gray-800">{patient.blood_group || 'Not specified'}</span>
              </div>
              <div className="flex">
                <span className="w-40 text-gray-600 font-medium">Registered:</span>
                <span className="text-gray-800">{formatDate(patient.registered_at)}</span>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex">
                <span className="w-40 text-gray-600 font-medium">Phone:</span>
                <span className="text-gray-800">{patient.phone}</span>
              </div>
              <div className="flex">
                <span className="w-40 text-gray-600 font-medium">Email:</span>
                <span className="text-gray-800">{patient.email || 'Not provided'}</span>
              </div>
              <div>
                <span className="text-gray-600 font-medium">Address:</span>
                <p className="text-gray-800 mt-1">{patient.address || 'Not provided'}</p>
              </div>
            </div>
          </div>

        </div>

        {/* Emergency Contact */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Emergency Contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex">
              <span className="w-40 text-gray-600 font-medium">Name:</span>
              <span className="text-gray-800">{patient.emergency_contact_name || 'Not provided'}</span>
            </div>
            <div className="flex">
              <span className="w-40 text-gray-600 font-medium">Phone:</span>
              <span className="text-gray-800">{patient.emergency_contact_phone || 'Not provided'}</span>
            </div>
          </div>
        </div>

        {/* Placeholder for Future Modules */}
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
          <p className="text-gray-600">
            Appointment history, consultations, admissions, and billing information will be available in future phases.
          </p>
        </div>

      </main>
    </Layout>
  );
};

export default PatientDetailsPage;
