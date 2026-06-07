import React, { useEffect, useState } from 'react';
import { Avatar, Button, Divider, Drawer, Space, Typography, Dropdown } from 'antd';
import {
  AppstoreOutlined,
  BellOutlined,
  CloseOutlined,
  LogoutOutlined,
  MenuOutlined,
  OrderedListOutlined,
  ProfileOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosClient from '@/api/axiosClient';
import { useAuthImage } from '@/hooks/useAuthImage';
import logoInternMatch from '@/assets/images/logo-internmatch.png';
const { Text } = Typography;
const HR_NAV_ITEMS = [
  { key: '/profile/company-dashboard', icon: <AppstoreOutlined />, label: 'Tổng quan', desc: 'Thống kê công ty' },
  { key: '/profile/manage-jobs', icon: <OrderedListOutlined />, label: 'Chiến dịch tuyển dụng', desc: 'Quản lý tin đăng' },
  { key: '/profile/applications-review', icon: <ProfileOutlined />, label: 'Hồ sơ ứng viên', desc: 'Duyệt CV' },
  { key: '/profile/hr-profile', icon: <UserOutlined />, label: 'Hồ sơ', desc: 'Cài đặt công ty' },
];
const STUDENT_NAV_ITEMS = [
  { key: '/jobs', icon: <AppstoreOutlined />, label: 'Việc làm', desc: 'Tìm cơ hội thực tập' },
  { key: '/applications', icon: <OrderedListOutlined />, label: 'Lịch sử', desc: 'Theo dõi ứng tuyển' },
  { key: '/profile', icon: <UserOutlined />, label: 'Hồ sơ', desc: 'Thông tin cá nhân' },
];
const ADMIN_NAV_ITEMS = [
  { key: '/admin/dashboard', icon: <AppstoreOutlined />, label: 'Tổng quan', desc: 'Thống kê hệ thống' },
  { key: '/admin/users', icon: <TeamOutlined />, label: 'Tài khoản', desc: 'Quản trị người dùng' },
  { key: '/admin/jobs', icon: <OrderedListOutlined />, label: 'Tin tuyển dụng', desc: 'Quản lý việc làm' },
];
const getHomePath = (role: string) => {
  if (role === 'SUPER_ADMIN') return '/admin/dashboard';
  if (role === 'HR_MANAGER') return '/profile/company-dashboard';
  return '/jobs';
};
const HeaderBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(localStorage.getItem('access_token')));
  const [displayName, setDisplayName] = useState('Khách');
  const [displayEmail, setDisplayEmail] = useState('');
  const [avatarLetter, setAvatarLetter] = useState('U');
  const [rawAvatarUrl, setRawAvatarUrl] = useState<string | undefined>(undefined);
  const [userRole, setUserRole] = useState('CANDIDATE');
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userStr = localStorage.getItem('user');
    setIsLoggedIn(Boolean(token));
    if (!token || !userStr) {
      setDisplayName('Khách');
      setDisplayEmail('');
      setAvatarLetter('U');
      setRawAvatarUrl(undefined);
      setUserRole('CANDIDATE');
      return;
    }
    try {
      const user = JSON.parse(userStr);
      const name = user.name || user.fullName || user.email || 'User';
      setDisplayName(name);
      setDisplayEmail(user.email || '');
      setAvatarLetter(name.charAt(0).toUpperCase() || 'U');
      setUserRole(user?.role?.name || 'CANDIDATE');
      if (user.avatarUrl) {
        const fileNameOnly = user.avatarUrl.replace(/^storage\//, "");
        setRawAvatarUrl(`/api/v1/files?fileName=${encodeURIComponent(fileNameOnly)}&folder=avatar`);
      } else {
        setRawAvatarUrl(undefined);
      }
    } catch {
      setDisplayName('User');
      setDisplayEmail('');
      setAvatarLetter('U');
      setRawAvatarUrl(undefined);
      setUserRole('CANDIDATE');
    }
  }, [location.pathname]);
  useEffect(() => {
    const syncFromStorage = () => {
      const userStr = localStorage.getItem('user');
      if (!userStr) return;
      try {
        const user = JSON.parse(userStr);
        const name = user.name || user.fullName || user.email || 'User';
        setDisplayName(name);
        setDisplayEmail(user.email || '');
        setAvatarLetter(name.charAt(0).toUpperCase() || 'U');
        setUserRole(user?.role?.name || 'CANDIDATE');
        if (user.avatarUrl) {
          const fileNameOnly = user.avatarUrl.replace(/^storage\//, "");
          setRawAvatarUrl(`/api/v1/files?fileName=${encodeURIComponent(fileNameOnly)}&folder=avatar`);
        } else {
          setRawAvatarUrl(undefined);
        }
      } catch {
      }
    };
    window.addEventListener('profile-updated', syncFromStorage);
    return () => window.removeEventListener('profile-updated', syncFromStorage);
  }, []);
  const avatarSrc = useAuthImage(rawAvatarUrl);
  const navItems = userRole === 'SUPER_ADMIN' ? ADMIN_NAV_ITEMS : userRole === 'CANDIDATE' ? STUDENT_NAV_ITEMS : HR_NAV_ITEMS;
  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await axiosClient.post('/api/v1/auth/logout');
    } catch {
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      localStorage.removeItem('user_cache_phone');
      setDropdownOpen(false);
      setLoggingOut(false);
      navigate('/login', { replace: true });
    }
  };
  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 99,
          height: 64,
          padding: '0 clamp(16px, 4vw, 32px)',
          background: '#ffffff',
          borderBottom: '1px solid #eef0f5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 4px rgba(0,21,41,.06)',
          gap: 'clamp(8px, 2vw, 24px)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => navigate(getHomePath(userRole))}>
          <img
            src={logoInternMatch}
            alt="InternMatching"
            style={{
              height: 60,
              width: 'auto',
              objectFit: 'contain',
            }}
          />
        </div>
        {isLoggedIn && (
          <nav className="header-nav" style={{ display: 'flex', alignItems: 'center', flex: 1, height: '100%', marginLeft: 'clamp(16px, 3vw, 40px)' }}>
            {navItems.map((item) => {
              const isActive = location.pathname === item.key || (item.key === '/jobs' && location.pathname.startsWith('/jobs'));
              return (
                <div
                  key={item.key}
                  className={`nav-item-modern ${isActive ? 'active' : ''}`}
                  onClick={() => navigate(item.key)}
                >
                  <span style={{ fontSize: 16, lineHeight: 0, marginTop: '-2px' }}>{item.icon}</span>
                  {item.label}
                </div>
              );
            })}
          </nav>
        )}
        <Space size={12}>
          {isLoggedIn && (
            <Button
              type="text"
              className="mobile-menu-btn"
              icon={<MenuOutlined />}
              onClick={() => setDrawerOpen(true)}
              style={{ display: 'none', fontSize: 18, width: 40, height: 40 }}
            />
          )}
          {!isLoggedIn ? (
            <>
              <Button onClick={() => navigate('/login')}>Đăng nhập</Button>
              <Button type="primary" onClick={() => navigate('/register')}>Đăng ký</Button>
            </>
          ) : (
            <>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#6b7280',
                  position: 'relative',
                }}
              >
                <BellOutlined style={{ fontSize: 18 }} />
                <div style={{ position: 'absolute', top: 7, right: 7, width: 8, height: 8, borderRadius: '50%', background: '#ff4d4f', border: '2px solid #fff' }} />
              </div>
              <Dropdown 
                overlayClassName="custom-user-dropdown"
                dropdownRender={(menu) => (
                  <div style={{
                    background: '#ffffff',
                    borderRadius: 16,
                    boxShadow: '0 12px 48px -12px rgba(0,0,0,0.15), 0 0 2px rgba(0,0,0,0.08)',
                    padding: 8,
                    width: 280,
                    animation: 'dropdownIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}>
                    <div style={{ padding: '12px 16px 16px', display: 'flex', alignItems: 'center', gap: 14, borderBottom: '1px solid #f3f4f6', marginBottom: 8 }}>
                      <Avatar size={48} src={avatarSrc} style={{ background: avatarSrc ? undefined : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', flexShrink: 0, fontWeight: 700, fontSize: 18 }}>
                        {!avatarSrc && avatarLetter}
                      </Avatar>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: 16, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 2 }}>{displayName}</div>
                        <div style={{ fontSize: 13, color: '#6b7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{displayEmail}</div>
                      </div>
                    </div>
                    {React.cloneElement(menu as React.ReactElement<any>, { style: { boxShadow: 'none', padding: 0, background: 'transparent' } })}
                  </div>
                )}
                menu={{ 
                  items: [
                    ...navItems.filter(item => item.key.includes('profile')).map(item => ({
                      key: item.key,
                      icon: item.icon,
                      label: item.label,
                      style: { padding: '12px 16px', borderRadius: 8, fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 4 }
                    })),
                    ...navItems.filter(item => !item.key.includes('profile')).map(item => ({
                      key: item.key,
                      icon: item.icon,
                      label: item.label,
                      style: { padding: '12px 16px', borderRadius: 8, fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 4 }
                    })),
                    { type: 'divider', style: { margin: '8px 0' } },
                    {
                      key: 'logout',
                      icon: <LogoutOutlined style={{ fontSize: 16 }} />,
                      label: loggingOut ? 'Đang đăng xuất...' : 'Đăng xuất',
                      danger: true,
                      style: { padding: '12px 16px', borderRadius: 8, fontSize: 14, fontWeight: 600 }
                    },
                  ] as any,
                  onClick: ({ key }) => {
                    if (key === 'logout') {
                      handleLogout();
                    } else {
                      navigate(key);
                    }
                  }
                }} 
                trigger={['click']} 
                placement="bottomRight"
              >
                <Avatar
                  size={36}
                  src={avatarSrc}
                  style={{
                    background: avatarSrc ? undefined : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    cursor: 'pointer',
                    fontSize: 13,
                    fontWeight: 700,
                    userSelect: 'none',
                    transition: 'box-shadow 0.2s',
                  }}
                >
                  {!avatarSrc && avatarLetter}
                </Avatar>
              </Dropdown>
            </>
          )}
        </Space>
      </div>
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        placement="right"
        width={300}
        closable={false}
        bodyStyle={{ padding: 0 }}
        headerStyle={{ display: 'none' }}
      >
        <div style={{ padding: '20px 20px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(135deg, #f0f7ff 0%, #ffffff 100%)', borderBottom: '1px solid #eef0f5' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Avatar size={40} src={avatarSrc} style={{ background: avatarSrc ? undefined : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', fontSize: 14, fontWeight: 700, flexShrink: 0 }}>
              {!avatarSrc && avatarLetter}
            </Avatar>
            <div style={{ overflow: 'hidden' }}>
              <Text strong style={{ fontSize: 14, color: '#111827', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {displayName}
              </Text>
              {displayEmail && <Text style={{ fontSize: 11, color: '#9ca3af', display: 'block' }}>{displayEmail}</Text>}
            </div>
          </div>
          <Button type="text" icon={<CloseOutlined />} onClick={() => setDrawerOpen(false)} style={{ color: '#6b7280' }} />
        </div>
        <div style={{ padding: '12px 0' }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.key || (item.key === '/jobs' && location.pathname.startsWith('/jobs'));
            return (
              <div
                key={item.key}
                onClick={() => {
                  navigate(item.key);
                  setDrawerOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '12px 20px',
                  cursor: 'pointer',
                  background: isActive ? '#f0f7ff' : 'transparent',
                  borderLeft: isActive ? '3px solid #1677ff' : '3px solid transparent',
                  transition: 'background 0.15s',
                }}
              >
                <div style={{ width: 36, height: 36, borderRadius: 8, background: isActive ? '#e6f4ff' : '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isActive ? '#1677ff' : '#6b7280', flexShrink: 0 }}>
                  {item.icon}
                </div>
                <div>
                  <Text strong style={{ fontSize: 14, color: isActive ? '#1677ff' : '#111827', display: 'block', lineHeight: '1.3' }}>
                    {item.label}
                  </Text>
                  <Text style={{ fontSize: 11, color: '#9ca3af' }}>{item.desc}</Text>
                </div>
              </div>
            );
          })}
        </div>
        <Divider style={{ margin: 0 }} />
        <div style={{ padding: '8px 0 4px' }}>
          <div
            onClick={() => {
              setDrawerOpen(false);
              handleLogout();
            }}
            style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 20px', cursor: loggingOut ? 'not-allowed' : 'pointer', opacity: loggingOut ? 0.6 : 1, transition: 'background 0.15s' }}
          >
            <div style={{ width: 36, height: 36, borderRadius: 8, background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', flexShrink: 0 }}>
              <LogoutOutlined style={{ fontSize: 15 }} />
            </div>
            <Text style={{ fontSize: 14, color: '#ef4444', fontWeight: 500 }}>{loggingOut ? 'Đang đăng xuất...' : 'Đăng xuất'}</Text>
          </div>
        </div>
      </Drawer>
      <style>{`
        @keyframes dropdownIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .nav-item-modern {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 16px;
          height: 64px;
          cursor: pointer;
          font-size: 15px;
          font-weight: 500;
          color: #64748b;
          border-bottom: 3px solid transparent;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        .nav-item-modern:hover {
          color: #1677ff;
          background: rgba(22, 119, 255, 0.04);
        }
        .nav-item-modern.active {
          font-weight: 600;
          color: #1677ff;
          border-bottom: 3px solid #1677ff;
        }
      `}</style>
    </>
  );
};
export default HeaderBar;
