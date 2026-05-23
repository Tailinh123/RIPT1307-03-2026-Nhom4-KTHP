import React from 'react';
import { Input, Select, Space } from 'antd';
import { SearchOutlined, FilterOutlined, AppstoreOutlined } from '@ant-design/icons';
import type { ApplicationStatus } from '@/types/application';
import { statusLabelMap, statusEmojiMap } from '@/utils/statusColor';

interface ApplicationFiltersProps {
  statusFilter: ApplicationStatus | 'ALL';
  onStatusChange: (s: ApplicationStatus | 'ALL') => void;
  searchKeyword: string;
  onSearchChange: (k: string) => void;
}

const STATUS_OPTIONS: { value: ApplicationStatus | 'ALL'; label: React.ReactNode }[] = [
  { value: 'ALL', label: <><AppstoreOutlined style={{ marginRight: 6 }} />Tất cả trạng thái</> },
  { value: 'PENDING', label: `${statusEmojiMap.PENDING} ${statusLabelMap.PENDING}` },
  { value: 'REVIEWING', label: `${statusEmojiMap.REVIEWING} ${statusLabelMap.REVIEWING}` },
  { value: 'APPROVED', label: `${statusEmojiMap.APPROVED} ${statusLabelMap.APPROVED}` },
  { value: 'REJECTED', label: `${statusEmojiMap.REJECTED} ${statusLabelMap.REJECTED}` },
];

const ApplicationFilters: React.FC<ApplicationFiltersProps> = ({
  statusFilter,
  onStatusChange,
  searchKeyword,
  onSearchChange,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        flexWrap: 'wrap',
      }}
    >
      <Input
        placeholder="Tìm theo vị trí, công ty..."
        prefix={<SearchOutlined style={{ color: '#8c8c8c' }} />}
        value={searchKeyword}
        onChange={(e) => onSearchChange(e.target.value)}
        allowClear
        style={{
          width: 280,
          borderRadius: 8,
          border: '1px solid #e8eaed',
        }}
      />
      <Select
        value={statusFilter}
        onChange={onStatusChange}
        options={STATUS_OPTIONS}
        suffixIcon={<FilterOutlined style={{ color: '#8c8c8c' }} />}
        style={{ width: 220 }}
        popupMatchSelectWidth={false}
      />
    </div>
  );
};

export default ApplicationFilters;
