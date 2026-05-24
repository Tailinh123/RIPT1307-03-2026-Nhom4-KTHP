import React from 'react';
import { Typography } from 'antd';
import { useJobs } from '@/hooks/useJobs';
import JobFilter from '@/components/job/JobFilter';
import JobList from '@/components/job/JobList';
import type { JobFilterParams } from '@/types/job';

const { Title, Text } = Typography;

const JobBoardPage: React.FC = () => {
  const { jobs, total, loading, error, filters, setFilters, page, setPage } = useJobs();

  return (
    <div>
      {/* ── HERO SECTION — true full-width bleed ── */}
      <div
        style={{
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
          marginTop: -28,
          position: 'relative',
          background: 'linear-gradient(135deg, #0a3d8f 0%, #1155cc 45%, #1a6fd4 75%, #1e88e5 100%)',
          paddingBottom: 96,
          overflow: 'hidden',
        }}
      >
        {/* ── Decorative SVG pattern (subtle diagonal lines + circles) ── */}
        <svg
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.08, pointerEvents: 'none' }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="diag" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
              <line x1="0" y1="0" x2="0" y2="40" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#diag)" />
          {/* Large soft circles */}
          <circle cx="5%" cy="20%" r="120" fill="white" fillOpacity="0.04" />
          <circle cx="90%" cy="80%" r="180" fill="white" fillOpacity="0.03" />
          <circle cx="80%" cy="10%" r="80" fill="white" fillOpacity="0.05" />
        </svg>

        {/* ── Hero text (centered) ── */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            textAlign: 'center',
            padding: '60px 32px 44px',
          }}
        >
          <Title
            level={1}
            style={{
              color: '#ffffff',
              margin: 0,
              marginBottom: 12,
              fontSize: 'clamp(26px, 4vw, 40px)',
              fontWeight: 800,
              letterSpacing: '-0.5px',
              lineHeight: 1.2,
              textShadow: '0 2px 12px rgba(0,0,0,0.2)',
            }}
          >
            Tìm kiếm việc làm nhanh chóng
          </Title>
          <Text
            style={{
              color: 'rgba(255,255,255,0.85)',
              fontSize: 'clamp(14px, 1.8vw, 17px)',
              display: 'block',
              letterSpacing: '0.1px',
            }}
          >
            Khám phá hàng trăm cơ hội thực tập từ các công ty hàng đầu Việt Nam
          </Text>
        </div>
      </div>

      {/* ── FILTER BAR — overlaps hero bottom via negative margin-top ── */}
      <div
        style={{
          marginLeft: -32,
          marginRight: -32,
          padding: '0 32px',
          marginTop: -48,
          position: 'relative',
          zIndex: 10,
          marginBottom: 28,
        }}
      >
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <JobFilter
            filters={filters}
            onChange={(f: JobFilterParams) => setFilters(f)}
            loading={loading}
          />
        </div>
      </div>

      {/* ── JOB LIST ── */}
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
