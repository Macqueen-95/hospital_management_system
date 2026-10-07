import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDoctorById, updateDoctor } from '../utils/api';
import Layout from '../components/Layout';
import Button from '../components/Button';
import { ArrowLeft, Save } from 'lucide-react';

const EditDoctorPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    specialization: '',
    qualification: '',
    experience_years: '',
    consultation_fee: '',
    available_days: '',
    available_time_start: '',
    available_time_end: '',
    password: '' // Optional password update
  });

  const [doctorInfo, setDoctorInfo] = useState(null);

  useEffect(() => {
    fetchDoctor();
  }, [id]);

  const fetchDoctor = async () => {
    try {
      setFetchLoading(true);
      const data = await getDoctorById(id);
      const doctor = data.doctor;
      
      setDoctorInfo(doctor);
      setFormData({
        full_name: doctor.full_name || '',
        email: doctor.email || '',
        phone: doctor.phone || '',
        specialization: doctor.specialization || '',
        qualification: doctor.qualification || '',
        experience_years: doctor.experience_years || '',
        consultation_fee: doctor.consultation_fee || '',
        available_days: doctor.available_days || '',
        available_time_start: doctor.available_time_start || '',
        available_time_end: doctor.available_time_end || '',
        password: ''
      });
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setFetchLoading(false);
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
    setError('');
    setLoading(true);

    try {
      // Prepare data
      const doctorData = {
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone || null,
        specialization: formData.specialization,
        qualification: formData.qualification || null,
        experience_years: formData.experience_years ? parseInt(formData.experience_years) : 0,
        consultation_fee: parseFloat(formData.consultation_fee),
        available_days: formData.available_days || null,
        available_time_start: formData.available_time_start || null,
        available_time_end: formData.available_time_end || null
      };

      // Include password only if provided
      if (formData.password && formData.password.trim() !== '') {
        doctorData.password = formData.password;
      }

      await updateDoctor(id, doctorData);
      navigate('/doctors');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Only Admin can access this page
  if (user?.role !== 'Admin') {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-red-600">Access denied. Admin only.</p>
        </div>
      </Layout>
    );
  }

  if (fetchLoading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#13805d]"></div>
          <p className="mt-4 text-[#53636c]">Loading doctor...</p>
        </div>
      </Layout>
    );
  }

  if (!doctorInfo) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-red-600">Doctor not found</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/doctors')}
            className="flex items-center gap-2 text-[#53636c] hover:text-[#18232c] mb-4"
          >
            <ArrowLeft size={20} />
            <span className="text-sm">Back to Doctors</span>
          </button>
          <h1 className="text-2xl font-extrabold text-[#18232c] tracking-tight">Edit Doctor</h1>
          <p className="text-sm text-[#6b7b83] mt-1">Update doctor information and availability</p>
          <p className="text-xs text-[#82928c] mt-1">Username: @{doctorInfo.username}</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-[#dce6e1] p-6">
          
          {/* Personal Information */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-[#18232c] mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#53636c] mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-[#dce6e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#13805d] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#53636c] mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-[#dce6e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#13805d] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#53636c] mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-[#dce6e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#13805d] focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#53636c] mb-2">
                  Update Password <span className="text-xs text-[#82928c]">(leave blank to keep current)</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  minLength="6"
                  className="w-full px-4 py-2 border border-[#dce6e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#13805d] focus:border-transparent"
                  placeholder="Enter new password (optional)"
                />
              </div>

            </div>
          </div>

          {/* Professional Information */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-[#18232c] mb-4">Professional Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div>
                <label className="block text-sm font-medium text-[#53636c] mb-2">
                  Specialization <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-[#dce6e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#13805d] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#53636c] mb-2">
                  Qualification
                </label>
                <input
                  type="text"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-[#dce6e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#13805d] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#53636c] mb-2">
                  Experience (Years)
                </label>
                <input
                  type="number"
                  name="experience_years"
                  value={formData.experience_years}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border border-[#dce6e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#13805d] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#53636c] mb-2">
                  Consultation Fee (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="consultation_fee"
                  value={formData.consultation_fee}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-[#dce6e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#13805d] focus:border-transparent"
                />
              </div>

            </div>
          </div>

          {/* Availability */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-[#18232c] mb-4">Availability</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-[#53636c] mb-2">
                  Available Days
                </label>
                <input
                  type="text"
                  name="available_days"
                  value={formData.available_days}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-[#dce6e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#13805d] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#53636c] mb-2">
                  Start Time
                </label>
                <input
                  type="time"
                  name="available_time_start"
                  value={formData.available_time_start}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-[#dce6e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#13805d] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#53636c] mb-2">
                  End Time
                </label>
                <input
                  type="time"
                  name="available_time_end"
                  value={formData.available_time_end}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-[#dce6e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#13805d] focus:border-transparent"
                />
              </div>

            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-[#e7efeb]">
            <button
              type="button"
              onClick={() => navigate('/doctors')}
              className="px-4 py-2 text-[#53636c] hover:bg-[#f4f7f4] rounded-lg transition-colors"
            >
              Cancel
            </button>
            <Button type="submit" disabled={loading} icon={Save}>
              {loading ? 'Updating...' : 'Update Doctor'}
            </Button>
          </div>

        </form>

      </div>
    </Layout>
  );
};

export default EditDoctorPage;
