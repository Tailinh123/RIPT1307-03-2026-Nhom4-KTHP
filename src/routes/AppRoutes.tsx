import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import StudentLayout from '@/layouts/StudentLayout';

import JobBoardPage from '@/pages/student/JobBoardPage';
import JobDetailPage from '@/pages/student/JobDetailPage';
import MyApplicationsPage from '@/pages/student/MyApplicationsPage';
import ProfilePage from '@/pages/student/ProfilePage';
import LoginPage from '@/pages/student/LoginPage';
import RegisterPage from '@/pages/student/RegisterPage';

import ProtectedRoute from './ProtectedRoute';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Auth */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected */}
      <Route
        element={
          <ProtectedRoute>
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/jobs" replace />} />

        <Route path="/jobs" element={<JobBoardPage />} />

        <Route path="/jobs/:id" element={<JobDetailPage />} />

        <Route path="/applications" element={<MyApplicationsPage />} />

        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/jobs" replace />} />
    </Routes>
  );
};

export default AppRoutes;