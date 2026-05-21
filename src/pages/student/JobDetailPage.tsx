import React from 'react';
import { Typography, Card, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';

const { Title, Text } = Typography;

const JobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  return (
    <div>
      <Button
        icon={<ArrowLeftOutlined />}
        type="text"
        style={{ marginBottom: 16, paddingLeft: 0 }}
        onClick={() => navigate(-1)}
      >
        Quay lại danh sách
      </Button>
      <Card style={{ borderRadius: 14, border: '1px solid #eef0f5', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <Title level={4}>Chi tiết việc làm #{id}</Title>
          <Text type="secondary">Trang chi tiết sẽ được xây dựng tiếp theo.</Text>
        </div>
      </Card>
    </div>
  );
};

export default JobDetailPage;
