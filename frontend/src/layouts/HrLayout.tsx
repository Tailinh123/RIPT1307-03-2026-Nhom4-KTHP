import React, { useMemo, useState } from 'react';
import { Avatar, Button, Dropdown, Layout, Menu, Space, Typography } from 'antd';
import {
  AppstoreOutlined,
  DoubleLeftOutlined,
  DoubleRightOutlined,
  HomeOutlined,
  LogoutOutlined,
  OrderedListOutlined,
  ProfileOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { authApi } from '@/api/authApi';
import logoInternMatch from '@/assets/images/logo-internmatch.png';
import { useAuthImage } from '@/hooks/useAuthImage';
const normalizeAvatarFileName = (value?: string | null) =>
  value && value.includes('/') ? value.substring(value.lastIndexOf('/') + 1) : value || '';
const { Content, Header, Sider } = Layout;
const { Text } = Typography;
const items = [
  { key: '/profile/company-dashboard', icon: <AppstoreOutlined />, label: 'Tổng quan' },
  { key: '/profile/manage-jobs', icon: <OrderedListOutlined />, label: 'Chiến dịch tuyển dụng' },
  { key: '/profile/applications-review', icon: <ProfileOutlined />, label: 'Hồ sơ ứng viên' },
];
const readUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || '{}');
  } catch {
    return {};
  }
};
const HrLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const user = useMemo(() => readUser(), [location.pathname]);
  const displayName = user?.name || user?.email || 'HR Manager';
  const companyName = user?.company?.name || 'Doanh nghiệp';
  const rawAvatarName = user?.avatarUrl;
  const avatarFileName = normalizeAvatarFileName(rawAvatarName);
  const apiAvatarUrl = rawAvatarName
    ? `/api/v1/files?fileName=${encodeURIComponent(avatarFileName || rawAvatarName)}&folder=avatar`
    : undefined;
  const fetchedAvatarUrl = useAuthImage(apiAvatarUrl);
  const activeKey = items.find((item) => location.pathname.startsWith(item.key))?.key || '/profile/company-dashboard';
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
  const dropdownMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Hồ sơ',
    },
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
    },
  ];
  const handleDropdownClick = ({ key }: { key: string }) => {
    if (key === 'profile') {
      navigate('/profile/hr-profile');
    } else if (key === 'home') {
      navigate('/');
    } else if (key === 'logout') {
      handleLogout();
    }
  };
  const ROLE_LABEL_MAP: Record<string, string> = {
    SUPER_ADMIN: 'Quản trị viên',
    HR_MANAGER: 'Quản lý tuyển dụng',
    CANDIDATE: 'Ứng viên',
  };
  const roleName = user?.role?.name || 'HR_MANAGER';
  const roleLabel = ROLE_LABEL_MAP[roleName] || roleName;
  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f6fa' }}>
      <Sider
        className="admin-sidebar"
        width={260}
        breakpoint="lg"
        collapsedWidth="0"
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        style={{
          minHeight: '100vh',
          background: '#ffffff',
          borderRight: '1px solid #eef0f5',
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
            transition: 'padding 0.2s ease',
          }}
        >
          <img
            src={logoInternMatch}
            alt="InternMatching"
            style={{
              height: collapsed ? 36 : 40,
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
              Doanh Nghiệp
            </Text>
          </div>
        )}
        <Menu
          mode="inline"
          theme="light"
          selectedKeys={[activeKey]}
          items={items}
          onClick={({ key }) => navigate(key)}
          style={{ background: 'transparent', borderRight: 'none', padding: '0 8px' }}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            height: 64,
            background: '#fff',
            borderBottom: '1px solid #eef0f5',
            padding: '0 clamp(12px, 3vw, 24px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            lineHeight: 1.2,
          }}
        >
          <Space align="center" size={12}>
            <Button
              type="text"
              icon={collapsed ? <DoubleRightOutlined /> : <DoubleLeftOutlined />}
              onClick={() => setCollapsed((value) => !value)}
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
              <Text strong style={{ display: 'block', color: '#0f172a', fontSize: 15 }}>
                {companyName}
              </Text>
              <Text style={{ color: '#94a3b8', fontSize: 12 }}>Quản lý tuyển dụng và ứng viên</Text>
            </div>
          </Space>
          <Dropdown menu={{ items: dropdownMenuItems, onClick: handleDropdownClick }} trigger={['click']} placement="bottomRight">
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
                src={fetchedAvatarUrl}
                style={{
                  background: fetchedAvatarUrl ? undefined : 'linear-gradient(135deg, #1677ff 0%, #4096ff 100%)',
                  boxShadow: '0 2px 6px rgba(22,119,255,0.25)',
                }}
              >
                {!fetchedAvatarUrl && String(displayName).charAt(0).toUpperCase()}
              </Avatar>
              <div style={{ lineHeight: 1.3 }}>
                <Text strong style={{ display: 'block', color: '#0f172a', fontSize: 13 }}>
                  {displayName}
                </Text>
                <Text style={{ color: '#64748b', fontSize: 12 }}>{roleLabel}</Text>
              </div>
            </div>
          </Dropdown>
        </Header>
        <Content style={{ padding: 'clamp(12px, 3vw, 24px)', overflow: 'auto' }}>
          <div style={{ maxWidth: 1480, margin: '0 auto' }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
export default HrLayout;
