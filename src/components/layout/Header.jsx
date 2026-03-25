import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  Settings, 
  Moon, 
  Sun,
  Menu,
  ChevronDown,
  Dot
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { clsx } from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';

export const Header = ({ onMenuClick }) => {
  const { notifications, markNotificationRead, darkTheme, setDarkTheme } = useAppContext();
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 h-20 bg-white/70 backdrop-blur-md border-b border-gray-100 z-30 transition-all duration-300 px-8 flex items-center justify-between">
      {/* Page Title */}
      <div className="flex items-center gap-6 flex-1">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2.5 text-gray-500 hover:bg-gray-100 rounded-xl transition-all"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <h2 className="text-xl font-bold text-gray-900 tracking-tight uppercase">Dashboard</h2>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative mr-4">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all relative group hover:scale-110 active:scale-90"
          >
            <Bell className="w-6 h-6 stroke-[1.5]" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowNotifications(false)} 
                />
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-4 w-96 bg-white rounded-2xl p-0 z-50 overflow-hidden shadow-2xl border border-gray-100/50"
                >
                  <div className="p-4 border-b border-gray-50 flex items-center justify-between">
                    <h3 className="font-bold text-gray-900">Notifications</h3>
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">{unreadCount} New</span>
                  </div>
                  <div className="max-h-[70vh] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-gray-500">No notifications</div>
                    ) : (
                      notifications.map(n => (
                        <div 
                          key={n.id} 
                          className={clsx(
                            "p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer relative group",
                            !n.read && "bg-blue-50/20"
                          )}
                          onClick={() => {
                            if (!n.read) markNotificationRead(n.id);
                          }}
                        >
                          <h4 className="font-bold text-sm text-gray-900 mb-0.5">{n.title}</h4>
                          <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">{n.message}</p>
                          <span className="text-[10px] text-gray-400 font-medium mt-2 block uppercase tracking-wider">{n.time}</span>
                        </div>
                      ))
                    )}
                  </div>
                  <button className="w-full py-3 text-xs font-bold text-blue-600 hover:bg-blue-50 transition-colors border-t border-gray-50 uppercase tracking-widest">
                    View All Activity
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <div className="flex items-center gap-4 group cursor-pointer py-1.5 px-3 rounded-2xl transition-all">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-xs shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform duration-300">
            AD
          </div>
          <div className="text-left hidden md:block">
            <p className="text-sm font-bold text-gray-900 leading-none">Apollo Diagnostics</p>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">Provider Admin</p>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400 ml-1" />
        </div>
      </div>
    </header>
  );
};
