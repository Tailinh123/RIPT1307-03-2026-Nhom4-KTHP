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
  Switch,
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
  companyName?: string;
  status?: JobStatus;
};

export default function ManageJobs() {
  // ==================== STATE MANAGEMENT ====================
const [companies, setCompanies] = useState<any[]>([]);
const [jobs, setJobs] = useState<Job[]>([]);
const [loading, setLoading] = useState<boolean>(true);

useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await apiClient.get('/api/v1/jobs');
        const data = response.data.data?.result || response.data.data || response.data;
        setJobs(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Jobs API failed", error);
        message.error("Không thể tải danh sách vị trí tuyển dụng từ Database.");
      } finally {
        setLoading(false);
      }
    };
const fetchCompanies = async () => {
      try {
        const response = await apiClient.get('/api/v1/companies');
        const data = response.data.data?.result || response.data.data || response.data;
        setCompanies(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Companies API failed", error);
      }
    };
    fetchJobs();
    fetchCompanies();
  }, []);
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [modalLoading, setModalLoading] = useState<boolean>(false);

  // Filter state
  const [filters, setFilters] = useState<ManageJobFilter>({
    name: undefined,
    companyName: undefined,
    status: undefined,
  });

  // Form instance
  const [form] = Form.useForm<JobFormData>();

  // ==================== FILTERED DATA ====================
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const nameMatch =
        !filters.name ||
        (job.title || "").toLowerCase().includes(filters.name.toLowerCase());
      const companyMatch =
        !filters.companyName ||
        (job.company?.name || job.companyName || "")
          .toLowerCase()
          .includes(filters.companyName.toLowerCase());
      const statusMatch = !filters.status || job.status === filters.status;

      return nameMatch && companyMatch && statusMatch;
    });
  }, [jobs, filters]);

const companyOptions = useMemo(() => {
    return companies.map((c: any) => ({
      value: c.id,   // Giá trị gửi lên BE là số ID (1, 2...) để khớp khóa ngoại company_id
      label: c.name, // Chữ hiển thị trên giao diện dropdown
    }));
  }, [companies]);

  // ==================== HANDLERS ====================
  // Mở modal thêm mới
  const handleAddNew = () => {
    setEditingJob(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  // Mở modal chỉnh sửa
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
        ? record.skills.map((skill) =>
            typeof skill === 'object' ? skill.id : skill
          )
        : [],
      jobCategory: record.jobCategory || record.category,
      location: record.location,
      quantity: record.quantity,
      companyId: record.company?.id || record.companyId,
      startDate: record.startDate ? dayjs(record.startDate) : undefined,
      endDate: record.endDate ? dayjs(record.endDate) : undefined,
      isActive: record.isActive ?? true,
      isHot: record.isHot ?? false,
    });
    setIsModalOpen(true);
  };

// Xóa job
  const handleDelete = async (id: string | number) => {
    setLoading(true);
    try {
      await apiClient.delete(`/api/v1/jobs/${id}`);
      setJobs((prev) => prev.filter((job) => job.id !== id));
      message.success("Xóa vị trí thực tập thành công!");
    } catch {
      message.error("Có lỗi xảy ra khi xóa!");
    } finally {
      setLoading(false);
    }
  };

