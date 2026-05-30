import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Table,
  Card,
  Button,
  Space,
  Tag,
  Input,
  Select,
  Row,
  Col,
  Modal,
  message,
  Tooltip,
  Typography,
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type {
  Application,
  ApplicationFilter,
  UpdateApplicationStatusRequest,
} from "@/types/application";
import {
  ApplicationStatus,
  applicationStatusLabels,
  applicationStatusColors,
  applicationStatusOptions,
} from "@/types/application";

type ApplicationRow = Application & {
  user?: { name?: string; email?: string };
  candidate?: { name?: string; email?: string };
  job?: { title?: string; name?: string; company?: { name?: string } };
};

import apiClient from "@/api/api";

const { Title, Text } = Typography;

// ============================================================================
// COMPONENT CHÍNH: ApplicationsReview
// ============================================================================

const ApplicationsReview: React.FC = () => {
  const allApplicationsRef = useRef<Application[]>([]);

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [processingLoading, setProcessingLoading] = useState(false);
  const [targetApp, setTargetApp] = useState<ApplicationRow | null>(null);
  const [actionType, setActionType] = useState<'APPROVED' | 'REJECTED'>('APPROVED');
  const [noteContent, setNoteContent] = useState('');
  const [cvLoading, setCvLoading] = useState<number | null>(null);

  const [filters, setFilters] = useState<ApplicationFilter>({
    status: undefined,
    jobName: undefined,
  });

  useEffect(() => {
    const loadApplications = async () => {
      setLoading(true);
      try {
        const userStr = localStorage.getItem('user');
        const userObj = userStr ? JSON.parse(userStr) : null;
        const myCompanyId = userObj?.company?.id || userObj?.companyId;

        let myJobIds: Set<string> = new Set();
        if (myCompanyId) {
          try {
            const jobsRes = await apiClient.get('/api/v1/jobs');
            const allJobs = jobsRes.data.data?.result || jobsRes.data.data || jobsRes.data || [];
            (Array.isArray(allJobs) ? allJobs : []).forEach((job: any) => {
              if (String(job.company?.id) === String(myCompanyId)) {
                myJobIds.add(String(job.id));
              }
            });
          } catch { /* ignore */ }
        }

        const response = await apiClient.get('/api/v1/applications');
        const data = response.data.data?.result || response.data.data || response.data;
        const allApps: Application[] = Array.isArray(data) ? data : [];

        const companyFiltered = myCompanyId
          ? allApps.filter((app: any) => {
              const jobId = String(app.jobId || app.job?.id || app.job_id || '');
              return myJobIds.has(jobId);
            })
          : allApps;

        allApplicationsRef.current = companyFiltered;
        setApplications(companyFiltered);
      } catch (error) {
        console.error('Error fetching applications:', error);
        message.error('Không thể tải danh sách đơn ứng tuyển.');
      } finally {
        setLoading(false);
      }
    };

    loadApplications();
  }, []); 

  // ── Client-side filter ────────────────────────────────────────────────────
  const filteredApplications = useMemo(() => {
    const all = allApplicationsRef.current;
    return all.filter((app: any) => {
      const jobTitle = (
        app.jobName || app.jobTitle || app.job?.title || app.job?.name || ''
      ).toLowerCase();
      const nameMatch = !filters.jobName || jobTitle.includes(filters.jobName.toLowerCase());
      const statusMatch = !filters.status || app.status === filters.status;
      return nameMatch && statusMatch;
    });
  }, [filters, applications]); 

  // ── Update status ────────────────────────────────────────────────────────
  const updateApplicationStatus = async (request: UpdateApplicationStatusRequest) => {
    try {
      await apiClient.put('/api/v1/applications', request);
      const updater = (list: Application[]) =>
        list.map((app) =>
          app.id === request.id
            ? { ...app, status: request.status, note: request.note || app.note, reviewedAt: new Date().toISOString() }
            : app
        );
      allApplicationsRef.current = updater(allApplicationsRef.current);
      setApplications(updater(allApplicationsRef.current));
      const statusText = request.status === ApplicationStatus.APPROVED ? 'duyệt' : 'từ chối';
      message.success(`Đã ${statusText} đơn ứng tuyển thành công`);
    } catch (error: any) {
      console.error('Error updating application status:', error);
      message.error(error?.response?.data?.message || 'Không thể cập nhật trạng thái đơn ứng tuyển');
      throw error;
    }
  };

  const handleConfirmAction = async () => {
    if (!targetApp) return;
    setProcessingLoading(true);
    try {
      await updateApplicationStatus({ id: targetApp.id, status: actionType, note: noteContent || undefined });
      setIsModalOpen(false);
      setNoteContent('');
    } catch { /* đã xử lý trong updateApplicationStatus */ } finally {
      setProcessingLoading(false);
    }
  };

  // ── Xem CV (fetch blob với auth token) ───────────────────────────────────
  const handleViewCV = async (record: ApplicationRow) => {
    const rawCv = (record as any).cvUrl || (record as any).resumeUrl || (record as any).cv;
    if (!rawCv) {
      message.warning('Ứng viên này chưa đính kèm file CV!');
      return;
    }
    setCvLoading(record.id);
    try {
      let apiUrl: string;
      if (rawCv.startsWith('http')) {
        apiUrl = rawCv;
      } else {
        const fileName = rawCv
          .replace(/^storage\//, '')
          .replace(/^cv\//, '')
          .replace(/^resume\//, '');
        apiUrl = `/api/v1/files?fileName=${encodeURIComponent(fileName)}&folder=resume`;
      }
      const res = await apiClient.get(apiUrl, { responseType: 'blob' });
      const blob = res.data as Blob;
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = '';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(objectUrl), 5000);
    } catch (err: any) {
      if (err?.response?.status === 404) {
        message.error('Không tìm thấy file CV!');
      } else {
        message.error('Không thể mở CV. Vui lòng thử lại!');
      }
    } finally {
      setCvLoading(null);
    }
  };

  const handleFilterChange = (key: keyof ApplicationFilter, value: string | undefined) => {
    setFilters((prev) => ({ ...prev, [key]: value || undefined }));
  };

  const handleResetFilters = () => {
    setFilters({ status: undefined, jobName: undefined });
  };

  // ── TABLE COLUMNS ────────────────────────────────────────────────────────
  const columns: ColumnsType<Application> = [
    {
      title: 'STT',
      key: 'index',
      width: 60,
      align: 'center',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      align: 'center',
      render: (status: ApplicationStatus) => (
        <Tag color={applicationStatusColors[status] || 'blue'}>
          {applicationStatusLabels[status] || status || 'Chờ xử lý'}
        </Tag>
      ),
    },
    {
      title: 'Ứng viên',
      key: 'applicant',
      width: 220,
      render: (_, record: ApplicationRow) => {
        const name = record.applicantName || record.user?.name || record.candidate?.name || 'Ẩn danh';
        const email = record.applicantEmail || record.user?.email || record.candidate?.email || 'Chưa có email';
        return (
          <div>
            <Text strong>{name}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: '12px' }}>{email}</Text>
          </div>
        );
      },
    },
    {
      title: 'Công việc ứng tuyển',
      key: 'job',
      width: 220,
      render: (_, record: ApplicationRow) => {
        const jobTitle = record.jobName || (record as any).jobTitle || record.job?.title || record.job?.name || 'Vị trí không rõ';
        return <Text strong>{jobTitle}</Text>;
      },
    },
    {
      title: 'Ngày nộp',
      dataIndex: 'appliedAt',
      key: 'appliedAt',
      width: 110,
      render: (date: string) => {
        if (!date) return 'Chưa rõ ngày';
        const d = new Date(date);
        return (
          <div>
            <Text>{d.toLocaleDateString('vi-VN')}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </div>
        );
      },
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
      width: 180,
      ellipsis: true,
      render: (note: string | undefined) =>
        note ? (
          <Tooltip title={note}><Text type="secondary">{note}</Text></Tooltip>
        ) : (
          <Text type="secondary" italic>Chưa có ghi chú</Text>
        ),
    },
    {
      title: 'CV',
      key: 'cv',
      width: 80,
      align: 'center',
      render: (_, record: ApplicationRow) => (
        <Button
          type="primary"
          icon={<FilePdfOutlined />}
          loading={cvLoading === record.id}
          onClick={() => handleViewCV(record)}
          style={{
            fontWeight: 700,
            fontSize: 12,
            padding: '0 10px',
            letterSpacing: 0.5,
          }}
        >
          CV
        </Button>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 200,
      render: (_, record: ApplicationRow) => (
        <Space size="small" wrap>
          {record.status === 'REVIEWING' ? (
            <>
              <Button
                type="primary"
                size="small"
                style={{ backgroundColor: '#166534' }}
                onClick={() => { setTargetApp(record); setActionType('APPROVED'); setIsModalOpen(true); }}
              >
                Chấp nhận
              </Button>
              <Button
                danger
                type="primary"
                size="small"
                onClick={() => { setTargetApp(record); setActionType('REJECTED'); setIsModalOpen(true); }}
              >
                Từ chối
              </Button>
            </>
          ) : (
            <Tag color={record.status === 'APPROVED' ? 'green' : record.status === 'REJECTED' ? 'red' : 'orange'}>
              {applicationStatusLabels[record.status] || record.status}
            </Tag>
          )}
        </Space>
      ),
    },
  ];

  // ── RENDER ─────────────────────────────────────────────────────────────
  return (
    <div style={{ padding: '24px 40px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
        <Card
          bordered={false}
          style={{ borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.02), 0 4px 12px rgba(0,0,0,0.03)' }}
          bodyStyle={{ padding: '24px' }}
        >
          {/* Header */}
          <div style={{ marginBottom: '24px' }}>
            <Title level={3} style={{ margin: 0, fontWeight: 600, color: '#0f172a' }}>
              Xét duyệt đơn ứng tuyển
            </Title>
            <Text style={{ color: '#64748b', fontSize: '14px' }}>
              Quản lý và xét duyệt các đơn ứng tuyển từ ứng viên
            </Text>
          </div>

          {/* Filter Section */}
          <Card
            size="small"
            bordered
            style={{ marginBottom: '16px', backgroundColor: '#fafafa', borderRadius: '8px' }}
          >
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} sm={12} md={8}>
                <Input
                  placeholder="Tìm theo tên công việc..."
                  prefix={<SearchOutlined />}
                  value={filters.jobName || ''}
                  onChange={(e) => handleFilterChange('jobName', e.target.value)}
                  allowClear
                />
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Select
                  placeholder="Lọc theo trạng thái"
                  style={{ width: '100%' }}
                  value={filters.status}
                  onChange={(value) => handleFilterChange('status', value)}
                  allowClear
                  options={applicationStatusOptions}
                />
              </Col>
              <Col xs={24} sm={12} md={4}>
                <Button icon={<ReloadOutlined />} onClick={handleResetFilters}>
                  Đặt lại
                </Button>
              </Col>
              <Col xs={24} sm={12} md={4} style={{ textAlign: 'right' }}>
                <Text type="secondary" style={{ fontSize: '13px' }}>
                  Tổng: <strong style={{ color: '#0f172a' }}>{filteredApplications.length}</strong> đơn
                </Text>
              </Col>
            </Row>
          </Card>

          {/* Table */}
          <Table<Application>
            columns={columns}
            dataSource={filteredApplications}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} đơn ứng tuyển`,
            }}
            scroll={{ x: 1200 }}
            size="middle"
          />
        </Card>
      </div>

      <Modal
        title={actionType === 'APPROVED' ? '✅ Xác nhận Duyệt Hồ Sơ' : '❌ Xác nhận Từ Chối Hồ Sơ'}
        open={isModalOpen}
        onOk={handleConfirmAction}
        onCancel={() => { setIsModalOpen(false); setNoteContent(''); }}
        confirmLoading={processingLoading}
        okText={actionType === 'APPROVED' ? 'Duyệt & Gửi Mail' : 'Từ chối & Gửi Mail'}
        okButtonProps={{ danger: actionType === 'REJECTED' }}
        cancelText="Hủy bỏ"
        destroyOnClose
      >
        <div style={{ marginBottom: '16px', backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
          <p style={{ margin: '0 0 8px 0' }}>
            <strong>Ứng viên:</strong> {targetApp?.applicantName || targetApp?.user?.name || 'Ẩn danh'}
          </p>
          <p style={{ margin: '0 0 8px 0' }}>
            <strong>Email:</strong> {targetApp?.applicantEmail || targetApp?.user?.email || 'N/A'}
          </p>
          <p style={{ margin: 0 }}>
            <strong>Vị trí:</strong> {targetApp?.jobName || targetApp?.job?.title || 'N/A'}
          </p>
        </div>
        <p style={{ fontWeight: 500 }}>Lời nhắn gửi ứng viên:</p>
        <Input.TextArea
          rows={4}
          placeholder="Nhập lời nhắn... (Tùy chọn)"
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default ApplicationsReview;
