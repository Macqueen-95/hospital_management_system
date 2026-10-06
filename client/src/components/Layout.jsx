import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Home, Users, Calendar, UserPlus, CalendarPlus, Stethoscope, 
  UserCog, LogOut, Menu, X, ChevronRight, Building2, Bed, Receipt, FileText, CalendarCheck,
  Activity, BarChart3
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
        { name: 'Rooms', path: '/rooms', icon: Building2, roles: ['Admin', 'Receptionist'] },
        { name: 'Admissions', path: '/admissions', icon: Bed, roles: ['Admin', 'Receptionist'] },
        { name: 'Billing', path: '/bills', icon: Receipt, roles: ['Admin', 'Receptionist'] },
        { name: 'Discharges', path: '/discharges', icon: FileText, roles: ['Admin', 'Receptionist'] },
        { name: 'Follow-ups', path: '/followups', icon: CalendarCheck, roles: ['Admin', 'Receptionist'] },
      );
    }

    if (user?.role === 'Admin') {
      baseItems.push(
        { name: 'Activity Logs', path: '/activity-logs', icon: Activity, roles: ['Admin'] },
        { name: 'Reports', path: '/reports', icon: BarChart3, roles: ['Admin'] },
      );
    }

    if (user?.role === 'Doctor') {
      baseItems.push(
        { name: "Today's Appointments", path: '/appointments/today', icon: Stethoscope, roles: ['Doctor'] },
        { name: 'Rooms', path: '/rooms', icon: Building2, roles: ['Doctor'] },
        { name: 'Admissions', path: '/admissions', icon: Bed, roles: ['Doctor'] },
        { name: 'Discharges', path: '/discharges', icon: FileText, roles: ['Doctor'] },
        { name: 'Follow-ups', path: '/followups', icon: CalendarCheck, roles: ['Doctor'] },
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
            ? 'bg-[#e3f7ef] text-[#13805d] font-semibold' 
            : 'text-[#53636c] hover:bg-[#f4f7f4] hover:text-[#18232c]'
          }
        `}
      >
        <Icon size={19} className={active ? 'text-[#13805d]' : 'text-[#82928c]'} />
        <span className="text-sm">{item.name}</span>
        {active && <ChevronRight size={16} className="ml-auto" />}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-[#f4f7f4]">
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-[#18232c]/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-white border-r border-[#dce6e1] z-50 transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          
          {/* Logo */}
          <div className="p-6 border-b border-[#e7efeb]">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-[#e3f7ef] rounded-xl flex items-center justify-center">
                <Stethoscope size={23} className="text-[#13805d]" />
              </div>
              <div>
                <h1 className="text-lg font-extrabold tracking-tight text-[#18232c]">HMS</h1>
                <p className="text-[0.65rem] uppercase tracking-[0.14em] text-[#82928c]">Care operations</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <p className="px-4 mb-3 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-[#82928c]">Workspace</p>
            <div className="space-y-1">
              {navigationItems.map((item) => (
                <NavItem key={item.path} item={item} mobile={true} />
              ))}
            </div>
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-[#e7efeb]">
            <div className="flex items-center gap-3 mb-3 px-2">
              <div className="w-10 h-10 bg-[#f0f5f2] rounded-full flex items-center justify-center">
                <UserCog size={19} className="text-[#53636c]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#18232c] truncate">{user?.full_name}</p>
                <p className="text-xs text-[#82928c]">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-[#c05b48] hover:bg-[#ffebe7] rounded-lg transition-colors"
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
        <header className="sticky top-0 z-30 bg-white border-b border-[#dce6e1]">
          <div className="flex items-center justify-between px-4 py-4 lg:px-8">
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-white rounded-xl transition-colors"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Page Title - Hidden on mobile, shown on desktop */}
            <div className="hidden lg:block">
              <h2 className="text-xl font-extrabold tracking-[-0.03em] text-[#18232c]">
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
                <p className="text-sm font-bold text-[#18232c]">{user?.full_name}</p>
                <p className="text-xs text-[#6b7b83]">{user?.role}</p>
              </div>
              <div className="w-10 h-10 bg-white border border-[#dce6e1] rounded-full flex items-center justify-center">
                <UserCog size={20} className="text-[#53636c]" />
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
