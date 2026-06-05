import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import StudentLayout from '@/layouts/StudentLayout';
import AdminLayout from '@/layouts/AdminLayout';
import HrLayout from '@/layouts/HrLayout';
import CompanyDashboard from '@/pages/student/profile/CompanyDashboard';
import ManageJobs from '@/pages/student/profile/ManageJobs';
import ApplicationsReview from '@/pages/student/profile/ApplicationsReview';
import HrProfile from '@/pages/student/profile/HrProfile';
import LoginPage from '@/pages/student/profile/LoginPage';
import RegisterPage from '@/pages/student/profile/RegisterPage';
import JobBoardPage from '@/pages/student/JobBoardPage';
import JobDetailPage from '@/pages/student/JobDetailPage';
import MyApplicationsPage from '@/pages/student/MyApplicationsPage';
import ProfilePage from '@/pages/student/ProfilePage';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminUsersPage from '@/pages/admin/AdminUsersPage';
import AdminCompaniesPage from '@/pages/admin/AdminCompaniesPage';
import AdminJobsPage from '@/pages/admin/AdminJobsPage';
import AdminSkillsPage from '@/pages/admin/AdminSkillsPage';
import AdminResumesPage from '@/pages/admin/AdminResumesPage';
import AdminApplicationsPage from '@/pages/admin/AdminApplicationsPage';
import AdminRolesPage from '@/pages/admin/AdminRolesPage';
import AdminPermissionsPage from '@/pages/admin/AdminPermissionsPage';
import ProtectedRoute from './ProtectedRoute';
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<StudentLayout />}>
        <Route path="/" element={<Navigate to="/jobs" replace />} />
        <Route path="/jobs" element={<JobBoardPage />} />
        <Route path="/jobs/:id" element={<JobDetailPage />} />
        <Route element={<ProtectedRoute allowedRoles={['CANDIDATE']} />}>
          <Route path="/applications" element={<MyApplicationsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>
      <Route element={<ProtectedRoute allowedRoles={['HR_MANAGER']} />}>
        <Route element={<HrLayout />}>
          <Route path="/profile/company-dashboard" element={<CompanyDashboard />} />
          <Route path="/profile/manage-jobs" element={<ManageJobs />} />
          <Route path="/profile/applications-review" element={<ApplicationsReview />} />
          <Route path="/profile/hr-profile" element={<HrProfile />} />
        </Route>
      </Route>
      <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/companies" element={<AdminCompaniesPage />} />
          <Route path="/admin/jobs" element={<AdminJobsPage />} />
          <Route path="/admin/skills" element={<AdminSkillsPage />} />
          <Route path="/admin/resumes" element={<AdminResumesPage />} />
          <Route path="/admin/applications" element={<AdminApplicationsPage />} />
          <Route path="/admin/roles" element={<AdminRolesPage />} />
          <Route path="/admin/permissions" element={<AdminPermissionsPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
export default AppRoutes;
