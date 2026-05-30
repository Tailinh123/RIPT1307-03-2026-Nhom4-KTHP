import React, { useEffect, useState } from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import HeaderBar from '@/components/layout/HeaderBar';
import LoginPage from '@/pages/student/profile/LoginPage';
import RegisterPage from '@/pages/student/profile/RegisterPage';

const { Content } = Layout;

const StudentLayout: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(Boolean(localStorage.getItem('access_token')));
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const handler = () => setIsAuthenticated(Boolean(localStorage.getItem('access_token')));
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <HeaderBar />
      
      <Layout style={{ marginTop: 64 }}> 
        <Content style={{ padding: '0px', width: '100%' }}>
          <Outlet />
        </Content>
      </Layout>
      {!isAuthenticated && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 3000, background: 'rgba(0,0,0,0.32)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {showRegister ? (
            <RegisterPage onSuccess={() => setShowRegister(false)} />
          ) : (
            <LoginPage onSuccess={() => setIsAuthenticated(true)} onRegister={() => setShowRegister(true)} />
          )}
        </div>
      )}
    </Layout>
  );
};

export default StudentLayout;