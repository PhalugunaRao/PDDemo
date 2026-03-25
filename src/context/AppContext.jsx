import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { MOCK_APPOINTMENTS, MOCK_FINANCIALS, MOCK_RFQS, MOCK_SUPPORT, MOCK_FACILITY, MOCK_NOTIFICATIONS, MOCK_PROFILE } from '../data/mockData';
import { toast } from 'sonner';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  
  // States
  const [appointments, setAppointments] = useState(() => {
    const saved = localStorage.getItem('appointments_v2');
    return saved ? JSON.parse(saved) : MOCK_APPOINTMENTS;
  });
  
  const [financials, setFinancials] = useState(MOCK_FINANCIALS);
  const [rfqs, setRfqs] = useState(MOCK_RFQS);
  const [facility, setFacility] = useState(MOCK_FACILITY);
  const [support, setSupport] = useState(MOCK_SUPPORT);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [profile, setProfile] = useState(MOCK_PROFILE);
  const [darkTheme, setDarkTheme] = useState(false);
  const [role, setRole] = useState('Provider'); // Bonus feature: Provider vs Enterprise

  useEffect(() => {
    localStorage.setItem('appointments_v2', JSON.stringify(appointments));
  }, [appointments]);

  // Auth
  const login = (email, password) => {
    if (email === 'admin@provider.com' && password === 'mediSync@demo2025') {
      setUser({ name: 'Dr. Vikram', role: 'Provider Admin', email: 'vikram.v@provider.com' });
      toast.success('Welcome to MediSync PD');
      return true;
    }
    toast.error('Invalid credentials (use admin@provider.com / password)');
    return false;
  };

  const logout = () => {
    setUser(null);
    toast.info('Logged out safely');
  };

  // Actions
  const updateAppointmentStatus = (id, newStatus, reason = '') => {
    setAppointments(prev => prev.map(apt => {
      if (apt.id === id) {
        return {
          ...apt,
          status: newStatus,
          rejectReason: reason,
          auditLog: [
            ...apt.auditLog,
            { action: `Status changed to ${newStatus}`, timestamp: new Date().toISOString(), user: user?.name || 'Staff' }
          ]
        };
      }
      return apt;
    }));
    toast.success(`APT ${id} updated to ${newStatus}`);
  };

  const uploadReport = (id, file) => {
    setAppointments(prev => prev.map(apt => {
      if (apt.id === id) {
        return {
          ...apt,
          status: 'report_uploaded',
          reports: [...(apt.reports || []), { name: file.name, date: new Date().toISOString() }],
          auditLog: [...apt.auditLog, { action: 'Report Uploaded', timestamp: new Date().toISOString(), user: 'Operator' }]
        };
      }
      return apt;
    }));
    toast.success('Report uploaded successfully');
  };

  const updateFacility = (newData) => {
    setFacility(prev => ({ ...prev, ...newData }));
    toast.success('Facility updated');
  };

  const submitQuote = (rfqId, quoteData) => {
    setRfqs(prev => prev.map(r => r.id === rfqId ? { ...r, status: 'quote_submitted', quote: quoteData } : r));
    toast.success('Quote submitted successfully');
  };

  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const updateProfile = (newData) => {
    setProfile(prev => ({ ...prev, ...newData }));
    toast.success('Profile protocol updated');
  };

  const value = useMemo(() => ({
    user,
    appointments,
    financials,
    rfqs,
    facility,
    support,
    notifications,
    profile,
    darkTheme,
    role,
    login,
    logout,
    updateAppointmentStatus,
    uploadReport,
    updateFacility,
    submitQuote,
    markNotificationRead,
    updateProfile,
    setDarkTheme,
    setRole,
  }), [user, appointments, financials, rfqs, facility, support, notifications, profile, darkTheme, role]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
