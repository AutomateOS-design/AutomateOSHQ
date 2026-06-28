import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminPage from './pages/AdminPage';
import AdminLeadsPage from './pages/AdminLeadsPage';
import LeadMagnetPage from './pages/LeadMagnetPage';
import AuditPage from './pages/AuditPage';
import TemplatesPage from './pages/TemplatesPage';
import ClientPortal from './pages/ClientPortal';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/portal" element={<ClientPortal />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/leads" element={<AdminLeadsPage />} />
        <Route path="/lead-magnet" element={<LeadMagnetPage />} />
        <Route path="/audit" element={<AuditPage />} />
        <Route path="/templates" element={<TemplatesPage />} />
      </Routes>
    </Router>
  );
}

export default App;