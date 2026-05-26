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
      {/* ── HERO SECTION — Full-width banner with overlay ── */}
      <div
        className="hero-section"
        style={{
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
          marginTop: -28,
          position: 'relative',
          backgroundImage: 'url(/images/banner.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          paddingBottom: 140,
          overflow: 'hidden',
          minHeight: 400,
        }}
      >
        {/* ── Dark overlay for better text visibility ── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(10, 61, 143, 0.35) 0%, rgba(10, 61, 143, 0.28) 50%, rgba(10, 61, 143, 0.32) 100%)',
            pointerEvents: 'none',
          }}
        />

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
              textShadow: '0 3px 16px rgba(0,0,0,0.3)',
            }}
          >
            Tìm kiếm việc làm nhanh chóng
          </Title>
          <Text
            style={{
              color: 'rgba(255,255,255,0.9)',
              fontSize: 'clamp(14px, 1.8vw, 17px)',
              display: 'block',
              letterSpacing: '0.1px',
              textShadow: '0 2px 8px rgba(0,0,0,0.2)',
            }}
          >
            Khám phá hàng trăm cơ hội thực tập từ các công ty hàng đầu Việt Nam!
          </Text>
        </div>
      </div>

      {/* ── FILTER BAR — overlaps hero bottom via negative margin-top ── */}
      <div
        style={{
          marginLeft: -32,
          marginRight: -32,
          padding: '0 32px',
          marginTop: 0,
          transform: 'translateY(-150px)',
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
