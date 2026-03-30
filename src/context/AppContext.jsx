import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { MOCK_APPOINTMENTS, MOCK_FINANCIALS, MOCK_RFQS, MOCK_SUPPORT, MOCK_FACILITY, MOCK_NOTIFICATIONS, MOCK_PROFILE } from '../data/mockData';
import { RAW_APPOINTMENTS } from '../data/realAppointments';
import { toast } from 'sonner';
import { parse } from 'date-fns';

const AppContext = createContext();
const APPOINTMENTS_STORAGE_KEY = 'appointments_v6';

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const normalizeVendorStatus = (status = 'NEW') => status.trim().toUpperCase();

  const mapVendorStatusToStatus = (vendorStatus = 'NEW') =>
    normalizeVendorStatus(vendorStatus).toLowerCase().replace(/\s+/g, '_');

  const mapStatusToVendorStatus = (status = 'new') => {
    const normalizedStatus = status.trim().toLowerCase().replace(/\s+/g, '_');
    const statusMap = {
      new: 'NEW',
      confirmed: 'CONFIRMED',
      rejected: 'REJECTED',
    };

    return statusMap[normalizedStatus] || normalizedStatus.toUpperCase();
  };

  const normalizeAppointment = (appointment) => {
    const normalizedVendorStatus = appointment.vendor_status
      ? normalizeVendorStatus(appointment.vendor_status)
      : mapStatusToVendorStatus(appointment.status);

    return {
      ...appointment,
      status: mapVendorStatusToStatus(normalizedVendorStatus),
      vendor_status: normalizedVendorStatus,
    };
  };
  
  // Helper to map raw data to app schema
  const mapRawToApp = (raw) => {
    // Attempt to parse date/time safely
    let isoDate = new Date().toISOString();
    try {
      if (raw.appointment_date && raw.appointment_time) {
        const dateStr = `${raw.appointment_date} ${raw.appointment_time}`;
        const parsed = parse(dateStr, 'yyyy-MM-dd hh:mm a', new Date());
        isoDate = parsed.toISOString();
      }
    } catch {
      console.warn('Failed to parse date for', raw.appointment_id);
    }

    const ageGender = raw.age_and_gender?.split(',') || ['NA', 'NA'];

    return {
      id: raw.appointment_id || `RAW-${raw.id}`,
      customerName: raw.name,
      phone: raw.mobile_number,
      email: `${raw.name.toLowerCase().replace(/\s+/g, '.')}@patient-ek.com`,
      date: isoDate,
      package: raw.package_name?.[0] || 'Standard Package',
      status: mapVendorStatusToStatus(raw.vendor_status),
      vendor_status: normalizeVendorStatus(raw.vendor_status),
      branch: raw.branch || 'Madhapur, Hyderabad',
      price: 1500 + (Math.random() * 500),
      isSlaBreached: raw.time_since_create_color === 'red',
      age: ageGender[0]?.trim(),
      gender: ageGender[1]?.trim(),
      home_collection: !!raw.home_collection,
      address: raw.home_address,
      tests: raw.appointment_tests,
      timeSinceCreate: raw.time_since_create,
      benefitType: raw.benefit_type,
      auditLog: [
          { action: 'Registration Received', timestamp: raw.registration_date + 'T00:00:00Z', user: 'System' },
          { action: 'Appointment Scheduled', timestamp: isoDate, user: 'System' }
      ]
    };
  };

  // States
  const [appointments, setAppointments] = useState(() => {
    const saved = localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
    if (saved) return JSON.parse(saved).map(normalizeAppointment);
    
    // Mix mock and real data for high fidelity
    const realMapped = RAW_APPOINTMENTS.map(mapRawToApp);
    return [...realMapped, ...MOCK_APPOINTMENTS].map(normalizeAppointment);
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
    localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(appointments));
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
          vendor_status: mapStatusToVendorStatus(newStatus),
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
