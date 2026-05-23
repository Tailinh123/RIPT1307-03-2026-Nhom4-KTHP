import React from 'react';
import { Tag } from 'antd';
import type { ApplicationStatus } from '@/types/application';
import { statusColorMap, statusLabelMap, statusEmojiMap } from '@/utils/statusColor';

interface StatusBadgeProps {
  status: ApplicationStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  return (
    <Tag
      color={statusColorMap[status]}
      style={{
        borderRadius: 20,
        fontWeight: 600,
        fontSize: 12,
        padding: '2px 14px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        letterSpacing: '0.2px',
      }}
    >
      <span style={{ fontSize: 10 }}>{statusEmojiMap[status]}</span>
      {statusLabelMap[status]}
    </Tag>
  );
};

export default StatusBadge;
