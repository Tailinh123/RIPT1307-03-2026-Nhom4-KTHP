import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import StudentLayout from '@/layouts/StudentLayout';
import JobBoardPage from '@/pages/student/JobBoardPage';
import JobDetailPage from '@/pages/student/JobDetailPage';
import ResumeManagementPage from '@/pages/student/ResumeManagementPage';
import MyApplicationsPage from '@/pages/student/MyApplicationsPage';
import ProfilePage from '@/pages/student/ProfilePage';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Student section — wraps all pages in StudentLayout */}
      <Route element={<StudentLayout />}>
        <Route index element={<Navigate to="/jobs" replace />} />
        <Route path="/jobs" element={<JobBoardPage />} />
        <Route path="/jobs/:id" element={<JobDetailPage />} />
        <Route path="/resumes" element={<ResumeManagementPage />} />
        <Route path="/applications" element={<MyApplicationsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/jobs" replace />} />
    </Routes>
  );
};

export default AppRoutes;
