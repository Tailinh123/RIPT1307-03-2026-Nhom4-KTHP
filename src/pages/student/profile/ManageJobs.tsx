import apiClient from '@/api/api';
import React, { useState, useEffect, useMemo } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Card,
  Row,
  Col,
  Tag,
  Popconfirm,
  message,
  Typography,
  DatePicker,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

import type {
  Job,
  JobFormData,
  JobLevel,
  JobType,
  WorkMode,
  JobStatus,
} from "@/types/job";
import {
  skillOptions,
  jobCategoryOptions,
  levelLabels,
  jobTypeLabels,
  workModeLabels,
  statusLabels,
  statusColors,
} from "@/types/job";
import dayjs from "dayjs";

const { Title } = Typography;
const { TextArea } = Input;

type ManageJobFilter = {
  name?: string;
  status?: JobStatus;
};

export default function ManageJobs() {
  // ==================== STATE MANAGEMENT ====================
const [companies, setCompanies] = useState<any[]>([]);
const [jobs, setJobs] = useState<Job[]>([]);
const [loading, setLoading] = useState<boolean>(true);
const [myCompanyId, setMyCompanyId] = useState<number | undefined>(undefined);
const [myCompanyName, setMyCompanyName] = useState<string>('');

useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        const cId = userObj?.company?.id || userObj?.companyId;
        const cName = userObj?.company?.name || userObj?.companyName || '';
        setMyCompanyId(cId ? Number(cId) : undefined);
        setMyCompanyName(cName);
      } catch { /* ignore */ }
    }

    const fetchJobs = async () => {
      try {
        const userStr2 = localStorage.getItem('user');
        const userObj2 = userStr2 ? JSON.parse(userStr2) : null;
        const cId = userObj2?.company?.id || userObj2?.companyId;
        const response = await apiClient.get('/api/v1/jobs');
        const data = response.data.data?.result || response.data.data || response.data;
        const allJobs = Array.isArray(data) ? data : [];
        const filtered = cId ? allJobs.filter((j: any) => String(j.company?.id) === String(cId)) : allJobs;
        setJobs(filtered);
      } catch (error) {
        console.error('Jobs API failed', error);
        message.error('Không thể tải danh sách viế trí tuyển dụng.');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);;
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [modalLoading, setModalLoading] = useState<boolean>(false);

  // Filter state
  const [filters, setFilters] = useState<ManageJobFilter>({
    name: undefined,
    status: undefined,
  });

  // Form instance
  const [form] = Form.useForm<JobFormData>();

  // ==================== FILTERED DATA ====================
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const jobTitle = (job.title || (job as any).name || '').toLowerCase();
      const nameMatch = !filters.name || jobTitle.includes(filters.name.toLowerCase());
      const jobStatus: string = job.status ||
        ((job as any).active === true || (job as any).active === 1 ? 'ACTIVE' :
         (job as any).active === false || (job as any).active === 0 ? 'PENDING' : '');
      const statusMatch = !filters.status || jobStatus === filters.status;
      return nameMatch && statusMatch;
    });
  }, [jobs, filters]);

