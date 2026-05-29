import React, { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { LockOutlined, MailOutlined, RocketOutlined } from '@ant-design/icons';
import { authApi } from '@/api/authApi';

const { Title, Text } = Typography;

type LoginPageProps = {
  onSuccess?: () => void;
};

const LoginPage: React.FC<LoginPageProps> = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleLogin = async (values: { username: string; password: string }) => {
    try {
      setLoading(true);
      const data = await authApi.login(values.username, values.password);
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      message.success('Đăng nhập thành công!');
      if (onSuccess) onSuccess();
    } catch {
      message.error('Sai tài khoản hoặc mật khẩu!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f0f7ff 0%, #e8f4fd 50%, #f5f0ff 100%)',
      }}
    >
      <div
        style={{
          width: 420,
          background: '#fff',
          borderRadius: 20,
          boxShadow: '0 20px 60px rgba(22,119,255,0.12), 0 4px 16px rgba(0,0,0,0.06)',
          padding: '48px 40px',
          border: '1px solid #eef0f5',
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: 'linear-gradient(135deg, #1677ff 0%, #69b1ff 100%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
              boxShadow: '0 8px 24px rgba(22,119,255,0.3)',
            }}
          >
            <RocketOutlined style={{ color: '#fff', fontSize: 26 }} />
          </div>
          <Title level={3} style={{ margin: 0, fontWeight: 700, color: '#111827' }}>
            InternMatch <span style={{ color: '#1677ff' }}>HR</span>
          </Title>
          <Text style={{ color: '#6b7280', fontSize: 14 }}>
            Đăng nhập vào cổng Nhà tuyển dụng
          </Text>
        </div>

        <Form form={form} layout="vertical" onFinish={handleLogin}>
          <Form.Item
            name="username"
            label={<span style={{ fontWeight: 500 }}>Email</span>}
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' },
            ]}
          >
            <Input
              prefix={<MailOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="hr@company.com"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={<span style={{ fontWeight: 500 }}>Mật khẩu</span>}
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="••••••••"
              size="large"
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            loading={loading}
            style={{
              marginTop: 8,
              height: 48,
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 600,
              background: 'linear-gradient(135deg, #1677ff 0%, #4096ff 100%)',
              border: 'none',
              boxShadow: '0 4px 16px rgba(22,119,255,0.3)',
            }}
          >
            Đăng nhập
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;