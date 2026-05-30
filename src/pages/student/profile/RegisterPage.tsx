import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Typography, message, Divider, Select, Spin } from 'antd';
import {
  LockOutlined, MailOutlined, RocketOutlined, UserOutlined,
  EyeInvisibleOutlined, EyeTwoTone, BankOutlined,
} from '@ant-design/icons';
import { authApi } from '@/api/authApi';
import axiosClient from '@/api/axiosClient';

const { Title, Text } = Typography;

type RegisterPageProps = {
  onSuccess?: () => void;
};

interface Company {
  id: number;
  name: string;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [companiesLoading, setCompaniesLoading] = useState(false);
  const [form] = Form.useForm();

  // Load danh sách công ty
  useEffect(() => {
    setCompaniesLoading(true);
    axiosClient
      .get('/api/v1/companies', { params: { page: 0, size: 200 } })
      .then((res) => {
        const data = res.data?.data?.result || res.data?.data || res.data || [];
        setCompanies(Array.isArray(data) ? data : []);
      })
      .catch(() => setCompanies([]))
      .finally(() => setCompaniesLoading(false));
  }, []);

  const handleRegister = async (values: {
    name: string;
    username: string;
    password: string;
    confirmPassword: string;
    companyId: number;
  }) => {
    if (values.password !== values.confirmPassword) {
      message.error('Mật khẩu xác nhận không khớp!');
      return;
    }
    try {
      setLoading(true);
      await authApi.register(values.name, values.username, values.password, values.companyId);
      message.success('Đăng ký thành công! Vui lòng đăng nhập.');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || err?.response?.data?.error || '';
      if (errorMsg.toLowerCase().includes('email already exists') || errorMsg.toLowerCase().includes('exists')) {
        form.setFields([{ name: 'username', errors: ['Email này đã được đăng ký!'] }]);
        message.warning('Email này đã được sử dụng. Vui lòng chọn email khác!');
      } else {
        message.error(errorMsg || 'Đăng ký thất bại. Vui lòng thử lại sau.');
      }
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
        padding: '24px 0',
      }}
    >
      <div
        style={{
          width: 440,
          background: '#fff',
          borderRadius: 20,
          boxShadow: '0 20px 60px rgba(22,119,255,0.12), 0 4px 16px rgba(0,0,0,0.06)',
          padding: '40px 40px 32px',
          border: '1px solid #eef0f5',
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div
            style={{
              width: 48, height: 48, borderRadius: 12,
              background: 'linear-gradient(135deg, #1677ff 0%, #69b1ff 100%)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 10, boxShadow: '0 8px 24px rgba(22,119,255,0.3)',
            }}
          >
            <RocketOutlined style={{ color: '#fff', fontSize: 24 }} />
          </div>
          <Title level={4} style={{ margin: 0, fontWeight: 700, color: '#111827' }}>
            InternMatch <span style={{ color: '#1677ff' }}>HR</span>
          </Title>
        </div>

        <Form form={form} layout="vertical" onFinish={handleRegister} size="middle">
          <div style={{ display: 'flex', gap: '12px' }}>
            <Form.Item
              name="name"
              label={<span style={{ fontWeight: 500 }}>Họ và tên</span>}
              rules={[
                { required: true, message: 'Vui lòng nhập họ tên' },
                { min: 2, message: 'Tên phải có ít nhất 2 ký tự' },
              ]}
              style={{ flex: 1, marginBottom: 12 }}
            >
              <Input
                prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
                placeholder="Nguyễn Văn A"
              />
            </Form.Item>

            <Form.Item
              name="username"
              label={<span style={{ fontWeight: 500 }}>Email</span>}
              rules={[
                { required: true, message: 'Vui lòng nhập email' },
                { type: 'email', message: 'Email không hợp lệ' },
              ]}
              style={{ flex: 1, marginBottom: 12 }}
            >
              <Input
                prefix={<MailOutlined style={{ color: '#bfbfbf' }} />}
                placeholder="hr@company.com"
              />
            </Form.Item>
          </div>

          {/* Công ty công tác — required, backend dùng để gán role HR_MANAGER */}
          <Form.Item
            name="companyId"
            label={<span style={{ fontWeight: 500 }}>Công ty công tác</span>}
            rules={[{ required: true, message: 'Vui lòng chọn công ty' }]}
            style={{ marginBottom: 12 }}
          >
            <Select
              placeholder="Chọn công ty của bạn"
              showSearch
              allowClear
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
              filterOption={(input, option) =>
                String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              notFoundContent={
                companiesLoading ? (
                  <div style={{ textAlign: 'center', padding: 8 }}>
                    <Spin size="small" />
                  </div>
                ) : (
                  <span style={{ color: '#9ca3af', fontSize: 13 }}>Không tìm thấy công ty</span>
                )
              }
              options={companies.map((c) => ({ value: c.id, label: c.name }))}
            />
          </Form.Item>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Form.Item
              name="password"
              label={<span style={{ fontWeight: 500 }}>Mật khẩu</span>}
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu' },
                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
              ]}
              style={{ flex: 1, marginBottom: 12 }}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                placeholder="••••••••"
                iconRender={(visible) => visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label={<span style={{ fontWeight: 500 }}>Xác nhận mật khẩu</span>}
              rules={[{ required: true, message: 'Vui lòng xác nhận mật khẩu' }]}
              style={{ flex: 1, marginBottom: 12 }}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                placeholder="••••••••"
                iconRender={(visible) => visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
              />
            </Form.Item>
          </div>

          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            loading={loading}
            style={{
              marginTop: 12, height: 40, borderRadius: 8, fontSize: 15, fontWeight: 600,
              background: 'linear-gradient(135deg, #1677ff 0%, #4096ff 100%)',
              border: 'none', boxShadow: '0 4px 16px rgba(22,119,255,0.3)',
            }}
          >
            Đăng ký
          </Button>
        </Form>

        <Divider style={{ margin: '16px 0', fontSize: 13, color: '#9ca3af' }}>hoặc</Divider>

        <div style={{ textAlign: 'center' }}>
          <Text style={{ color: '#6b7280', fontSize: 14 }}>
            Đã có tài khoản?{' '}
            <span
              style={{ color: '#1677ff', fontWeight: 600, cursor: 'pointer' }}
              onClick={() => onSuccess && onSuccess()}
            >
              Đăng nhập ngay
            </span>
          </Text>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
