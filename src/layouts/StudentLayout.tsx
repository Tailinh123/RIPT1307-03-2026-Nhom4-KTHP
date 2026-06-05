import React from 'react';
import { Layout } from 'antd';
import { Outlet, useLocation } from 'react-router-dom';
import HeaderBar from '@/components/layout/HeaderBar';
import Footer from '@/components/layout/Footer';
const { Content } = Layout;
const StudentLayout: React.FC = () => {
  const location = useLocation();
  const hideFooter = location.pathname.startsWith('/profile');

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <HeaderBar />
      <Layout style={{ marginTop: 64, minHeight: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
        <Content style={{ padding: '0px', width: '100%', flex: 1, minHeight: 'calc(100vh - 20px)' }}>
          <Outlet />
        </Content>
        {!hideFooter && <Footer />}
      </Layout>
    </Layout>
  );
};
export default StudentLayout;
