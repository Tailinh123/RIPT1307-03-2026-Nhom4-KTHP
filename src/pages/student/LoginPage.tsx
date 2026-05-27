import React, { useState } from 'react';
import { Card, Input, Button, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/api/authApi';

const { Title } = Typography;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);

      const data = await authApi.login(username, password);

      localStorage.setItem('accessToken', data.accessToken);

      localStorage.setItem('user', JSON.stringify(data.user));

      message.success('Đăng nhập thành công');

      navigate('/jobs');
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
      </Card>
    </div>
  );
};

export default LoginPage;

// sva@gmail.com   123456