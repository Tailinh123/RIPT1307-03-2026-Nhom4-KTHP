import React, { useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Divider, Form, Input, Row, Typography, notification } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '@/api/authApi';
import { getBackendErrorMessage } from '@/utils/backendMessage';
import {
  clearAuthSession,
  consumeAuthNotice,
  ensureRoleActive,
  INACTIVE_ROLE_MESSAGE,
  SESSION_EXPIRED_MESSAGE,
} from '@/utils/authStatus';
import logoInternMatch from '@/assets/images/logo-internmatch.png';
const { Title, Text } = Typography;
type AuthFeedback = {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
};
const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<AuthFeedback | null>(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  useEffect(() => {
    const notice = consumeAuthNotice();
    if (notice) {
      setFeedback({
        type: 'error',
        title: notice,
      });
    }
  }, []);
  const handleLogin = async (values: { username: string; password: string }) => {
    try {
      setLoading(true);
      setFeedback(null);
      const data = await authApi.login(values.username, values.password);
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      let roleIsActive = true;
      try {
        roleIsActive = await ensureRoleActive(data.user?.role);
      } catch {
        clearAuthSession();
        setFeedback({
          type: 'error',
          title: SESSION_EXPIRED_MESSAGE,
        });
        return;
      }
      if (!roleIsActive) {
        clearAuthSession();
        setFeedback({
          type: 'error',
          title: INACTIVE_ROLE_MESSAGE,
        });
        return;
      }
      setFeedback({
        type: 'success',
        title: 'Đăng nhập thành công.',
        description: 'Đang chuyển hướng...',
      });
      notification.success({
        message: 'Đăng nhập thành công',
        description: 'Đang chuyển bạn đến trang phù hợp.',
        placement: 'topRight',
      });
      const role = data.user?.role?.name;
      const targetPath =
        role === 'SUPER_ADMIN'
          ? '/admin/dashboard'
          : role === 'HR_MANAGER'
            ? '/profile/company-dashboard'
            : role === 'CANDIDATE'
              ? '/jobs'
              : '/';
      window.dispatchEvent(new Event('storage'));
      window.setTimeout(() => navigate(targetPath), 650);
    } catch (error: any) {
      let errorMessage = getBackendErrorMessage(error, 'Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại.');
      let isNetworkError = false;
      if (error.message === 'Network Error' || !error.response) {
        errorMessage = 'Không thể kết nối đến máy chủ. Vui lòng thử lại sau.';
        isNetworkError = true;
      }
      setFeedback({
        type: 'error',
        title: errorMessage,
        description: isNetworkError
          ? 'Máy chủ hiện đang bảo trì hoặc không phản hồi.'
          : undefined,
      });
      if (!isNetworkError) {
        form.setFields([{ name: 'password', errors: [errorMessage] }]);
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="auth-page login-bg">
      <div className="auth-floating-shape auth-shape-1" />
      <div className="auth-floating-shape auth-shape-2" />
      <div className="auth-floating-shape auth-shape-3" />
      <Row align="middle" justify="center" style={{ width: '100%', maxWidth: 1100, margin: '0 auto', minHeight: '100vh', padding: '40px 20px' }}>
        <Col xs={0} md={0} lg={12} xl={12}>
          <div className="auth-hero-panel">
            <img
              src={logoInternMatch}
              alt="InternMatching"
              style={{ height: 110, width: 'auto', objectFit: 'contain', marginBottom: 32, mixBlendMode: 'multiply' }}
            />
            <Title level={2} style={{ margin: 0, color: '#0f172a', fontSize: 30, fontWeight: 700, lineHeight: 1.3 }}>
              Kết nối việc làm,
              <br />
              <span style={{ color: '#1677ff' }}>mở lối tương lai</span>
            </Title>
            <Text style={{ display: 'block', marginTop: 16, color: '#64748b', fontSize: 15, lineHeight: 1.7, maxWidth: 420 }}>
              Nền tảng kết nối ứng viên với hàng ngàn cơ hội việc làm từ các doanh nghiệp uy tín trên toàn quốc.
            </Text>
            <div style={{ marginTop: 36, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                'Tìm kiếm & ứng tuyển việc làm dễ dàng',
                'Theo dõi trạng thái đơn ứng tuyển realtime',
                'Nhận thông báo email khi có kết quả',
              ].map((item) => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#1677ff', flexShrink: 0 }} />
                  <Text style={{ color: '#475569', fontSize: 14 }}>{item}</Text>
                </div>
              ))}
            </div>
          </div>
        </Col>
        <Col xs={24} sm={24} md={20} lg={12} xl={12}>
          <Card
            bordered={false}
            className="auth-card"
            bodyStyle={{ padding: '40px 36px' }}
          >
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div className="auth-card-logo-mobile">
                <img
                  src={logoInternMatch}
                  alt="InternMatching"
                  style={{ height: 64, width: 'auto', objectFit: 'contain', marginBottom: 20, mixBlendMode: 'multiply' }}
                />
              </div>
              <Title level={3} style={{ margin: '0 0 6px', color: '#111827', fontWeight: 700 }}>
                Đăng nhập vào InternMatching
              </Title>
              <Text style={{ color: '#64748b', fontSize: 14 }}>
                Tìm kiếm cơ hội Việc làm phù hợp với bạn.
              </Text>
            </div>
            {feedback && (
              <Alert
                type={feedback.type}
                showIcon
                message={feedback.title}
                description={feedback.description}
                style={{ marginBottom: 20, borderRadius: 8 }}
              />
            )}
            <Form
              form={form}
              layout="vertical"
              onFinish={handleLogin}
              size="large"
              requiredMark={false}
              onValuesChange={() => {
                if (feedback?.type === 'error' || feedback?.type === 'warning') setFeedback(null);
              }}
            >
              <Form.Item
                name="username"
                label={<span style={{ fontWeight: 600, color: '#334155' }}>Email</span>}
                rules={[
                  { required: true, message: 'Vui lòng nhập email' },
                  { type: 'email', message: 'Email không hợp lệ' },
                ]}
              >
                <Input
                  prefix={<MailOutlined style={{ color: '#94a3b8' }} />}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </Form.Item>
              <Form.Item
                name="password"
                label={<span style={{ fontWeight: 600, color: '#334155' }}>Mật khẩu</span>}
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: '#94a3b8' }} />}
                  placeholder="Nhập mật khẩu"
                  onPressEnter={() => form.submit()}
                  autoComplete="current-password"
                />
              </Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
                disabled={loading}
                className="auth-submit-btn"
              >
                Đăng nhập
              </Button>
            </Form>
            <Divider style={{ margin: '24px 0 20px', fontSize: 13, color: '#cbd5e1' }}>hoặc</Divider>
            <Text style={{ color: '#64748b', display: 'block', textAlign: 'center', fontSize: 14 }}>
              Chưa có tài khoản?{' '}
              <Link to="/register" style={{ color: '#1677ff', fontWeight: 600 }}>
                Tạo tài khoản mới
              </Link>
            </Text>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default LoginPage;
