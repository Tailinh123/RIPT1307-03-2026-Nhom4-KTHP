import React from 'react';
import { Avatar, Popover, Tag, Typography } from 'antd';
import {
  ApartmentOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  FireFilled,
  HomeOutlined,
  ThunderboltFilled,
  WifiOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { Job } from '@/types/job';
import { formatSalary } from '@/utils/formatSalary';
import { daysUntil, formatDate } from '@/utils/formatDate';
import {
  CATEGORY_NAME_MAP,
  JOB_LEVEL_LABEL,
  JOB_TYPE_LABEL,
  WORK_MODE_LABEL,
} from '@/utils/constants';
import JobSkillTag from './JobSkillTag';
const { Text, Title } = Typography;
const WORK_MODE_ICON: Record<string, React.ReactNode> = {
  ONSITE: <HomeOutlined />,
  REMOTE: <WifiOutlined />,
  HYBRID: <ApartmentOutlined />,
};
const LEVEL_PALETTE: Record<string, { color: string; bg: string; border: string }> = {
  INTERN: { color: '#1677ff', bg: '#e6f4ff', border: '#bae0ff' },
  FRESHER: { color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
  JUNIOR: { color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
  MIDDLE: { color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe' },
  SENIOR: { color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
};
const CompanyPopoverContent: React.FC<{ job: Job; companyLogo?: string }> = ({ job, companyLogo }) => {
  const company = job.company;
  const companyName = company?.name || job.companyName || 'Chưa cập nhật';
  const initial = companyName.charAt(0).toUpperCase();
  return (
    <div style={{ width: 280, padding: '4px 0' }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
        <Avatar
          size={48}
          src={companyLogo}
          style={{
            background: companyLogo ? '#fff' : 'linear-gradient(135deg, #1677ff, #4096ff)',
            color: '#fff',
            fontSize: 20,
            fontWeight: 800,
            flexShrink: 0,
            border: companyLogo ? '1.5px solid #e5e7eb' : 'none',
            borderRadius: 10,
          }}
        >
          {initial}
        </Avatar>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Text strong style={{ fontSize: 14, display: 'block', color: '#0f172a' }} ellipsis>
            {companyName}
          </Text>
          {(job as any).companyIndustry && (
            <Text style={{ fontSize: 12, color: '#64748b' }}>
              <GlobalOutlined style={{ marginRight: 4, fontSize: 11 }} />
              {(job as any).companyIndustry}
            </Text>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {(job as any).companyDescription && (
          <Text
            style={{
              fontSize: 12,
              color: '#475569',
              lineHeight: '18px',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {(job as any).companyDescription}
          </Text>
        )}
        {job.location && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <EnvironmentOutlined style={{ color: '#94a3b8', fontSize: 12 }} />
            <Text style={{ fontSize: 12, color: '#475569' }}>{job.location}</Text>
          </div>
        )}
      </div>
      <div
        style={{
          marginTop: 10,
          paddingTop: 8,
          borderTop: '1px solid #f1f5f9',
          textAlign: 'center',
        }}
      >
        <Text style={{ fontSize: 11, color: '#94a3b8' }}>
          Click vào job để xem chi tiết
        </Text>
      </div>
    </div>
  );
};
interface JobCardProps { job: Job; }
const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const navigate = useNavigate();
  const daysLeft = daysUntil(job.deadline || '');
  const isUrgent = daysLeft <= 7 && daysLeft >= 0;
  const expired = daysLeft < 0;
  const isHot = Boolean(job.isHot) || (job.salaryMax || 0) >= 15_000_000;
  const palette = LEVEL_PALETTE[job.level] || LEVEL_PALETTE.INTERN;
  const initial = (job.companyName || job.title || 'J').charAt(0).toUpperCase();
  const companyLogo = job.companyLogo || job.company?.logoUrl;
  const skills = job.skills || [];
  const salary = formatSalary(job.salaryMin || 0, job.salaryMax || 0);
  return (
    <div
      className="job-card"
      onClick={() => navigate(`/jobs/${job.id}`)}
      style={{
        position: 'relative',
        borderRadius: 14,
        border: '1px solid #eef0f5',
        background: '#ffffff',
        boxShadow: '0 2px 8px rgba(15,23,42,0.04), 0 1px 2px rgba(15,23,42,0.02)',
        cursor: 'pointer',
        transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      {isUrgent && (
        <div style={{
          position: 'absolute', top: 12, right: 12,
          display: 'flex', alignItems: 'center', gap: 4,
          background: 'linear-gradient(135deg, #ef4444, #f87171)',
          color: '#fff', fontSize: 10, fontWeight: 800,
          padding: '3px 8px', borderRadius: 6, letterSpacing: 0.4,
          zIndex: 1,
        }}>
          <ThunderboltFilled style={{ fontSize: 9 }} /> URGENT
        </div>
      )}
      {!isUrgent && isHot && (
        <div style={{
          position: 'absolute', top: 12, right: 12,
          display: 'flex', alignItems: 'center', gap: 4,
          background: 'linear-gradient(135deg, #f97316, #fb923c)',
          color: '#fff', fontSize: 10, fontWeight: 800,
          padding: '3px 8px', borderRadius: 6, letterSpacing: 0.4,
          zIndex: 1,
        }}>
          <FireFilled style={{ fontSize: 9 }} /> HOT
        </div>
      )}
      <div style={{ padding: '16px 18px 14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
          <Avatar
            size={46}
            src={companyLogo}
            style={{
              background: companyLogo ? '#fff' : palette.bg,
              color: palette.color,
              fontSize: 18,
              fontWeight: 800,
              flexShrink: 0,
              border: companyLogo ? '1.5px solid #e5e7eb' : `1.5px solid ${palette.border}`,
              borderRadius: 12,
            }}
          >
            {initial}
          </Avatar>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Title
              level={5}
              ellipsis={{ rows: 2 }}
              style={{ margin: 0, fontSize: 14, lineHeight: '20px', color: '#0f172a', fontWeight: 700 }}
            >
              {job.title}
            </Title>
            <Popover
              content={<CompanyPopoverContent job={job} companyLogo={companyLogo} />}
              trigger="hover"
              placement="bottomLeft"
              mouseEnterDelay={0.15}
              mouseLeaveDelay={0.05}
              overlayClassName="company-popover"
              overlayInnerStyle={{ borderRadius: 12, padding: '12px 16px' }}
              align={{ offset: [0, 0] }}
            >
              <div 
                onClick={e => e.stopPropagation()} 
                style={{ display: 'inline-block', maxWidth: '100%', marginTop: 3, padding: '2px 0' }}
              >
                <Text
                  ellipsis
                  className="company-name-link"
                  style={{
                    display: 'block',
                    fontSize: 12,
                    color: '#1677ff',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  {job.companyName}
                </Text>
              </div>
            </Popover>
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 12 }}>
          {job.category && job.category !== 'OTHER' && (
            <Tag style={{
              background: '#f5f3ff', color: '#7c3aed',
              border: '1px solid #ddd6fe', borderRadius: 6,
              fontSize: 11, fontWeight: 700, margin: 0, padding: '1px 8px',
            }}>
              {CATEGORY_NAME_MAP[job.category] || job.category}
            </Tag>
          )}
          <Tag style={{
            background: palette.bg, color: palette.color,
            border: `1px solid ${palette.border}`, borderRadius: 6,
            fontSize: 11, fontWeight: 700, margin: 0, padding: '1px 8px',
          }}>
            {JOB_LEVEL_LABEL[job.level] || job.level}
          </Tag>
          {job.jobType && (
            <Tag style={{
              background: '#fff7ed', color: '#c2410c',
              border: '1px solid #fed7aa', borderRadius: 6,
              fontSize: 11, fontWeight: 700, margin: 0, padding: '1px 8px',
            }}>
              {JOB_TYPE_LABEL[job.jobType] || job.jobType}
            </Tag>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <EnvironmentOutlined style={{ color: '#94a3b8', fontSize: 12, flexShrink: 0 }} />
            <Text style={{ fontSize: 12, color: '#475569' }}>{job.location || 'Chưa cập nhật'}</Text>
            <span style={{ color: '#cbd5e1', fontSize: 10 }}>·</span>
            <span style={{ color: '#94a3b8', fontSize: 12 }}>{WORK_MODE_ICON[job.workMode]}</span>
            <Text style={{ fontSize: 12, color: '#475569' }}>{WORK_MODE_LABEL[job.workMode] || job.workMode}</Text>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <DollarOutlined style={{ color: '#16a34a', fontSize: 12, flexShrink: 0 }} />
            <Text style={{ fontSize: 12.5, fontWeight: 700, color: '#15803d' }}>
              {salary}
            </Text>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <ClockCircleOutlined style={{ color: isUrgent ? '#ef4444' : '#94a3b8', fontSize: 12, flexShrink: 0 }} />
            <Text style={{ fontSize: 11.5, color: isUrgent ? '#ef4444' : '#64748b', fontWeight: isUrgent ? 600 : 400 }}>
              {expired
                ? 'Đã hết hạn'
                : isUrgent
                  ? `Còn ${daysLeft} ngày`
                  : `Hết hạn ${formatDate(job.deadline || '')}`}
            </Text>
          </div>
        </div>
        <div style={{ flex: 1, display: 'flex', flexWrap: 'nowrap', gap: 5, alignItems: 'center', overflow: 'hidden' }}>
          {skills.slice(0, 3).map((skill, index) => (
            <JobSkillTag key={skill.id} skill={skill} index={index} />
          ))}
          {skills.length > 3 && (
            <Tag style={{
              borderRadius: 5, border: '1px dashed #d1d5db',
              background: 'transparent', color: '#94a3b8', fontSize: 11, margin: 0,
              flexShrink: 0,
            }}>
              +{skills.length - 3}
            </Tag>
          )}
        </div>
      </div>
    </div>
  );
};
export default React.memo(JobCard);
