import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getBillById, recordPayment } from '../utils/api';
import Layout from '../components/Layout';
import Button from '../components/Button';
import Badge from '../components/Badge';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import { ArrowLeft, Receipt, User, Calendar, CreditCard, Check } from 'lucide-react';

const BillDetailsPage = () => {
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const canRecordPayment = user?.role === 'Admin' || user?.role === 'Receptionist';

  useEffect(() => {
    fetchBill();
  }, [id]);

  const fetchBill = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getBillById(id);
      setBill(data.bill);
    } catch (err) {
      setError(err.message || 'Failed to load bill');
    } finally {
      setLoading(false);
    }
  };

  const handleRecordPayment = async () => {
    if (!window.confirm('Record payment for this bill? This action cannot be undone.')) {
      return;
    }

    try {
      setRecording(true);
      setError('');
      await recordPayment(id);
      setSuccess('Payment recorded successfully!');
      
      // Refresh bill details
      setTimeout(() => {
        fetchBill();
        setSuccess('');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to record payment');
    } finally {
      setRecording(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return `₹${parseFloat(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
              <Receipt size={32} className="text-blue-600" />
              Bill Details
            </h1>
            <p className="text-slate-600 mt-1">Bill ID: #{id}</p>
          </div>
          
          {bill && (
            <Badge
              variant={bill.payment_status === 'Paid' ? 'success' : 'warning'}
              className="text-base px-4 py-2"
            >
              {bill.payment_status}
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

      {/* Bill Details */}
      {!loading && bill && (
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
                    {bill.patient_first_name} {bill.patient_last_name}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-slate-600 mb-1">Patient ID</p>
                  <p className="text-base font-medium text-slate-800">#{bill.patient_id}</p>
                </div>
                
                <div>
                  <p className="text-sm text-slate-600 mb-1">Date of Birth</p>
                  <p className="text-base font-medium text-slate-800">
                    {new Date(bill.date_of_birth).toLocaleDateString()} ({calculateAge(bill.date_of_birth)} years)
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-slate-600 mb-1">Gender</p>
                  <p className="text-base font-medium text-slate-800">{bill.gender}</p>
                </div>
                
                <div>
                  <p className="text-sm text-slate-600 mb-1">Blood Group</p>
                  <p className="text-base font-medium text-slate-800">{bill.blood_group}</p>
                </div>
                
                <div>
                  <p className="text-sm text-slate-600 mb-1">Phone</p>
                  <p className="text-base font-medium text-slate-800">{bill.patient_phone}</p>
                </div>
                
                <div className="md:col-span-2">
                  <p className="text-sm text-slate-600 mb-1">Email</p>
                  <p className="text-base font-medium text-slate-800">{bill.patient_email}</p>
                </div>
                
                <div className="md:col-span-2">
                  <p className="text-sm text-slate-600 mb-1">Address</p>
                  <p className="text-base font-medium text-slate-800">{bill.address}</p>
                </div>
              </div>
            </div>

            {/* Charges Breakdown */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
              <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2 mb-4">
                <Receipt size={24} className="text-green-600" />
                Charges Breakdown
              </h2>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-3 border-b border-slate-100">
                  <div>
                    <p className="font-medium text-slate-800">Consultation Charge</p>
                    <p className="text-sm text-slate-600">Doctor consultation fee</p>
                  </div>
                  <p className="text-lg font-semibold text-slate-800">
                    {formatCurrency(bill.consultation_charge)}
                  </p>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-slate-100">
                  <div>
                    <p className="font-medium text-slate-800">Room Charge</p>
                    <p className="text-sm text-slate-600">Hospitalization charges</p>
                  </div>
                  <p className="text-lg font-semibold text-slate-800">
                    {formatCurrency(bill.room_charge)}
                  </p>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-slate-100">
                  <div>
                    <p className="font-medium text-slate-800">Additional Charge</p>
                    <p className="text-sm text-slate-600">Medicines, tests, procedures</p>
                  </div>
                  <p className="text-lg font-semibold text-slate-800">
                    {formatCurrency(bill.additional_charge)}
                  </p>
                </div>
                
                <div className="flex justify-between items-center py-4 bg-green-50 rounded-lg px-4 mt-4">
                  <div>
                    <p className="text-lg font-bold text-slate-800">Total Amount</p>
                    <p className="text-sm text-slate-600">Grand total</p>
                  </div>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(bill.total_amount)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Payment Status */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
              <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2 mb-4">
                <CreditCard size={24} className="text-purple-600" />
                Payment Status
              </h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-600 mb-2">Status</p>
                  <Badge
                    variant={bill.payment_status === 'Paid' ? 'success' : 'warning'}
                    className="text-base px-3 py-1.5"
                  >
                    {bill.payment_status}
                  </Badge>
                </div>
                
                {bill.payment_status === 'Paid' && bill.payment_date && (
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Payment Date</p>
                    <p className="text-base font-medium text-slate-800">
                      {formatDate(bill.payment_date)}
                    </p>
                  </div>
                )}
                
                {bill.payment_status === 'Pending' && canRecordPayment && (
                  <div className="pt-4">
                    <Button
                      variant="primary"
                      onClick={handleRecordPayment}
                      disabled={recording}
                      loading={recording}
                      icon={Check}
                      className="w-full"
                    >
                      {recording ? 'Recording...' : 'Record Payment'}
                    </Button>
                    <p className="text-xs text-slate-600 mt-2 text-center">
                      Click to mark this bill as paid
                    </p>
                  </div>
                )}
                
                {bill.payment_status === 'Paid' && (
                  <div className="pt-4 bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <Check size={32} className="text-green-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-green-800">Payment Completed</p>
                  </div>
                )}
              </div>
            </div>

            {/* Bill Information */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
              <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2 mb-4">
                <Calendar size={24} className="text-blue-600" />
                Bill Information
              </h2>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Generated Date</p>
                  <p className="text-base font-medium text-slate-800">
                    {formatDate(bill.generated_at)}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-slate-600 mb-1">Generated By</p>
                  <p className="text-base font-medium text-slate-800">
                    {bill.generated_by_name}
                  </p>
                  <p className="text-sm text-slate-600">({bill.generated_by_username})</p>
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
                  onClick={() => navigate(`/patients/${bill.patient_id}`)}
                >
                  View Patient Profile
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default BillDetailsPage;
