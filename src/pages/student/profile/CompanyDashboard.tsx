import React, { useState, useEffect } from "react";
import { Card, Row, Col, message, Typography } from "antd";
import { 
  ProjectOutlined, 
  FileTextOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined 
} from "@ant-design/icons";
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
import apiClient from "@/api/api";
import type { DashboardStats, ChartData } from "@/types/dashboard";

const { Title, Text } = Typography;

// ============================================================================
// COMPONENT CHÍNH: CompanyDashboard (ĐÃ HIỆN ĐẠI HÓA & THU GỌN GIAO DIỆN)
// ============================================================================

const CompanyDashboard: React.FC = () => {
  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const [stats, setStats] = useState<DashboardStats>({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    pendingApplications: 0,
  });
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // ---------------------------------------------------------------------------
  // API CALL: Fetch Dashboard Statistics
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        let jobsList: any[] = [];
        let appsList: any[] = [];

        // 1. Gọi API Jobs độc lập
        try {
          const jobsResponse = await apiClient.get("/api/v1/jobs");
          jobsList = (Array.isArray(jobsResponse.data.data?.result)
            ? jobsResponse.data.data.result
            : Array.isArray(jobsResponse.data.data)
            ? jobsResponse.data.data
            : Array.isArray(jobsResponse.data)
            ? jobsResponse.data
            : []);
        } catch (jobError) {
          console.warn("API Jobs lỗi tại Dashboard:", jobError);
        }

        // 2. Gọi API Applications độc lập
        try {
          const applicationsResponse = await apiClient.get("/api/v1/applications");
          appsList = (Array.isArray(applicationsResponse.data.data?.result)
            ? applicationsResponse.data.data.result
            : Array.isArray(applicationsResponse.data.data)
            ? applicationsResponse.data.data
            : Array.isArray(applicationsResponse.data)
            ? applicationsResponse.data
            : []);
        } catch (appError) {
          console.warn("API Applications lỗi tại Dashboard:", appError);
        }

        // 3. Đếm số lượng thực tế từ Database
        setStats({
          totalJobs: jobsList.length,
          activeJobs: jobsList.filter((job: any) => job?.active === true || job?.active === 1 || job?.active === null || job?.active === undefined).length,
          totalApplications: appsList.length,
          pendingApplications: appsList.filter((app: any) => app?.status === "PENDING").length,
        });

        // 4. Tính toán dữ liệu biểu đồ theo TÊN DANH MỤC (Đã gộp và tối ưu hóa vòng lặp)
        const categoryMap = new Map<string, { jobs: number; applications: number }>();

        jobsList.forEach((job: any) => {
          let categoryName = "Khác";
          if (job.jobCategory && typeof job.jobCategory === 'object') {
            categoryName = job.jobCategory.name || "Khác";
          } else if (typeof job.jobCategory === 'string') {
            categoryName = job.jobCategory;
          }
          const entry = categoryMap.get(categoryName) || { jobs: 0, applications: 0 };
          entry.jobs += 1;
          categoryMap.set(categoryName, entry);
        });

        appsList.forEach((app: any) => {
          const targetJobId = app.jobId || app.job?.id || app.job_id;
          const relatedJob = jobsList.find(
            (job: any) => String(job.id) === String(targetJobId)
          );
          
          let categoryName = "Khác";
          if (relatedJob) {
            if (relatedJob.jobCategory && typeof relatedJob.jobCategory === 'object') {
              categoryName = relatedJob.jobCategory.name || "Khác";
            } else if (typeof relatedJob.jobCategory === 'string') {
              categoryName = relatedJob.jobCategory;
            }
          }
          
          const entry = categoryMap.get(categoryName) || { jobs: 0, applications: 0 };
          entry.applications += 1;
          categoryMap.set(categoryName, entry);
        });

        setChartData(
          Array.from(categoryMap.entries()).map(([name, counts]) => ({
            name,
            jobs: counts.jobs,
            applications: counts.applications,
          }))
        );

      } catch (error) {
        console.error("Lỗi xử lý số liệu tổng tại Dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // ---------------------------------------------------------------------------
  // RENDER HÀM THẺ MINI-METRIC THEO PHONG CÁCH TỐI GIẢN CHUẨN SAAS
  // ---------------------------------------------------------------------------
  const renderMiniCard = (title: string, value: number, icon: React.ReactNode, bgColor: string, iconColor: string) => (
    <Card
      bordered={false}
      style={{
        borderRadius: "12px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.02), 0 4px 12px rgba(0,0,0,0.03)",
        background: "#ffffff",
      }}
      bodyStyle={{ padding: "20px" }}
    >
      <Row align="middle" justify="space-between" wrap={false}>
        <Col>
          <Text style={{ fontSize: "13px", color: "#8c8c8c", fontWeight: 500, display: "block", marginBottom: "4px" }}>
            {title}
          </Text>
          <Title level={3} style={{ margin: 0, fontWeight: 700, color: "#1f1f1f", fontSize: "24px" }}>
            {value}
          </Title>
        </Col>
        <Col>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "10px",
              backgroundColor: bgColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              color: iconColor,
            }}
          >
            {icon}
          </div>
        </Col>
      </Row>
    </Card>
  );

  // ---------------------------------------------------------------------------
  // MAIN LAYOUT RENDER
  // ---------------------------------------------------------------------------
