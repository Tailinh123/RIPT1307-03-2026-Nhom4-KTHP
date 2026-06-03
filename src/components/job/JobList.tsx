import React from 'react';
import { Alert, Col, Pagination, Row, Skeleton, Space, Tag, Typography, Button } from 'antd';
import { AppstoreOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import type { Job } from '@/types/job';
import JobCard from './JobCard';
import EmptyState from '@/components/common/EmptyState';

const { Text } = Typography;

interface JobListProps {
  jobs: Job[];
  total: number;
  loading: boolean;
  error: string | null;
  page: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  onApply?: (job: Job) => void;
  onClearFilters?: () => void;
}

const JobList: React.FC<JobListProps> = ({
  jobs,
  total,
  loading,
  error,
  page,
  pageSize = 12,
  onPageChange,
  onClearFilters,
}) => {
  return (
    <div>
      {error && (
        <Alert
          type="warning"
          showIcon
          message="Không kết nối được backend"
          description={error}
          style={{ marginBottom: 18, borderRadius: 8 }}
        />
      )}

      <div
        style={{
          marginBottom: 18,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        <Space>
          {onClearFilters && (
            <Button 
              type="dashed" 
              icon={<ArrowLeftOutlined />} 
              onClick={onClearFilters}
              style={{ marginRight: 8, borderRadius: 8, color: '#64748b' }}
            >
              Quay lại
            </Button>
          )}
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              background: '#e6f4ff',
              color: '#1677ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AppstoreOutlined />
          </div>
          <Text style={{ color: '#475569', fontSize: 14 }}>
            Tìm thấy <Text strong>{total}</Text> vị trí tuyển dụng
          </Text>
        </Space>
        <Tag color="blue" style={{ borderRadius: 8, padding: '3px 10px', margin: 0 }}>
          Trang {page}
        </Tag>
      </div>
      {loading ? (
        <Row gutter={[24, 24]}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Col key={index} xs={24} md={12} xl={8}>
              <div
                style={{
                  background: '#fff',
                  borderRadius: 8,
                  padding: 20,
                  border: '1px solid #eef0f5',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                }}
              >
                <Skeleton avatar active paragraph={{ rows: 4 }} />
              </div>
            </Col>
          ))}
        </Row>
      ) : jobs.length === 0 ? (
        <EmptyState
          illustration="no-jobs"
          title="Không tìm thấy việc làm phù hợp"
          description="Hãy thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm để khám phá thêm cơ hội."
          actionText={onClearFilters ? "Quay lại" : undefined}
          onAction={onClearFilters}
        />
      ) : (
        <Row gutter={[24, 24]}>
          {jobs.map((job) => (
            <Col key={job.id} xs={24} md={12} xl={8}>
              <JobCard job={job} />
            </Col>
          ))}
        </Row>
      )}
      {!loading && total > pageSize && (
        <div style={{ marginTop: 34, textAlign: 'center' }}>
          <Pagination
            current={page}
            total={total}
            pageSize={pageSize}
            onChange={onPageChange}
            showSizeChanger={false}
            showQuickJumper
            showTotal={(count) => `Tổng ${count} việc làm`}
          />
        </div>
      )}
    </div>
  );
};
export default React.memo(JobList);
