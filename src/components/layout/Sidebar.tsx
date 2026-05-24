import React from 'react';
import { Layout, Typography } from 'antd';
import { RocketOutlined } from '@ant-design/icons';

const { Sider } = Layout;
const { Text } = Typography;

const Sidebar: React.FC = () => {
  return (
    <Sider
      width={220}
      style={{
        background: '#ffffff',
        borderRight: '1px solid #f0f0f0',
        boxShadow: '2px 0 8px rgba(0,0,0,0.04)',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── Logo / Brand ── */}
      <div
        style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          padding: '0 20px',
          borderBottom: '1px solid #f0f4ff',
          gap: 12,
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
        <div>
          <Text strong style={{ fontSize: 16, color: '#1677ff', letterSpacing: '-0.3px' }}>
            InternMatch
          </Text>
          <br />
          <Text style={{ fontSize: 11, color: '#8c8c8c' }}>Sinh viên</Text>
        </div>
      </div>
    </Sider>
  );
};

export default Sidebar;
