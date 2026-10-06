import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllPatients, getAllDoctors, getAvailableRooms, createAdmission } from '../utils/api';
import Layout from '../components/Layout';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import { Bed, UserPlus, ArrowLeft } from 'lucide-react';

const CreateAdmissionPage = () => {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [formData, setFormData] = useState({
    patient_id: '',
    doctor_id: '',
    room_id: '',
    reason: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const [patientsData, doctorsData, roomsData] = await Promise.all([
        getAllPatients(),
        getAllDoctors(),
        getAvailableRooms()
      ]);
      setPatients(patientsData.patients);
      setDoctors(doctorsData.doctors);
      setRooms(roomsData.rooms);
    } catch (err) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.patient_id) {
      setError('Please select a patient');
      return;
    }
    if (!formData.doctor_id) {
      setError('Please select a doctor');
      return;
    }
    if (!formData.room_id) {
      setError('Please select a room');
      return;
    }
    if (!formData.reason.trim()) {
      setError('Please enter admission reason');
      return;
    }

    setSubmitting(true);

    try {
      const result = await createAdmission({
        patient_id: parseInt(formData.patient_id),
        doctor_id: parseInt(formData.doctor_id),
        room_id: parseInt(formData.room_id),
        reason: formData.reason.trim()
      });
      
      setSuccess('Admission created successfully!');
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate(`/admissions/${result.admission_id}`);
      }, 1500);
      
    } catch (err) {
      setError(err.message || 'Failed to create admission');
      setSubmitting(false);
    }
  };

  const selectedPatient = patients.find(p => p.patient_id === parseInt(formData.patient_id));
  const selectedDoctor = doctors.find(d => d.doctor_id === parseInt(formData.doctor_id));
  const selectedRoom = rooms.find(r => r.room_id === parseInt(formData.room_id));

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
        
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
          <Bed size={32} className="text-blue-600" />
          Create New Admission
        </h1>
        <p className="text-slate-600 mt-1">Admit a patient and allocate a room</p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="error" onClose={() => setError('')} className="mb-6">
          {error}
        </Alert>
      )}

      {/* Success Alert */}
      {success && (
        <Alert variant="success" className="mb-6">
          {success}
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="large" />
        </div>
      )}

      {/* Form */}
      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Patient Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Patient <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="patient_id"
                    value={formData.patient_id}
                    onChange={handleChange}
                    required
                    disabled={submitting}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100 disabled:cursor-not-allowed"
                  >
                    <option value="">Select a patient</option>
                    {patients.map((patient) => (
                      <option key={patient.patient_id} value={patient.patient_id}>
                        {patient.first_name} {patient.last_name} - {patient.phone} ({patient.status})
                      </option>
                    ))}
                  </select>
                  {patients.length === 0 && (
                    <p className="mt-2 text-sm text-amber-600">No patients available. Please register a patient first.</p>
                  )}
                </div>

                {/* Doctor Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Admitting Doctor <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="doctor_id"
                    value={formData.doctor_id}
                    onChange={handleChange}
                    required
                    disabled={submitting}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100 disabled:cursor-not-allowed"
                  >
                    <option value="">Select a doctor</option>
                    {doctors.map((doctor) => (
                      <option key={doctor.doctor_id} value={doctor.doctor_id}>
                        {doctor.full_name} - {doctor.specialization}
                      </option>
                    ))}
                  </select>
                  {doctors.length === 0 && (
                    <p className="mt-2 text-sm text-amber-600">No doctors available.</p>
                  )}
                </div>

                {/* Room Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Room <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="room_id"
                    value={formData.room_id}
                    onChange={handleChange}
                    required
                    disabled={submitting}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100 disabled:cursor-not-allowed"
                  >
                    <option value="">Select a room</option>
                    {rooms.map((room) => (
                      <option key={room.room_id} value={room.room_id}>
                        Room {room.room_number} - {room.room_type} (Floor {room.floor}) - ₹{room.price_per_day}/day
                      </option>
                    ))}
                  </select>
                  {rooms.length === 0 && (
                    <p className="mt-2 text-sm text-red-600">No rooms available. All rooms are occupied.</p>
                  )}
                </div>

                {/* Admission Reason */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Admission Reason <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    required
                    disabled={submitting}
                    rows={4}
                    placeholder="Enter reason for admission..."
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100 disabled:cursor-not-allowed resize-none"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex gap-3">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={submitting || rooms.length === 0}
                    loading={submitting}
                    icon={UserPlus}
                    className="flex-1"
                  >
                    {submitting ? 'Creating Admission...' : 'Create Admission'}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => navigate('/admissions')}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Admission Preview</h3>
              
              <div className="space-y-4">
                {/* Patient Info */}
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase mb-1">Patient</p>
                  {selectedPatient ? (
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="font-medium text-slate-800">
                        {selectedPatient.first_name} {selectedPatient.last_name}
                      </p>
                      <p className="text-sm text-slate-600">{selectedPatient.phone}</p>
                      <p className="text-sm text-slate-600">Status: {selectedPatient.status}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 italic">No patient selected</p>
                  )}
                </div>

                {/* Doctor Info */}
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase mb-1">Doctor</p>
                  {selectedDoctor ? (
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="font-medium text-slate-800">{selectedDoctor.full_name}</p>
                      <p className="text-sm text-slate-600">{selectedDoctor.specialization}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 italic">No doctor selected</p>
                  )}
                </div>

                {/* Room Info */}
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase mb-1">Room</p>
                  {selectedRoom ? (
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="font-medium text-slate-800">Room {selectedRoom.room_number}</p>
                      <p className="text-sm text-slate-600">{selectedRoom.room_type}</p>
                      <p className="text-sm text-slate-600">Floor {selectedRoom.floor}</p>
                      <p className="text-sm font-medium text-green-600 mt-1">
                        ₹{selectedRoom.price_per_day.toLocaleString()}/day
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 italic">No room selected</p>
                  )}
                </div>

                {/* Reason Preview */}
                {formData.reason && (
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase mb-1">Reason</p>
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-sm text-slate-800">{formData.reason}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default CreateAdmissionPage;
