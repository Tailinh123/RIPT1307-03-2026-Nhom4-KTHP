import React from 'react';
import { Avatar, Button, Dropdown, Layout, Tag, Typography } from 'antd';
import { HomeOutlined, LogoutOutlined, DoubleLeftOutlined, DoubleRightOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/api/authApi';
const { Header } = Layout;
const { Text } = Typography;
interface AdminTopbarProps {
  collapsed: boolean;
  onToggle: () => void;
}
const readUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || '{}');
  } catch {
    return {};
  }
};
const ROLE_LABEL_MAP: Record<string, string> = {
  SUPER_ADMIN: 'Quản trị viên',
  HR_MANAGER: 'Quản lý tuyển dụng',
  CANDIDATE: 'Ứng viên',
};
const AdminTopbar: React.FC<AdminTopbarProps> = ({ collapsed, onToggle }) => {
  const navigate = useNavigate();
  const user = readUser();
  const displayName = user?.name || user?.email || 'Super Admin';
  const roleName = user?.role?.name || 'SUPER_ADMIN';
  const roleLabel = ROLE_LABEL_MAP[roleName] || roleName;
  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      localStorage.removeItem('user_cache_phone');
      navigate('/login', { replace: true });
    }
  };
  const menuItems = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: 'Về trang chủ',
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      danger: true,
    },
  ];
  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === 'home') navigate('/');
    else if (key === 'logout') handleLogout();
  };
  return (
    <Header
      style={{
        height: 64,
        padding: '0 24px',
        background: '#fff',
        borderBottom: '1px solid #eef0f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        lineHeight: 'normal',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Button
          type="text"
          icon={collapsed ? <DoubleRightOutlined /> : <DoubleLeftOutlined />}
          onClick={onToggle}
          style={{
            fontSize: 14,
            width: 36,
            height: 36,
            borderRadius: 8,
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        />
        <div style={{ lineHeight: 1.3 }}>
          <Text strong style={{ color: '#0f172a', fontSize: 15, display: 'block' }}>
            Quản trị hệ thống
          </Text>
          <Text style={{ color: '#94a3b8', fontSize: 12 }}>
            Intern Matching admin workspace
          </Text>
        </div>
      </div>
      <Dropdown menu={{ items: menuItems, onClick: handleMenuClick }} trigger={['click']} placement="bottomRight">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            cursor: 'pointer',
            padding: '6px 12px',
            borderRadius: 10,
            transition: 'background 0.2s',
            border: '1px solid transparent',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#f8fafc';
            e.currentTarget.style.borderColor = '#e2e8f0';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.borderColor = 'transparent';
          }}
        >
          <Avatar
            icon={<UserOutlined />}
            style={{
              background: 'linear-gradient(135deg, #1677ff 0%, #4096ff 100%)',
              boxShadow: '0 2px 6px rgba(22,119,255,0.25)',
            }}
          />
          <div style={{ lineHeight: 1.3 }}>
            <Text strong style={{ display: 'block', color: '#0f172a', fontSize: 13 }}>
              {displayName}
            </Text>
            <Tag
              color={roleName === 'SUPER_ADMIN' ? 'red' : roleName === 'HR_MANAGER' ? 'blue' : 'green'}
              style={{ margin: 0, fontSize: 10, lineHeight: '16px', padding: '0 6px' }}
            >
              {roleLabel}
            </Tag>
          </div>
        </div>
      </Dropdown>
    </Header>
  );
};
export default AdminTopbar;
