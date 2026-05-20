import React, { useState } from 'react';
import { Modal, Select, Typography, Space, Alert } from 'antd';
import { SendOutlined, FileTextOutlined } from '@ant-design/icons';
import type { Job } from '@/types/job';
import { JOB_LEVEL_LABEL, WORK_MODE_LABEL } from '@/utils/constants';
import { formatSalary } from '@/utils/formatSalary';

const { Text, Title } = Typography;

interface ApplyModalProps {
  job: Job | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (jobId: number, resumeId: number) => void;
  loading?: boolean;
}

// Mock resumes for demo
const mockResumes = [
  { id: 1, name: 'CV_Frontend_2024.pdf' },
  { id: 2, name: 'CV_General_2024.pdf' },
  { id: 3, name: 'CV_ReactDev.pdf' },
];

const ApplyModal: React.FC<ApplyModalProps> = ({ job, open, onClose, onSubmit, loading }) => {
  const [selectedResume, setSelectedResume] = useState<number | undefined>();

  if (!job) return null;

  const handleSubmit = () => {
    if (!selectedResume) return;
    onSubmit(job.id, selectedResume);
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      okText="Gửi đơn ứng tuyển"
      cancelText="Huỷ"
      okButtonProps={{
        icon: <SendOutlined />,
        loading,
        disabled: !selectedResume,
        style: { borderRadius: 8 },
      }}
      cancelButtonProps={{ style: { borderRadius: 8 } }}
      title={
        <Space>
          <SendOutlined style={{ color: '#1677ff' }} />
          <span>Ứng tuyển vị trí</span>
        </Space>
      }
      width={520}
      styles={{ body: { paddingTop: 8 } }}
    >
      {/* Job summary */}
      <div
        style={{
          background: '#f5f8ff',
          borderRadius: 10,
          padding: '14px 16px',
          marginBottom: 20,
          border: '1px solid #dbe8ff',
        }}
      >
        <Title level={5} style={{ margin: 0, marginBottom: 6 }}>{job.title}</Title>
        <Space wrap>
          <Text style={{ color: '#595959' }}>{job.companyName}</Text>
          <Text type="secondary">·</Text>
          <Text style={{ color: '#389e0d', fontWeight: 500 }}>{formatSalary(job.salaryMin, job.salaryMax)}</Text>
          <Text type="secondary">·</Text>
          <Text style={{ color: '#595959' }}>{JOB_LEVEL_LABEL[job.level]}</Text>
          <Text type="secondary">·</Text>
          <Text style={{ color: '#595959' }}>{WORK_MODE_LABEL[job.workMode]}</Text>
        </Space>
      </div>

      {/* Resume selection */}
      <div style={{ marginBottom: 16 }}>
        <Text strong style={{ display: 'block', marginBottom: 8 }}>
          <FileTextOutlined style={{ marginRight: 6, color: '#1677ff' }} />
          Chọn CV để ứng tuyển
        </Text>
        <Select
          placeholder="-- Chọn CV của bạn --"
          style={{ width: '100%', borderRadius: 8 }}
          value={selectedResume}
          onChange={setSelectedResume}
          options={mockResumes.map((r) => ({ label: r.name, value: r.id }))}
          size="large"
        />
      </div>

      <Alert
        type="info"
        showIcon
        message="Sau khi gửi đơn, nhà tuyển dụng sẽ xem xét hồ sơ của bạn trong vòng 3-5 ngày làm việc."
        style={{ borderRadius: 8, fontSize: 12 }}
      />
    </Modal>
  );
};

export default ApplyModal;
