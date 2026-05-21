import React, { useState, useEffect } from "react";
import { Card, Row, Col, message, Typography } from "antd";
import { ProjectOutlined, FileTextOutlined } from "@ant-design/icons";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { mockDashboardStats, mockChartData } from "@/data/mock-dashboard";
import apiClient from "@/api/api";
import type { DashboardStats, ChartData } from "@/types/dashboard";

const { Title, Text } = Typography;

// ============================================================================
// COMPONENT CHÍNH: CompanyDashboard
// ============================================================================

const CompanyDashboard: React.FC = () => {
  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------

  const [stats, setStats] = useState<DashboardStats>(mockDashboardStats);
  const [chartData, setChartData] = useState<ChartData[]>(mockChartData);
  const [loading, setLoading] = useState<boolean>(false);

  // ---------------------------------------------------------------------------
  // API CALL: Fetch Dashboard Statistics
  // ---------------------------------------------------------------------------

useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // 1. Mở khóa gọi API thật đồng thời
        const [jobsResponse, applicationsResponse] = await Promise.all([
          apiClient.get("/api/v1/jobs"),
          apiClient.get("/api/v1/applications"),
        ]);

        // 2. Bóc tách mảng dữ liệu chuẩn đầu ra (Hỗ trợ cả có và không có phân trang)
        const jobsList = (Array.isArray(jobsResponse.data.data?.result)
          ? jobsResponse.data.data.result
          : Array.isArray(jobsResponse.data.data)
          ? jobsResponse.data.data
          : Array.isArray(jobsResponse.data)
          ? jobsResponse.data
          : []);
        const appsList = (Array.isArray(applicationsResponse.data.data?.result)
          ? applicationsResponse.data.data.result
          : Array.isArray(applicationsResponse.data.data)
          ? applicationsResponse.data.data
          : Array.isArray(applicationsResponse.data)
          ? applicationsResponse.data
          : []);

        // 3. Đếm số lượng thực tế từ Database
        setStats({
          totalJobs: jobsList.length,
          activeJobs: jobsList.filter((job: { active?: boolean }) => job?.active === true).length,
          totalApplications: appsList.length,
          pendingApplications: appsList.filter((app: { status?: string }) => app?.status === "PENDING").length,
        });

        // Tạm thời giữ nguyên biểu đồ bằng dữ liệu giả cho đến khi BE hỗ trợ API gom nhóm (Group By)
        setChartData(mockChartData); 

      } catch (error) {
        console.error("Lỗi đồng bộ số liệu Dashboard:", error);
        message.error("Lỗi 401: Trình duyệt chưa có Token xác thực!");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // ---------------------------------------------------------------------------
  // CUSTOM COLORS
  // ---------------------------------------------------------------------------

  const primaryColor = "#1890ff"; // Ant Design blue
  const successColor = "#52c41a"; // Ant Design green
  const jobsBarColor = "#1890ff"; // Blue
  const applicationsBarColor = "#52c41a"; // Green

  // ---------------------------------------------------------------------------
  // RENDER: Card Metrics
  // ---------------------------------------------------------------------------

  const renderMetricCard = (
    title: string,
    value: number,
    subtitle: string,
    icon: React.ReactNode,
    color: string
  ) => (
    <Card
      className="border-0"
      style={{
        background: "linear-gradient(135deg, #ffffff 0%, #fafafa 100%)",
        borderTop: `4px solid ${color}`,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <Row align="middle" justify="space-between">
        <Col>
          <Text type="secondary" style={{ fontSize: "14px" }}>
            {title}
          </Text>
          <Title level={2} style={{ margin: "8px 0 0 0" }}>
            {value}
          </Title>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            {subtitle}
          </Text>
        </Col>
        <Col>
          <div
            style={{
              fontSize: "48px",
              color: color,
              opacity: 0.3,
            }}
          >
            {icon}
          </div>
        </Col>
      </Row>
    </Card>
  );

  // ---------------------------------------------------------------------------
  // RENDER: Main Component
  // ---------------------------------------------------------------------------

  return (
    <div style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}>
      <Title level={2} style={{ marginBottom: "24px" }}>
        Tổng Quan Quản Lý Tuyển Dụng
      </Title>

      {/* ===================================================================== */
      /* SECTION 1: METRICS CARDS */
      /* ===================================================================== */}

      <Row gutter={[24, 24]} style={{ marginBottom: "32px" }}>
        <Col xs={24} sm={24} md={12} lg={12}>
          {renderMetricCard(
            "Tổng Số Job Tuyển Dụng",
            stats.totalJobs,
            `${stats.activeJobs} công việc đang tuyển`,
            <ProjectOutlined />,
            primaryColor
          )}
        </Col>

        <Col xs={24} sm={24} md={12} lg={12}>
          {renderMetricCard(
            "Tổng Số Đơn Ứng Tuyển",
            stats.totalApplications,
            `${stats.pendingApplications} đơn chờ xét duyệt`,
            <FileTextOutlined />,
            successColor
          )}
        </Col>
      </Row>

      {/* ===================================================================== */
      /* SECTION 2: STATISTICS CHART */
      /* ===================================================================== */}

      <Card
        title="Thống Kê Tuyển Dụng Theo Danh Mục"
        style={{
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
        loading={loading}
      >
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8e8e8" />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={120}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              label={{ value: "Số Lượng", angle: -90, position: "insideLeft" }}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                background: "#fff",
                border: `1px solid ${primaryColor}`,
                borderRadius: "4px",
              }}
              cursor={{ fill: "rgba(24, 144, 255, 0.1)" }}
            />
            <Legend
              wrapperStyle={{ paddingTop: "20px" }}
              iconType="square"
            />

            <Bar dataKey="jobs" fill={jobsBarColor} name="Công Việc" radius={[8, 8, 0, 0]} />
            <Bar
              dataKey="applications"
              fill={applicationsBarColor}
              name="Hồ Sơ"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* ===================================================================== */
      /* ADDITIONAL INFO */
      /* ===================================================================== */}

      <Row gutter={[24, 24]} style={{ marginTop: "24px" }}>
        <Col xs={24}>
          <Card style={{ background: "#fafafa" }}>
            <Text type="secondary">
              💡 <strong>Lưu ý:</strong> Biểu đồ đang sử dụng dữ liệu mẫu. Khi backend API ready, hãy uncomment các hàm API call trong useEffect để tải dữ liệu thực tế.
            </Text>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CompanyDashboard;