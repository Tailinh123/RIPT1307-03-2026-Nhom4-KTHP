import React, { useState } from 'react';
import { Row, Col, Card, Typography, Space, Tag } from 'antd';
import {
  AppstoreOutlined,
  FireOutlined,
  EnvironmentOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import type { Job } from '@/types/job';
import { useJobs } from '@/hooks/useJobs';
import JobFilter from '@/components/job/JobFilter';
import JobList from '@/components/job/JobList';
import ApplyModal from '@/components/job/ApplyModal';
import type { JobFilterParams } from '@/types/job';

const { Title, Text } = Typography;

const STAT_CARDS = [
  { label: 'Tổng việc làm', value: 248, icon: <AppstoreOutlined />, color: '#1677ff', bg: '#e6f4ff' },
  { label: 'Đang hot', value: 32, icon: <FireOutlined />, color: '#ff4d4f', bg: '#fff1f0' },
  { label: 'Địa điểm', value: 15, icon: <EnvironmentOutlined />, color: '#52c41a', bg: '#f6ffed' },
  { label: 'Công ty tuyển dụng', value: 86, icon: <TrophyOutlined />, color: '#fa8c16', bg: '#fff7e6' },
];

const JobBoardPage: React.FC = () => {
  const { jobs, total, loading, error, filters, setFilters, page, setPage } = useJobs();
  const [applyJob, setApplyJob] = useState<Job | null>(null);
  const [applyLoading, setApplyLoading] = useState(false);

  const handleApplySubmit = (jobId: string | number, resumeId: number) => {
    console.log('Apply submit:', { jobId, resumeId });
    setApplyLoading(true);
    setTimeout(() => {
      setApplyLoading(false);
      setApplyJob(null);
    }, 1200);
  };

  return (
    <div>
      {/* ── Page Hero ── */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1677ff 0%, #4096ff 50%, #69b1ff 100%)',
          borderRadius: 16,
          padding: '28px 32px',
          marginBottom: 24,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute', top: -30, right: -30,
            width: 200, height: 200, borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
          }}
        />
        <div
          style={{
            position: 'absolute', bottom: -50, right: 80,
            width: 150, height: 150, borderRadius: '50%',
            background: 'rgba(255,255,255,0.04)',
          }}
        />
        <Title level={3} style={{ color: '#fff', margin: 0, marginBottom: 6 }}>
          Tìm kiếm việc làm thực tập
        </Title>
        <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15 }}>
          Khám phá hàng trăm cơ hội thực tập từ các công ty hàng đầu Việt Nam
        </Text>
        <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['IT / Phần mềm', 'Marketing', 'Thiết kế', 'Tài chính', 'Nhân sự'].map((cat) => (
            <Tag
              key={cat}
              style={{
                background: 'rgba(255,255,255,0.18)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: 20,
                padding: '2px 14px',
                fontSize: 13,
                cursor: 'pointer',
                backdropFilter: 'blur(4px)',
              }}
            >
              {cat}
            </Tag>
          ))}
        </div>
      </div>

      {/* ── Stats Row ── */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {STAT_CARDS.map((stat) => (
          <Col key={stat.label} xs={12} sm={12} md={6} lg={6}>
            <Card
              style={{
                borderRadius: 12,
                border: '1px solid #eef0f5',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}
              bodyStyle={{ padding: '16px 20px' }}
            >
              <Space>
                <div
                  style={{
                    width: 42, height: 42, borderRadius: 10,
                    background: stat.bg, display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    fontSize: 18, color: stat.color,
                  }}
                >
                  {stat.icon}
                </div>
                <div>
                  <Text style={{ fontSize: 12, color: '#8c8c8c', display: 'block' }}>{stat.label}</Text>
                  <Text strong style={{ fontSize: 22, color: '#1d1d1f', lineHeight: '28px' }}>
                    {stat.value}
                  </Text>
                </div>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

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
        onApply={(job) => setApplyJob(job)}
      />

      {/* ── Apply Modal ── */}
      <ApplyModal
        job={applyJob}
        open={!!applyJob}
        onClose={() => setApplyJob(null)}
        onSubmit={handleApplySubmit}
        loading={applyLoading}
      />
    </div>
  );
};

export default JobBoardPage;
