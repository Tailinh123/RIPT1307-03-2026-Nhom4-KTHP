import React from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import HeaderBar from '@/components/layout/HeaderBar';

const { Content } = Layout;

const StudentLayout: React.FC = () => {
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
    </Layout>
  );
};

export default StudentLayout;