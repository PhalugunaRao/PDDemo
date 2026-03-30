import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Calendar, 
  FileText, 
  Settings, 
  LogOut,
  ChevronRight,
  ShieldCheck,
  LayoutDashboard,
  Wallet,
  Activity,
  MessageSquare,
  HelpCircle,
  Briefcase,
  Layers,
  Building2,
  X,
  CreditCard,
  Building,
  Home
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { clsx } from 'clsx';
import { Card } from '../ui/Card';

const SidebarLink = ({ to, icon: Icon, label, onClick }) => (
  <NavLink 
    to={to} 
    className={({ isActive }) => clsx(
      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group",
      isActive 
        ? "bg-blue-600 dark:bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none" 
        : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:pl-6"
    )}
    onClick={onClick}
  >
    <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
    <span className="font-semibold text-sm">{label}</span>
  </NavLink>
);

export const Sidebar = ({ isOpen, onClose }) => {
  const { logout } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={clsx(
        "fixed inset-y-0 left-0 w-64 glass-sidebar z-50 flex flex-col transition-transform duration-500 ease-in-out lg:translate-x-0 overflow-y-auto bg-white border-r border-gray-100",
        !isOpen && "-translate-x-full"
      )}>
        {/* Header/Logo */}
        <div className="p-8 pb-4 flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-200">
             <span className="text-white font-black text-xl italic leading-none">e</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-black tracking-tight text-gray-900 leading-none">
              ekincare <span className="text-gray-400 font-medium">PD</span>
            </h1>
          </div>
          <button 
            className="lg:hidden ml-auto p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Label */}
        <div className="px-8 mt-6 mb-2">
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Menu</p>
        </div>

        {/* Navigation */}
        <nav className="px-6 space-y-1.5 flex-1">
          <SidebarLink to="/dashboard" icon={Home} label="Dashboard" onClick={onClose} />
          <SidebarLink to="/appointments" icon={Calendar} label="Appointments" onClick={onClose} />
          <SidebarLink to="/financials" icon={Wallet} label="Financials" onClick={onClose} />
          <SidebarLink to="/rfqs" icon={Briefcase} label="Schemes & RFQs" onClick={onClose} />
          <SidebarLink to="/facility" icon={Building2} label="Facility Management" onClick={onClose} />
          <SidebarLink to="/support" icon={HelpCircle} label="Support & Help" onClick={onClose} />
        </nav>

        {/* Status Card at Bottom */}
        <div className="p-6 mt-auto">
          <Card className="p-4 bg-blue-50 border-none rounded-xl dark:bg-blue-900/20">
             <p className="text-[10px] font-black text-blue-600/50 uppercase tracking-widest mb-2 leading-none">Status</p>
             <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-sm shadow-green-200" />
                <span className="text-sm font-bold text-blue-600 tracking-tight">Accepting Bookings</span>
             </div>
          </Card>
          <button
            onClick={handleLogout}
            className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>
    </>
  );
};
