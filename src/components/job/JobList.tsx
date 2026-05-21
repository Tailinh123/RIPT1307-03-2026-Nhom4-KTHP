import React from 'react';
import { Row, Col, Pagination, Empty, Alert, Typography, Space, Tag, Skeleton } from 'antd';
import { AppstoreOutlined } from '@ant-design/icons';
import type { Job } from '@/types/job';
import JobCard from './JobCard';

const { Text } = Typography;

interface JobListProps {
  jobs: Job[];
  total: number;
  loading: boolean;
  error: string | null;
  page: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
}

const JobList: React.FC<JobListProps> = ({
  jobs,
  total,
  loading,
  error,
  page,
  pageSize = 12,
  onPageChange,
}) => {
  return (
    <div>
      {/* ── Backend Error Alert ── */}
      {error && (
        <Alert
          type="warning"
          showIcon
          message="Không kết nối được Backend"
          description={`${error} — Đang hiển thị dữ liệu mẫu.`}
          style={{ marginBottom: 20, borderRadius: 10 }}
        />
      )}

      {/* ── Result summary ── */}
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Space>
          <AppstoreOutlined style={{ color: '#1677ff' }} />
          <Text style={{ color: '#595959' }}>
            Tìm thấy{' '}
            <Text strong style={{ color: '#1d1d1f' }}>
              {total}
            </Text>{' '}
            vị trí tuyển dụng
          </Text>
        </Space>
        <Space>
          <Tag color="blue" style={{ borderRadius: 6 }}>Trang {page}</Tag>
        </Space>
      </div>

      {/* ── Grid ── */}
      {loading ? (
        <Row gutter={[20, 20]}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Col key={i} xs={24} sm={12} md={12} lg={8} xl={8}>
              <div
                style={{
                  background: '#fff',
                  borderRadius: 14,
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
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <span style={{ color: '#8c8c8c' }}>
              Không tìm thấy việc làm phù hợp. Hãy thử điều chỉnh bộ lọc.
            </span>
          }
          style={{ margin: '60px 0' }}
        />
      ) : (
        <Row gutter={[20, 20]}>
          {jobs.map((job) => (
            <Col key={job.id} xs={24} sm={12} md={12} lg={8} xl={8}>
              <JobCard job={job} />
            </Col>
          ))}
        </Row>
      )}

      {/* ── Pagination ── */}
      {!loading && total > pageSize && (
        <div style={{ marginTop: 32, textAlign: 'center' }}>
          <Pagination
            current={page}
            total={total}
            pageSize={pageSize}
            onChange={onPageChange}
            showSizeChanger={false}
            showQuickJumper
            showTotal={(tot) => `Tổng ${tot} việc làm`}
          />
        </div>
      )}
    </div>
  );
};

export default JobList;
