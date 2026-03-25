import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { MainLayout } from './components/layout/MainLayout';
import { LoginPage } from './pages/LoginPage';
import { DashboardHome } from './pages/DashboardHome';
import { AppointmentsPage } from './pages/AppointmentsPage';
import { KanbanPendency } from './pages/KanbanPendency';
import { FinancialsPage } from './pages/FinancialsPage';
import { RFQBoard } from './pages/RFQBoard';
import { PerformanceAnalytics } from './pages/PerformanceAnalytics';
import { FacilityManagement } from './pages/FacilityManagement';
import { SupportCenter } from './pages/SupportCenter';
import { ProfilePage } from './pages/ProfilePage';
import { ReportsPage } from './pages/ReportsPage';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<DashboardHome />} />
            <Route path="/pendency" element={<KanbanPendency />} />
            <Route path="/appointments" element={<AppointmentsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/financials" element={<FinancialsPage />} />
            <Route path="/rfqs" element={<RFQBoard />} />
            <Route path="/facility" element={<FacilityManagement />} />
            <Route path="/performance" element={<PerformanceAnalytics />} />
            <Route path="/support" element={<SupportCenter />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