// Submit form
  const handleSubmit = async (values: JobFormData) => {
    setModalLoading(true);
    try {
      const safeCategoryId = typeof values.jobCategory === 'number' ? values.jobCategory : 1;
      
      // Khắc phục lệch pha Enum JobType giữa FE ("INTERNSHIP") và BE ("INTERN")
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
        location: values.location || "Hà Nội",
        quantity: values.quantity ?? 1,
company: values.companyId ? { id: Number(values.companyId) } : undefined,
startDate: values.startDate ? dayjs(values.startDate).endOf('day').toISOString() : undefined,
        endDate: values.endDate
          ? (values.endDate as unknown as { toISOString: () => string }).toISOString()
          : undefined,
        isActive: values.isActive ?? true,
        isHot: values.isHot ?? false,
      };

      if (editingJob) {
        // GỌI API SỬA (PUT)
        await apiClient.put('/api/v1/jobs', {
          id: editingJob.id,
          ...payload
        });
        message.success("Cập nhật vị trí thực tập thành công!");
      } else {
        // GỌI API THÊM MỚI (POST)
        await apiClient.post('/api/v1/jobs', payload);
        message.success("Thêm vị trí thực tập mới thành công!");
      }
      
      setIsModalOpen(false);
      form.resetFields();
      
      // Load lại dữ liệu thực tế từ Backend để hiển thị lên bảng
      const response = await apiClient.get('/api/v1/jobs');
      const data = response.data.data?.result || response.data.data || response.data;
      setJobs(Array.isArray(data) ? data : []);
      
    } catch (error) {
      console.error("Lỗi lưu dữ liệu:", error);
      message.error("Có lỗi xảy ra khi lưu vào Database!");
    } finally {
      setModalLoading(false);
    }
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      name: undefined,
      companyName: undefined,
      status: undefined,
    });
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
        // Bọc an toàn: Nếu không tìm thấy nhãn dịch, hiển thị luôn giá trị gốc từ DB, tránh bị sập UI
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
      // Thêm render này để ưu tiên hiển thị tên từ object company của API thật
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
          {salary.toLocaleString("vi-VN")} VNĐ
        </span>
      ),
    },
{
      title: "Phí dịch vụ",
      dataIndex: "serviceFee",
      key: "serviceFee",
      width: 140,
      align: "right",
render: (fee: number) => (
  <span className="text-orange-600 font-medium">
    {fee ? fee.toLocaleString("vi-VN") : "0"} VNĐ
  </span>
),
},
{
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      align: "center",
      render: (status: JobStatus) => {
        // Bọc an toàn nếu trạng thái từ DB trả về null hoặc trống
        const statusText = statusLabels[status] || status || "Đang tuyển";
        const statusColor = statusColors[status] || "blue";
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
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Title level={2} className="!mb-1">
            Quản lý vị trí thực tập
          </Title>
          <p className="text-gray-500">
            Quản lý các vị trí tuyển dụng của doanh nghiệp
          </p>
        </div>

        {/* Filter Section */}
        <Card className="mb-6 shadow-sm">
          <Row gutter={[16, 16]} align="bottom">
            <Col xs={24} sm={12} md={6}>
              <div className="mb-1 text-sm font-medium text-gray-700">
                Tên công việc
              </div>
              <Input
                placeholder="Tìm theo tên công việc..."
                prefix={<SearchOutlined className="text-gray-400" />}
                value={filters.name || ""}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    name: e.target.value || undefined,
                  }))
                }
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div className="mb-1 text-sm font-medium text-gray-700">
                Tên công ty
              </div>
              <Input
                placeholder="Tìm theo tên công ty..."
                prefix={<SearchOutlined className="text-gray-400" />}
                value={filters.companyName || ""}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    companyName: e.target.value || undefined,
                  }))
                }
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div className="mb-1 text-sm font-medium text-gray-700">
                Trạng thái
              </div>
              <Select
                placeholder="Chọn trạng thái"
                className="w-full"
                value={filters.status}
                onChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    status: value as JobStatus | undefined,
                  }))
                }
                allowClear
                options={Object.keys(statusLabels).map((status) => ({
                  value: status as JobStatus,
                  label: statusLabels[status as JobStatus],
                }))}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Space>
                <Button icon={<ReloadOutlined />} onClick={handleResetFilters}>
                  Đặt lại
                </Button>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAddNew}
                >
                  Thêm mới
                </Button>
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
          width={850} // Nới rộng độ rộng modal để vừa khít bố cục 3 cột nằm ngang
          destroyOnClose
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="mt-4"
          >
            {/* --- CÁC TRƯỜNG ẨN (HIDDEN) ĐỂ GIỮ CHUẨN VALIDATE VỚI BACKEND SPRING BOOT --- */}
            <Form.Item name="jobType" hidden initialValue="INTERN"><Input /></Form.Item>
            <Form.Item name="workMode" hidden initialValue="REMOTE"><Input /></Form.Item>
            <Form.Item name="jobCategory" hidden initialValue={1}><Input /></Form.Item>

            {/* ROW 1: Tên công việc (8) | Kỹ năng yêu cầu (8) | Địa điểm (8) */}
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

            {/* ROW 2: Mức lương (8) | Số lượng (8) | Trình độ (8) */}
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

            {/* ROW 3: Công ty (6) | Ngày bắt đầu (5) | Ngày kết thúc (5) | Hoạt động (4) | Hot (4) */}
            <Row gutter={16} align="middle">
              <Col span={6}>
                <Form.Item
                  name="companyId"
                  label={<span style={{ fontWeight: 500 }}>Công ty</span>}
                  rules={[{ required: true, message: "Vui lòng chọn công ty" }]}
                >
                  <Select
                    placeholder="Chọn công ty"
                    options={companyOptions}
                    showSearch
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item
                  name="startDate"
                  label={<span style={{ fontWeight: 500 }}>Ngày bắt đầu</span>}
                  rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu" }]}
                >
                  <DatePicker className="w-full" format="YYYY-MM-DD" />
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item
                  name="endDate"
                  label={<span style={{ fontWeight: 500 }}>Ngày kết thúc</span>}
                  rules={[{ required: true, message: "Vui lòng chọn ngày kết thúc" }]}
                >
                  <DatePicker className="w-full" format="YYYY-MM-DD" />
                </Form.Item>
              </Col>
              <Col span={4} style={{ textAlign: "center" }}>
                <Form.Item
                  name="isActive"
                  label={<span style={{ fontWeight: 500 }}>Hoạt động</span>}
                  valuePropName="checked"
                  initialValue={true}
                >
                  <Switch style={{ marginTop: "4px" }} />
                </Form.Item>
              </Col>
              <Col span={4} style={{ textAlign: "center" }}>
                <Form.Item
                  name="isHot"
                  label={<span style={{ fontWeight: 500 }}>Hot</span>}
                  valuePropName="checked"
                  initialValue={false}
                >
                  <Switch style={{ marginTop: "4px" }} />
                </Form.Item>
              </Col>
            </Row>

            {/* ROW 4: KHUNG SOẠN THẢO VĂN BẢN (MOCK RICH TEXT EDITOR) GIỐNG ẢNH MẪU */}
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
              {/* Rich Text Editor Mock Toolbar */}
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

              {/* Text Area Không Viền Lồng Bên Trong */}
              <Form.Item
                name="description"
                noStyle
                rules={[
                  { required: true, message: "Vui lòng nhập mô tả công việc" },
                  { min: 20, message: "Mô tả phải có ít nhất 20 ký tự" },
                ]}
              >
                <TextArea
                  rows={6}
                  bordered={false}
                  placeholder="Phát triển hệ thống backend bằng Spring Boot..."
                  style={{ padding: "12px", resize: "none", fontSize: "14px" }}
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
