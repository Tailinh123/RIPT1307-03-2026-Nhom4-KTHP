import React from 'react';
import { Layout, Menu, Typography, Avatar } from 'antd';
import {
  AppstoreOutlined,
  ProfileOutlined,
  OrderedListOutlined,
  RocketOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Sider } = Layout;
const { Text } = Typography;

const menuItems = [
  { key: '/jobs', icon: <AppstoreOutlined />, label: 'Bảng việc làm' },
  { key: '/applications', icon: <OrderedListOutlined />, label: 'Đơn ứng tuyển' },
  { key: '/profile', icon: <ProfileOutlined />, label: 'Hồ sơ cá nhân' },
];

interface SidebarProps {
  collapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedKey =
    menuItems.find((item) => location.pathname.startsWith(item.key))?.key ?? '/jobs';

  return (
    <Sider
      collapsed={collapsed}
      width={240}
      collapsedWidth={72}
      style={{
        background: '#ffffff',
        borderRight: '1px solid #f0f0f0',
        boxShadow: '2px 0 8px rgba(0,0,0,0.04)',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 100,
        overflow: 'auto',
      }}
    >
      {/* ── Logo / Brand ── */}
      <div
        style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          padding: collapsed ? '0 20px' : '0 20px',
          borderBottom: '1px solid #f0f4ff',
          gap: 12,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #1677ff 0%, #69b1ff 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <RocketOutlined style={{ color: '#fff', fontSize: 18 }} />
        </div>
        {!collapsed && (
          <div>
            <Text strong style={{ fontSize: 16, color: '#1677ff', letterSpacing: '-0.3px' }}>
              InternMatch
            </Text>
            <br />
            <Text style={{ fontSize: 11, color: '#8c8c8c' }}>Sinh viên</Text>
          </div>
        )}
      </div>

      {/* ── Navigation Menu ── */}
      {!collapsed && (
        <div style={{ padding: '12px 16px 4px', marginTop: 4 }}>
          <Text style={{ fontSize: 11, fontWeight: 600, color: '#8c8c8c', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            Điều hướng
          </Text>
        </div>
      )}

      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        onClick={({ key }) => navigate(key)}
        items={menuItems}
        style={{
          border: 'none',
          padding: '4px 8px',
        }}
        theme="light"
      />

      {/* ── User info at bottom ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: collapsed ? '16px 18px' : '16px 20px',
          borderTop: '1px solid #f0f0f0',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: '#fafbff',
          overflow: 'hidden',
        }}
      >
        <Avatar
          size={36}
          style={{ background: 'linear-gradient(135deg,#1677ff,#69b1ff)', flexShrink: 0 }}
        >
          SV
        </Avatar>
        {!collapsed && (
          <div style={{ overflow: 'hidden' }}>
            <Text strong style={{ fontSize: 13, display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Sinh viên
            </Text>
            <Text style={{ fontSize: 11, color: '#8c8c8c' }}>Tài khoản</Text>
          </div>
        )}
      </div>
    </Sider>
  );
};

export default Sidebar;
