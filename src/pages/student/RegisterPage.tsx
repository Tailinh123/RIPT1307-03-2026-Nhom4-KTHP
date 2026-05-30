import React, { useState } from 'react';
import { Form, Input, Button, Typography, message, Divider } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '@/api/authApi';

const { Title, Text } = Typography;

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleRegister = async (values: { name: string; email: string; password: string; confirmPassword: string }) => {
    if (values.password !== values.confirmPassword) {
      message.error('Mật khẩu xác nhận không khớp!');
      return;
    }
    try {
      setLoading(true);
      await authApi.register(values.name, values.email, values.password);
      message.success('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || err?.response?.data?.error || '';
      if (errorMsg.toLowerCase().includes('email already exists') || errorMsg.toLowerCase().includes('exists')) {
        form.setFields([{ name: 'email', errors: ['Email này đã được đăng ký!'] }]);
        message.warning('Email này đã được sử dụng. Vui lòng chọn email khác!');
      } else {
        message.error(errorMsg || 'Đăng ký thất bại. Vui lòng thử lại sau.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative circles */}
      <div style={{ position: 'absolute', top: -80, left: -80, width: 300, height: 300, background: 'rgba(255,255,255,0.08)', borderRadius: '50%' }} />
      <div style={{ position: 'absolute', bottom: -100, right: -60, width: 400, height: 400, background: 'rgba(255,255,255,0.06)', borderRadius: '50%' }} />

      <div style={{
        width: '100%',
        maxWidth: 440,
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: 24,
        padding: '40px 40px 32px',
        boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 16, margin: '0 auto 16px',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28,
          }}>
            🎓
          </div>
          <Title level={3} style={{ margin: 0, color: '#1a1a2e', fontWeight: 700 }}>
            Tạo tài khoản
          </Title>
          <Text type="secondary" style={{ fontSize: 14 }}>
            Đăng ký để tìm kiếm việc làm & thực tập
          </Text>
        </div>

        <Form form={form} layout="vertical" onFinish={handleRegister} requiredMark={false}>
          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }, { min: 2, message: 'Tên phải có ít nhất 2 ký tự' }]}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#9ca3af' }} />}
              placeholder="Họ và tên"
              size="large"
              style={{ borderRadius: 12, height: 48 }}
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' },
            ]}
          >
            <Input
              prefix={<MailOutlined style={{ color: '#9ca3af' }} />}
              placeholder="Email"
              size="large"
              style={{ borderRadius: 12, height: 48 }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu!' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#9ca3af' }} />}
              placeholder="Mật khẩu"
              size="large"
              style={{ borderRadius: 12, height: 48 }}
              iconRender={(visible) => visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            rules={[{ required: true, message: 'Vui lòng xác nhận mật khẩu!' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#9ca3af' }} />}
              placeholder="Xác nhận mật khẩu"
              size="large"
              style={{ borderRadius: 12, height: 48 }}
              iconRender={(visible) => visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 16 }}>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              size="large"
              style={{
                height: 50,
                borderRadius: 12,
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                border: 'none',
                fontWeight: 600,
                fontSize: 16,
                boxShadow: '0 4px 15px rgba(102,126,234,0.4)',
              }}
            >
              Đăng ký
            </Button>
          </Form.Item>
        </Form>

        <Divider style={{ margin: '16px 0', color: '#9ca3af', fontSize: 13 }}>hoặc</Divider>

        <div style={{ textAlign: 'center' }}>
          <Text type="secondary" style={{ fontSize: 14 }}>
            Đã có tài khoản?{' '}
            <Link
              to="/login"
              style={{ color: '#667eea', fontWeight: 600, textDecoration: 'none' }}
            >
              Đăng nhập ngay
            </Link>
          </Text>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
