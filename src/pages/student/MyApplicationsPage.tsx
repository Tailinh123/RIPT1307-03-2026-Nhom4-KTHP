import React from 'react';
import { Alert, Card, Typography } from 'antd';
import {
  OrderedListOutlined,
  ClockCircleOutlined,
  SyncOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { useApplications } from '@/hooks/useApplications';
import ApplicationFilters from '@/components/application/ApplicationFilters';
import ApplicationTable from '@/components/application/ApplicationTable';
import type { ApplicationStatus } from '@/types/application';

const { Title, Text } = Typography;

const STATUS_BADGES: {
  key: ApplicationStatus | 'ALL';
  label: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  borderColor: string;
}[] = [
  {
    key: 'PENDING',
    label: 'Chờ xét duyệt',
    icon: <ClockCircleOutlined style={{ fontSize: 13 }} />,
    color: '#d48806',
    bg: '#fffbe6',
    borderColor: '#ffe58f',
  },
  {
    key: 'REVIEWING',
    label: 'Đang xem xét',
    icon: <SyncOutlined style={{ fontSize: 13 }} />,
    color: '#1677ff',
    bg: '#e6f4ff',
    borderColor: '#91caff',
  },
  {
    key: 'APPROVED',
    label: 'Đã duyệt',
    icon: <CheckCircleOutlined style={{ fontSize: 13 }} />,
    color: '#389e0d',
    bg: '#f6ffed',
    borderColor: '#b7eb8f',
  },
  {
    key: 'REJECTED',
    label: 'Bị từ chối',
    icon: <CloseCircleOutlined style={{ fontSize: 13 }} />,
    color: '#cf1322',
    bg: '#fff1f0',
    borderColor: '#ffa39e',
  },
];

const MyApplicationsPage: React.FC = () => {
  const {
    applications,
    total,
    loading,
    error,
    statusFilter,
    setStatusFilter,
    searchKeyword,
    setSearchKeyword,
    page,
    setPage,
    pageSize,
    statusCounts,
  } = useApplications();


  return (
    <div>
      <div
        style={{
          background: '#ffffff',
          borderRadius: 14,
          border: '1px solid #eef0f5',
          padding: '28px 32px 24px',
          marginBottom: 24,
        }}
      >
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
              Lịch sử ứng tuyển
            </Title>
            <Text style={{ fontSize: 14, color: '#6b7280', lineHeight: '20px' }}>
              Theo dõi trạng thái đơn ứng tuyển và phản hồi từ nhà tuyển dụng
            </Text>
          </div>
        </div>

        <div style={{ height: 1, background: '#f0f0f0', marginBottom: 18 }} />

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <div
            onClick={() => setStatusFilter('ALL')}
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
              background: statusFilter === 'ALL' ? '#111827' : '#f9fafb',
              color: statusFilter === 'ALL' ? '#ffffff' : '#6b7280',
              border: `1px solid ${statusFilter === 'ALL' ? '#111827' : '#e5e7eb'}`,
            }}
          >
            <OrderedListOutlined style={{ fontSize: 13 }} />
            Tất cả
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                background: statusFilter === 'ALL' ? 'rgba(255,255,255,0.2)' : '#e5e7eb',
                color: statusFilter === 'ALL' ? '#ffffff' : '#6b7280',
                borderRadius: 10,
                padding: '0 7px',
                lineHeight: '18px',
              }}
            >
              {statusCounts.total}
            </span>
          </div>

          {STATUS_BADGES.map((badge) => {
            const isActive = statusFilter === badge.key;
            const count = statusCounts[badge.key as ApplicationStatus] ?? 0;
            return (
              <div
                key={badge.key}
                onClick={() => setStatusFilter(isActive ? 'ALL' : badge.key)}
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
                  background: isActive ? badge.bg : '#f9fafb',
                  color: isActive ? badge.color : '#6b7280',
                  border: `1px solid ${isActive ? badge.borderColor : '#e5e7eb'}`,
                }}
              >
                {badge.icon}
                {badge.label}
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    background: isActive ? `${badge.color}18` : '#e5e7eb',
                    color: isActive ? badge.color : '#6b7280',
                    borderRadius: 10,
                    padding: '0 7px',
                    lineHeight: '18px',
                  }}
                >
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>


      {error && (
        <Alert
          type="warning"
          showIcon
          icon={<InfoCircleOutlined />}
          message="Không thể kết nối đến máy chủ"
          description={error}
          style={{ marginBottom: 20, borderRadius: 10 }}
          closable
        />
      )}

      <Card
        style={{
          borderRadius: 14,
          border: '1px solid #eef0f5',
          boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
        }}
        bodyStyle={{ padding: '24px 28px' }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
            marginBottom: 20,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: '#f0ecff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
                color: '#722ed1',
              }}
            >
              <OrderedListOutlined />
            </div>
            <div>
              <Title level={5} style={{ margin: 0, fontSize: 16, color: '#1d1d1f', fontWeight: 700 }}>
                Danh sách đơn ứng tuyển
              </Title>
              <Text style={{ fontSize: 12, color: '#8c8c8c' }}>
                Hiển thị {applications.length} / {total} đơn
              </Text>
            </div>
          </div>

          <ApplicationFilters
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            searchKeyword={searchKeyword}
            onSearchChange={setSearchKeyword}
          />
        </div>

        <ApplicationTable
          applications={applications}
          total={total}
          loading={loading}
          error={error}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
        />
      </Card>
    </div>
  );
};

export default MyApplicationsPage;
