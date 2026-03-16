import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Users, 
  Store, 
  BarChart3, 
  Bell, 
  Search,
  Menu,
  X,
  ChevronRight,
  UserCheck,
  Settings,
  Wallet,
  Receipt,
  UserCog,
  TrendingUp,
  History,
  LogOut,
  Box,
  UserPlus,
  FileText,
  Package
} from 'lucide-react';
import { cn } from '../utils/cn';
import { useAuth } from '../context/AuthContext';

interface SidebarItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon: Icon, label, active, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
      active 
        ? "bg-red-600 text-white shadow-lg shadow-red-100" 
        : "text-slate-600 hover:bg-slate-50 hover:text-red-600"
    )}
  >
    <Icon size={20} className={cn(active ? "text-white" : "text-slate-400 group-hover:text-red-600")} />
    <span className="font-medium">{label}</span>
    {active && <ChevronRight size={16} className="ml-auto" />}
  </Link>
);

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavClick = () => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const menuItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/add-connection', icon: PlusCircle, label: 'Add Connection' },
    { to: '/all-connections', icon: Users, label: 'All Connections' },
    { to: '/engineers', icon: UserCheck, label: 'Engineers' },
    { to: '/retailers', icon: Store, label: 'Retailers' },
    { to: '/reports', icon: BarChart3, label: 'Reports' },
    { to: '/settings', icon: Settings, label: 'Commission Settings' },
  ];

  const financeItems = [
    { to: '/finance/settlements', icon: Wallet, label: 'Monthly Settlements' },
    { to: '/finance/engineer-payouts', icon: UserCog, label: 'Engineer Payouts' },
    { to: '/finance/retailer-payouts', icon: Store, label: 'Retailer Payouts' },
    { to: '/finance/payment-history', icon: History, label: 'Payment History' },
    { to: '/finance/profit-report', icon: TrendingUp, label: 'Profit Report' },
  ];

  const inventoryItems = [
    { to: '/inventory/cable-stock', icon: Box, label: 'Cable Stock' },
    { to: '/inventory/cable-allocation', icon: UserPlus, label: 'Engineer Allocation' },
    { to: '/inventory/usage-report', icon: FileText, label: 'Usage Report' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ 
          width: isSidebarOpen ? 256 : 0,
          opacity: isSidebarOpen || !isMobile ? 1 : 0,
          x: isSidebarOpen ? 0 : (isMobile ? -256 : 0)
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 120 }}
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200 lg:relative overflow-hidden shadow-2xl lg:shadow-none h-full",
          !isSidebarOpen && isMobile ? "pointer-events-none" : ""
        )}
      >
        <div className="w-64 h-full flex flex-col p-6">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-red-100 shrink-0">
                D
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-slate-800 leading-tight">Deshbondhu</span>
                <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">AirFiber Manager</span>
              </div>
            </div>
            {isMobile && (
              <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-slate-400 hover:text-red-600 rounded-lg">
                <X size={20} />
              </button>
            )}
          </div>

          <nav className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4">Main Menu</span>
              {menuItems.map((item) => (
                <SidebarItem
                  key={item.to}
                  to={item.to}
                  icon={item.icon}
                  label={item.label}
                  active={location.pathname === item.to}
                  onClick={handleNavClick}
                />
              ))}
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4">Finance</span>
              {financeItems.map((item) => (
                <SidebarItem
                  key={item.to}
                  to={item.to}
                  icon={item.icon}
                  label={item.label}
                  active={location.pathname === item.to}
                  onClick={handleNavClick}
                />
              ))}
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4">Inventory</span>
              {inventoryItems.map((item) => (
                <SidebarItem
                  key={item.to}
                  to={item.to}
                  icon={item.icon}
                  label={item.label}
                  active={location.pathname === item.to}
                  onClick={handleNavClick}
                />
              ))}
            </div>
          </nav>

          <div className="mt-auto pt-6 border-t border-slate-100">
            <div className="bg-slate-50 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-600/10 flex items-center justify-center text-red-600 font-bold border border-red-100 shrink-0">
                {user?.name.split(' ').map(n => n[0]).join('') || 'AD'}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-semibold text-slate-800 truncate">{user?.name || 'Admin User'}</span>
                <span className="text-xs text-slate-500 truncate">{user?.email || 'admin@deshbondhu.com'}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50 h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 sticky top-0 z-40 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-50 rounded-lg text-slate-500 hover:text-red-600 transition-colors"
            >
              <Menu size={20} />
            </button>
            <div className="relative hidden md:block">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-red-600 w-64 transition-all outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button className="p-2 hover:bg-slate-50 rounded-lg relative text-slate-500">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-200 mx-1"></div>
            <div className="flex items-center gap-2 md:gap-3">
              <div className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-1 rounded-lg transition-colors group">
                <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden border border-slate-100 shrink-0">
                  <img src={`https://picsum.photos/seed/${user?.email || 'admin'}/100/100`} alt="Avatar" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </div>
                <span className="text-sm font-medium text-slate-700 hidden sm:block">{user?.name.split(' ')[0] || 'Admin'}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && isMobile && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
