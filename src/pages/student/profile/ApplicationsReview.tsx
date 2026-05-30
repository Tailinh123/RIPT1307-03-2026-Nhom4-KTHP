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
  EyeOutlined,
  DownloadOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
  CalendarOutlined,
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

import { Avatar, Descriptions } from "antd";

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

  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [viewingProfile, setViewingProfile] = useState<any>(null);

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
      const applicantEmail = (targetApp as any).resume?.user?.email || (targetApp as any).createdBy;
      if (applicantEmail) {
        message.info(`Đã gửi email thông báo tới ${applicantEmail}`);
      }
    } catch { /* đã xử lý trong updateApplicationStatus */ } finally {
      setProcessingLoading(false);
    }
  };

  const getRawCv = (record: ApplicationRow): string | undefined =>
    (record as any).resume?.url ||
    (record as any).cvUrl ||
    (record as any).resumeUrl ||
    (record as any).cv;

  const getFileName = (rawCv: string): string =>
    rawCv
      .replace(/^.*[/\\]/, '')
      .replace(/^storage\//, '')
      .replace(/^uploads\/resume\//, '')
      .replace(/^resume\//, '')
      .replace(/^cv\//, '') || 'CV.pdf';

  const fetchCvBlob = async (rawCv: string): Promise<{ blob: Blob; fileName: string }> => {
    const fileName = getFileName(rawCv);
    const apiUrl = `/api/v1/files?fileName=${encodeURIComponent(fileName)}&folder=resume`;
    const res = await apiClient.get(apiUrl, { responseType: 'blob' });
    return { blob: res.data as Blob, fileName };
  };

  const handleCvError = (err: any) => {
    console.error('[CV Error]', err?.response?.status, err?.response?.data, err?.message);
    if (err?.response?.status === 404) message.error('Không tìm thấy file CV trên server!');
    else if (err?.response?.status === 403) message.error('Không có quyền truy cập file CV!');
    else message.error(`Lỗi CV: ${err?.response?.data?.message || err?.message || 'Không xác định'}`);
  };

  const markAsReviewing = async (record: ApplicationRow) => {
    if (record.status !== 'PENDING') return;
    try {
      await apiClient.put('/api/v1/applications', {
        id: record.id,
        status: 'REVIEWING',
        note: (record as any).note || null,
      });
      const updater = (list: Application[]) =>
        list.map((app) => app.id === record.id ? { ...app, status: 'REVIEWING' as any } : app);
      allApplicationsRef.current = updater(allApplicationsRef.current);
      setApplications(updater(allApplicationsRef.current));
    } catch { /* ignore */ }
  };
  const handleViewCV = async (record: ApplicationRow) => {
    const rawCv = getRawCv(record);
    if (!rawCv) { message.warning('Ứng viên này chưa đính kèm file CV!'); return; }
    setCvLoading(record.id);
    try {
      await markAsReviewing(record);
      if (rawCv.startsWith('http://') || rawCv.startsWith('https://')) {
        window.open(rawCv, '_blank', 'noopener,noreferrer');
      } else {
        const { blob, fileName } = await fetchCvBlob(rawCv);
        const ext = fileName.split('.').pop()?.toLowerCase();
        const mimeType = ext === 'pdf' ? 'application/pdf'
          : ext === 'doc' ? 'application/msword'
          : ext === 'docx' ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          : 'application/octet-stream';
        const viewBlob = new Blob([blob], { type: mimeType });
        const objectUrl = URL.createObjectURL(viewBlob);
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
      }
    } catch (err: any) {
      handleCvError(err);
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

  // ── Xem hồ sơ ứng viên ──────────────────────────────────────────────────────────
  const handleViewApplicant = (record: ApplicationRow) => {)
    const applicant = (record as any).resume?.user;
    if (!applicant && !(record as any).createdBy) {
      message.warning('Không tìm thấy thông tin ứng viên!');
      return;
    }
    const profile = {
      ...applicant,
      email: applicant?.email || (record as any).createdBy,
      name: applicant?.name || (record as any).createdBy?.split('@')[0],
    };
    setViewingProfile(profile);
    setProfileModalOpen(true);
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
      width: 240,
      render: (_, record: ApplicationRow) => {
        const applicant = (record as any).resume?.user;
        const name = applicant?.name || record.applicantName || record.user?.name || (record as any).createdBy?.split('@')[0] || 'Không rõ';
        const email = applicant?.email || record.applicantEmail || record.user?.email || (record as any).createdBy || 'Chưa có email';
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ flex: 1 }}>
              <Text strong style={{ display: 'block' }}>{name}</Text>
              <Text type="secondary" style={{ fontSize: '12px' }}>{email}</Text>
            </div>
            <Button
              type="link"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleViewApplicant(record)}
              title="Xem hồ sơ ứng viên"
              style={{ padding: '0 4px', color: '#1677ff' }}
            />
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
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 110,
      render: (date: string, record: any) => {
        const actualDate = date || record.appliedAt;
        if (!actualDate) return 'Chưa rõ ngày';
        const d = new Date(actualDate);
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
      render: (_, record: ApplicationRow) => {
        const canAction = record.status === 'PENDING' || record.status === 'REVIEWING';
        return (
          <Space size="small" wrap>
            {canAction ? (
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
              <Tag color={record.status === 'APPROVED' ? 'green' : 'red'}>
                {applicationStatusLabels[record.status] || record.status}
              </Tag>
            )}
          </Space>
        );
      },
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
            <strong>Ứng viên:</strong> {(targetApp as any)?.createdBy?.split('@')[0] || targetApp?.applicantName || 'Ẩn danh'}
          </p>
          <p style={{ margin: '0 0 8px 0' }}>
            <strong>Email:</strong> {(targetApp as any)?.createdBy || targetApp?.applicantEmail || 'N/A'}
          </p>
          <p style={{ margin: 0 }}>
            <strong>Vị trí:</strong> {(targetApp as any)?.jobName || (targetApp as any)?.job?.name || 'N/A'}
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

      {/* ── Modal xem hồ sơ ứng viên ── */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <UserOutlined style={{ color: '#1677ff' }} />
            <span>Hồ sơ ứng viên</span>
          </div>
        }
        open={profileModalOpen}
        onCancel={() => { setProfileModalOpen(false); setViewingProfile(null); }}
        footer={<Button onClick={() => setProfileModalOpen(false)}>Đóng</Button>}
        width={560}
        destroyOnClose
      >
        {viewingProfile ? (
          <div>
            {/* Avatar + tên */}
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Avatar
                size={80}
                src={viewingProfile.avatarUrl ? `/api/v1/files?fileName=${encodeURIComponent(viewingProfile.avatarUrl.replace(/^.*[/\\]/, '').replace(/^avatar\//, ''))}&folder=avatar` : undefined}
                icon={<UserOutlined />}
                style={{ background: 'linear-gradient(135deg, #1677ff, #69b1ff)', fontSize: 32, marginBottom: 12 }}
              >
                {!viewingProfile.avatarUrl && (viewingProfile.name || viewingProfile.email || '?').charAt(0).toUpperCase()}
              </Avatar>
              <div>
                <Text strong style={{ fontSize: 18, display: 'block' }}>
                  {viewingProfile.name || viewingProfile.email?.split('@')[0] || 'Ứng viên'}
                </Text>
                <Text type="secondary">{viewingProfile.role?.name || 'Ứng viên'}</Text>
              </div>
            </div>

            <Descriptions
              column={1}
              bordered
              size="small"
              labelStyle={{ width: 140, fontWeight: 500, color: '#6b7280' }}
              contentStyle={{ color: '#111827', fontWeight: 500 }}
            >
              <Descriptions.Item label={<><MailOutlined /> Email</>}>
                {viewingProfile.email || '—'}
              </Descriptions.Item>
              <Descriptions.Item label={<><PhoneOutlined /> Số điện thoại</>}>
                {viewingProfile.phone || '—'}
              </Descriptions.Item>
              <Descriptions.Item label={<><CalendarOutlined /> Ngày sinh</>}>
                {viewingProfile.dateOfBirth
                  ? new Date(viewingProfile.dateOfBirth).toLocaleDateString('vi-VN')
                  : '—'}
              </Descriptions.Item>
              <Descriptions.Item label="Giới tính">
                {viewingProfile.gender === 'MALE' ? 'Nam'
                  : viewingProfile.gender === 'FEMALE' ? 'Nữ'
                  : viewingProfile.gender === 'OTHER' ? 'Khác' : '—'}
              </Descriptions.Item>
              <Descriptions.Item label={<><HomeOutlined /> Địa chỉ</>}>
                {viewingProfile.address || '—'}
              </Descriptions.Item>
              {viewingProfile.skills && viewingProfile.skills.length > 0 && (
                <Descriptions.Item label="Kỹ năng">
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {viewingProfile.skills.map((s: any) => (
                      <Tag key={s.id} color="blue">{s.name}</Tag>
                    ))}
                  </div>
                </Descriptions.Item>
              )}
            </Descriptions>
          </div>
        ) : (
          <Text type="secondary">Không tìm thấy thông tin ứng viên.</Text>
        )}
      </Modal>
    </div>
  );
};

export default ApplicationsReview;