const companyOptions = useMemo(() => {
    return companies.map((c: any) => ({
      value: c.id,  
      label: c.name, 
    }));
  }, [companies]);

  // ==================== HANDLERS ====================
  const handleAddNew = () => {
    setEditingJob(null);
    form.resetFields();
    if (myCompanyId) form.setFieldValue('companyId', myCompanyId);
    setIsModalOpen(true);
  };

  const handleEdit = (record: Job) => {
    setEditingJob(record);
    form.setFieldsValue({
      name: record.title || record.name,
      description: record.description,
      salary: record.salary,
      level: record.level,
      jobType: record.jobType,
      workMode: record.workMode,
      skills: Array.isArray(record.skills)
        ? record.skills.map((skill) => (typeof skill === 'object' ? skill.id : skill))
        : [],
      jobCategory: record.jobCategory || record.category,
      location: record.location,
      quantity: record.quantity,
      startDate: record.startDate ? dayjs(record.startDate) : undefined,
      endDate: record.endDate ? dayjs(record.endDate) : undefined,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string | number) => {
    setLoading(true);
    try {
      await apiClient.delete(`/api/v1/jobs/${id}`);
      setJobs((prev) => prev.filter((job) => job.id !== id));
      message.success('Xóa vị trí thực tập thành công!');
    } catch (err: any) {
      if (err?.response?.status === 400) {
        try {
          const job = jobs.find((j) => j.id === id);
          await apiClient.put('/api/v1/jobs', {
            id,
            name: (job as any)?.title || (job as any)?.name || 'job',
            active: false,
            isActive: false,
          });
          await apiClient.delete(`/api/v1/jobs/${id}`);
          setJobs((prev) => prev.filter((j) => j.id !== id));
          message.success('Xóa vị trí thực tập thành công!');
        } catch {
          message.error('Không thể xóa vị trí này. Vui lòng thử lại!');
        }
      } else {
        message.error('Có lỗi xảy ra khi xóa!');
      }
    } finally {
      setLoading(false);
    }
  };

// Submit form
  const handleSubmit = async (values: JobFormData) => {
    setModalLoading(true);
    try {
      const safeCategoryId = typeof values.jobCategory === 'number' ? values.jobCategory : 1;
      
      const safeJobType =
        String(values.jobType).toUpperCase() === "INTERNSHIP"
          ? ("INTERN" as unknown as JobType)
          : values.jobType;

      const payload = {
        name: values.name,
        title: values.name,
        description: values.description,
        salary: values.salary,
        level: values.level,
        jobType: safeJobType,
        workMode: values.workMode,
        jobCategory: { id: safeCategoryId },
        skills: values.skills.map((skillValue: number | string) => ({
          id: typeof skillValue === 'number' ? skillValue : Number(skillValue) || 1,
        })),
        location: values.location || 'Hà Nội',
        quantity: values.quantity ?? 1,
        company: myCompanyId ? { id: Number(myCompanyId) } : undefined,
        startDate: values.startDate
          ? dayjs(values.startDate).startOf('day').format('YYYY-MM-DDTHH:mm:ssZ')
          : undefined,
        endDate: values.endDate
          ? dayjs(values.endDate).endOf('day').format('YYYY-MM-DDTHH:mm:ssZ')
          : undefined,
        isHot: false,
      };

      if (editingJob) {
        await apiClient.put('/api/v1/jobs', { id: editingJob.id, ...payload });
        message.success('Cập nhật vị trí thực tập thành công!');
      } else {
        await apiClient.post('/api/v1/jobs', payload);
        message.success('Thêm vị trí thực tập mới thành công!');
      }
      setIsModalOpen(false);
      form.resetFields();
      const response = await apiClient.get('/api/v1/jobs');
      const data = response.data.data?.result || response.data.data || response.data;
      const allJobs = Array.isArray(data) ? data : [];
      const filtered = myCompanyId ? allJobs.filter((j: any) => String(j.company?.id) === String(myCompanyId)) : allJobs;
      setJobs(filtered);
      
    } catch (error) {
      console.error("Lỗi lưu dữ liệu:", error);
      message.error("Có lỗi xảy ra khi lưu vào Database!");
    } finally {
      setModalLoading(false);
    }
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilters({ name: undefined, status: undefined });
  };

  // ==================== TABLE COLUMNS ====================
  const columns: ColumnsType<Job> = [
    {
      title: "STT",
      key: "index",
      width: 60,
      align: "center",
      render: (_, __, index) => index + 1,
    },
   {
      title: "Tên công việc",
      dataIndex: "title",
      key: "title",
      width: 250,
      render: (title: string, record: Job) => {

        const levelText = levelLabels[record.level] || record.level || "Chưa xác định";
        const typeText = record.jobType ? (jobTypeLabels[record.jobType] || record.jobType) : "N/A";

        return (
          <div>
            <div className="font-medium text-gray-900">{title || record.name || "Không có tên"}</div>
            <div className="text-xs text-gray-500">
              {levelText} • {typeText}
            </div>
          </div>
        );
      },
    },
    {
      title: "Tên công ty",
      dataIndex: "companyName",
      key: "companyName",
      width: 180,
      render: (text: string, record: Job) => record.company?.name || record.companyName || text,
    },
    {
      title: "Mức lương",
      dataIndex: "salary",
      key: "salary",
      width: 140,
      align: "right",
      render: (salary: number) => (
        <span className="font-medium">
          {salary?.toLocaleString('vi-VN')} VNĐ
        </span>
      ),
    },
    {
      title: 'Trạng thái',
      key: 'status',
      width: 130,
      align: 'center',
      render: (_: any, record: Job) => {
        const rawActive = (record as any).active;
        let resolvedStatus: string = record.status || '';
        if (!resolvedStatus) {
          resolvedStatus = (rawActive === true || rawActive === 1) ? 'ACTIVE' : 'PENDING';
        }
        const statusText = statusLabels[resolvedStatus as JobStatus] || resolvedStatus || 'Chờ duyệt';
        const statusColor = statusColors[resolvedStatus as JobStatus] || 'orange';
        return <Tag color={statusColor}>{statusText}</Tag>;
      },
    },
    {
      title: "Hành động",
      key: "actions",
      width: 100,
      align: "center",
      render: (_, record: Job) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            className="text-blue-600 hover:text-blue-800"
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa vị trí này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="text"
              icon={<DeleteOutlined />}
              className="text-red-600 hover:text-red-800"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // ==================== RENDER ====================
return (
    <div style={{ padding: "24px 40px", background: "#f8fafc", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1300px", margin: "0 auto" }}>
        <div className="mb-6">
          <Title level={3} className="!mb-1" style={{ fontWeight: 600, color: "#0f172a" }}>
            Quản lý vị trí thực tập
          </Title>
          <p className="text-gray-500" style={{ fontSize: "14px" }}>
            Quản lý các vị trí tuyển dụng của doanh nghiệp
          </p>
        </div>

        {/* Filter Section */}
        <Card className="mb-6" style={{ borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <Row gutter={[16, 16]} align="bottom">
            <Col xs={24} sm={12} md={8}>
              <div className="mb-1 text-sm font-medium text-gray-700">Tên công việc</div>
              <Input
                placeholder="Tìm theo tên công việc..."
                prefix={<SearchOutlined className="text-gray-400" />}
                value={filters.name || ''}
                onChange={(e) => setFilters((prev) => ({ ...prev, name: e.target.value || undefined }))}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div className="mb-1 text-sm font-medium text-gray-700">Trạng thái</div>
              <Select
                placeholder="Chọn trạng thái"
                className="w-full"
                style={{ width: '100%' }}
                value={filters.status}
                onChange={(value) => setFilters((prev) => ({ ...prev, status: value as JobStatus | undefined }))}
                allowClear
                options={Object.keys(statusLabels).map((status) => ({ value: status as JobStatus, label: statusLabels[status as JobStatus] }))}
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Space>
                <Button icon={<ReloadOutlined />} onClick={handleResetFilters}>Đặt lại</Button>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>Thêm mới</Button>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Table Section */}
        <Card className="shadow-sm">
          <Table
            columns={columns}
            dataSource={filteredJobs}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Tổng ${total} vị trí`,
            }}
            scroll={{ x: 1000 }}
          />
        </Card>

        {/* Add/Edit Modal */}
<Modal
          title={
            <span style={{ fontSize: "18px", fontWeight: 600, color: "#262626" }}>
              {editingJob ? "Cập nhật Job" : "Thêm vị trí thực tập mới"}
            </span>
          }
          open={isModalOpen}
          onCancel={() => {
            setIsModalOpen(false);
            form.resetFields();
          }}
          footer={null}
          width={850} 
          destroyOnClose
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="mt-4"
          >
            <Form.Item name="jobType" hidden initialValue="INTERN"><Input /></Form.Item>
            <Form.Item name="workMode" hidden initialValue="REMOTE"><Input /></Form.Item>
            <Form.Item name="jobCategory" hidden initialValue={1}><Input /></Form.Item>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="name"
                  label={<span style={{ fontWeight: 500 }}>Tên công việc</span>}
                  rules={[
                    { required: true, message: "Vui lòng nhập tên công việc" },
                    { min: 5, message: "Tên công việc phải có ít nhất 5 ký tự" },
                  ]}
                >
                  <Input placeholder="Backend Developer Intern" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="skills"
                  label={<span style={{ fontWeight: 500 }}>Kỹ năng yêu cầu</span>}
                  rules={[{ required: true, message: "Vui lòng chọn ít nhất 1 kỹ năng" }]}
                >
                  <Select
                    mode="multiple"
                    placeholder="Chọn các kỹ năng"
                    options={skillOptions}
                    maxTagCount="responsive"
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="location"
                  label={<span style={{ fontWeight: 500 }}>Địa điểm</span>}
                  rules={[{ required: true, message: "Vui lòng nhập địa điểm" }]}
                >
                  <Input placeholder="Ha Noi" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="salary"
                  label={<span style={{ fontWeight: 500 }}>Mức lương</span>}
                  rules={[{ required: true, message: "Vui lòng nhập mức lương" }]}
                >
                  <InputNumber<number>
                    className="w-full"
                    min={0}
                    step={500000}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    parser={(value) => Number(value?.replace(/\$\s?|(,*)/g, "")) || 0}
                    placeholder="1500"
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="quantity"
                  label={<span style={{ fontWeight: 500 }}>Số lượng</span>}
                  rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
                >
                  <InputNumber<number>
                    className="w-full"
                    min={1}
                    max={100}
                    placeholder="3"
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="level"
                  label={<span style={{ fontWeight: 500 }}>Trình độ</span>}
                  rules={[{ required: true, message: "Vui lòng chọn cấp độ" }]}
                >
                  <Select
                    placeholder="Junior"
                    options={Object.keys(levelLabels).map((level) => ({
                      value: level,
                      label: levelLabels[level],
                    }))}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  label={<span style={{ fontWeight: 500 }}>Công ty</span>}
                >
                  <Input
                    disabled
                    style={{ background: '#f9fafb', cursor: 'not-allowed' }}
                    value={myCompanyName || String(myCompanyId || '')}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="startDate"
                  label={<span style={{ fontWeight: 500 }}>Ngày bắt đầu</span>}
                  rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}
                >
                  <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="endDate"
                  label={<span style={{ fontWeight: 500 }}>Ngày kết thúc</span>}
                  rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc' }]}
                >
                  <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
                </Form.Item>
              </Col>
            </Row>

            <div className="text-sm font-medium text-gray-700 mb-1" style={{ marginTop: "8px" }}>
              Miêu tả
            </div>
            <div 
              style={{ 
                border: "1px solid #d9d9d9", 
                borderRadius: "6px", 
                overflow: "hidden",
                backgroundColor: "#fff"
              }}
            >
              <div 
                style={{ 
                  backgroundColor: "#fafafa", 
                  borderBottom: "1px solid #d9d9d9", 
                  padding: "6px 12px", 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "16px",
                  color: "#555",
                  fontSize: "13px",
                  userSelect: "none"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "4px", cursor: "pointer", padding: "2px 6px", background: "#fff", border: "1px solid #d9d9d9", borderRadius: "4px" }}>
                  <span>Normal</span>
                  <span style={{ fontSize: "8px", color: "#bfbfbf" }}>▼</span>
                </div>
                <div style={{ height: "14px", width: "1px", backgroundColor: "#d9d9d9" }} />
                <span style={{ fontWeight: "bold", cursor: "pointer", padding: "0 4px" }} title="Bold">B</span>
                <span style={{ fontStyle: "italic", cursor: "pointer", padding: "0 4px" }} title="Italic">I</span>
                <span style={{ textDecoration: "underline", cursor: "pointer", padding: "0 4px" }} title="Underline">U</span>
                <span style={{ cursor: "pointer", padding: "0 4px" }} title="Link">🔗</span>
                <div style={{ height: "14px", width: "1px", backgroundColor: "#d9d9d9" }} />
                <span style={{ cursor: "pointer", padding: "0 4px" }} title="Bullet List">⋮≡</span>
                <span style={{ cursor: "pointer", padding: "0 4px" }} title="Ordered List">📋</span>
                <span style={{ cursor: "pointer", padding: "0 4px", color: "#8c8c8c" }} title="Clear Formatting"><u><i>T</i></u><sub>x</sub></span>
              </div>

              <Form.Item
                name="description"
                noStyle
                rules={[
                  { required: true, message: 'Vui lòng nhập mô tả công việc' },
                  { min: 20, message: 'Mô tả phải có ít nhất 20 ký tự' },
                ]}
              >
                <Input.TextArea
                  rows={6}
                  maxLength={2000}
                  showCount={{
                    formatter: ({ count, maxLength }) =>
                      `${count}/${maxLength} ký tự (tối thiểu 20)`,
                  }}
                  bordered={false}
                  placeholder="Phát triển hệ thống backend bằng Spring Boot..."
                  style={{ padding: '12px', resize: 'none', fontSize: '14px' }}
                />
              </Form.Item>
            </div>

            {/* FOOTER BUTTONS */}
            <div className="flex justify-end gap-2 mt-6 pt-4 border-t" style={{ marginTop: "24px" }}>
              <Button
                onClick={() => {
                  setIsModalOpen(false);
                  form.resetFields();
                }}
              >
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" loading={modalLoading}>
                OK
              </Button>
            </div>
          </Form>
        </Modal>
      </div>
    </div>
  );
}
