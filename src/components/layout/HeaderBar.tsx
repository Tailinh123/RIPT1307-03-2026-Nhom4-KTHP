import React, { useState, useEffect } from 'react';
import {
  Typography,
  Avatar,
  Divider,
} from 'antd';
import {
  AppstoreOutlined,
  OrderedListOutlined,
  ProfileOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosClient from '@/api/axiosClient';
import { useAuthImage } from '@/hooks/useAuthImage';

const { Text } = Typography;

const NAV_ITEMS = [
  {
    key: '/jobs',
    icon: <AppstoreOutlined style={{ fontSize: 16 }} />,
    label: 'Bảng việc làm',
    desc: 'Tìm kiếm cơ hội thực tập',
  },
  {
    key: '/applications',
    icon: <OrderedListOutlined style={{ fontSize: 16 }} />,
    label: 'Đơn ứng tuyển',
    desc: 'Lịch sử và trạng thái đơn',
  },
  {
    key: '/profile',
    icon: <ProfileOutlined style={{ fontSize: 16 }} />,
    label: 'Hồ sơ cá nhân',
    desc: 'Thông tin tài khoản',
  },
];

const HeaderBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const isJobDetail = /^\/jobs\/\d+/.test(location.pathname);

  const [displayName, setDisplayName] = useState('Sinh viên');
  const [displayEmail, setDisplayEmail] = useState('');
  const [avatarLetter, setAvatarLetter] = useState('SV');
  const [rawAvatarUrl, setRawAvatarUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        const name = user.name || user.fullName || 'Sinh viên';
        setDisplayName(name);
        setDisplayEmail(user.email || '');
        setAvatarLetter(name.charAt(0).toUpperCase() || 'SV');
        // Đọc avatarUrl để fetch ảnh
        const av = user.avatarUrl;
        if (av) {
          const fileNameOnly = av.replace(/^storage\//, '').replace(/^avatar\//, '');
          setRawAvatarUrl(`/api/v1/files?fileName=${encodeURIComponent(fileNameOnly)}&folder=avatar`);
        } else {
          setRawAvatarUrl(undefined);
        }
      } catch {
        // ignore
      }
    }
  }, [dropdownOpen]); 

  const avatarSrc = useAuthImage(rawAvatarUrl);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await axiosClient.post('/api/v1/auth/logout');
    } catch {
      // Dù API lỗi vẫn xóa local data và redirect
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      localStorage.removeItem('user_cache_phone');
      setDropdownOpen(false);
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
          padding: '0 32px',
          background: '#ffffff',
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 4px rgba(0,21,41,.06)',
        }}
      >
        {/* ── Left: Logo ── */}
        <div
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          onClick={() => navigate('/jobs')}
        >
          <img
            src="/images/logo2.png"
            alt="InternMatch"
            style={{
              height: 65,
              maxHeight: 65,
              width: 'auto',
              objectFit: 'contain',
              display: 'block',
            }}
          />
        </div>

        {/* ── Right: user avatar ── */}
        <Avatar
          size={36}
          src={avatarSrc}
          onClick={() => setDropdownOpen((v) => !v)}
          style={{
            background: avatarSrc ? undefined : 'linear-gradient(135deg, #1677ff 0%, #69b1ff 100%)',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 700,
            userSelect: 'none',
            boxShadow: dropdownOpen ? '0 0 0 3px rgba(22,119,255,0.2)' : 'none',
            transition: 'box-shadow 0.2s',
          }}
        >
          {!avatarSrc && avatarLetter}
        </Avatar>
      </div>

      {/* ── Overlay to close dropdown ── */}
      {dropdownOpen && (
        <div
          onClick={() => setDropdownOpen(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 199 }}
        />
      )}

      {/* ── User Dropdown Panel ── */}
      {dropdownOpen && (
        <div
          style={{
            position: 'fixed',
            top: 72,
            right: 20,
            zIndex: 200,
            background: '#ffffff',
            borderRadius: 14,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
            border: '1px solid #eef0f5',
            width: 280,
            overflow: 'hidden',
            animation: 'dropdownIn 0.18s ease',
          }}
        >
          {/* User info */}
          <div
            style={{
              padding: '20px 20px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              background: 'linear-gradient(135deg, #f0f7ff 0%, #ffffff 100%)',
            }}
          >
            <Avatar
              size={48}
              src={avatarSrc}
              style={{
                background: avatarSrc ? undefined : 'linear-gradient(135deg, #1677ff 0%, #69b1ff 100%)',
                fontSize: 16,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {!avatarSrc && avatarLetter}
            </Avatar>
            <div style={{ overflow: 'hidden' }}>
              <Text
                strong
                style={{
                  fontSize: 15,
                  color: '#111827',
                  display: 'block',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {displayName}
              </Text>
              {displayEmail && (
                <Text style={{ fontSize: 12, color: '#9ca3af', display: 'block' }}>
                  {displayEmail}
                </Text>
              )}
            </div>
          </div>

          <Divider style={{ margin: 0 }} />

          {/* Navigation items */}
          <div style={{ padding: '8px 0' }}>
            {NAV_ITEMS.map((item) => {
              const isActive =
                location.pathname === item.key ||
                (item.key === '/jobs' && isJobDetail);
              return (
                <div
                  key={item.key}
                  onClick={() => {
                    navigate(item.key);
                    setDropdownOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '10px 20px',
                    cursor: 'pointer',
                    background: isActive ? '#f0f7ff' : 'transparent',
                    transition: 'background 0.15s',
                    borderLeft: isActive ? '3px solid #1677ff' : '3px solid transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive)
                      (e.currentTarget as HTMLDivElement).style.background = '#f9fafb';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive)
                      (e.currentTarget as HTMLDivElement).style.background = 'transparent';
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 9,
                      background: isActive ? '#e6f4ff' : '#f3f4f6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isActive ? '#1677ff' : '#6b7280',
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <Text
                      strong
                      style={{
                        fontSize: 14,
                        color: isActive ? '#1677ff' : '#111827',
                        display: 'block',
                        lineHeight: '1.3',
                      }}
                    >
                      {item.label}
                    </Text>
                    <Text style={{ fontSize: 11, color: '#9ca3af' }}>{item.desc}</Text>
                  </div>
                </div>
              );
            })}
          </div>

          <Divider style={{ margin: 0 }} />

          {/* Logout */}
          <div style={{ padding: '8px 0 4px' }}>
            <div
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '10px 20px',
                cursor: loggingOut ? 'not-allowed' : 'pointer',
                opacity: loggingOut ? 0.6 : 1,
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => {
                if (!loggingOut)
                  (e.currentTarget as HTMLDivElement).style.background = '#fef2f2';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = 'transparent';
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 9,
                  background: '#fef2f2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ef4444',
                  flexShrink: 0,
                }}
              >
                <LogoutOutlined style={{ fontSize: 15 }} />
              </div>
              <Text style={{ fontSize: 14, color: '#ef4444', fontWeight: 500 }}>
                {loggingOut ? 'Đang đăng xuất...' : 'Đăng xuất'}
              </Text>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes dropdownIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
      `}</style>
    </>
  );
};

export default HeaderBar;
