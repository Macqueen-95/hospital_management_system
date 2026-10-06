import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllAdmissions } from '../utils/api';
import Layout from '../components/Layout';
import Button from '../components/Button';
import Badge from '../components/Badge';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Alert from '../components/Alert';
import { Bed, Plus, Eye, UserCheck } from 'lucide-react';

const AdmissionListPage = () => {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, active, discharged
  
  const { user } = useAuth();
  const navigate = useNavigate();

  const canCreateAdmission = user?.role === 'Admin' || user?.role === 'Receptionist';

  useEffect(() => {
    fetchAdmissions();
  }, []);

  const fetchAdmissions = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getAllAdmissions();
      setAdmissions(data.admissions);
    } catch (err) {
      setError(err.message || 'Failed to load admissions');
    } finally {
      setLoading(false);
    }
  };

  const filteredAdmissions = admissions.filter(admission => {
    if (filterStatus === 'active') return admission.status === 'Active';
    if (filterStatus === 'discharged') return admission.status === 'Discharged';
    return true;
  });

  const stats = {
    total: admissions.length,
    active: admissions.filter(a => a.status === 'Active').length,
    discharged: admissions.filter(a => a.status === 'Discharged').length,
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Layout>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
              <Bed size={32} className="text-blue-600" />
              Patient Admissions
            </h1>
            <p className="text-slate-600 mt-1">Manage patient admissions and room allocations</p>
          </div>
          
          {canCreateAdmission && (
            <Button
              variant="primary"
              onClick={() => navigate('/admissions/new')}
              icon={Plus}
            >
              New Admission
            </Button>
          )}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="error" onClose={() => setError('')} className="mb-6">
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Admissions</p>
              <p className="text-3xl font-bold text-slate-800 mt-1">{stats.total}</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Bed className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Active</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{stats.active}</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <UserCheck className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Discharged</p>
              <p className="text-3xl font-bold text-slate-600 mt-1">{stats.discharged}</p>
            </div>
            <div className="h-12 w-12 bg-slate-100 rounded-lg flex items-center justify-center">
              <Bed className="text-slate-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All ({stats.total})
          </button>
          <button
            onClick={() => setFilterStatus('active')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === 'active'
                ? 'bg-green-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Active ({stats.active})
          </button>
          <button
            onClick={() => setFilterStatus('discharged')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === 'discharged'
                ? 'bg-slate-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Discharged ({stats.discharged})
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="large" />
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredAdmissions.length === 0 && (
        <EmptyState
          icon={Bed}
          title={filterStatus === 'all' ? 'No admissions found' : `No ${filterStatus} admissions`}
          description={
            filterStatus === 'all'
              ? 'There are no patient admissions yet.'
              : `There are no ${filterStatus} admissions at the moment.`
          }
          action={
            canCreateAdmission && filterStatus === 'all' ? (
              <Button
                variant="primary"
                onClick={() => navigate('/admissions/new')}
                icon={Plus}
              >
                Create First Admission
              </Button>
            ) : null
          }
        />
      )}

      {/* Admissions Table */}
      {!loading && filteredAdmissions.length > 0 && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Admission ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Doctor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Room
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Admission Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredAdmissions.map((admission) => (
                  <tr key={admission.admission_id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                      #{admission.admission_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-slate-900">
                          {admission.patient_first_name} {admission.patient_last_name}
                        </div>
                        <div className="text-sm text-slate-500">{admission.patient_phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-slate-900">
                          {admission.doctor_name}
                        </div>
                        <div className="text-sm text-slate-500">{admission.specialization}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-slate-900">
                          Room {admission.room_number}
                        </div>
                        <div className="text-sm text-slate-500">
                          {admission.room_type} • Floor {admission.floor}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {formatDate(admission.admission_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        variant={admission.status === 'Active' ? 'success' : 'secondary'}
                      >
                        {admission.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => navigate(`/admissions/${admission.admission_id}`)}
                        icon={Eye}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AdmissionListPage;
