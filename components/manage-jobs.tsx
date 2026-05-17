"use client";

import React, { useState, useMemo } from "react";
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
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

import {
  Job,
  JobFormData,
  JobFilter,
  JobLevel,
  JobType,
  WorkMode,
  JobStatus,
  skillOptions,
  jobCategoryOptions,
  levelLabels,
  jobTypeLabels,
  workModeLabels,
  statusLabels,
  statusColors,
} from "@/types/job";
import { mockJobs, generateJobId } from "@/data/mock-jobs";

const { Title } = Typography;
const { TextArea } = Input;

export default function ManageJobs() {
  // ==================== STATE MANAGEMENT ====================
  // Jobs data state - Dễ dàng thay thế bằng API fetch
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [loading, setLoading] = useState<boolean>(false);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [modalLoading, setModalLoading] = useState<boolean>(false);

  // Filter state
  const [filters, setFilters] = useState<JobFilter>({
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
        job.name.toLowerCase().includes(filters.name.toLowerCase());
      const companyMatch =
        !filters.companyName ||
        job.companyName.toLowerCase().includes(filters.companyName.toLowerCase());
      const statusMatch = !filters.status || job.status === filters.status;

      return nameMatch && companyMatch && statusMatch;
    });
  }, [jobs, filters]);

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
      name: record.name,
      description: record.description,
      salary: record.salary,
      level: record.level,
      jobType: record.jobType,
      workMode: record.workMode,
      skills: record.skills,
      jobCategory: record.jobCategory,
    });
    setIsModalOpen(true);
  };

  // Xóa job
  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      // TODO: Thay thế bằng API call
      // await axios.delete(`/api/jobs/${id}`);
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
      if (editingJob) {
        // TODO: Thay thế bằng API call
        // const response = await axios.put(`/api/jobs/${editingJob.id}`, values);
        const updatedJob: Job = {
          ...editingJob,
          ...values,
          updatedAt: new Date().toISOString(),
        };
        setJobs((prev) =>
          prev.map((job) => (job.id === editingJob.id ? updatedJob : job))
        );
        message.success("Cập nhật vị trí thực tập thành công!");
      } else {
        // TODO: Thay thế bằng API call
        // const response = await axios.post('/api/jobs', values);
        const newJob: Job = {
          id: generateJobId(),
          ...values,
          companyName: "Công ty của bạn", // Lấy từ context user sau
          serviceFee: Math.round(values.salary * 0.1),
          status: JobStatus.PENDING,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setJobs((prev) => [newJob, ...prev]);
        message.success("Thêm vị trí thực tập mới thành công!");
      }
      setIsModalOpen(false);
      form.resetFields();
    } catch {
      message.error("Có lỗi xảy ra!");
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
      dataIndex: "name",
      key: "name",
      width: 250,
      render: (name: string, record: Job) => (
        <div>
          <div className="font-medium text-gray-900">{name}</div>
          <div className="text-xs text-gray-500">
            {levelLabels[record.level]} • {jobTypeLabels[record.jobType]}
          </div>
        </div>
      ),
    },
    {
      title: "Tên công ty",
      dataIndex: "companyName",
      key: "companyName",
      width: 180,
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
          {fee.toLocaleString("vi-VN")} VNĐ
        </span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      align: "center",
      render: (status: JobStatus) => (
        <Tag color={statusColors[status]}>{statusLabels[status]}</Tag>
      ),
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
            title="Xác nhận xóa"
            description="Bạn có chắc chắn muốn xóa vị trí này?"
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
                  setFilters((prev) => ({ ...prev, status: value }))
                }
                allowClear
                options={Object.values(JobStatus).map((status) => ({
                  value: status,
                  label: statusLabels[status],
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
          title={editingJob ? "Chỉnh sửa vị trí thực tập" : "Thêm vị trí thực tập mới"}
          open={isModalOpen}
          onCancel={() => {
            setIsModalOpen(false);
            form.resetFields();
          }}
          footer={null}
          width={720}
          destroyOnClose
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="mt-4"
          >
            <Form.Item
              name="name"
              label="Tên công việc"
              rules={[
                { required: true, message: "Vui lòng nhập tên công việc" },
                { min: 5, message: "Tên công việc phải có ít nhất 5 ký tự" },
              ]}
            >
              <Input placeholder="VD: Frontend Developer Intern" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Mô tả công việc"
              rules={[
                { required: true, message: "Vui lòng nhập mô tả công việc" },
                { min: 20, message: "Mô tả phải có ít nhất 20 ký tự" },
              ]}
            >
              <TextArea
                rows={4}
                placeholder="Mô tả chi tiết về vị trí tuyển dụng, yêu cầu, quyền lợi..."
                showCount
                maxLength={1000}
              />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="salary"
                  label="Mức lương (VNĐ)"
                  rules={[
                    { required: true, message: "Vui lòng nhập mức lương" },
                  ]}
                >
                  <InputNumber
                    className="w-full"
                    min={0}
                    step={500000}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) =>
                      Number(value?.replace(/\$\s?|(,*)/g, "")) || 0
                    }
                    placeholder="VD: 5,000,000"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="level"
                  label="Cấp độ"
                  rules={[
                    { required: true, message: "Vui lòng chọn cấp độ" },
                  ]}
                >
                  <Select
                    placeholder="Chọn cấp độ"
                    options={Object.values(JobLevel).map((level) => ({
                      value: level,
                      label: levelLabels[level],
                    }))}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="jobType"
                  label="Loại hình"
                  rules={[
                    { required: true, message: "Vui lòng chọn loại hình" },
                  ]}
                >
                  <Select
                    placeholder="Chọn loại hình"
                    options={Object.values(JobType).map((type) => ({
                      value: type,
                      label: jobTypeLabels[type],
                    }))}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="workMode"
                  label="Hình thức làm việc"
                  rules={[
                    { required: true, message: "Vui lòng chọn hình thức" },
                  ]}
                >
                  <Select
                    placeholder="Chọn hình thức"
                    options={Object.values(WorkMode).map((mode) => ({
                      value: mode,
                      label: workModeLabels[mode],
                    }))}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="skills"
                  label="Kỹ năng yêu cầu"
                  rules={[
                    { required: true, message: "Vui lòng chọn ít nhất 1 kỹ năng" },
                  ]}
                >
                  <Select
                    mode="multiple"
                    placeholder="Chọn các kỹ năng"
                    options={skillOptions}
                    maxTagCount="responsive"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="jobCategory"
                  label="Danh mục công việc"
                  rules={[
                    { required: true, message: "Vui lòng chọn danh mục" },
                  ]}
                >
                  <Select
                    placeholder="Chọn danh mục"
                    options={jobCategoryOptions}
                  />
                </Form.Item>
              </Col>
            </Row>

            <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
              <Button
                onClick={() => {
                  setIsModalOpen(false);
                  form.resetFields();
                }}
              >
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" loading={modalLoading}>
                {editingJob ? "Cập nhật" : "Thêm mới"}
              </Button>
            </div>
          </Form>
        </Modal>
      </div>
    </div>
  );
}
