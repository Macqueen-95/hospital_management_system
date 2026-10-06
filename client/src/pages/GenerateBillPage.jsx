import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllPatients, generateBill } from '../utils/api';
import Layout from '../components/Layout';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import { ArrowLeft, Receipt, FileText } from 'lucide-react';

const GenerateBillPage = () => {
  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState({
    patient_id: '',
    additional_charge: '0'
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getAllPatients();
      setPatients(data.patients);
    } catch (err) {
      setError(err.message || 'Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
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

    const additionalCharge = parseFloat(formData.additional_charge) || 0;
    if (additionalCharge < 0) {
      setError('Additional charge cannot be negative');
      return;
    }

    setSubmitting(true);

    try {
      const result = await generateBill({
        patient_id: parseInt(formData.patient_id),
        additional_charge: additionalCharge
      });
      
      setSuccess(`Bill generated successfully! Total Amount: ₹${result.total_amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`);
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate(`/bills/${result.bill_id}`);
      }, 1500);
      
    } catch (err) {
      setError(err.message || 'Failed to generate bill');
      setSubmitting(false);
    }
  };

  const selectedPatient = patients.find(p => p.patient_id === parseInt(formData.patient_id));

  const formatCurrency = (amount) => {
    return `₹${parseFloat(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <Layout>
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="secondary"
          onClick={() => navigate('/bills')}
          icon={ArrowLeft}
          className="mb-4"
        >
          Back to Bills
        </Button>
        
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
          <Receipt size={32} className="text-blue-600" />
          Generate Bill
        </h1>
        <p className="text-slate-600 mt-1">Create a new bill for a patient</p>
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

      {/* Info Alert */}
      <Alert variant="info" className="mb-6">
        <div className="flex items-start gap-2">
          <FileText size={18} className="mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium mb-1">Automatic Charge Calculation:</p>
            <ul className="list-disc list-inside space-y-1 text-slate-700">
              <li><strong>Consultation Charge:</strong> Automatically calculated from the patient's most recent consultation with the doctor's fee</li>
              <li><strong>Room Charge:</strong> Automatically calculated from active admission (days × room price per day)</li>
              <li><strong>Additional Charge:</strong> Enter any additional charges (medicine, procedures, etc.)</li>
            </ul>
          </div>
        </div>
      </Alert>

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

                {/* Additional Charge */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Additional Charge (₹)
                  </label>
                  <input
                    type="number"
                    name="additional_charge"
                    value={formData.additional_charge}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    disabled={submitting}
                    placeholder="0.00"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100 disabled:cursor-not-allowed"
                  />
                  <p className="mt-2 text-sm text-slate-600">
                    Enter any additional charges for medicines, procedures, tests, etc. (Default: ₹0.00)
                  </p>
                </div>

                {/* Note */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-900">
                    <strong>Note:</strong> Consultation and room charges will be calculated automatically based on the patient's medical records. 
                    Only add additional charges if needed.
                  </p>
                </div>

                {/* Submit Button */}
                <div className="flex gap-3">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={submitting || patients.length === 0}
                    loading={submitting}
                    icon={Receipt}
                    className="flex-1"
                  >
                    {submitting ? 'Generating Bill...' : 'Generate Bill'}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => navigate('/bills')}
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
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Bill Preview</h3>
              
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

                {/* Charges Breakdown */}
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase mb-2">Charges</p>
                  <div className="bg-slate-50 rounded-lg p-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Consultation</span>
                      <span className="text-slate-800 font-medium">Auto-calculated</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Room</span>
                      <span className="text-slate-800 font-medium">Auto-calculated</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Additional</span>
                      <span className="text-slate-800 font-medium">
                        {formatCurrency(formData.additional_charge || 0)}
                      </span>
                    </div>
                    <div className="border-t border-slate-200 pt-2 mt-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-semibold text-slate-700">Total</span>
                        <span className="font-semibold text-green-600">
                          To be calculated
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Generated By */}
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase mb-1">Generated By</p>
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-sm font-medium text-slate-800">{user?.full_name}</p>
                    <p className="text-sm text-slate-600">{user?.role}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default GenerateBillPage;
