import React, { useEffect, useState } from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import HeaderBar from '@/components/layout/HeaderBar';
import LoginPage from '@/pages/student/profile/LoginPage';

const { Content } = Layout;

const StudentLayout: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(Boolean(localStorage.getItem('access_token')));

  useEffect(() => {
    const handler = () => setIsAuthenticated(Boolean(localStorage.getItem('access_token')));
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Giữ lại duy nhất Header trên cùng */}
      <HeaderBar />
      
      <Layout style={{ marginTop: 64 }}> 
        {/* ĐÃ XÓA <Sidebar /> tại đây */}
        
        {/* NỘI DUNG CHÍNH: Xóa bỏ hoàn toàn marginLeft: 220 hoặc paddingLeft: 220 */}
        <Content style={{ padding: '0px', width: '100%' }}>
          <Outlet />
        </Content>
      </Layout>

      {/* Nếu chưa đăng nhập: hiển thị overlay login trên cùng giao diện */}
      {!isAuthenticated && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 3000, background: 'rgba(0,0,0,0.32)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <LoginPage onSuccess={() => setIsAuthenticated(true)} />
        </div>
      )}
    </Layout>
  );
};

export default StudentLayout;