import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createFollowUp, getAllPatients, getAllDoctors, getAllDischarges } from '../utils/api';
import Layout from '../components/Layout';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import { ArrowLeft, Calendar, Save } from 'lucide-react';

const ScheduleFollowUpPage = () => {
  const [formData, setFormData] = useState({
    patient_id: '',
    doctor_id: '',
    discharge_id: '',
    followup_date: '',
    followup_time: '',
    notes: ''
  });
  
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [discharges, setDischarges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
    
    // Pre-populate from URL params if provided
    const patientId = searchParams.get('patient_id');
    const dischargeId = searchParams.get('discharge_id');
    
    if (patientId) {
      setFormData(prev => ({ ...prev, patient_id: patientId }));
    }
    if (dischargeId) {
      setFormData(prev => ({ ...prev, discharge_id: dischargeId }));
    }
  }, [searchParams]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [patientsData, doctorsData, dischargesData] = await Promise.all([
        getAllPatients(),
        getAllDoctors(),
        getAllDischarges()
      ]);
      
      setPatients(patientsData.patients || []);
      setDoctors(doctorsData.doctors || []);
      setDischarges(dischargesData.discharges || []);
    } catch (err) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.patient_id || !formData.doctor_id || !formData.followup_date) {
      setError('Patient, doctor, and follow-up date are required');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      
      const submitData = {
        patient_id: parseInt(formData.patient_id),
        doctor_id: parseInt(formData.doctor_id),
        followup_date: formData.followup_date,
        followup_time: formData.followup_time || null,
        notes: formData.notes || null
      };
      
      // Only include discharge_id if it's actually selected
      if (formData.discharge_id) {
        submitData.discharge_id = parseInt(formData.discharge_id);
      }
      
      const result = await createFollowUp(submitData);
      
      // Navigate to the created follow-up
      navigate(`/followups/${result.followup_id}`);
    } catch (err) {
      setError(err.message || 'Failed to schedule follow-up');
      setSubmitting(false);
    }
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Filter discharges for selected patient
  const patientDischarges = formData.patient_id
    ? discharges.filter(d => d.patient_id === parseInt(formData.patient_id))
    : [];

  const selectedPatient = patients.find(p => p.patient_id === parseInt(formData.patient_id));

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
        
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <Calendar size={32} className="text-blue-600" />
            Schedule Follow-up
          </h1>
          <p className="text-slate-600 mt-1">Schedule a follow-up appointment for a patient</p>
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

      {/* Form */}
      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
              <div className="space-y-6">
                {/* Patient Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Patient <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="patient_id"
                    value={formData.patient_id}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select a patient</option>
                    {patients.map(patient => (
                      <option key={patient.patient_id} value={patient.patient_id}>
                        {patient.first_name} {patient.last_name} - ID: #{patient.patient_id} - {patient.phone}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Doctor Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Doctor <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="doctor_id"
                    value={formData.doctor_id}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select a doctor</option>
                    {doctors.map(doctor => (
                      <option key={doctor.doctor_id} value={doctor.doctor_id}>
                        {doctor.full_name} - {doctor.specialization}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Discharge Selection (Optional) */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Related Discharge (Optional)
                  </label>
                  <select
                    name="discharge_id"
                    value={formData.discharge_id}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={!formData.patient_id}
                  >
                    <option value="">None (Outpatient Follow-up)</option>
                    {patientDischarges.map(discharge => (
                      <option key={discharge.discharge_id} value={discharge.discharge_id}>
                        Discharge #{discharge.discharge_id} - {new Date(discharge.discharge_date).toLocaleDateString()}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-slate-500 mt-1">
                    Leave empty for outpatient follow-up, or select a discharge for post-discharge follow-up
                  </p>
                </div>

                {/* Follow-up Date */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Follow-up Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="followup_date"
                    value={formData.followup_date}
                    onChange={handleChange}
                    min={getMinDate()}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Follow-up Time */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Follow-up Time (Optional)
                  </label>
                  <input
                    type="time"
                    name="followup_time"
                    value={formData.followup_time}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Specify a time if needed. Can be left empty if time is flexible.
                  </p>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter any additional notes or instructions for the follow-up..."
                  />
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-3 pt-4 border-t border-slate-200">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={submitting}
                    icon={Save}
                    className="flex-1"
                  >
                    {submitting ? 'Scheduling...' : 'Schedule Follow-up'}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => navigate('/followups')}
                    disabled={submitting}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </form>
          </div>

          {/* Sidebar - Preview */}
          <div className="lg:col-span-1">
            <div className="bg-slate-50 rounded-lg border border-slate-200 p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Preview</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-600 mb-1 uppercase font-medium">Patient</p>
                  <p className="text-sm text-slate-800">
                    {selectedPatient 
                      ? `${selectedPatient.first_name} ${selectedPatient.last_name}` 
                      : 'Not selected'}
                  </p>
                </div>
                
                <div>
                  <p className="text-xs text-slate-600 mb-1 uppercase font-medium">Doctor</p>
                  <p className="text-sm text-slate-800">
                    {formData.doctor_id 
                      ? doctors.find(d => d.doctor_id === parseInt(formData.doctor_id))?.full_name || 'Unknown'
                      : 'Not selected'}
                  </p>
                </div>
                
                <div>
                  <p className="text-xs text-slate-600 mb-1 uppercase font-medium">Type</p>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    formData.discharge_id 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {formData.discharge_id ? 'Post-Discharge' : 'Outpatient'}
                  </span>
                </div>
                
                <div>
                  <p className="text-xs text-slate-600 mb-1 uppercase font-medium">Date</p>
                  <p className="text-sm text-slate-800">
                    {formData.followup_date 
                      ? new Date(formData.followup_date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : 'Not set'}
                  </p>
                </div>
                
                <div>
                  <p className="text-xs text-slate-600 mb-1 uppercase font-medium">Time</p>
                  <p className="text-sm text-slate-800">
                    {formData.followup_time || 'Not specified'}
                  </p>
                </div>
                
                {formData.notes && (
                  <div>
                    <p className="text-xs text-slate-600 mb-1 uppercase font-medium">Notes</p>
                    <p className="text-sm text-slate-700 line-clamp-3">
                      {formData.notes}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-300">
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs text-blue-800 font-medium mb-1">ℹ️ Important</p>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• Follow-up will be created with "Scheduled" status</li>
                    <li>• Patient status may be updated to "Follow-up Scheduled"</li>
                    <li>• Date cannot be in the past</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ScheduleFollowUpPage;
