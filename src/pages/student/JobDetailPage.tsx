import React, { useState } from 'react';
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
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useJobDetail } from '@/hooks/useJobDetail';
import ApplyModal from '@/components/job/ApplyModal';
import JobSkillTag from '@/components/job/JobSkillTag';
import { formatSalary } from '@/utils/formatSalary';
import { formatDate, daysUntil } from '@/utils/formatDate';
import { JOB_LEVEL_LABEL, WORK_MODE_LABEL, CATEGORY_LABEL } from '@/utils/constants';
import type { ApplyFormData } from '@/components/job/ApplyModal';
import { applicationApi } from '@/api/applicationApi';


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

// ── Renders a multi-line bullet text ──────────────────────────────────────
const BulletList: React.FC<{ text: string }> = ({ text }) => {
  const lines = text.split('\n').filter((l) => l.trim().length > 0);
  return (
    <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none' }}>
      {lines.map((line, idx) => {
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
  );
};

// ── Section block ─────────────────────────────────────────────────────────
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

// ── Meta chip ─────────────────────────────────────────────────────────────
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
      borderRadius: 10,
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

// ── Main page component ────────────────────────────────────────────────────
const JobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { job, loading, error } = useJobDetail(id);
  const [applyOpen, setApplyOpen] = useState(false);
  const [applyLoading, setApplyLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const handleApplySubmit = async (jobId: number, data: ApplyFormData) => {
    setApplyLoading(true);
    try {
      await applicationApi.applyToJob(jobId, data.file);
      setApplyOpen(false);
      setSuccessOpen(true);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ??
        err?.message ??
        'Vui lòng thử lại sau.';
      notification.error({
        message: 'Ứng tuyển thất bại',
        description: msg,
        placement: 'topRight',
      });
    } finally {
      setApplyLoading(false);
    }
  };

  // ── Skeleton loading state ──
  if (loading) {
    return (
      <div>
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
            <Card style={{ borderRadius: 14, border: '1px solid #eef0f5' }}>
              <Skeleton active avatar={{ size: 64, shape: 'square' }} paragraph={{ rows: 8 }} />
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card style={{ borderRadius: 14, border: '1px solid #eef0f5' }}>
              <Skeleton active paragraph={{ rows: 4 }} />
            </Card>
          </Col>
        </Row>
      </div>
    );
  }

  // ── Error state ──
  if (error || !job) {
    return (
      <div>
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
            borderRadius: 14,
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

  const daysLeft = daysUntil(job.deadline);
  const isUrgent = daysLeft <= 7 && daysLeft >= 0;
  const expired = daysLeft < 0;
  const companyInitial = job.companyName.charAt(0).toUpperCase();
  const levelColor = LEVEL_COLOR[job.level] ?? '#1677ff';

  return (
    <div>
      {/* ── Back button ── */}
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
        {/* ════════════════════════════════════════════════
            LEFT COLUMN — Job detail content
         */}
        <Col xs={24} lg={16}>
          <Card
            style={{
              borderRadius: 14,
              border: '1px solid #eef0f5',
              boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
            }}
            bodyStyle={{ padding: '28px 32px' }}
          >
            {/* ── Header: Avatar + Title + Company ── */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18, marginBottom: 20 }}>
              <Avatar
                size={64}
                shape="square"
                style={{
                  background: `linear-gradient(135deg, ${levelColor}22, ${levelColor}44)`,
                  color: levelColor,
                  fontSize: 24,
                  fontWeight: 800,
                  borderRadius: 14,
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
                  <Tag
                    style={{
                      background: '#f0f5ff',
                      color: '#2f54eb',
                      border: 'none',
                      borderRadius: 6,
                      fontSize: 11,
                      padding: '1px 8px',
                    }}
                  >
                    {CATEGORY_LABEL[job.category]}
                  </Tag>
                </Space>
              </div>
            </div>

            {/* ── Skills ── */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
              {job.skills.map((skill, idx) => (
                <JobSkillTag key={skill.id} skill={skill} index={idx} />
              ))}
            </div>

            {/* ── Meta chips ── */}
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
                value={formatSalary(job.salaryMin, job.salaryMax)}
                color="#389e0d"
                bg="#f6ffed"
              />
              <MetaChip
                icon={<EnvironmentOutlined />}
                label="Địa điểm"
                value={job.location}
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

            {/* ── Chi tiết công việc ── */}
            <SectionBlock
              title="Chi tiết công việc"
              icon={<FileTextOutlined />}
              accentColor="#1677ff"
            >
              <BulletList text={job.description} />
            </SectionBlock>

            {/* ── Yêu cầu ứng viên ── */}
            <SectionBlock
              title="Yêu cầu ứng viên"
              icon={<UserOutlined />}
              accentColor="#1677ff"
            >
              <BulletList text={job.requirements} />
            </SectionBlock>

            {/* ── Quyền lợi ── */}
            {job.benefits && (
              <SectionBlock
                title="Quyền lợi"
                icon={<GiftOutlined />}
                accentColor="#1677ff"
              >
                <BulletList text={job.benefits} />
              </SectionBlock>
            )}
          </Card>
        </Col>

        {/* ════════════════════════════════════════════════
            RIGHT COLUMN — Apply sidebar
         */}
        <Col xs={24} lg={8}>
          <div style={{ position: 'sticky', top: 88, display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* ── Apply card ── */}
            <Card
              style={{
                borderRadius: 14,
                border: '1px solid #eef0f5',
                boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
              }}
              bodyStyle={{ padding: '20px 24px' }}
            >
              {/* Deadline */}
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
                    {formatDate(job.deadline)}
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

              {/* Apply button */}
              <Tooltip title={expired ? 'Công việc này đã hết hạn ứng tuyển' : ''}>
                <Button
                  type="primary"
                  size="large"
                  icon={<SendOutlined />}
                  disabled={expired}
                  onClick={() => setApplyOpen(true)}
                  block
                  style={{
                    borderRadius: 10,
                    fontWeight: 700,
                    fontSize: 14,
                    height: 46,
                    background: expired
                      ? undefined
                      : 'linear-gradient(135deg, #1677ff 0%, #4096ff 100%)',
                    border: 'none',
                    boxShadow: expired ? 'none' : '0 4px 14px rgba(22,119,255,0.35)',
                    letterSpacing: '0.3px',
                  }}
                >
                  ỨNG TUYỂN CÔNG VIỆC
                </Button>
              </Tooltip>

              <Divider style={{ margin: '16px 0' }} />

              {/* Quick stats */}
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
                    {formatDate(job.createdAt)}
                  </Text>
                </div>
              </Space>
            </Card>



          </div>
        </Col>
      </Row>

      {/* ── Apply modal ── */}
      <ApplyModal
        job={job}
        open={applyOpen}
        onClose={() => setApplyOpen(false)}
        onSubmit={handleApplySubmit}
        loading={applyLoading}
      />

      {/* ── Success modal ── */}
      <Modal
        open={successOpen}
        onCancel={() => setSuccessOpen(false)}
        footer={null}
        closable={false}
        centered
        width={460}
      >
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ marginBottom: 20 }}>
            <CheckCircleOutlined style={{ fontSize: 72, color: '#52c41a' }} />
          </div>
          <Title level={4} style={{ color: '#1d1d1f', marginBottom: 12 }}>
            Nộp đơn thành công!
          </Title>
          <Paragraph
            style={{
              fontSize: 14,
              color: '#595959',
              marginBottom: 24,
              lineHeight: '1.6',
            }}
          >
            Đơn ứng tuyển vị trí <Text strong>{job?.title}</Text> tại{' '}
            <Text strong>{job?.companyName}</Text> đã được gửi thành công.
          </Paragraph>
          <Alert
            type="info"
            showIcon
            message="Nhà tuyển dụng sẽ xem xét hồ sơ của bạn trong vòng 3–5 ngày làm việc."
            style={{ marginBottom: 24, textAlign: 'left', borderRadius: 8 }}
          />
          <Button
            type="primary"
            size="large"
            onClick={() => setSuccessOpen(false)}
            style={{ borderRadius: 8, minWidth: 160 }}
          >
            Hoàn tất
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default JobDetailPage;
