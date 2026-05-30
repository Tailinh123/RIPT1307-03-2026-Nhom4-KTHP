import React, { useState } from 'react';
import { Card, Input, Button, Typography, message, Divider } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '@/api/authApi';

const { Title, Text } = Typography;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);

      const data = await authApi.login(username, password);

      localStorage.setItem('access_token', data.access_token);

      localStorage.setItem('user', JSON.stringify(data.user));

      message.success('Đăng nhập thành công');

      window.location.href = '/jobs';
    } catch (error) {
      console.error(error);
      message.error('Sai tài khoản hoặc mật khẩu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#f5f7fb',
      }}
    >
      <Card style={{ width: 400 }}>
        <Title level={3}>Đăng nhập</Title>

        <Input
          placeholder="Email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ marginBottom: 16 }}
        />

        <Input.Password
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginBottom: 16 }}
        />

        <Button
          type="primary"
          block
          loading={loading}
          onClick={handleLogin}
        >
          Đăng nhập
        </Button>

        <Divider style={{ margin: '16px 0', fontSize: 13, color: '#9ca3af' }}>hoặc</Divider>

        <div style={{ textAlign: 'center' }}>
          <Text type="secondary" style={{ fontSize: 14 }}>
            Chưa có tài khoản?{' '}
            <Link to="/register" style={{ color: '#1677ff', fontWeight: 600 }}>
              Đăng ký ngay
            </Link>
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;

// sva@gmail.com   123456