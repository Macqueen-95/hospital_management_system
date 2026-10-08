import { useState, useEffect } from 'react';
import { getReportSummary } from '../utils/api';
import { 
  Users, Calendar, Bed, Receipt, CalendarCheck, 
  TrendingUp, DollarSign, Activity 
} from 'lucide-react';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';

const ReportsPage = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchReportSummary();
  }, []);

  const fetchReportSummary = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getReportSummary();
      setSummary(data.summary);
    } catch (err) {
      setError(err.message || 'Failed to load report summary');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <Layout>
      <div className="max-w-7xl">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="text-[#82928c]">Loading reports...</div>
          </div>
        </div>
      </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
      <div className="max-w-7xl">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        </div>
      </div>
      </Layout>
    );
  }

  return (
    <Layout>
    <div className="max-w-7xl">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-6">
          <button onClick={() => navigate('/dashboard')} className="mb-4 text-sm font-semibold text-[#13805d] hover:text-[#0f6449]">
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-[#18232c] mb-2">Reports & Analytics</h1>
          <p className="text-[#53636c]">System-wide statistics and summaries</p>
        </div>
        {/* Patient Summary */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="text-[#13805d]" size={24} />
            <h2 className="text-xl font-semibold text-[#18232c]">Patient Summary</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <StatCard
              label="Total Patients"
              value={summary?.patients?.total || 0}
              color="blue"
            />
            <StatCard
              label="Registered"
              value={summary?.patients?.registered || 0}
              color="gray"
            />
            <StatCard
              label="Appointment Scheduled"
              value={summary?.patients?.appointmentScheduled || 0}
              color="purple"
            />
            <StatCard
              label="Checked In"
              value={summary?.patients?.checkedIn || 0}
              color="yellow"
            />
            <StatCard
              label="Consultation Completed"
              value={summary?.patients?.consultationCompleted || 0}
              color="green"
            />
            <StatCard
              label="Admitted"
              value={summary?.patients?.admitted || 0}
              color="orange"
            />
            <StatCard
              label="Ready for Discharge"
              value={summary?.patients?.readyForDischarge || 0}
              color="teal"
            />
            <StatCard
              label="Discharged"
              value={summary?.patients?.discharged || 0}
              color="indigo"
            />
            <StatCard
              label="Follow-up Scheduled"
              value={summary?.patients?.followUpScheduled || 0}
              color="pink"
            />
          </div>
        </div>

        {/* Appointment Summary */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="text-[#13805d]" size={24} />
            <h2 className="text-xl font-semibold text-[#18232c]">Appointment Summary</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <StatCard
              label="Total Appointments"
              value={summary?.appointments?.total || 0}
              color="blue"
            />
            <StatCard
              label="Scheduled"
              value={summary?.appointments?.scheduled || 0}
              color="purple"
            />
            <StatCard
              label="Checked In"
              value={summary?.appointments?.checkedIn || 0}
              color="yellow"
            />
            <StatCard
              label="Completed"
              value={summary?.appointments?.completed || 0}
              color="green"
            />
            <StatCard
              label="Cancelled"
              value={summary?.appointments?.cancelled || 0}
              color="red"
            />
          </div>
        </div>

        {/* Admission Summary */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Bed className="text-[#13805d]" size={24} />
            <h2 className="text-xl font-semibold text-[#18232c]">Admission Summary</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              label="Total Admissions"
              value={summary?.admissions?.total || 0}
              color="blue"
            />
            <StatCard
              label="Active Admissions"
              value={summary?.admissions?.active || 0}
              color="orange"
            />
            <StatCard
              label="Discharged"
              value={summary?.admissions?.discharged || 0}
              color="green"
            />
          </div>
        </div>

        {/* Billing Summary */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Receipt className="text-[#13805d]" size={24} />
            <h2 className="text-xl font-semibold text-[#18232c]">Billing Summary</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <StatCard
              label="Total Bills"
              value={summary?.billing?.totalBills || 0}
              color="blue"
            />
            <StatCard
              label="Pending Bills"
              value={summary?.billing?.pendingBills || 0}
              color="yellow"
            />
            <StatCard
              label="Paid Bills"
              value={summary?.billing?.paidBills || 0}
              color="green"
            />
            <StatCard
              label="Total Billed Amount"
              value={formatCurrency(summary?.billing?.totalBilledAmount || 0)}
              color="purple"
              icon={<DollarSign size={20} />}
            />
            <StatCard
              label="Total Value of Paid Bills"
              value={formatCurrency(summary?.billing?.totalPaidBillValue || 0)}
              color="green"
              icon={<TrendingUp size={20} />}
            />
          </div>
        </div>

        {/* Follow-up Summary */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <CalendarCheck className="text-[#13805d]" size={24} />
            <h2 className="text-xl font-semibold text-[#18232c]">Follow-up Summary</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total Follow-ups"
              value={summary?.followUps?.total || 0}
              color="blue"
            />
            <StatCard
              label="Scheduled"
              value={summary?.followUps?.scheduled || 0}
              color="purple"
            />
            <StatCard
              label="Completed"
              value={summary?.followUps?.completed || 0}
              color="green"
            />
            <StatCard
              label="Cancelled"
              value={summary?.followUps?.cancelled || 0}
              color="red"
            />
          </div>
        </div>

        {/* Footer Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
          <div className="flex items-start gap-2">
            <Activity size={18} className="mt-0.5 flex-shrink-0" />
            <div>
              <strong>Note:</strong> All statistics are generated from real-time database data. 
              Billing amounts represent the total value of bills and do not constitute detailed financial accounting.
            </div>
          </div>
        </div>
      </div>
      </div>
      </Layout>
  );
};

// Stat Card Component
const StatCard = ({ label, value, color, icon }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
    teal: 'bg-teal-50 text-teal-700 border-teal-200',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    pink: 'bg-pink-50 text-pink-700 border-pink-200',
    gray: 'bg-gray-50 text-gray-700 border-gray-200'
  };

  return (
    <div className={`rounded-lg border p-4 ${colorClasses[color] || colorClasses.blue}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs font-medium uppercase tracking-wide opacity-80">
          {label}
        </div>
        {icon && <div className="opacity-60">{icon}</div>}
      </div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
};

export default ReportsPage;
