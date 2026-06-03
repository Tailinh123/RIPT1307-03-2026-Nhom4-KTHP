import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Card,
  Typography,
  Button,
  Tag,
  Space,
  Skeleton,
  Avatar,
  Divider,
  Tooltip,
  Modal,
  Alert,
  notification,
  Breadcrumb,
} from 'antd';
import {
  ArrowLeftOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  HomeOutlined,
  WifiOutlined,
  ApartmentOutlined,
  SendOutlined,
  CalendarOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
  UserOutlined,
  GiftOutlined,
  BankOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useJobDetail } from '@/hooks/useJobDetail';
import ApplyModal from '@/components/job/ApplyModal';
import JobSkillTag from '@/components/job/JobSkillTag';
import { formatSalary } from '@/utils/formatSalary';
import { formatDate, daysUntil } from '@/utils/formatDate';
import { JOB_LEVEL_LABEL, WORK_MODE_LABEL, CATEGORY_NAME_MAP, JOB_TYPE_LABEL } from '@/utils/constants';
import type { ApplyFormData } from '@/components/job/ApplyModal';
import { applicationApi } from '@/api/applicationApi';
import { getBackendErrorMessage } from '@/utils/backendMessage';
const { Title, Text, Paragraph } = Typography;
const LEVEL_COLOR: Record<string, string> = {
  INTERN: '#1677ff',
  FRESHER: '#52c41a',
  JUNIOR: '#fa8c16',
  MIDDLE: '#722ed1',
  SENIOR: '#f5222d',
};
const WORK_MODE_ICON: Record<string, React.ReactNode> = {
  ONSITE: <HomeOutlined />,
  REMOTE: <WifiOutlined />,
  HYBRID: <ApartmentOutlined />,
};
const BulletList: React.FC<{ text: string }> = ({ text }) => {
  const [expanded, setExpanded] = useState(false);
  const lines = text.split('\n').filter((l) => l.trim().length > 0);
  const isLong = lines.length > 5;
  const visibleLines = expanded ? lines : lines.slice(0, 5);
  return (
    <div>
      <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none' }}>
        {visibleLines.map((line, idx) => {
          const clean = line.replace(/^[-•]\s*/, '');
          return (
            <li
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                marginBottom: 10,
                lineHeight: '1.65',
              }}
            >
              <span
                style={{
                  flexShrink: 0,
                  marginTop: 7,
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: '#1677ff',
                  display: 'inline-block',
                }}
              />
              <Text style={{ fontSize: 14, color: '#374151' }}>{clean}</Text>
            </li>
          );
        })}
      </ul>
      {isLong && (
        <Button
          type="link"
          style={{ padding: 0, marginTop: 8 }}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Thu gọn' : 'Xem thêm'}
        </Button>
      )}
    </div>
  );
};
const SectionBlock: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  accentColor?: string;
}> = ({ title, icon, children, accentColor = '#1677ff' }) => (
  <div style={{ marginBottom: 32 }}>
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginBottom: 16,
        paddingBottom: 12,
        borderBottom: '2px solid #f0f4ff',
      }}
    >
      <span style={{ color: accentColor, fontSize: 20 }}>{icon}</span>
      <Title level={5} style={{ margin: 0, color: '#1d1d1f', fontWeight: 700 }}>
        {title}
      </Title>
    </div>
    {children}
  </div>
);
const MetaChip: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  color?: string;
  bg?: string;
}> = ({ icon, label, value, color = '#595959', bg = '#f5f6fa' }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      background: bg,
      border: '1px solid #eef0f5',
      borderRadius: 8,
      padding: '10px 16px',
      flex: '1 1 160px',
      minWidth: 0,
    }}
  >
    <span style={{ color, fontSize: 17 }}>{icon}</span>
    <div style={{ minWidth: 0 }}>
      <Text style={{ fontSize: 11, color: '#8c8c8c', display: 'block', lineHeight: 1.2 }}>
        {label}
      </Text>
      <Text strong style={{ fontSize: 13, color: '#1d1d1f', display: 'block' }}>
        {value}
      </Text>
    </div>
  </div>
);
const JobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { job, loading, error } = useJobDetail(id);
  const [applyOpen, setApplyOpen] = useState(false);
  const [applyLoading, setApplyLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  useEffect(() => {
    const checkAppliedStatus = async () => {
      const userStr = localStorage.getItem('user');
      if (!userStr || !id) return;
      try {
        const user = JSON.parse(userStr);
        if (user?.role?.name === 'CANDIDATE') {
          const apps = await applicationApi.getMyApplications(1, 500);
          const alreadyApplied = apps.some((app: any) => String(app.job?.id || app.jobId) === String(id));
          setHasApplied(alreadyApplied);
        }
      } catch (err) {
        console.error('Error checking apply status:', err);
      }
    };
    checkAppliedStatus();
  }, [id]);
  const handleApplyClick = () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      notification.warning({
        message: 'Cần đăng nhập',
        description: 'Vui lòng đăng nhập với tài khoản ứng viên để nộp đơn.',
        placement: 'topRight',
      });
      navigate('/login');
      return;
    }
    setApplyOpen(true);
  };
  const handleApplySubmit = async (jobId: number, data: ApplyFormData) => {
    setApplyLoading(true);
    try {
      const result = await applicationApi.applyToJob(jobId, data.file);
      setApplyOpen(false);
      notification.success({
        message: 'Bạn đã nộp hồ sơ thành công!',
        description: result.applicationMessage,
        placement: 'topRight',
      });
      setHasApplied(true);
      setSuccessOpen(true);
    } catch (err: any) {
      const translatedMessage = getBackendErrorMessage(err, 'Có lỗi xảy ra trong quá trình nộp hồ sơ.');
      throw new Error(translatedMessage);
    } finally {
      setApplyLoading(false);
    }
  };
  if (loading) {
    return (
      <div className="page-enter" style={{ maxWidth: 1180, margin: '0 auto', padding: '24px' }}>
        <Button
          icon={<ArrowLeftOutlined />}
          type="text"
          style={{ marginBottom: 20, paddingLeft: 0, color: '#595959' }}
          onClick={() => navigate(-1)}
        >
          Hủy bỏ
        </Button>
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <Card style={{ borderRadius: 8, border: '1px solid #eef0f5' }}>
              <Skeleton active avatar={{ size: 64, shape: 'square' }} paragraph={{ rows: 8 }} />
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card style={{ borderRadius: 8, border: '1px solid #eef0f5' }}>
              <Skeleton active paragraph={{ rows: 4 }} />
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
  if (error || !job) {
    return (
      <div className="page-enter" style={{ maxWidth: 1180, margin: '0 auto', padding: '24px' }}>
        <Button
          icon={<ArrowLeftOutlined />}
          type="text"
          style={{ marginBottom: 20, paddingLeft: 0 }}
          onClick={() => navigate(-1)}
        >
          Hủy bỏ
        </Button>
        <Card
          style={{
            borderRadius: 8,
            border: '1px solid #eef0f5',
            textAlign: 'center',
            padding: '48px 24px',
          }}
        >
          <ExclamationCircleOutlined style={{ fontSize: 48, color: '#ff4d4f', marginBottom: 16 }} />
          <Title level={4}>Không tìm thấy việc làm</Title>
          <Text type="secondary">
            {error ?? 'Công việc này không tồn tại hoặc đã bị xoá.'}
          </Text>
          <br />
          <Button
            type="primary"
            style={{ marginTop: 20, borderRadius: 8 }}
            onClick={() => navigate('/jobs')}
          >
            Quay lại danh sách
          </Button>
        </Card>
      </div>
    );
  }
  const daysLeft = daysUntil(job.deadline || '');
  const isUrgent = daysLeft <= 7 && daysLeft >= 0;
  const expired = daysLeft < 0;
  const companyInitial = job.companyName.charAt(0).toUpperCase();
  const levelColor = LEVEL_COLOR[job.level] ?? '#1677ff';
  return (
    <div className="page-enter" style={{ maxWidth: 1180, margin: '0 auto', padding: '24px' }}>
      <Breadcrumb 
        separator={<RightOutlined style={{ fontSize: 10, color: '#cbd5e1' }} />}
        style={{ marginBottom: 12, fontSize: 14, color: '#64748b' }}
      >
        <Breadcrumb.Item>
          <span style={{ cursor: 'pointer', color: '#64748b', transition: 'color 0.2s' }} onClick={() => navigate('/jobs')} onMouseEnter={(e) => e.currentTarget.style.color = '#1677ff'} onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}>
            <HomeOutlined style={{ marginRight: 6 }} />
            Việc làm
          </span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <span style={{ color: '#1e293b', fontWeight: 600 }}>{job.title}</span>
        </Breadcrumb.Item>
      </Breadcrumb>
      <Button
        icon={<ArrowLeftOutlined />}
        type="text"
        style={{
          marginBottom: 20,
          paddingLeft: 0,
          color: '#595959',
          fontWeight: 500,
          fontSize: 14,
        }}
        onClick={() => navigate(-1)}
      >
        Quay lại
      </Button>
      <Row gutter={[24, 24]} align="top">
        <Col xs={24} lg={16}>
          <Card
            style={{
              borderRadius: 8,
              border: '1px solid #eef0f5',
              boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
            }}
            bodyStyle={{ padding: '28px 32px' }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18, marginBottom: 20 }}>
              <Avatar
                size={64}
                shape="square"
                src={job.companyLogo}
                style={{
                  background: `linear-gradient(135deg, ${levelColor}22, ${levelColor}44)`,
                  color: levelColor,
                  fontSize: 24,
                  fontWeight: 800,
                  borderRadius: 8,
                  border: `2px solid ${levelColor}33`,
                  flexShrink: 0,
                }}
              >
                {companyInitial}
              </Avatar>
              <div style={{ flex: 1, minWidth: 0 }}>
                <Title
                  level={4}
                  style={{
                    margin: 0,
                    marginBottom: 4,
                    fontSize: 20,
                    color: '#1d1d1f',
                    fontWeight: 700,
                    lineHeight: '26px',
                  }}
                >
                  {job.title}
                </Title>
                <Space size={6} wrap>
                  <Text style={{ fontSize: 14, color: '#1677ff', fontWeight: 600 }}>
                    {job.companyName}
                  </Text>
                  <Text type="secondary">·</Text>
                  <Tag
                    style={{
                      background: `${levelColor}15`,
                      color: levelColor,
                      border: 'none',
                      borderRadius: 6,
                      fontWeight: 700,
                      fontSize: 11,
                      padding: '1px 8px',
                    }}
                  >
                    {JOB_LEVEL_LABEL[job.level]}
                  </Tag>
                  {job.jobType && (
                    <Tag
                      style={{
                        background: '#fff7e6',
                        color: '#d46b08',
                        border: 'none',
                        borderRadius: 6,
                        fontWeight: 700,
                        fontSize: 11,
                        padding: '1px 8px',
                      }}
                    >
                      {JOB_TYPE_LABEL[job.jobType] || job.jobType}
                    </Tag>
                  )}
                  {job.category && job.category !== 'OTHER' && (
                    <Tag
                      style={{
                        background: '#f9f0ff',
                        color: '#722ed1',
                        border: 'none',
                        borderRadius: 6,
                        fontSize: 11,
                        padding: '1px 8px',
                      }}
                    >
                      {CATEGORY_NAME_MAP[job.category] || job.category}
                    </Tag>
                  )}
                </Space>
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
              {(job.skills || []).map((skill, idx) => (
                <JobSkillTag key={skill.id} skill={skill} index={idx} />
              ))}
            </div>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 10,
                marginBottom: 28,
              }}
            >
              <MetaChip
                icon={<DollarOutlined />}
                label="Mức lương"
                value={formatSalary(job.salaryMin || 0, job.salaryMax || 0)}
                color="#389e0d"
                bg="#f6ffed"
              />
              <MetaChip
                icon={<EnvironmentOutlined />}
                label="Địa điểm"
                value={job.location || ''}
                color="#1677ff"
                bg="#e6f4ff"
              />
              <MetaChip
                icon={<TeamOutlined />}
                label="Số lượng"
                value={`${job.headcount} thành viên`}
                color="#fa8c16"
                bg="#fff7e6"
              />
              <MetaChip
                icon={WORK_MODE_ICON[job.workMode]}
                label="Hình thức"
                value={WORK_MODE_LABEL[job.workMode]}
                color="#722ed1"
                bg="#f9f0ff"
              />
            </div>
            <Divider style={{ margin: '0 0 28px' }} />
            <SectionBlock
              title="Chi tiết công việc"
              icon={<FileTextOutlined />}
              accentColor="#1677ff"
            >
              {(job.description && /<[a-z][\s\S]*>/i.test(job.description)) ? (
                <div 
                  className="job-description-html"
                  dangerouslySetInnerHTML={{ __html: job.description }}
                  style={{
                    color: '#334155',
                    fontSize: 15,
                    lineHeight: 1.7,
                  }}
                />
              ) : (
                <BulletList text={job.description || ''} />
              )}
            </SectionBlock>
            {job.requirements && (
              <SectionBlock
                title="Yêu cầu ứng viên"
                icon={<UserOutlined />}
                accentColor="#1677ff"
              >
                <BulletList text={job.requirements} />
              </SectionBlock>
            )}
            {job.benefits && (
              <SectionBlock
                title="Quyền lợi"
                icon={<GiftOutlined />}
                accentColor="#1677ff"
              >
                <BulletList text={job.benefits || ''} />
              </SectionBlock>
            )}
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <div style={{ position: 'sticky', top: 88, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Card
              style={{
                borderRadius: 8,
                border: '1px solid #eef0f5',
                boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
              }}
              bodyStyle={{ padding: '20px 24px' }}
            >
              <div style={{ marginBottom: 18 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 6,
                  }}
                >
                  <Text style={{ fontSize: 12, color: '#8c8c8c', fontWeight: 500 }}>
                    Ngày kết thúc
                  </Text>
                  <CalendarOutlined style={{ color: '#8c8c8c', fontSize: 13 }} />
                </div>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    background: expired ? '#fff1f0' : isUrgent ? '#fff7e6' : '#f6ffed',
                    border: `1px solid ${expired ? '#ffccc7' : isUrgent ? '#ffd591' : '#b7eb8f'}`,
                    borderRadius: 8,
                    padding: '6px 14px',
                  }}
                >
                  <ClockCircleOutlined
                    style={{
                      color: expired ? '#ff4d4f' : isUrgent ? '#fa8c16' : '#52c41a',
                      fontSize: 14,
                    }}
                  />
                  <Text
                    strong
                    style={{
                      fontSize: 16,
                      color: expired ? '#ff4d4f' : isUrgent ? '#fa8c16' : '#389e0d',
                    }}
                  >
                    {formatDate(job.deadline || '')}
                  </Text>
                </div>
                {!expired && (
                  <Text
                    style={{
                      display: 'block',
                      marginTop: 6,
                      fontSize: 12,
                      color: isUrgent ? '#fa8c16' : '#8c8c8c',
                      fontWeight: isUrgent ? 600 : 400,
                    }}
                  >
                    {isUrgent ? `⚡ Chỉ còn ${daysLeft} ngày để ứng tuyển!` : `Còn ${daysLeft} ngày`}
                  </Text>
                )}
                {expired && (
                  <Text
                    style={{
                      display: 'block',
                      marginTop: 6,
                      fontSize: 12,
                      color: '#ff4d4f',
                      fontWeight: 600,
                    }}
                  >
                    Đã hết hạn nộp đơn
                  </Text>
                )}
              </div>
              <Tooltip title={hasApplied ? 'Bạn đã nộp đơn cho công việc này' : (expired ? 'Công việc này đã hết hạn ứng tuyển' : '')}>
                <Button
                  type="primary"
                  size="large"
                  icon={hasApplied ? <CheckCircleOutlined /> : <SendOutlined />}
                  disabled={expired || hasApplied}
                  onClick={handleApplyClick}
                  block
                  style={{
                    borderRadius: 8,
                    fontWeight: 700,
                    fontSize: 14,
                    height: 46,
                    background: (expired || hasApplied)
                      ? undefined
                      : 'linear-gradient(135deg, #1677ff 0%, #4096ff 100%)',
                    border: 'none',
                    boxShadow: (expired || hasApplied) ? 'none' : '0 4px 14px rgba(22,119,255,0.35)',
                    letterSpacing: 0,
                  }}
                >
                  {hasApplied ? 'ĐÃ ỨNG TUYỂN' : 'ỨNG TUYỂN CÔNG VIỆC'}
                </Button>
              </Tooltip>
              <Divider style={{ margin: '16px 0' }} />
              <Space direction="vertical" size={10} style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontSize: 12, color: '#8c8c8c' }}>Hình thức làm việc</Text>
                  <Tag
                    icon={WORK_MODE_ICON[job.workMode]}
                    style={{
                      background: '#f0f5ff',
                      color: '#2f54eb',
                      border: 'none',
                      borderRadius: 6,
                      fontSize: 12,
                    }}
                  >
                    {WORK_MODE_LABEL[job.workMode]}
                  </Tag>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontSize: 12, color: '#8c8c8c' }}>Cấp độ</Text>
                  <Tag
                    style={{
                      background: `${levelColor}15`,
                      color: levelColor,
                      border: 'none',
                      borderRadius: 6,
                      fontSize: 12,
                    }}
                  >
                    {JOB_LEVEL_LABEL[job.level]}
                  </Tag>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontSize: 12, color: '#8c8c8c' }}>Số lượng tuyển</Text>
                  <Text strong style={{ fontSize: 12, color: '#1d1d1f' }}>
                    {job.headcount} người
                  </Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontSize: 12, color: '#8c8c8c' }}>Địa điểm</Text>
                  <Text strong style={{ fontSize: 12, color: '#1d1d1f' }}>
                    {job.location}
                  </Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontSize: 12, color: '#8c8c8c' }}>Ngày đăng</Text>
                  <Text strong style={{ fontSize: 12, color: '#1d1d1f' }}>
                    {formatDate(job.createdAt || '')}
                  </Text>
                </div>
              </Space>
            </Card>
            <Card
              style={{
                borderRadius: 8,
                border: '1px solid #eef0f5',
                boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
              }}
              bodyStyle={{ padding: 22 }}
            >
              <Space align="start" size={14} style={{ width: '100%' }}>
                <Avatar
                  size={52}
                  shape="square"
                  src={job.companyLogo}
                  style={{
                    borderRadius: 8,
                    background: '#e6f4ff',
                    color: '#1677ff',
                    fontWeight: 800,
                    flexShrink: 0,
                  }}
                >
                  {companyInitial}
                </Avatar>
                <div style={{ minWidth: 0 }}>
                  <Text style={{ color: '#64748b', fontSize: 12, fontWeight: 600 }}>
                    Công ty tuyển dụng
                  </Text>
                  <Title level={5} style={{ margin: '4px 0 6px', color: '#111827' }}>
                    {job.companyName}
                  </Title>
                  <Tag icon={<BankOutlined />} color="blue" style={{ borderRadius: 4 }}>
                    {job.category ? CATEGORY_NAME_MAP[job.category] || job.category : 'Doanh nghiệp'}
                  </Tag>
                </div>
              </Space>
              <Divider style={{ margin: '16px 0' }} />
              <Space direction="vertical" size={10} style={{ width: '100%' }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <EnvironmentOutlined style={{ color: '#1677ff' }} />
                  <Text style={{ color: '#475569', fontSize: 13 }}>{job.location || 'Chưa cập nhật địa điểm'}</Text>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <TeamOutlined style={{ color: '#0f766e' }} />
                  <Text style={{ color: '#475569', fontSize: 13 }}>Đang tuyển {job.headcount} vị trí</Text>
                </div>
              </Space>
            </Card>
          </div>
        </Col>
      </Row>
      <ApplyModal
        job={job}
        open={applyOpen}
        onClose={() => setApplyOpen(false)}
        onSubmit={handleApplySubmit}
        loading={applyLoading}
      />
      <Modal
        open={successOpen}
        onCancel={() => setSuccessOpen(false)}
        footer={null}
        closable={true}
        centered
        width={520}
        maskStyle={{ backdropFilter: 'blur(2px)' }}
        bodyStyle={{ padding: 0 }}
      >
        <div style={{ padding: '28px 28px 24px' }}>
          <Space align="start" size={14} style={{ width: '100%', marginBottom: 22 }}>
            <span
              style={{
                width: 44,
                height: 44,
                borderRadius: 8,
                background: '#ecfdf3',
                color: '#16a34a',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <CheckCircleOutlined style={{ fontSize: 24 }} />
            </span>
            <div style={{ minWidth: 0 }}>
              <Text style={{ color: '#16a34a', fontSize: 12, fontWeight: 700, textTransform: 'uppercase' }}>
                Hồ sơ đã được gửi
              </Text>
              <Title level={4} style={{ margin: '4px 0 6px', color: '#111827', fontWeight: 700 }}>
                Ứng tuyển thành công
              </Title>
              <Paragraph style={{ color: '#64748b', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
                CV của bạn đã được chuyển đến nhà tuyển dụng. Bạn có thể theo dõi trạng thái xử lý trong trang hồ sơ.
              </Paragraph>
            </div>
          </Space>
          <div
            style={{
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              padding: '16px 18px',
              marginBottom: 18,
              background: '#ffffff',
            }}
          >
            <Space align="start" size={12} style={{ width: '100%' }}>
              <Avatar
                shape="square"
                size={44}
                style={{
                  borderRadius: 8,
                  background: '#eff6ff',
                  color: '#1677ff',
                  fontWeight: 800,
                  flexShrink: 0,
                }}
              >
                {companyInitial}
              </Avatar>
              <div style={{ minWidth: 0 }}>
                <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>
                  {job?.companyName}
                </Text>
                <Text strong style={{ fontSize: 16, color: '#111827', display: 'block' }}>
                  {job?.title}
                </Text>
                <Space size={8} wrap style={{ marginTop: 8 }}>
                  <Tag icon={<EnvironmentOutlined />} style={{ borderRadius: 4, marginInlineEnd: 0 }}>
                    {job?.location}
                  </Tag>
                  <Tag icon={<ClockCircleOutlined />} color="blue" style={{ borderRadius: 4, marginInlineEnd: 0 }}>
                    Đang chờ xét duyệt
                  </Tag>
                </Space>
              </div>
            </Space>
          </div>
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 8,
              padding: '14px 16px',
              marginBottom: 24,
            }}
          >
            <Text strong style={{ color: '#334155', fontSize: 14, display: 'block', marginBottom: 10 }}>
              Các bước tiếp theo
            </Text>
            <Space direction="vertical" size={8} style={{ width: '100%' }}>
              <Space align="start" size={10}>
                <FileTextOutlined style={{ color: '#1677ff', marginTop: 3 }} />
                <Text style={{ color: '#475569', fontSize: 13 }}>
                  Nhà tuyển dụng xem xét CV và thông tin ứng tuyển của bạn.
                </Text>
              </Space>
              <Space align="start" size={10}>
                <CalendarOutlined style={{ color: '#1677ff', marginTop: 3 }} />
                <Text style={{ color: '#475569', fontSize: 13 }}>
                  Kết quả sẽ được cập nhật trong danh sách đơn ứng tuyển.
                </Text>
              </Space>
            </Space>
          </div>
          <Space size={12} style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button
              size="large"
              onClick={() => {
                setSuccessOpen(false);
                navigate('/jobs');
              }}
              style={{ borderRadius: 8, fontWeight: 600, color: '#64748b' }}
            >
              Tìm thêm việc
            </Button>
            <Button
              type="primary"
              size="large"
              onClick={() => {
                setSuccessOpen(false);
                navigate('/applications');
              }}
              style={{
                borderRadius: 8,
                fontWeight: 600,
                background: '#1677ff',
                border: 'none',
              }}
            >
              Xem đơn ứng tuyển
            </Button>
          </Space>
        </div>
      </Modal>
    </div>
  );
};
export default JobDetailPage;
