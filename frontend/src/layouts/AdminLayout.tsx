import React, { useState } from 'react';
import { Breadcrumb, Layout } from 'antd';
import { HomeOutlined, RightOutlined } from '@ant-design/icons';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTopbar from '@/components/admin/AdminTopbar';
const { Content } = Layout;
const breadcrumbMap: Record<string, string> = {
  admin: 'Quản trị',
  dashboard: 'Bảng điều khiển',
  users: 'Người dùng',
  companies: 'Công ty',
  jobs: 'Tin tuyển dụng',
  skills: 'Kỹ năng',
  resumes: 'Hồ sơ',
  applications: 'Ứng tuyển',
  roles: 'Vai trò',
  permissions: 'Quyền hạn',
};
const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const pathParts = location.pathname.split('/').filter(Boolean);
  const breadcrumbItems = pathParts.map((part, index) => ({
    title: breadcrumbMap[part] || part,
    key: index,
  }));
  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f6fa' }}>
      <AdminSidebar collapsed={collapsed} onCollapse={setCollapsed} />
      <Layout style={{ background: '#f5f6fa' }}>
        <AdminTopbar collapsed={collapsed} onToggle={() => setCollapsed((value) => !value)} />
        <Content style={{ padding: 'clamp(12px, 2vw, 20px) clamp(16px, 4vw, 28px)', overflow: 'auto' }}>
          <div style={{ maxWidth: 1480, margin: '0 auto' }}>
            <Breadcrumb 
              separator={<RightOutlined style={{ fontSize: 10, color: '#cbd5e1' }} />}
              style={{ marginBottom: 16, fontSize: 14, color: '#64748b' }}
            >
              {breadcrumbItems.map((item, index) => {
                const isLast = index === breadcrumbItems.length - 1;
                return (
                  <Breadcrumb.Item key={item.key}>
                    <span
                      style={{
                        color: isLast ? '#1e293b' : '#64748b',
                        fontWeight: isLast ? 600 : 400,
                      }}
                    >
                      {index === 0 && <HomeOutlined style={{ marginRight: 6 }} />}
                      {item.title}
                    </span>
                  </Breadcrumb.Item>
                );
              })}
            </Breadcrumb>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
export default AdminLayout;
