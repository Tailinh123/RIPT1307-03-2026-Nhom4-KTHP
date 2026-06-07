import React, { useState } from 'react';
import type { ColumnsType } from 'antd/es/table';
import { Button, Tag, message } from 'antd';
import { LinkOutlined } from '@ant-design/icons';
import { adminApi } from '@/api/adminApi';
import axiosClient from '@/api/axiosClient';
import AdminCrudPage from '@/components/admin/AdminCrudPage';
import type { AdminApplication } from '@/types/admin';
import { formatDateTime, loadAll } from './adminUtils';
const statusColors: Record<string, string> = {
  PENDING: 'gold',
  REVIEWING: 'blue',
  APPROVED: 'green',
  REJECTED: 'red',
};
const statusLabels: Record<string, string> = {
  PENDING: 'Chờ duyệt',
  REVIEWING: 'Đang xem',
  APPROVED: 'Đã duyệt',
  REJECTED: 'Từ chối',
};
const ViewCvButton = ({ url }: { url: string }) => {
  const [loading, setLoading] = useState(false);
  const handleViewCV = async () => {
    if (!url) return;
    if (url.startsWith('http://') || url.startsWith('https://')) {
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }
    setLoading(true);
    try {
      const fileName = url
        .replace(/^.*[/\\]/, '')
        .replace(/^storage\//, "")
        .replace(/^uploads\/resume\//, "")
        .replace(/^resume\//, "")
        .replace(/^cv\//, "")
      const encodedFileName = encodeURIComponent(fileName);
      const apiUrl = `/api/v1/files?folder=resume&fileName=${encodedFileName}`;
      const res = await axiosClient.get(apiUrl, { responseType: 'blob' });
      const ext = fileName.split('.').pop()?.toLowerCase();
      const mimeType = ext === 'pdf' ? 'application/pdf'
        : ext === 'doc' ? 'application/msword'
        : ext === 'docx' ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        : 'application/octet-stream';
      const blob = new Blob([res.data], { type: mimeType });
      const objectUrl = URL.createObjectURL(blob);
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
    } catch (error) {
      message.error('Không thể mở CV, vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <Button onClick={handleViewCV} loading={loading} icon={<LinkOutlined />} size="small">
      Mở CV
    </Button>
  );
};
const columns: ColumnsType<AdminApplication> = [
  { title: 'ID', dataIndex: 'id', width: 60 },
  { 
    title: 'Tên', 
    dataIndex: 'name', 
    ellipsis: true, 
    render: (_, record: any) => record.resume?.user?.name || record.resume?.title?.split('-')?.[1]?.trim() || '-' 
  },
  { 
    title: 'Công việc', 
    dataIndex: 'job', 
    width: 250, 
    render: (job) => (
      <div>
        <div style={{ fontWeight: 500, color: '#1677ff', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
          {job?.name || '-'}
        </div>
        <div style={{ fontSize: 12, color: '#64748b' }}>
          {job?.company?.name || ''}
        </div>
      </div>
    ) 
  },
  { title: 'Resume', dataIndex: 'resume', ellipsis: true, render: (resume) => resume?.title || (resume?.id ? `#${resume.id}` : '-') },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    width: 120,
    render: (status) => (status ? <Tag color={statusColors[status] || 'default'}>{statusLabels[status] || status}</Tag> : '-'),
  },
  { title: 'Ghi chú', dataIndex: 'note', ellipsis: true, render: (value) => value || '-' },
  { title: 'Người tạo', dataIndex: 'createdBy', ellipsis: true, render: (value) => value || '-' },
  {
    title: 'CV',
    dataIndex: 'resume',
    width: 80,
    render: (resume) =>
      resume?.url ? (
        <ViewCvButton url={resume.url} />
      ) : (
        '-'
      ),
  },
];
const AdminApplicationsPage = () => {
  return (
    <AdminCrudPage<AdminApplication>
      title="Ứng tuyển"
      description="Danh sách đơn ứng tuyển đã gửi vào các job."
      columns={columns}
      searchKeys={['name', 'status', 'note', 'createdBy', 'resume.title']}
      loadData={() => loadAll(adminApi.applications.list<AdminApplication>({ page: 1, size: 800, sort: 'id,desc' }))}
      canCreate={false}
      canEdit={true}
      canDelete={false}
      updateData={(record, values) =>
        adminApi.applications.update<AdminApplication>({
          id: record.id,
          status: values.status,
          note: values.note || null,
        })
      }
      fields={[
        { name: 'status', label: 'Trạng thái', type: 'select', required: true, options: [
            { label: 'Chờ duyệt', value: 'PENDING' },
            { label: 'Đang xem', value: 'REVIEWING' },
            { label: 'Đã duyệt', value: 'APPROVED' },
            { label: 'Từ chối', value: 'REJECTED' },
        ] },
        { name: 'note', label: 'Ghi chú cho ứng viên', type: 'textarea' },
      ]}
    />
  );
};
export default AdminApplicationsPage;
