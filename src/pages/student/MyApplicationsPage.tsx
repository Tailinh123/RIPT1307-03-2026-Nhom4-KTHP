import React from 'react';
import { Typography, Card } from 'antd';
import { OrderedListOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const MyApplicationsPage: React.FC = () => (
  <Card style={{ borderRadius: 14, border: '1px solid #eef0f5', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
    <div style={{ textAlign: 'center', padding: '48px 0' }}>
      <OrderedListOutlined style={{ fontSize: 48, color: '#1677ff', marginBottom: 16 }} />
      <Title level={4}>Đơn ứng tuyển của tôi</Title>
      <Text type="secondary">Trang này sẽ được xây dựng tiếp theo.</Text>
    </div>
  </Card>
);

export default MyApplicationsPage;
