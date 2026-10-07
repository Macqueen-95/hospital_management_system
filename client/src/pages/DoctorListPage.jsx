import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllDoctors, updateDoctorStatus } from '../utils/api';
import Layout from '../components/Layout';
import Button from '../components/Button';
import { UserPlus, Edit, CheckCircle, XCircle, Search, Stethoscope } from 'lucide-react';

const DoctorListPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, active, inactive

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const data = await getAllDoctors();
      setDoctors(data.doctors);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (doctorId, currentStatus) => {
    if (!window.confirm(`Are you sure you want to ${currentStatus ? 'deactivate' : 'reactivate'} this doctor?`)) {
      return;
    }

    try {
      await updateDoctorStatus(doctorId, !currentStatus);
      // Refresh the list
      await fetchDoctors();
    } catch (err) {
      alert(`Failed to update doctor status: ${err.message}`);
    }
  };

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = 
      doctor.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = 
      filterStatus === 'all' ||
      (filterStatus === 'active' && doctor.is_active) ||
      (filterStatus === 'inactive' && !doctor.is_active);

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#13805d]"></div>
          <p className="mt-4 text-[#53636c]">Loading doctors...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#18232c] tracking-tight">Doctor Management</h1>
            <p className="text-sm text-[#6b7b83] mt-1">Manage doctor accounts and availability</p>
          </div>
          
          {user?.role === 'Admin' && (
            <Button
              onClick={() => navigate('/doctors/new')}
              icon={UserPlus}
            >
              Add Doctor
            </Button>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-[#dce6e1] p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#82928c]" size={18} />
              <input
                type="text"
                placeholder="Search doctors by name, username, specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-[#dce6e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#13805d] focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-[#dce6e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#13805d] focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-[#6b7b83]">
          Showing {filteredDoctors.length} of {doctors.length} doctors
        </div>

        {/* Doctors Table */}
        <div className="bg-white rounded-lg shadow-sm border border-[#dce6e1] overflow-hidden">
          {filteredDoctors.length === 0 ? (
            <div className="text-center py-12">
              <Stethoscope className="mx-auto mb-4 text-[#82928c]" size={48} />
              <p className="text-[#53636c]">No doctors found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#e7efeb]">
                <thead className="bg-[#f4f7f4]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-[#53636c] uppercase tracking-wider">Doctor</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-[#53636c] uppercase tracking-wider">Specialization</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-[#53636c] uppercase tracking-wider">Qualification</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-[#53636c] uppercase tracking-wider">Experience</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-[#53636c] uppercase tracking-wider">Fee</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-[#53636c] uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-[#53636c] uppercase tracking-wider">Status</th>
                    {user?.role === 'Admin' && (
                      <th className="px-6 py-3 text-left text-xs font-bold text-[#53636c] uppercase tracking-wider">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-[#e7efeb]">
                  {filteredDoctors.map((doctor) => (
                    <tr key={doctor.doctor_id} className="hover:bg-[#f4f7f4] transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-semibold text-[#18232c]">{doctor.full_name}</div>
                          <div className="text-xs text-[#82928c]">@{doctor.username}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-[#53636c]">{doctor.specialization}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-[#53636c]">{doctor.qualification || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-[#53636c]">{doctor.experience_years} years</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-[#18232c]">₹{doctor.consultation_fee}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs text-[#53636c]">
                          <div>{doctor.email}</div>
                          <div>{doctor.phone || 'N/A'}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {doctor.is_active ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle size={12} />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <XCircle size={12} />
                            Inactive
                          </span>
                        )}
                      </td>
                      {user?.role === 'Admin' && (
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => navigate(`/doctors/${doctor.doctor_id}/edit`)}
                              className="text-[#13805d] hover:text-[#0f6348] transition-colors"
                              title="Edit Doctor"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleStatusChange(doctor.doctor_id, doctor.is_active)}
                              className={`transition-colors ${
                                doctor.is_active 
                                  ? 'text-red-600 hover:text-red-800' 
                                  : 'text-green-600 hover:text-green-800'
                              }`}
                              title={doctor.is_active ? 'Deactivate' : 'Reactivate'}
                            >
                              {doctor.is_active ? <XCircle size={18} /> : <CheckCircle size={18} />}
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </Layout>
  );
};

export default DoctorListPage;
