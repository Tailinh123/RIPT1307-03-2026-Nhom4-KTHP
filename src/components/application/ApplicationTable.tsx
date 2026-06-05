import React from 'react';
import { Table, Typography, Avatar, Skeleton, Pagination } from 'antd';
import {
  WarningOutlined,
} from '@ant-design/icons';
import EmptyState from '@/components/common/EmptyState';
import type { ColumnsType } from 'antd/es/table';
import type { Application } from '@/types/application';
import StatusBadge from './StatusBadge';
import { formatDate, formatDatetime } from '@/utils/formatDate';
const { Text } = Typography;
interface ApplicationTableProps {
  applications: Application[];
  total: number;
  loading: boolean;
  error: string | null;
  page: number;
  pageSize: number;
  onPageChange: (p: number) => void;
}
const COMPANY_COLORS = [
  '#1677ff', '#52c41a', '#fa8c16', '#722ed1', '#eb2f96',
  '#13c2c2', '#2f54eb', '#fadb14', '#a0d911', '#f5222d',
];
function getCompanyColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COMPANY_COLORS[Math.abs(hash) % COMPANY_COLORS.length];
}
const columns: ColumnsType<Application> = [
  {
    title: 'Vị trí ứng tuyển',
    dataIndex: 'jobTitle',
    key: 'jobTitle',
    width: '30%',
    render: (title: string, record: Application) => {
      const companyName = record.companyName || record.job?.company?.name || 'Không rõ công ty';
      const jobTitle = title || record.jobTitle || record.job?.name || 'Không rõ vị trí';
      const color = getCompanyColor(companyName);
      const initial = companyName.charAt(0).toUpperCase();
      const logoUrl = (record.job?.company as any)?.logoUrl || (record.job?.company as any)?.logo || (record as any).companyLogo;

      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar
            size={40}
            shape="square"
            src={logoUrl}
            style={{
              background: `linear-gradient(135deg, ${color}22, ${color}44)`,
              color: color,
              fontSize: 16,
              fontWeight: 800,
              borderRadius: 10,
              border: `1.5px solid ${color}33`,
              flexShrink: 0,
            }}
          >
            {!logoUrl && initial}
          </Avatar>
          <div style={{ minWidth: 0 }}>
            <Text strong style={{ fontSize: 14, color: '#1d1d1f', display: 'block', lineHeight: '20px' }}>
              {jobTitle}
            </Text>
            <Text style={{ fontSize: 12, color: '#1677ff', fontWeight: 500 }}>
              {companyName}
            </Text>
          </div>
        </div>
      );
    },
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    key: 'status',
    width: '15%',
    align: 'center',
    render: (status: Application['status']) => <StatusBadge status={status} />,
  },
  {
    title: 'Ngày nộp',
    dataIndex: 'appliedAt',
    key: 'appliedAt',
    width: '15%',
    render: (date: string) => (
      <div>
        <Text style={{ fontSize: 13, color: '#1d1d1f', display: 'block', fontWeight: 500 }}>
          {formatDate(date)}
        </Text>
        <Text style={{ fontSize: 11, color: '#8c8c8c' }}>
          {formatDatetime(date).split(' ')[0]}
        </Text>
      </div>
    ),
  },
  {
    title: 'Ghi chú',
    dataIndex: 'note',
    key: 'note',
    width: '40%',
    render: (note: string | undefined, record: Application) => {
      if (record.status !== 'REJECTED' || !note) {
        return (
          <Text style={{ fontSize: 13, color: '#bfbfbf' }}>—</Text>
        );
      }
      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 8,
            background: '#fff2f0',
            border: '1px solid #ffccc7',
            borderRadius: 8,
            padding: '8px 12px',
          }}
        >
          <WarningOutlined
            style={{
              color: '#ff4d4f',
              fontSize: 13,
              marginTop: 3,
              flexShrink: 0,
            }}
          />
          <div style={{ minWidth: 0 }}>
            <Text
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: '#cf1322',
                display: 'block',
                marginBottom: 2,
                textTransform: 'uppercase',
                letterSpacing: '0.3px',
              }}
            >
              Phản hồi từ HR
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: '#595959',
                lineHeight: '1.5',
                display: 'block',
              }}
            >
              {note}
            </Text>
          </div>
        </div>
      );
    },
  },
];
const ApplicationTable: React.FC<ApplicationTableProps> = ({
  applications,
  total,
  loading,
  error,
  page,
  pageSize,
  onPageChange,
}) => {
  if (loading) {
    return (
      <div style={{ padding: '24px 0' }}>
        <Skeleton active paragraph={{ rows: 6 }} />
      </div>
    );
  }
  if (applications.length === 0 && !error) {
    return (
      <EmptyState
        illustration="no-applications"
        title="Chưa có đơn ứng tuyển nào"
        description="Hãy tìm và ứng tuyển các vị trí thực tập tại trang Bảng việc làm để bắt đầu hành trình sự nghiệp."
        actionText="Tìm việc ngay"
        onAction={() => window.location.href = '/jobs'}
      />
    );
  }
  return (
    <div>
      <Table<Application>
        columns={columns}
        dataSource={applications}
        rowKey="id"
        pagination={false}
        size="middle"
        scroll={{ x: 'max-content' }}
        style={{ marginBottom: 16 }}
        rowClassName={() => 'application-table-row'}
      />
      {total > pageSize && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 0 0',
          }}
        >
          <Text style={{ fontSize: 13, color: '#8c8c8c' }}>
            {`${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, total)} trên ${total} hồ sơ`}
          </Text>
          <Pagination
            current={page}
            total={total}
            pageSize={pageSize}
            onChange={onPageChange}
            size="small"
            showSizeChanger={false}
          />
        </div>
      )}
    </div>
  );
};
export default ApplicationTable;
