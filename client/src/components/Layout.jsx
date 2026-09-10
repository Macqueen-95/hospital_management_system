import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Home, Users, Calendar, UserPlus, CalendarPlus, Stethoscope, 
  UserCog, LogOut, Menu, X, ChevronRight 
} from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Navigation items based on role
  const getNavigationItems = () => {
    const baseItems = [
      { name: 'Dashboard', path: '/home', icon: Home, roles: ['Admin', 'Receptionist', 'Doctor'] },
      { name: 'Patients', path: '/patients', icon: Users, roles: ['Admin', 'Receptionist', 'Doctor'] },
    ];

    if (user?.role === 'Admin' || user?.role === 'Receptionist') {
      baseItems.push(
        { name: 'Register Patient', path: '/patients/register', icon: UserPlus, roles: ['Admin', 'Receptionist'] },
        { name: 'Appointments', path: '/appointments', icon: Calendar, roles: ['Admin', 'Receptionist'] },
        { name: 'Book Appointment', path: '/appointments/book', icon: CalendarPlus, roles: ['Admin', 'Receptionist'] },
      );
    }

    if (user?.role === 'Doctor') {
      baseItems.push(
        { name: "Today's Appointments", path: '/appointments/today', icon: Stethoscope, roles: ['Doctor'] },
      );
    }

    return baseItems.filter(item => item.roles.includes(user?.role));
  };

  const navigationItems = getNavigationItems();

  const isActive = (path) => location.pathname === path;

  const NavItem = ({ item, mobile = false }) => {
    const Icon = item.icon;
    const active = isActive(item.path);
    
    return (
      <button
        onClick={() => {
          navigate(item.path);
          if (mobile) setSidebarOpen(false);
        }}
        className={`
          w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
          ${active 
            ? 'bg-blue-50 text-blue-700 font-medium' 
            : 'text-slate-700 hover:bg-slate-50'
          }
        `}
      >
        <Icon size={20} className={active ? 'text-blue-600' : 'text-slate-500'} />
        <span className="text-sm">{item.name}</span>
        {active && <ChevronRight size={16} className="ml-auto" />}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-white border-r border-slate-200 z-50 transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          
          {/* Logo */}
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Stethoscope size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-800">HMS</h1>
                <p className="text-xs text-slate-500">Hospital System</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-1">
              {navigationItems.map((item) => (
                <NavItem key={item.path} item={item} mobile={true} />
              ))}
            </div>
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-slate-200">
            <div className="flex items-center gap-3 mb-3 px-2">
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                <UserCog size={20} className="text-slate-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{user?.full_name}</p>
                <p className="text-xs text-slate-500">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>

        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
          <div className="flex items-center justify-between px-4 py-4 lg:px-8">
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Page Title - Hidden on mobile, shown on desktop */}
            <div className="hidden lg:block">
              <h2 className="text-xl font-semibold text-slate-800">
                {navigationItems.find(item => isActive(item.path))?.name || 'Dashboard'}
              </h2>
            </div>

            {/* User Info - Mobile */}
            <div className="lg:hidden flex items-center gap-2">
              <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                <UserCog size={16} className="text-slate-600" />
              </div>
            </div>

            {/* User Info - Desktop */}
            <div className="hidden lg:flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-800">{user?.full_name}</p>
                <p className="text-xs text-slate-500">{user?.role}</p>
              </div>
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                <UserCog size={20} className="text-slate-600" />
              </div>
            </div>

          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">
          {children}
        </main>

      </div>
    </div>
  );
};

export default Layout;
