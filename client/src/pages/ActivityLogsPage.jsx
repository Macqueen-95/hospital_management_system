import { useState, useEffect } from 'react';
import { getActivityLogs } from '../utils/api';
import { Search, ChevronLeft, ChevronRight, Filter, X } from 'lucide-react';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';

const ActivityLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0
  });

  // Filters
  const [filters, setFilters] = useState({
    user: '',
    action: '',
    entity_type: '',
    date: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLogs();
  }, [pagination.page]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError('');
      
      const activeFilters = {};
      if (filters.user) activeFilters.user = filters.user;
      if (filters.action) activeFilters.action = filters.action;
      if (filters.entity_type) activeFilters.entity_type = filters.entity_type;
      if (filters.date) activeFilters.date = filters.date;
      activeFilters.page = pagination.page;
      activeFilters.limit = pagination.limit;

      const data = await getActivityLogs(activeFilters);
      setLogs(data.logs || []);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message || 'Failed to load activity logs');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchLogs();
  };

  const clearFilters = () => {
    setFilters({
      user: '',
      action: '',
      entity_type: '',
      date: ''
    });
    setPagination(prev => ({ ...prev, page: 1 }));
    setTimeout(() => fetchLogs(), 100);
  };

  const goToPage = (page) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const formatDateTime = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <Layout>
    <div className="max-w-7xl">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-6">
          <button onClick={() => navigate('/dashboard')} className="mb-4 text-sm font-semibold text-[#13805d] hover:text-[#0f6449]">
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-[#18232c] mb-2">Activity Logs</h1>
          <p className="text-[#53636c]">System audit trail and activity records</p>
        </div>
        {/* Filters */}
        <div className="bg-white rounded-lg border border-[#dce6e1] p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-[#13805d] hover:text-[#0f6449] font-medium"
            >
              <Filter size={18} />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
            {(filters.user || filters.action || filters.entity_type || filters.date) && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 text-[#82928c] hover:text-[#53636c]"
              >
                <X size={18} />
                Clear Filters
              </button>
            )}
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#53636c] mb-1">
                  User
                </label>
                <input
                  type="text"
                  value={filters.user}
                  onChange={(e) => handleFilterChange('user', e.target.value)}
                  placeholder="Search by name..."
                  className="w-full px-3 py-2 border border-[#dce6e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#13805d]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#53636c] mb-1">
                  Action
                </label>
                <input
                  type="text"
                  value={filters.action}
                  onChange={(e) => handleFilterChange('action', e.target.value)}
                  placeholder="e.g., Login, Patient Registered..."
                  className="w-full px-3 py-2 border border-[#dce6e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#13805d]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#53636c] mb-1">
                  Entity Type
                </label>
                <select
                  value={filters.entity_type}
                  onChange={(e) => handleFilterChange('entity_type', e.target.value)}
                  className="w-full px-3 py-2 border border-[#dce6e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#13805d]"
                >
                  <option value="">All Types</option>
                  <option value="Patient">Patient</option>
                  <option value="Appointment">Appointment</option>
                  <option value="Consultation">Consultation</option>
                  <option value="Admission">Admission</option>
                  <option value="Bill">Bill</option>
                  <option value="Payment">Payment</option>
                  <option value="Discharge">Discharge</option>
                  <option value="FollowUp">FollowUp</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#53636c] mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={filters.date}
                  onChange={(e) => handleFilterChange('date', e.target.value)}
                  className="w-full px-3 py-2 border border-[#dce6e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#13805d]"
                />
              </div>

              <div className="md:col-span-4">
                <button
                  onClick={applyFilters}
                  className="w-full md:w-auto px-6 py-2 bg-[#13805d] text-white rounded-lg hover:bg-[#0f6449] flex items-center justify-center gap-2"
                >
                  <Search size={18} />
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Activity Logs Table */}
        <div className="bg-white rounded-lg border border-[#dce6e1] overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-[#82928c]">Loading activity logs...</div>
          ) : logs.length === 0 ? (
            <div className="p-8 text-center text-[#82928c]">No activity logs found</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#f4f7f4] border-b border-[#dce6e1]">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[#53636c] uppercase">
                        Date/Time
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[#53636c] uppercase">
                        User
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[#53636c] uppercase">
                        Action
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[#53636c] uppercase">
                        Entity Type
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[#53636c] uppercase">
                        Entity ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[#53636c] uppercase">
                        Description
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[#53636c] uppercase">
                        IP Address
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e7efeb]">
                    {logs.map((log) => (
                      <tr key={log.log_id} className="hover:bg-[#f4f7f4]">
                        <td className="px-4 py-3 text-sm text-[#18232c] whitespace-nowrap">
                          {formatDateTime(log.created_at)}
                        </td>
                        <td className="px-4 py-3 text-sm text-[#18232c]">
                          <div className="font-medium">{log.user_name || 'System'}</div>
                          {log.username && (
                            <div className="text-xs text-[#82928c]">@{log.username}</div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-[#e3f7ef] text-[#13805d]">
                            {log.action}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-[#53636c]">
                          {log.entity_type || '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-[#53636c]">
                          {log.entity_id || '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-[#53636c] max-w-md">
                          {log.description || '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-[#82928c] whitespace-nowrap">
                          {log.ip_address || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="border-t border-[#dce6e1] px-4 py-3 flex items-center justify-between">
                <div className="text-sm text-[#53636c]">
                  Showing {logs.length} of {pagination.total} logs
                  {pagination.totalPages > 1 && ` (Page ${pagination.page} of ${pagination.totalPages})`}
                </div>
                
                {pagination.totalPages > 1 && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => goToPage(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="px-3 py-1 border border-[#dce6e1] rounded-lg hover:bg-[#f4f7f4] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                    >
                      <ChevronLeft size={16} />
                      Previous
                    </button>
                    
                    <div className="flex items-center gap-1">
                      {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                        let pageNum;
                        if (pagination.totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (pagination.page <= 3) {
                          pageNum = i + 1;
                        } else if (pagination.page >= pagination.totalPages - 2) {
                          pageNum = pagination.totalPages - 4 + i;
                        } else {
                          pageNum = pagination.page - 2 + i;
                        }
                        
                        return (
                          <button
                            key={i}
                            onClick={() => goToPage(pageNum)}
                            className={`px-3 py-1 rounded-lg ${
                              pagination.page === pageNum
                                ? 'bg-[#13805d] text-white'
                                : 'border border-[#dce6e1] hover:bg-[#f4f7f4]'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    
                    <button
                      onClick={() => goToPage(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                      className="px-3 py-1 border border-[#dce6e1] rounded-lg hover:bg-[#f4f7f4] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                    >
                      Next
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      </div>
      </Layout>
  );
};

export default ActivityLogsPage;
