import React from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import HeaderBar from '@/components/layout/HeaderBar';

const { Content } = Layout;

const StudentLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const sidebarWidth = collapsed ? 72 : 240;

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f6fa' }}>
      <Sidebar collapsed={collapsed} />

      <Layout style={{ marginLeft: sidebarWidth, transition: 'margin-left 0.2s' }}>
        <HeaderBar
          collapsed={collapsed}
          onToggle={() => setCollapsed((c) => !c)}
          sidebarWidth={sidebarWidth}
        />

        <Content
          style={{
            marginTop: 64,
            padding: '28px 28px',
            minHeight: 'calc(100vh - 64px)',
            background: '#f5f6fa',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default StudentLayout;
