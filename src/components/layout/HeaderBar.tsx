import React, { useState, useEffect } from 'react';
import { Typography, Avatar, Divider, Button } from 'antd';
import {
  AppstoreOutlined,
  OrderedListOutlined,
  ProfileOutlined,
  LogoutOutlined,
  RocketOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';

const { Text } = Typography;

// DANH SÁCH MENU ĐIỀU HƯỚNG CỦA NHÀ TUYỂN DỤNG (ĐÃ BỔ SUNG HỒ SƠ CÁ NHÂN)
const NAV_ITEMS = [
  {
    key: '/profile/company-dashboard',
    icon: <AppstoreOutlined style={{ fontSize: 16 }} />,
    label: 'Dashboard công ty',
    desc: 'Tổng quan phân tích số liệu',
  },
  {
    key: '/profile/manage-jobs',
    icon: <OrderedListOutlined style={{ fontSize: 16 }} />,
    label: 'Quản lý việc làm',
    desc: 'Danh sách và cấu hình Job',
  },
  {
    key: '/profile/applications-review',
    icon: <ProfileOutlined style={{ fontSize: 16 }} />,
    label: 'Duyệt ứng tuyển',
    desc: 'Xét duyệt hồ sơ ứng viên',
  },
  {
    key: '/profile/hr-profile',
    icon: <UserOutlined style={{ fontSize: 16 }} />,
    label: 'Hồ sơ cá nhân',
    desc: 'Cập nhật thông tin tài khoản',
  },
];

const HeaderBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  // Đọc thông tin user đăng nhập từ localStorage khi load trang
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUserData(JSON.parse(storedUser));
      } catch (e) {
        console.error("Lỗi đọc thông tin user", e);
      }
    }
  }, [location.pathname]); // Cập nhật lại nếu có chuyển hướng hành động

  // Xác định nhãn vai trò hiển thị
  const isCompany = userData?.role === 'COMPANY' || localStorage.getItem('access_token') != null; // Fallback bọc an toàn cho HR
  const roleLabel = isCompany ? 'Nhà tuyển dụng' : 'Sinh viên';
  const avatarLabel = isCompany ? 'HR' : 'SV';
  const fullNameDisplay = userData?.fullName || userData?.name || (isCompany ? 'HR Manager' : 'Sinh viên');

  const handleLogout = () => {
    localStorage.clear();
    message.success("Đăng xuất thành công!");
    navigate('/api/v1/auth/login'); // Điều hướng về trang login của team
  };

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
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
        {/* ── Left: Logo + Brand Động ── */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
          onClick={() => navigate(isCompany ? '/profile/company-dashboard' : '/jobs')}
        >
          <div
            style={{
              width: 34, height: 34,
              borderRadius: 9,
              background: 'linear-gradient(135deg, #1677ff 0%, #69b1ff 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <RocketOutlined style={{ color: '#fff', fontSize: 16 }} />
          </div>
          <div>
            <Text strong style={{ fontSize: 16, color: '#1677ff', letterSpacing: '-0.3px', lineHeight: '1.2' }}>
              InternMatch
            </Text>
            <br />
            {/* CHỮ PHỤ DƯỚI LOGO ĐÃ BIẾN THÀNH ĐỘNG THEO YÊU CẦU CỦA ĐẠI */}
            <Text style={{ fontSize: 10, color: '#9ca3af', lineHeight: '1', fontWeight: 500 }}>
              {roleLabel}
            </Text>
          </div>
        </div>

        {/* ── Right: User Avatar Động ── */}
        <Avatar
          size={36}
          src={userData?.avatar} // Hiển thị ảnh thật nếu có trong máy tính
          onClick={() => setDropdownOpen((v) => !v)}
          style={{
            background: isCompany ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' : 'linear-gradient(135deg, #1677ff 0%, #69b1ff 100%)',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 700,
            userSelect: 'none',
            boxShadow: dropdownOpen ? '0 0 0 3px rgba(22,119,255,0.2)' : 'none',
            transition: 'box-shadow 0.2s',
          }}
        >
          {!userData?.avatar && avatarLabel}
        </Avatar>
      </div>

      {/* Overlay */}
      {dropdownOpen && (
        <div onClick={() => setDropdownOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 199 }} />
      )}

      {/* User Dropdown Panel */}
      {dropdownOpen && (
        <div
          style={{
            position: 'fixed',
            top: 72, right: 20,
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
          <div
            style={{
              padding: '20px 20px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              background: 'linear-gradient(135deg, #f0f7ff 0%, #ffffff 100%)',
            }}
          >
            <Avatar size={48} src={userData?.avatar} style={{ background: '#1677ff', fontSize: 16, fontWeight: 700, flexShrink: 0 }}>
              {!userData?.avatar && avatarLabel}
            </Avatar>
            <div style={{ overflow: 'hidden' }}>
              <Text strong style={{ fontSize: 15, color: '#111827', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {fullNameDisplay}
              </Text>
              <Text style={{ fontSize: 12, color: '#6b7280' }}>{userData?.email || 'hr@gmail.com'}</Text>
            </div>
          </div>

          <Divider style={{ margin: 0 }} />

          {/* Navigation Items */}
          <div style={{ padding: '8px 0' }}>
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.key;
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
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: 9,
                    background: isActive ? '#e6f4ff' : '#f3f4f6',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: isActive ? '#1677ff' : '#6b7280', flexShrink: 0
                  }}>
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

          {/* Logout */}
          <div style={{ padding: '8px 0 4px' }} onClick={handleLogout}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 20px', cursor: 'pointer' }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', flexShrink: 0 }}>
                <LogoutOutlined style={{ fontSize: 15 }} />
              </div>
              <Text style={{ fontSize: 14, color: '#ef4444', fontWeight: 500 }}>Đăng xuất</Text>
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