import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as loginAPI } from '../utils/api';
import { Stethoscope, Hospital } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';
import Alert from '../components/Alert';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await loginAPI(username, password);
      login(response.token, response.user);
      navigate('/home');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7f4] flex">
      
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-[47%] bg-[#e3f7ef] p-14 items-center justify-center">
        <div className="max-w-md text-[#18232c]">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 bg-[#20b486] rounded-2xl flex items-center justify-center">
              <Stethoscope size={30} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">HMS</h1>
              <p className="text-[#13805d] text-xs uppercase tracking-[0.16em]">Care operations</p>
            </div>
          </div>
          <h2 className="text-4xl font-extrabold tracking-[-0.045em] mb-5 leading-[1.1]">
            A clearer way to manage care.
          </h2>
          <p className="text-[#53636c] text-base leading-7">
            Keep patient records, schedules, and consultations organized in one focused place.
          </p>
          <div className="mt-12 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                <Hospital size={20} className="text-[#13805d]" />
              </div>
              <div>
                <p className="font-medium">Patient Management</p>
                <p className="text-sm text-[#53636c]">Complete patient records & history</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                <Stethoscope size={20} className="text-[#13805d]" />
              </div>
              <div>
                <p className="font-medium">Clinical Workflow</p>
                <p className="text-sm text-[#53636c]">Appointments & consultations</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-[53%] flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-[#20b486] rounded-2xl flex items-center justify-center">
              <Stethoscope size={24} className="text-[#10251e]" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-[#18232c]">HMS</h1>
              <p className="text-xs uppercase tracking-[0.12em] text-[#6b7b83]">Care operations</p>
            </div>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-2xl border border-[#dce6e1] shadow-[0_12px_35px_rgba(24,35,44,0.07)] p-8 sm:p-10">
            
            <div className="mb-8">
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#13805d] mb-3">Secure sign in</p>
              <h2 className="text-3xl font-extrabold tracking-[-0.04em] text-[#18232c] mb-2">Welcome back</h2>
              <p className="text-[#6b7b83]">Sign in to access your workspace.</p>
            </div>

            {error && (
              <div className="mb-6">
                <Alert type="error">{error}</Alert>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              
              <Input
                label="Username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                disabled={loading}
              />

              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={loading}
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                className="w-full"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>

            </form>

          </div>

          {/* Footer Note */}
          <p className="text-center text-sm text-[#8a9a94] mt-6">
            Protected access for care teams
          </p>

        </div>
      </div>

    </div>
  );
};

export default LoginPage;
