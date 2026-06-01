import React from 'react';
import { Layout, Menu, Typography } from 'antd';
import {
  AppstoreOutlined,
  BankOutlined,
  CheckSquareOutlined,
  FileTextOutlined,
  KeyOutlined,
  ProfileOutlined,
  SafetyCertificateOutlined,
  TagsOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import logoInternMatch from '@/assets/images/logo-internmatch.png';
const { Sider } = Layout;
const { Text } = Typography;
const items = [
  { key: '/admin/dashboard', icon: <AppstoreOutlined />, label: 'Bảng điều khiển' },
  { key: '/admin/users', icon: <TeamOutlined />, label: 'Người dùng' },
  { key: '/admin/companies', icon: <BankOutlined />, label: 'Công ty' },
  { key: '/admin/jobs', icon: <ProfileOutlined />, label: 'Tin tuyển dụng' },
  { key: '/admin/skills', icon: <TagsOutlined />, label: 'Kỹ năng' },
  { key: '/admin/resumes', icon: <FileTextOutlined />, label: 'Hồ sơ' },
  { key: '/admin/applications', icon: <CheckSquareOutlined />, label: 'Ứng tuyển' },
  { key: '/admin/roles', icon: <SafetyCertificateOutlined />, label: 'Vai trò' },
  { key: '/admin/permissions', icon: <KeyOutlined />, label: 'Quyền hạn' },
];
interface AdminSidebarProps {
  collapsed: boolean;
  onCollapse?: (collapsed: boolean) => void;
}
const AdminSidebar: React.FC<AdminSidebarProps> = ({ collapsed, onCollapse }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const activeKey = items.find((item) => location.pathname.startsWith(item.key))?.key || '/admin/dashboard';
  return (
    <Sider
      className="admin-sidebar"
      width={260}
      collapsedWidth={0}
      collapsed={collapsed}
      breakpoint="lg"
      onBreakpoint={(broken) => onCollapse?.(broken)}
      style={{
        minHeight: '100vh',
        background: '#ffffff',
        borderRight: '1px solid #eef0f5',
        overflow: 'auto',
      }}
    >
      <div
        style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          padding: collapsed ? '0 12px' : '0 20px',
          borderBottom: '1px solid #eef0f5',
          gap: 10,
          cursor: 'pointer',
          transition: 'padding 0.2s ease',
        }}
        onClick={() => navigate('/admin/dashboard')}
      >
        <img
          src={logoInternMatch}
          alt="InternMatch"
          style={{
            height: collapsed ? 44 : 56,
            width: 'auto',
            maxWidth: collapsed ? 50 : 180,
            objectFit: 'contain',
            transition: 'all 0.3s ease',
            flexShrink: 0,
          }}
        />
      </div>
      {!collapsed && (
        <div style={{ padding: '20px 20px 8px', marginBottom: 0 }}>
          <Text style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
            Quản lý
          </Text>
        </div>
      )}
      <Menu
        mode="inline"
        theme="light"
        selectedKeys={[activeKey]}
        items={items}
        onClick={({ key }) => navigate(key)}
        style={{
          background: 'transparent',
          borderRight: 'none',
          padding: '0 8px',
        }}
      />
      {!collapsed && (
        <div style={{ padding: '16px 20px', position: 'absolute', bottom: 0, width: '100%', borderTop: '1px solid #eef0f5' }}>
          <Text style={{ color: '#cbd5e1', fontSize: 11 }}>Admin Console v1.0</Text>
        </div>
      )}
    </Sider>
  );
};
export default AdminSidebar;
