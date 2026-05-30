import React from 'react';
import { Card, Typography, Space, Tag, Button, Avatar } from 'antd';
import {
  EnvironmentOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  HomeOutlined,
  WifiOutlined,
  ApartmentOutlined,
} from '@ant-design/icons';
import type { Job } from '@/types/job';
import { formatSalary } from '@/utils/formatSalary';
import { formatDate, daysUntil } from '@/utils/formatDate';
import { JOB_LEVEL_LABEL, WORK_MODE_LABEL } from '@/utils/constants';
import JobSkillTag from './JobSkillTag';
import { useNavigate } from 'react-router-dom';

const { Text, Title } = Typography;

const WORK_MODE_ICON: Record<string, React.ReactNode> = {
  ONSITE: <HomeOutlined />,
  REMOTE: <WifiOutlined />,
  HYBRID: <ApartmentOutlined />,
};

const LEVEL_COLOR: Record<string, string> = {
  INTERN: '#1677ff',
  FRESHER: '#52c41a',
  JUNIOR: '#fa8c16',
  MIDDLE: '#722ed1',
  SENIOR: '#f5222d',
};

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const navigate = useNavigate();
  const daysLeft = daysUntil(job.deadline);
  const isUrgent = daysLeft <= 7 && daysLeft >= 0;
  const expired = daysLeft < 0;

  const companyInitial = job.companyName.charAt(0).toUpperCase();

  return (
    <Card
      hoverable
      style={{
        borderRadius: 14,
        border: '1px solid #eef0f5',
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
        transition: 'all 0.25s ease',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
      bodyStyle={{ padding: 20, display: 'flex', flexDirection: 'column', height: '100%' }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 30px rgba(22,119,255,0.12)';
        (e.currentTarget as HTMLDivElement).style.borderColor = '#91caff';
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)';
        (e.currentTarget as HTMLDivElement).style.borderColor = '#eef0f5';
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
      }}
    >
      {/* ── Header: Logo + Company + Level ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
        <Avatar
          size={48}
          style={{
            background: `linear-gradient(135deg, ${LEVEL_COLOR[job.level]}22, ${LEVEL_COLOR[job.level]}44)`,
            color: LEVEL_COLOR[job.level],
            fontSize: 18,
            fontWeight: 700,
            flexShrink: 0,
            border: `2px solid ${LEVEL_COLOR[job.level]}33`,
          }}
        >
          {companyInitial}
        </Avatar>

        <div style={{ flex: 1, minWidth: 0 }}>
          <Title
            level={5}
            ellipsis={{ rows: 2 }}
            style={{ margin: 0, fontSize: 15, lineHeight: '20px', color: '#1d1d1f', marginBottom: 4 }}
          >
            {job.title}
          </Title>
          <Text style={{ fontSize: 13, color: '#595959', fontWeight: 500 }}>
            {job.companyName}
          </Text>
        </div>

        <Tag
          style={{
            background: `${LEVEL_COLOR[job.level]}15`,
            color: LEVEL_COLOR[job.level],
            border: 'none',
            borderRadius: 6,
            fontWeight: 600,
            fontSize: 11,
            padding: '2px 8px',
            flexShrink: 0,
          }}
        >
          {JOB_LEVEL_LABEL[job.level]}
        </Tag>
      </div>

      {/* ── Meta info ── */}
      <Space direction="vertical" size={6} style={{ marginBottom: 14, width: '100%' }}>
        <Space size={6}>
          <EnvironmentOutlined style={{ color: '#8c8c8c', fontSize: 13 }} />
          <Text style={{ fontSize: 13, color: '#595959' }}>{job.location}</Text>
          <span style={{ color: '#d9d9d9' }}>·</span>
          {WORK_MODE_ICON[job.workMode]}
          <Text style={{ fontSize: 13, color: '#595959' }}>{WORK_MODE_LABEL[job.workMode]}</Text>
        </Space>

        <Space size={6}>
          <DollarOutlined style={{ color: '#52c41a', fontSize: 13 }} />
          <Text strong style={{ fontSize: 13, color: '#389e0d' }}>
            {formatSalary(job.salaryMin, job.salaryMax)}
          </Text>
        </Space>

        <Space size={6}>
          <ClockCircleOutlined style={{ color: isUrgent ? '#ff4d4f' : '#8c8c8c', fontSize: 13 }} />
          <Text style={{ fontSize: 12, color: isUrgent ? '#ff4d4f' : '#8c8c8c' }}>
            {expired
              ? 'Đã hết hạn'
              : isUrgent
              ? `Còn ${daysLeft} ngày`
              : `Hết hạn ${formatDate(job.deadline)}`}
          </Text>
        </Space>
      </Space>

      {/* ── Skills ── */}
      <div style={{ marginBottom: 16, flex: 1 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {job.skills.slice(0, 4).map((skill, idx) => (
            <JobSkillTag key={skill.id} skill={skill} index={idx} />
          ))}
          {job.skills.length > 4 && (
            <Tag style={{ borderRadius: 6, border: '1px dashed #d9d9d9', background: 'transparent', color: '#8c8c8c', fontSize: 12 }}>
              +{job.skills.length - 4}
            </Tag>
          )}
        </div>
      </div>

      {/* ── Actions ── */}
      <div style={{ marginTop: 'auto' }}>
        <Button
          type="primary"
          icon={<EyeOutlined />}
          size="small"
          style={{ width: '100%', borderRadius: 8, fontSize: 13, height: 34 }}
          onClick={() => navigate(`/jobs/${job.id}`)}
        >
          Xem chi tiết
        </Button>
      </div>
    </Card>
  );
};

export default JobCard;
