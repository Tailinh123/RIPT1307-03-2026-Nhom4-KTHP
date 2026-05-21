import React from 'react';
import { Layout, Button, Typography, Space, Badge, Avatar, Tooltip, Breadcrumb } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';

const { Header } = Layout;
const { Text } = Typography;

const PAGE_TITLES: Record<string, string> = {
  '/jobs': 'Bảng việc làm',
  '/resumes': 'CV của tôi',
  '/applications': 'Đơn ứng tuyển',
  '/profile': 'Hồ sơ cá nhân',
};

interface HeaderBarProps {
  collapsed: boolean;
  onToggle: () => void;
  sidebarWidth: number;
}

const HeaderBar: React.FC<HeaderBarProps> = ({ collapsed, onToggle, sidebarWidth }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isJobDetail = /^\/jobs\/\d+/.test(location.pathname);
  const title = isJobDetail ? 'Chi tiết việc làm' : (PAGE_TITLES[location.pathname] ?? 'InternMatch');

  // Breadcrumb items
  const breadcrumbItems = isJobDetail
    ? [
        { title: <Text style={{ fontSize: 12, color: '#8c8c8c' }}>Trang chủ</Text> },
        {
          title: (
            <span
              style={{ fontSize: 12, color: '#595959', cursor: 'pointer' }}
              onClick={() => navigate('/jobs')}
            >
              Bảng việc làm
            </span>
          ),
        },
        { title: <Text style={{ fontSize: 12, color: '#1677ff' }}>Chi tiết việc làm</Text> },
      ]
    : [
        { title: <Text style={{ fontSize: 12, color: '#8c8c8c' }}>Trang chủ</Text> },
        { title: <Text style={{ fontSize: 12, color: '#1677ff' }}>{title}</Text> },
      ];

  return (
    <Header
      style={{
        position: 'fixed',
        top: 0,
        left: sidebarWidth,
        right: 0,
        zIndex: 99,
        height: 64,
        padding: '0 24px',
        background: '#ffffff',
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 1px 4px rgba(0,21,41,.06)',
        transition: 'left 0.2s',
      }}
    >
      {/* ── Left: collapse toggle + breadcrumb ── */}
      <Space size={16} align="center">
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={onToggle}
          style={{ width: 36, height: 36, fontSize: 16, color: '#595959' }}
        />
        <div>
          <Breadcrumb
            items={breadcrumbItems}
            style={{ marginBottom: 2 }}
          />
          <Text strong style={{ fontSize: 18, color: '#1d1d1f', letterSpacing: '-0.2px' }}>
            {title}
          </Text>
        </div>
      </Space>

      {/* ── Right: actions ── */}
      <Space size={8} align="center">
        <Tooltip title="Tìm kiếm">
          <Button
            type="text"
            icon={<SearchOutlined />}
            style={{ width: 36, height: 36, color: '#595959' }}
          />
        </Tooltip>
        <Tooltip title="Trợ giúp">
          <Button
            type="text"
            icon={<QuestionCircleOutlined />}
            style={{ width: 36, height: 36, color: '#595959' }}
          />
        </Tooltip>
        <Badge count={3} size="small">
          <Button
            type="text"
            icon={<BellOutlined />}
            style={{ width: 36, height: 36, color: '#595959' }}
          />
        </Badge>
        <Avatar
          size={34}
          style={{
            background: 'linear-gradient(135deg, #1677ff 0%, #69b1ff 100%)',
            cursor: 'pointer',
            fontSize: 14,
          }}
        >
          SV
        </Avatar>
      </Space>
    </Header>
  );
};

export default HeaderBar;
