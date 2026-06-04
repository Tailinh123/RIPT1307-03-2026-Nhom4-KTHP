import React, { useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Divider, Form, Input, Radio, Row, Select, Spin, Typography, notification } from 'antd';
import {
  BankOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  LockOutlined,
  MailOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '@/api/authApi';
import axiosClient from '@/api/axiosClient';
import { getBackendErrorMessage, getBackendMessage } from '@/utils/backendMessage';
import logoInternMatch from '@/assets/images/logo-internmatch.png';
const { Title, Text } = Typography;
type AuthFeedback = {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
};
interface Company {
  id: number;
  name: string;
}
type AccountType = 'CANDIDATE' | 'HR_MANAGER';
const RegisterPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [companiesLoading, setCompaniesLoading] = useState(false);
  const [accountType, setAccountType] = useState<AccountType>('CANDIDATE');
  const [feedback, setFeedback] = useState<AuthFeedback | null>(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  useEffect(() => {
    setCompaniesLoading(true);
    axiosClient
      .get('/api/v1/companies', { params: { page: 1, size: 200 } })
      .then((res) => {
        const data = res.data?.data?.result || [];
        if (Array.isArray(data)) {
          const uniqueMap = new Map();
          data.forEach((company: Company) => {
            if (!uniqueMap.has(company.name)) {
              uniqueMap.set(company.name, company);
            }
          });
          setCompanies(Array.from(uniqueMap.values()));
        } else {
          setCompanies([]);
        }
      })
      .catch(() => setCompanies([]))
      .finally(() => setCompaniesLoading(false));
  }, []);
  const handleRegister = async (values: {
    name: string;
    username: string;
    password: string;
    confirmPassword: string;
    companyId?: number;
  }) => {
    if (values.password !== values.confirmPassword) {
      setFeedback({
        type: 'warning',
        title: 'Mật khẩu xác nhận chưa khớp.',
      });
      form.setFields([{ name: 'confirmPassword', errors: ['Mật khẩu xác nhận chưa khớp.'] }]);
      return;
    }
    const companyId = accountType === 'HR_MANAGER' ? values.companyId : undefined;
    if (accountType === 'HR_MANAGER' && !companyId) {
      setFeedback({
        type: 'warning',
        title: 'Vui lòng chọn công ty trước khi tạo tài khoản nhà tuyển dụng.',
      });
      form.setFields([{ name: 'companyId', errors: ['Vui lòng chọn công ty.'] }]);
      return;
    }
    try {
      setLoading(true);
      setFeedback(null);
      const result = await authApi.register(values.name, values.username, values.password, companyId);
      const successMessage = getBackendMessage(result, 'Tạo tài khoản thành công. Bạn có thể đăng nhập ngay bây giờ.');
      setFeedback({
        type: 'success',
        title: successMessage,
      });
      notification.success({
        message: 'Tạo tài khoản thành công',
        description: 'Đang chuyển bạn đến trang đăng nhập...',
        placement: 'topRight',
      });
      form.resetFields();
      window.setTimeout(() => navigate('/login'), 900);
    } catch (err: any) {
      const errorMsg = getBackendErrorMessage(err, '');
      if (String(errorMsg).toLowerCase().includes('exists')) {
        const warningMessage = 'Email này đã được sử dụng. Vui lòng dùng email khác.';
        form.setFields([{ name: 'username', errors: [warningMessage] }]);
        setFeedback({
          type: 'warning',
          title: warningMessage,
        });
      } else {
        setFeedback({
          type: 'error',
          title: errorMsg || 'Đăng ký thất bại. Vui lòng thử lại.',
        });
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
        <Col xs={0} md={0} lg={11} xl={11}>
          <div className="auth-hero-panel">
            <img
              src={logoInternMatch}
              alt="InternMatching"
              style={{ height: 110, width: 'auto', objectFit: 'contain', marginBottom: 32, mixBlendMode: 'multiply' }}
            />
            <Title level={2} style={{ margin: 0, color: '#0f172a', fontSize: 30, fontWeight: 700, lineHeight: 1.3 }}>
              Bắt đầu hành trình
              <br />
              <span style={{ color: '#1677ff' }}>tìm kiếm việc làm của bạn</span>
            </Title>
            <Text style={{ display: 'block', marginTop: 16, color: '#64748b', fontSize: 15, lineHeight: 1.7, maxWidth: 420 }}>
              Tạo tài khoản để tiếp cận hàng ngàn công việc mới mỗi ngày từ các doanh nghiệp hàng đầu.
            </Text>
            <div style={{ marginTop: 36, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {(accountType === 'HR_MANAGER'
                ? [
                  'Đăng tin tuyển dụng & quản lý ứng viên',
                  'Theo dõi hồ sơ ứng tuyển theo thời gian thực',
                  'Gửi email thông báo kết quả tự động',
                ]
                : [
                  'Tìm & ứng tuyển hồ sơ trong vài phút',
                  'Quản lý hồ sơ cá nhân chuyên nghiệp',
                  'Nhận thông báo khi có kết quả phỏng vấn',
                ]
              ).map((item) => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#1677ff', flexShrink: 0 }} />
                  <Text style={{ color: '#475569', fontSize: 14 }}>{item}</Text>
                </div>
              ))}
            </div>
          </div>
        </Col>
        <Col xs={24} sm={24} md={22} lg={13} xl={13}>
          <Card
            bordered={false}
            className="auth-card"
            bodyStyle={{ padding: '36px 36px 32px' }}
          >
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div className="auth-card-logo-mobile">
                <img
                  src={logoInternMatch}
                  alt="InternMatching"
                  style={{ height: 64, width: 'auto', objectFit: 'contain', marginBottom: 20, mixBlendMode: 'multiply' }}
                />
              </div>
              <Title level={3} style={{ margin: '0 0 6px', color: '#111827', fontWeight: 700 }}>
                Tạo tài khoản InternMatching
              </Title>
              <Text style={{ color: '#64748b', fontSize: 14 }}>
                Chọn loại tài khoản phù hợp để bắt đầu.
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
              onFinish={handleRegister}
              size="large"
              requiredMark={false}
              onValuesChange={() => {
                if (feedback?.type === 'error' || feedback?.type === 'warning') setFeedback(null);
              }}
            >
              <Form.Item label={<span style={{ fontWeight: 600, color: '#334155' }}>Loại tài khoản</span>} style={{ marginBottom: 20 }}>
                <Radio.Group
                  value={accountType}
                  onChange={(event) => {
                    setAccountType(event.target.value);
                    form.setFieldsValue({ companyId: undefined });
                  }}
                  buttonStyle="solid"
                  style={{ width: '100%', display: 'flex' }}
                >
                  <Radio.Button value="CANDIDATE" style={{ flex: 1, textAlign: 'center', height: 42, lineHeight: '42px', fontWeight: 600, borderRadius: '8px 0 0 8px' }}>
                    Ứng viên
                  </Radio.Button>
                  <Radio.Button value="HR_MANAGER" style={{ flex: 1, textAlign: 'center', height: 42, lineHeight: '42px', fontWeight: 600, borderRadius: '0 8px 8px 0' }}>
                    Nhà tuyển dụng
                  </Radio.Button>
                </Radio.Group>
              </Form.Item>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="name"
                    label={<span style={{ fontWeight: 600, color: '#334155' }}>Họ và tên</span>}
                    rules={[
                      { required: true, message: 'Vui lòng nhập họ tên' },
                      { min: 2, message: 'Tên phải có ít nhất 2 ký tự' },
                    ]}
                  >
                    <Input
                      prefix={<UserOutlined style={{ color: '#94a3b8' }} />}
                      placeholder="Nhập đầy đủ họ và tên"
                      autoComplete="name"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
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
                </Col>
              </Row>
              {accountType === 'HR_MANAGER' && (
                <Form.Item
                  name="companyId"
                  label={<span style={{ fontWeight: 600, color: '#334155' }}>Công ty</span>}
                  rules={[{ required: true, message: 'Vui lòng chọn công ty' }]}
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
                        <span style={{ color: '#94a3b8', fontSize: 13 }}>Không tìm thấy công ty</span>
                      )
                    }
                    options={companies.map((company) => ({ value: company.id, label: company.name }))}
                    suffixIcon={<BankOutlined />}
                  />
                </Form.Item>
              )}
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="password"
                    label={<span style={{ fontWeight: 600, color: '#334155' }}>Mật khẩu</span>}
                    rules={[
                      { required: true, message: 'Vui lòng nhập mật khẩu' },
                      { min: 6, message: 'Tối thiểu 6 ký tự' },
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined style={{ color: '#94a3b8' }} />}
                      placeholder="Tối thiểu 6 ký tự"
                      iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                      autoComplete="new-password"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="confirmPassword"
                    label={<span style={{ fontWeight: 600, color: '#334155' }}>Xác nhận mật khẩu</span>}
                    rules={[{ required: true, message: 'Vui lòng xác nhận mật khẩu' }]}
                  >
                    <Input.Password
                      prefix={<LockOutlined style={{ color: '#94a3b8' }} />}
                      placeholder="Nhập lại mật khẩu"
                      iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                      autoComplete="new-password"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
                disabled={loading}
                className="auth-submit-btn"
              >
                Tạo tài khoản
              </Button>
            </Form>
            <Divider style={{ margin: '24px 0 20px', fontSize: 13, color: '#cbd5e1' }}>hoặc</Divider>
            <Text style={{ color: '#64748b', display: 'block', textAlign: 'center', fontSize: 14 }}>
              Đã có tài khoản?{' '}
              <Link to="/login" style={{ color: '#1677ff', fontWeight: 600 }}>
                Đăng nhập ngay
              </Link>
            </Text>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default RegisterPage;
