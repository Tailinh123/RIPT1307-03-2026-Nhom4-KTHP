import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import StudentLayout from '@/layouts/StudentLayout';
import CompanyDashboard from '@/pages/student/profile/CompanyDashboard';
import ManageJobs from '@/pages/student/profile/ManageJobs';
import ApplicationsReview from '@/pages/student/profile/ApplicationsReview';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Student section — wraps all pages in StudentLayout */}
      <Route element={<StudentLayout />}>
        <Route index element={<Navigate to="/profile/company-dashboard" replace />} />
        <Route path="/profile" element={<Navigate to="/profile/company-dashboard" replace />} />
        <Route path="/profile/company-dashboard" element={<CompanyDashboard />} />
        <Route path="/profile/manage-jobs" element={<ManageJobs />} />
        <Route path="/profile/applications-review" element={<ApplicationsReview />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/profile/company-dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
