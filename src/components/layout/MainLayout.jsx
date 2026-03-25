import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAppContext } from '../../context/AppContext';
import { Toaster } from 'sonner';
import { clsx } from 'clsx';

export const MainLayout = () => {
  const { user, darkTheme } = useAppContext();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className={clsx(
      "min-h-screen flex flex-col font-inter selection:bg-blue-500 selection:text-white antialiased transition-colors duration-500",
      darkTheme ? "bg-gray-950 text-gray-50 dark" : "bg-[#F7F9FC] text-gray-900"
    )}>
      <Toaster position="top-right" richColors expand={false} closeButton />
      
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen relative">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        
        <main className="flex-1 pt-24 px-4 sm:px-8 pb-12 w-full max-w-[1600px] mx-auto animate-fade-in relative z-10 transition-all duration-500">
          <Outlet />
        </main>

        {/* Decorative Background Elements */}
        <div className={clsx(
          "fixed top-0 right-0 w-[500px] h-[500px] blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 -z-10 pointer-events-none transition-all duration-1000",
          darkTheme ? "bg-brand-900/20" : "bg-brand-500/5"
        )} />
        <div className={clsx(
          "fixed bottom-0 left-72 w-[500px] h-[500px] blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2 -z-10 pointer-events-none transition-all duration-1000",
          darkTheme ? "bg-brand-900/20" : "bg-brand-500/5"
        )} />
      </div>
    </div>
  );
};
