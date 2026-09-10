import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllPatients, searchPatients } from '../utils/api';
import Layout from '../components/Layout';
import Button from '../components/Button';
import Badge from '../components/Badge';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Alert from '../components/Alert';
import { Search, UserPlus, Users, Eye, Edit } from 'lucide-react';

const PatientListPage = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const canManagePatients = user?.role === 'Admin' || user?.role === 'Receptionist';

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

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchPatients();
      return;
    }

    try {
      setSearching(true);
      setError('');
      const data = await searchPatients(searchQuery);
      setPatients(data.patients);
    } catch (err) {
      setError(err.message || 'Search failed');
    } finally {
      setSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    fetchPatients();
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
      
      {/* Search and Actions Bar */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xl">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by ID, name, or phone..."
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              <Button
                type="submit"
                variant="primary"
                disabled={searching}
                loading={searching}
              >
                Search
              </Button>
              {searchQuery && (
                <Button
                  type="button"
                  onClick={clearSearch}
                  variant="secondary"
                >
                  Clear
                </Button>
              )}
            </div>
          </form>

          {/* Register Button */}
          {canManagePatients && (
            <Button
              onClick={() => navigate('/patients/register')}
              variant="primary"
              icon={UserPlus}
            >
              Register Patient
            </Button>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6">
          <Alert type="error">{error}</Alert>
        </div>
      )}

      {/* Loading State */}
      {loading && <LoadingSpinner text="Loading patients..." />}

      {/* Patient Table */}
      {!loading && patients.length > 0 && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Gender</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Date of Birth</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {patients.map((patient) => (
                  <tr key={patient.patient_id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                      #{patient.patient_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-medium">
                      {patient.first_name} {patient.last_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {patient.gender}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {formatDate(patient.date_of_birth)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {patient.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge>{patient.status}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <button
                        onClick={() => navigate(`/patients/${patient.patient_id}`)}
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                      >
                        <Eye size={16} />
                        View
                      </button>
                      {canManagePatients && (
                        <button
                          onClick={() => navigate(`/patients/${patient.patient_id}/edit`)}
                          className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-800 font-medium transition-colors"
                        >
                          <Edit size={16} />
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && patients.length === 0 && (
        <EmptyState
          icon={Users}
          title={searchQuery ? 'No patients found' : 'No patients registered yet'}
          description={searchQuery ? 'Try adjusting your search criteria' : 'Start by registering your first patient'}
          action={
            canManagePatients && !searchQuery ? (
              <Button onClick={() => navigate('/patients/register')} icon={UserPlus}>
                Register First Patient
              </Button>
            ) : null
          }
        />
      )}

    </Layout>
  );
};

export default PatientListPage;
