import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Home, Users, Calendar, UserPlus, CalendarPlus, Stethoscope, 
  UserCog, LogOut, Menu, X, ChevronRight, Building2, Bed, Receipt, FileText, CalendarCheck, ChevronDown,
  Activity, BarChart3, UserCheck
} from 'lucide-react';
import BrandMark from './BrandMark';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef(null);

  useEffect(() => {
    const closeAccountMenu = (event) => {
      if (accountRef.current && !accountRef.current.contains(event.target)) setAccountOpen(false);
    };
    document.addEventListener('mousedown', closeAccountMenu);
    return () => document.removeEventListener('mousedown', closeAccountMenu);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Navigation items based on role
  const getNavigationItems = () => {
    const baseItems = [
      { name: 'Dashboard', path: '/dashboard', icon: Home, roles: ['Admin', 'Receptionist', 'Doctor'] },
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
        { name: 'Doctors', path: '/doctors', icon: UserCheck, roles: ['Admin'] },
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
            <BrandMark />
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

            <div className="relative" ref={accountRef}>
              <button
                type="button"
                aria-expanded={accountOpen}
                aria-haspopup="menu"
                aria-label="Open account menu"
                onClick={() => setAccountOpen(!accountOpen)}
                className="flex items-center gap-3 rounded-lg p-1.5 pr-2 hover:bg-[#f4f7f4] focus:outline-none focus:ring-2 focus:ring-[#20b486]/30"
              >
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-bold text-[#18232c]">{user?.full_name}</p>
                  <p className="text-xs text-[#6b7b83]">{user?.role}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e3f7ef]">
                  <UserCog size={20} className="text-[#13805d]" />
                </div>
                <ChevronDown size={16} className="text-[#82928c]" />
              </button>
              {accountOpen && (
                <div role="menu" className="absolute right-0 top-14 z-50 w-56 rounded-xl border border-[#dce6e1] bg-white p-2 shadow-lg">
                  <div className="border-b border-[#e7efeb] px-3 py-2">
                    <p className="text-sm font-bold text-[#18232c]">{user?.full_name}</p>
                    <p className="text-xs text-[#6b7b83]">{user?.role}</p>
                  </div>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
                    className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-[#c05b48] hover:bg-[#ffebe7]"
                  >
                    <LogOut size={17} />
                    Sign out
                  </button>
                </div>
              )}
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
