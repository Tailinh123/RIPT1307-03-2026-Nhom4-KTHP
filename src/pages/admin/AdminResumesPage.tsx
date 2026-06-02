import { useState } from 'react';
import type { ColumnsType } from 'antd/es/table';
import { Button, Typography, message } from 'antd';
import { LinkOutlined } from '@ant-design/icons';
import { adminApi } from '@/api/adminApi';
import axiosClient from '@/api/axiosClient';
import AdminCrudPage from '@/components/admin/AdminCrudPage';
import type { AdminResume } from '@/types/admin';
import { formatDateTime, loadAll } from './adminUtils';
const { Text } = Typography;
const getResumeFileName = (url: string) =>
  url
    .replace(/^.*[/\\]/, '')
    .replace(/^storage\//, "")
    .replace(/^uploads\/resume\//, "")
    .replace(/^resume\//, "")
    .replace(/^cv\//, "")
const getMimeType = (fileName: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  if (ext === 'pdf') return 'application/pdf';
  if (ext === 'doc') return 'application/msword';
  if (ext === 'docx') return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  return 'application/octet-stream';
};
const ViewResumeButton = ({ url }: { url: string }) => {
  const [loading, setLoading] = useState(false);
  const handleOpen = async () => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }
    setLoading(true);
    try {
      const fileName = getResumeFileName(url);
      const res = await axiosClient.get('/api/v1/files', {
        params: { folder: 'resume', fileName },
        responseType: 'blob',
      });
      const objectUrl = URL.createObjectURL(new Blob([res.data], { type: getMimeType(fileName) }));
      const win = window.open(objectUrl, '_blank');
      if (!win) {
        const link = document.createElement('a');
        link.href = objectUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      setTimeout(() => URL.revokeObjectURL(objectUrl), 30000);
    } catch {
      message.error('Không thể mở CV, vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <Button onClick={handleOpen} loading={loading} icon={<LinkOutlined />} size="small">
      Mở CV
    </Button>
  );
};
import { FilePdfOutlined, UserOutlined } from '@ant-design/icons';
import { Space, Avatar } from 'antd';

const columns: ColumnsType<AdminResume> = [
  { 
    title: 'ID', 
    dataIndex: 'id', 
    width: 60,
    align: 'center',
    render: (id) => <Text type="secondary">#{id}</Text>
  },
  { 
    title: 'Tiêu đề CV', 
    dataIndex: 'title', 
    width: 250,
    render: (title) => (
      <Space>
        <FilePdfOutlined style={{ color: '#ff4d4f', fontSize: '18px' }} />
        <Text strong>{title}</Text>
      </Space>
    )
  },
  { 
    title: 'Thông tin ứng viên', 
    key: 'candidateInfo',
    width: 250, 
    render: (_, record) => (
      <Space>
        <Avatar src={record.user?.avatarUrl} icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Text strong>{record.user?.name || 'Ứng viên vãng lai'}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>{record.createdBy}</Text>
        </div>
      </Space>
    )
  },
  { 
    title: 'Ngày nộp', 
    dataIndex: 'createdAt', 
    width: 150, 
    render: (date) => <Text type="secondary">{formatDateTime(date)}</Text> 
  },
  {
    title: 'Hồ sơ gốc',
    dataIndex: 'url',
    width: 120,
    align: 'center',
    render: (url) => (url ? <ViewResumeButton url={url} /> : <Text type="secondary">Trống</Text>),
  },
];
const AdminResumesPage = () => {
  return (
    <AdminCrudPage<AdminResume>
      title="Hồ sơ"
      description="Danh sách hồ sơ (CV) do ứng viên tải lên."
      columns={columns}
      searchKeys={['title', 'user.name', 'createdBy', 'url']}
      loadData={() => loadAll(adminApi.resumes.list<AdminResume>({ page: 1, size: 800, sort: 'createdAt,desc' }))}
      canCreate={false}
      canEdit={false}
      canDelete={false}
    />
  );
};
export default AdminResumesPage;
