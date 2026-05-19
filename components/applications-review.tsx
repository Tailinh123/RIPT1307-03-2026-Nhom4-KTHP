"use client";

import React, { useState, useEffect, useCallback } from "react";
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
  Form,
  message,
  Tooltip,
  Typography,
} from "antd";
import {
  SearchOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import {
  Application,
  ApplicationStatus,
  ApplicationFilter,
  UpdateApplicationStatusRequest,
  applicationStatusLabels,
  applicationStatusColors,
  applicationStatusOptions,
} from "@/types/application";
import { mockApplications } from "@/data/mock-applications";
import { apiClient } from "@/lib/api";

const { Title, Text } = Typography;
const { TextArea } = Input;

// ============================================================================
// COMPONENT CHÍNH: ApplicationsReview
// ============================================================================

const ApplicationsReview: React.FC = () => {
  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT - Tách biệt để dễ thay thế bằng API
  // ---------------------------------------------------------------------------

  // Data state - Dữ liệu đơn ứng tuyển
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Filter state
  const [filters, setFilters] = useState<ApplicationFilter>({
    status: undefined,
    jobName: undefined,
  });

  // Modal state cho Reject
  const [rejectModalVisible, setRejectModalVisible] = useState<boolean>(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [rejectForm] = Form.useForm();

  // ---------------------------------------------------------------------------
  // API CALLS - Thay thế mock data bằng API thật tại đây
  // ---------------------------------------------------------------------------

  // Fetch danh sách applications
  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      // TODO: Uncomment để sử dụng API thật
      // const response = await apiClient.get<Application[]>("/api/v1/applications", {
      //   status: filters.status,
      //   jobName: filters.jobName,
      // });
      // setApplications(response.data);

      // Mock data - Xóa khi sử dụng API thật
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate loading
      let filteredData = [...mockApplications];

      if (filters.status) {
        filteredData = filteredData.filter((app) => app.status === filters.status);
      }
      if (filters.jobName) {
        filteredData = filteredData.filter((app) =>
          app.jobName.toLowerCase().includes(filters.jobName!.toLowerCase())
        );
      }

      setApplications(filteredData);
    } catch (error) {
      console.error("Error fetching applications:", error);
      message.error("Không thể tải danh sách đơn ứng tuyển");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Update status (Approve/Reject)
  const updateApplicationStatus = async (request: UpdateApplicationStatusRequest) => {
    try {
      // TODO: Uncomment để sử dụng API thật
      // await apiClient.put("/api/v1/applications", request);

      // Mock update - Xóa khi sử dụng API thật
      await new Promise((resolve) => setTimeout(resolve, 300));
      setApplications((prev) =>
        prev.map((app) =>
          app.id === request.id
            ? {
                ...app,
                status: request.status,
                note: request.note || app.note,
                reviewedAt: new Date().toISOString(),
              }
            : app
        )
      );

      const statusText =
        request.status === ApplicationStatus.APPROVED ? "duyệt" : "từ chối";
      message.success(`Đã ${statusText} đơn ứng tuyển thành công`);
    } catch (error) {
      console.error("Error updating application status:", error);
      message.error("Không thể cập nhật trạng thái đơn ứng tuyển");
      throw error;
    }
  };

  // ---------------------------------------------------------------------------
  // EFFECTS
  // ---------------------------------------------------------------------------

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // ---------------------------------------------------------------------------
  // HANDLERS
  // ---------------------------------------------------------------------------

  // Xử lý thay đổi filter
  const handleFilterChange = (key: keyof ApplicationFilter, value: string | undefined) => {
    setFilters((prev) => ({ ...prev, [key]: value || undefined }));
  };

  // Reset tất cả filter
  const handleResetFilters = () => {
    setFilters({ status: undefined, jobName: undefined });
  };

  // Mở CV trong tab mới
  const handleViewCV = (cvUrl: string) => {
    window.open(cvUrl, "_blank", "noopener,noreferrer");
  };

  // Xử lý Approve
  const handleApprove = async (application: Application) => {
    Modal.confirm({
      title: "Xác nhận duyệt đơn",
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>Bạn có chắc chắn muốn duyệt đơn ứng tuyển của:</p>
          <p>
            <strong>{application.applicantName}</strong> ({application.applicantEmail})
          </p>
          <p>
            Vị trí: <strong>{application.jobName}</strong>
          </p>
        </div>
      ),
      okText: "Duyệt",
      okType: "primary",
      cancelText: "Hủy",
      onOk: async () => {
        await updateApplicationStatus({
          id: application.id,
          status: ApplicationStatus.APPROVED,
        });
      },
    });
  };

  // Mở modal Reject
  const handleOpenRejectModal = (application: Application) => {
    setSelectedApplication(application);
    setRejectModalVisible(true);
    rejectForm.resetFields();
  };

  // Xử lý submit Reject
  const handleRejectSubmit = async () => {
    try {
      const values = await rejectForm.validateFields();

      if (!selectedApplication) return;

      await updateApplicationStatus({
        id: selectedApplication.id,
        status: ApplicationStatus.REJECTED,
        note: values.note,
      });

      setRejectModalVisible(false);
      setSelectedApplication(null);
      rejectForm.resetFields();
    } catch (error) {
      // Form validation error
      console.error("Validation error:", error);
    }
  };

  // Đóng modal Reject
  const handleCancelReject = () => {
    setRejectModalVisible(false);
    setSelectedApplication(null);
    rejectForm.resetFields();
  };

  // ---------------------------------------------------------------------------
  // TABLE COLUMNS DEFINITION
  // ---------------------------------------------------------------------------

  const columns: ColumnsType<Application> = [
    {
      title: "STT",
      key: "index",
      width: 70,
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 130,
      align: "center",
      render: (status: ApplicationStatus) => (
        <Tag color={applicationStatusColors[status]}>
          {applicationStatusLabels[status]}
        </Tag>
      ),
    },
    {
      title: "Ứng viên",
      key: "applicant",
      width: 220,
      render: (_, record) => (
        <div>
          <Text strong>{record.applicantName}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: "12px" }}>
            {record.applicantEmail}
          </Text>
        </div>
      ),
    },
    {
      title: "Công việc ứng tuyển",
      key: "job",
      width: 250,
      render: (_, record) => (
        <div>
          <Text strong>{record.jobName}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: "12px" }}>
            {record.companyName}
          </Text>
        </div>
      ),
    },
    {
      title: "Ngày nộp",
      dataIndex: "appliedAt",
      key: "appliedAt",
      width: 120,
      render: (date: string) => {
        const d = new Date(date);
        return (
          <div>
            <Text>{d.toLocaleDateString("vi-VN")}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: "12px" }}>
              {d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
            </Text>
          </div>
        );
      },
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      width: 200,
      ellipsis: true,
      render: (note: string | undefined) =>
        note ? (
          <Tooltip title={note}>
            <Text type="secondary">{note}</Text>
          </Tooltip>
        ) : (
          <Text type="secondary" italic>
            Chưa có ghi chú
          </Text>
        ),
    },
    {
      title: "Hành động",
      key: "actions",
      width: 200,
      align: "center",
      fixed: "right",
      render: (_, record) => {
        const isPending =
          record.status === ApplicationStatus.PENDING ||
          record.status === ApplicationStatus.REVIEWING;

        return (
          <Space size="small">
            <Tooltip title="Xem CV">
              <Button
                type="default"
                icon={<FileTextOutlined />}
                size="small"
                onClick={() => handleViewCV(record.cvUrl)}
              >
                CV
              </Button>
            </Tooltip>

            {isPending && (
              <>
                <Tooltip title="Duyệt đơn">
                  <Button
                    type="primary"
                    icon={<CheckCircleOutlined />}
                    size="small"
                    style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
                    onClick={() => handleApprove(record)}
                  >
                    Duyệt
                  </Button>
                </Tooltip>

                <Tooltip title="Từ chối">
                  <Button
                    danger
                    icon={<CloseCircleOutlined />}
                    size="small"
                    onClick={() => handleOpenRejectModal(record)}
                  >
                    Từ chối
                  </Button>
                </Tooltip>
              </>
            )}

            {record.status === ApplicationStatus.APPROVED && (
              <Tag color="green">Đã duyệt</Tag>
            )}

            {record.status === ApplicationStatus.REJECTED && (
              <Tag color="red">Đã từ chối</Tag>
            )}
          </Space>
        );
      },
    },
  ];

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <div style={{ padding: "24px", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Card>
        {/* Header */}
        <div style={{ marginBottom: "24px" }}>
          <Title level={3} style={{ margin: 0 }}>
            Xét duyệt đơn ứng tuyển
          </Title>
          <Text type="secondary">
            Quản lý và xét duyệt các đơn ứng tuyển từ ứng viên
          </Text>
        </div>

        {/* Filter Section */}
        <Card
          size="small"
          style={{ marginBottom: "16px", backgroundColor: "#fafafa" }}
        >
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={8} lg={6}>
              <Input
                placeholder="Tìm theo tên công việc..."
                prefix={<SearchOutlined />}
                value={filters.jobName || ""}
                onChange={(e) => handleFilterChange("jobName", e.target.value)}
                allowClear
              />
            </Col>

            <Col xs={24} sm={12} md={8} lg={6}>
              <Select
                placeholder="Lọc theo trạng thái"
                style={{ width: "100%" }}
                value={filters.status}
                onChange={(value) => handleFilterChange("status", value)}
                allowClear
                options={applicationStatusOptions}
              />
            </Col>

            <Col xs={24} sm={12} md={8} lg={6}>
              <Space>
                <Button icon={<ReloadOutlined />} onClick={handleResetFilters}>
                  Đặt lại
                </Button>
              </Space>
            </Col>

            <Col xs={24} sm={12} md={24} lg={6} style={{ textAlign: "right" }}>
              <Text type="secondary">
                Tổng số: <strong>{applications.length}</strong> đơn ứng tuyển
              </Text>
            </Col>
          </Row>
        </Card>

        {/* Table */}
        <Table<Application>
          columns={columns}
          dataSource={applications}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} đơn ứng tuyển`,
          }}
          scroll={{ x: 1200 }}
          bordered
          size="middle"
        />
      </Card>

      {/* Modal Reject với lý do bắt buộc */}
      <Modal
        title={
          <Space>
            <CloseCircleOutlined style={{ color: "#ff4d4f" }} />
            <span>Từ chối đơn ứng tuyển</span>
          </Space>
        }
        open={rejectModalVisible}
        onCancel={handleCancelReject}
        footer={[
          <Button key="cancel" onClick={handleCancelReject}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" danger onClick={handleRejectSubmit}>
            Xác nhận từ chối
          </Button>,
        ]}
        destroyOnClose
      >
        {selectedApplication && (
          <div style={{ marginBottom: "16px" }}>
            <p>
              <strong>Ứng viên:</strong> {selectedApplication.applicantName}
            </p>
            <p>
              <strong>Email:</strong> {selectedApplication.applicantEmail}
            </p>
            <p>
              <strong>Vị trí:</strong> {selectedApplication.jobName}
            </p>
          </div>
        )}

        <Form form={rejectForm} layout="vertical">
          <Form.Item
            name="note"
            label="Lý do từ chối"
            rules={[
              { required: true, message: "Vui lòng nhập lý do từ chối" },
              { min: 10, message: "Lý do phải có ít nhất 10 ký tự" },
            ]}
          >
            <TextArea
              rows={4}
              placeholder="Nhập lý do từ chối đơn ứng tuyển..."
              showCount
              maxLength={500}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ApplicationsReview;