return (
    // Thay đổi padding sang "24px 40px" để cách đều hai bên giống ManageJobs
    <div style={{ padding: "24px 40px", background: "#f8fafc", minHeight: "100vh" }}>
      
      {/* Thêm khung giới hạn độ rộng tối đa và căn giữa */}
      <div style={{ maxWidth: "1300px", margin: "0 auto" }}>
        
        {/* Page Header */}
        <div style={{ marginBottom: "24px" }}>
          <Title level={3} style={{ margin: 0, fontWeight: 600, color: "#0f172a" }}>
            Tổng quan Quản lý Tuyển dụng
          </Title>
          <Text style={{ color: "#64748b", fontSize: "14px" }}>
            Số liệu phân tích và tiến độ xét duyệt đơn thực tập theo thời gian thực.
          </Text>
        </div>

        {/* SECTION 1: CẤU TRÚC 4 CỘT MINI METRIC MỚI */}
        <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
          <Col xs={12} sm={12} md={6}>
            {renderMiniCard("Tổng số Job tuyển", stats.totalJobs, <ProjectOutlined />, "#e0f2fe", "#0284c7")}
          </Col>
          <Col xs={12} sm={12} md={6}>
            {renderMiniCard("Công việc đang mở", stats.activeJobs, <CheckCircleOutlined />, "#dcfce7", "#16a34a")}
          </Col>
          <Col xs={12} sm={12} md={6}>
            {renderMiniCard("Tổng số đơn nộp", stats.totalApplications, <FileTextOutlined />, "#f3e8ff", "#9333ea")}
          </Col>
          <Col xs={12} sm={12} md={6}>
            {renderMiniCard("Đơn chờ xét duyệt", stats.pendingApplications, <ClockCircleOutlined />, "#fef3c7", "#d97706")}
          </Col>
        </Row>

        {/* SECTION 2: BIỂU ĐỒ THU GỌN VỪA VẶN */}
        <Card
          title={
            <span style={{ fontSize: "15px", fontWeight: 600, color: "#1e293b" }}>
              Thống kê tuyển dụng theo danh mục
            </span>
          }
          bordered={false}
          style={{
            borderRadius: "12px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.02), 0 4px 12px rgba(0,0,0,0.03)",
          }}
          bodyStyle={{ padding: "24px 24px 12px 24px" }}
          loading={loading}
        >
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12, fill: "#64748b" }}
                axisLine={{ stroke: "#e2e8f0" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "#ffffff",
                  border: "none",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
                cursor={{ fill: "#f8fafc" }}
              />
              <Legend
                wrapperStyle={{ paddingTop: "12px", fontSize: "13px" }}
                iconType="circle"
                iconSize={8}
              />
              <Bar dataKey="jobs" fill="#3b82f6" name="Công Việc" radius={[4, 4, 0, 0]} barSize={24} />
              <Bar dataKey="applications" fill="#10b981" name="Hồ Sơ" radius={[4, 4, 0, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

      </div> {/* Kết thúc thẻ đóng maxWidth */}
    </div>
  );
};

export default CompanyDashboard;