import React from 'react';
import { Typography } from 'antd';
import {
  CodeOutlined,
  LineChartOutlined,
  HighlightOutlined,
  DollarOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import type { Job } from '@/types/job';
import { useJobs } from '@/hooks/useJobs';
import JobFilter from '@/components/job/JobFilter';
import JobList from '@/components/job/JobList';
import type { JobFilterParams } from '@/types/job';

const { Title, Text } = Typography;


// ── Category badge config ──
const CATEGORY_BADGES = [
  { label: 'IT / Phần mềm', icon: <CodeOutlined style={{ fontSize: 13 }} />, color: '#1677ff', bg: '#e6f4ff', borderColor: '#91caff' },
  { label: 'Marketing', icon: <LineChartOutlined style={{ fontSize: 13 }} />, color: '#d48806', bg: '#fffbe6', borderColor: '#ffe58f' },
  { label: 'Thiết kế', icon: <HighlightOutlined style={{ fontSize: 13 }} />, color: '#722ed1', bg: '#f9f0ff', borderColor: '#d3adf7' },
  { label: 'Tài chính', icon: <DollarOutlined style={{ fontSize: 13 }} />, color: '#389e0d', bg: '#f6ffed', borderColor: '#b7eb8f' },
  { label: 'Nhân sự', icon: <TeamOutlined style={{ fontSize: 13 }} />, color: '#cf1322', bg: '#fff1f0', borderColor: '#ffa39e' },
];

const JobBoardPage: React.FC = () => {
  const { jobs, total, loading, error, filters, setFilters, page, setPage } = useJobs();

  return (
    <div>
      {/* ── Page Header — Clean SaaS style ── */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 14,
          border: '1px solid #eef0f5',
          padding: '28px 32px 24px',
          marginBottom: 24,
        }}
      >
        {/* Title row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
            marginBottom: 20,
          }}
        >
          <div>
            <Title
              level={3}
              style={{
                margin: 0,
                marginBottom: 4,
                fontSize: 24,
                fontWeight: 700,
                color: '#111827',
                letterSpacing: '-0.3px',
              }}
            >
              Tìm kiếm việc làm thực tập
            </Title>
            <Text style={{ fontSize: 14, color: '#6b7280', lineHeight: '20px' }}>
              Khám phá hàng trăm cơ hội thực tập từ các công ty hàng đầu Việt Nam
            </Text>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: '#f0f0f0', marginBottom: 18 }} />

        {/* Category badges */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          {CATEGORY_BADGES.map((badge) => (
            <div
              key={badge.label}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '5px 14px',
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                background: badge.bg,
                color: badge.color,
                border: `1px solid ${badge.borderColor}`,
              }}
            >
              {badge.icon}
              {badge.label}
            </div>
          ))}
        </div>
      </div>


      {/* ── Filter ── */}
      <JobFilter
        filters={filters}
        onChange={(f: JobFilterParams) => setFilters(f)}
        loading={loading}
      />

      {/* ── Job List ── */}
      <JobList
        jobs={jobs}
        total={total}
        loading={loading}
        error={error}
        page={page}
        pageSize={12}
        onPageChange={setPage}
      />
    </div>
  );
};

export default JobBoardPage;
