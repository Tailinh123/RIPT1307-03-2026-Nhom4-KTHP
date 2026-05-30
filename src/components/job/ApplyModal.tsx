import React, { useState } from 'react';
import {
  Modal,
  Typography,
  Space,
  Alert,
  Upload,
  Input,
  Form,
  notification,
  Button,
} from 'antd';
import {
  SendOutlined,
  InboxOutlined,
  FileTextOutlined,
  CheckCircleFilled,
  DeleteOutlined,
} from '@ant-design/icons';
import type { UploadFile } from 'antd';
import type { Job } from '@/types/job';
import { JOB_LEVEL_LABEL, WORK_MODE_LABEL } from '@/utils/constants';
import { formatSalary } from '@/utils/formatSalary';

const { Text, Title } = Typography;
const { Dragger } = Upload;

export interface ApplyFormData {
  file: File;
}

interface ApplyModalProps {
  job: Job | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (jobId: number, data: ApplyFormData) => void;
  loading?: boolean;
}

const ApplyModal: React.FC<ApplyModalProps> = ({ job, open, onClose, onSubmit, loading }) => {
  const [form] = Form.useForm();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  if (!job) return null;

  const handleSubmit = async () => {
    try {
      if (!selectedFile) {
        notification.warning({
          message: 'Chưa chọn CV',
          description: 'Vui lòng tải lên file CV của bạn.',
          placement: 'topRight',
        });
        return;
      }
      onSubmit(job.id, { file: selectedFile });
    } catch {
      // form validation error
    }
  };

  const handleClose = () => {
    form.resetFields();
    setSelectedFile(null);
    setFileList([]);
    onClose();
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFileList([]);
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      title={
        <Space>
          <SendOutlined style={{ color: '#1677ff' }} />
          <span style={{ fontWeight: 700, fontSize: 16 }}>Ứng tuyển công việc</span>
        </Space>
      }
      width={520}
      bodyStyle={{ paddingTop: 12 }}
      destroyOnClose
    >
      {/* ── Job summary banner ── */}
      <div
        style={{
          background: 'linear-gradient(135deg, #f0f7ff 0%, #e6f4ff 100%)',
          borderRadius: 10,
          padding: '12px 16px',
          marginBottom: 20,
          border: '1px solid #bae0ff',
        }}
      >
        <Text strong style={{ fontSize: 14, color: '#1d1d1f', display: 'block', marginBottom: 4 }}>
          {job.title}
        </Text>
        <Space wrap size={4}>
          <Text style={{ color: '#1677ff', fontWeight: 500, fontSize: 12 }}>
            {job.companyName}
          </Text>
          <Text type="secondary" style={{ fontSize: 12 }}>·</Text>
          <Text style={{ color: '#389e0d', fontWeight: 600, fontSize: 12 }}>
            {formatSalary(job.salaryMin, job.salaryMax)}
          </Text>
          <Text type="secondary" style={{ fontSize: 12 }}>·</Text>
          <Text style={{ color: '#595959', fontSize: 12 }}>{JOB_LEVEL_LABEL[job.level]}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>·</Text>
          <Text style={{ color: '#595959', fontSize: 12 }}>{WORK_MODE_LABEL[job.workMode]}</Text>
        </Space>
      </div>

      <Form form={form} layout="vertical" requiredMark={false}>
        {/* ── Tên công việc ── */}
        <Form.Item label={<Text style={{ fontSize: 13, fontWeight: 600 }}>Tên công việc</Text>}>
          <Input
            value={job.title}
            readOnly
            style={{
              borderRadius: 8,
              background: '#f9fafb',
              color: '#595959',
              border: '1px solid #e8eaed',
            }}
          />
        </Form.Item>

        {/* ── CV Upload ── */}
        <Form.Item label={<Text style={{ fontSize: 13, fontWeight: 600 }}>CV của bạn</Text>}>
          {!selectedFile ? (
            <Dragger
              accept=".pdf,.docx"
              maxCount={1}
              fileList={fileList}
              showUploadList={false}
              beforeUpload={(file) => {
                const isPdfOrDocx =
                  file.type === 'application/pdf' ||
                  file.type ===
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                  file.name.endsWith('.docx') ||
                  file.name.endsWith('.pdf');

                if (!isPdfOrDocx) {
                  notification.error({
                    message: 'Định dạng không hợp lệ',
                    description: 'Chỉ chấp nhận file PDF hoặc DOCX!',
                  });
                  return Upload.LIST_IGNORE;
                }

                const isUnder5MB = file.size / 1024 / 1024 < 5;
                if (!isUnder5MB) {
                  notification.error({
                    message: 'File quá lớn',
                    description: 'File CV phải nhỏ hơn 5MB!',
                  });
                  return Upload.LIST_IGNORE;
                }

                setSelectedFile(file as unknown as File);
                setFileList([{ uid: '1', name: file.name, status: 'done' }]);
                return false;
              }}
              style={{ borderRadius: 10 }}
            >
              <div style={{ padding: '12px 0' }}>
                <p className="ant-upload-drag-icon" style={{ marginBottom: 8 }}>
                  <InboxOutlined style={{ fontSize: 36, color: '#1677ff' }} />
                </p>
                <p style={{ fontSize: 13, color: '#1d1d1f', fontWeight: 500, margin: '0 0 4px' }}>
                  Kéo thả hoặc click để tải lên CV
                </p>
                <p style={{ fontSize: 12, color: '#8c8c8c', margin: 0 }}>
                  .pdf, .docx (Tối đa 5MB)
                </p>
              </div>
            </Dragger>
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 14px',
                background: '#f6ffed',
                border: '1px solid #b7eb8f',
                borderRadius: 8,
              }}
            >
              <CheckCircleFilled style={{ color: '#52c41a', fontSize: 16 }} />
              <FileTextOutlined style={{ color: '#1677ff', fontSize: 16 }} />
              <Text style={{ flex: 1, fontSize: 13, fontWeight: 500, color: '#1d1d1f' }}>
                {selectedFile.name}
              </Text>
              <Button
                type="text"
                size="small"
                icon={<DeleteOutlined style={{ color: '#ff4d4f' }} />}
                onClick={handleRemoveFile}
                style={{ color: '#ff4d4f', padding: '0 4px' }}
              />
            </div>
          )}
        </Form.Item>
      </Form>

      <Alert
        type="info"
        showIcon
        message="Sau khi gửi đơn, nhà tuyển dụng sẽ xem xét hồ sơ của bạn trong vòng 3–5 ngày làm việc."
        style={{ borderRadius: 8, fontSize: 12, marginBottom: 20 }}
      />

      {/* ── Footer buttons ── */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
        <Button
          onClick={handleClose}
          style={{ borderRadius: 8, minWidth: 88 }}
          disabled={loading}
        >
          Huỷ
        </Button>
        <Button
          type="primary"
          icon={<SendOutlined />}
          loading={loading}
          onClick={handleSubmit}
          style={{ borderRadius: 8, minWidth: 140 }}
        >
          Nộp đơn ứng tuyển
        </Button>
      </div>
    </Modal>
  );
};

export default ApplyModal;
