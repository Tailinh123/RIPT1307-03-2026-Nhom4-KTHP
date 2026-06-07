import React, { useState, useEffect } from "react";
import { Card, Row, Col, Typography, List, Tag, Space } from "antd";
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
import { applicationStatusLabels } from "@/types/application";
const { Title, Text } = Typography;
const CompanyDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    pendingApplications: 0,
  });
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [recentApplications, setRecentApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const userStr = localStorage.getItem('user');
        const userObj = userStr ? JSON.parse(userStr) : null;
        const myCompanyId = userObj?.company?.id || userObj?.companyId;
        let jobsList: any[] = [];
        let appsList: any[] = [];
        try {
          const jobsResponse = await apiClient.get('/api/v1/jobs', { params: { page: 1, size: 500, sort: 'id,desc' } });
          const allJobs = (Array.isArray(jobsResponse.data.data?.result)
            ? jobsResponse.data.data.result
            : Array.isArray(jobsResponse.data.data)
            ? jobsResponse.data.data
            : Array.isArray(jobsResponse.data)
            ? jobsResponse.data
            : []);
          jobsList = myCompanyId
            ? allJobs.filter((job: any) => String(job.company?.id) === String(myCompanyId))
            : allJobs;
        } catch (jobError) {
          console.warn('API Jobs lỗi:', jobError);
        }
        try {
          const applicationsResponse = await apiClient.get('/api/v1/applications', { params: { page: 1, size: 500, sort: 'id,desc' } });
          const allApps = (Array.isArray(applicationsResponse.data.data?.result)
            ? applicationsResponse.data.data.result
            : Array.isArray(applicationsResponse.data.data)
            ? applicationsResponse.data.data
            : Array.isArray(applicationsResponse.data)
            ? applicationsResponse.data
            : []);
          appsList = allApps;
        } catch (appError) {
          console.warn('API Applications lỗi:', appError);
        }
        setStats({
          totalJobs: jobsList.length,
          activeJobs: jobsList.filter((job: any) => job?.active === true || job?.active === 1 || job?.active == null).length,
          totalApplications: appsList.length,
          pendingApplications: appsList.filter((app: any) => app?.status === 'PENDING').length,
        });
        setRecentApplications(appsList.slice(0, 5));
        const CATEGORY_MAP_VI: Record<string, string> = {
          "Ngon ngu": "Ngôn ngữ",
          "Thiet ke": "Thiết kế",
          "Ke toan - Kiem toan": "Kế toán - Kiểm toán",
          "Kinh doanh": "Kinh doanh",
          "IT - Phan mem": "IT - Phần mềm",
          "Nhan su": "Nhân sự",
          "Marketing - PR": "Marketing - PR",
          "Cong nghe thong tin": "Công nghệ thông tin",
        };
        const formatCategoryName = (name: string) => CATEGORY_MAP_VI[name] || name;
        const categoryMap = new Map<string, { jobs: number; applications: number }>();
        jobsList.forEach((job: any) => {
          let categoryName = 'Khác';
          if (job.jobCategory && typeof job.jobCategory === 'object') categoryName = job.jobCategory.name || 'Khác';
          else if (typeof job.jobCategory === 'string') categoryName = job.jobCategory;
          categoryName = formatCategoryName(categoryName);
          const entry = categoryMap.get(categoryName) || { jobs: 0, applications: 0 };
          entry.jobs += 1;
          categoryMap.set(categoryName, entry);
        });
        appsList.forEach((app: any) => {
          const targetJobId = app.jobId || app.job?.id || app.job_id;
          const relatedJob = jobsList.find((job: any) => String(job.id) === String(targetJobId));
          let categoryName = 'Khác';
          if (relatedJob) {
            if (relatedJob.jobCategory && typeof relatedJob.jobCategory === 'object') categoryName = relatedJob.jobCategory.name || 'Khác';
            else if (typeof relatedJob.jobCategory === 'string') categoryName = relatedJob.jobCategory;
          }
          categoryName = formatCategoryName(categoryName);
          const entry = categoryMap.get(categoryName) || { jobs: 0, applications: 0 };
          entry.applications += 1;
          categoryMap.set(categoryName, entry);
        });
        setChartData(Array.from(categoryMap.entries()).map(([name, counts]) => ({ name, jobs: counts.jobs, applications: counts.applications })));
      } catch (error) {
        console.error('Lỗi xử lý số liệu Dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);
  const renderMiniCard = (title: string, value: number, icon: React.ReactNode, bgColor: string, iconColor: string) => (
    <Card
      bordered={false}
      style={{
        borderRadius: "8px",
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
  return (
    <div className="page-enter">
      <div style={{ maxWidth: "1300px", margin: "0 auto" }}>
        <div style={{ marginBottom: "24px" }}>
          <Title level={3} style={{ margin: 0, fontWeight: 600, color: "#0f172a" }}>
            Tổng quan Quản lý Tuyển dụng
          </Title>
          <Text style={{ color: "#64748b", fontSize: "14px" }}>
            Số liệu phân tích và tiến độ xét duyệt đơn thực tập theo thời gian thực.
          </Text>
        </div>
        <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
          <Col xs={12} sm={12} md={6}>
            {renderMiniCard("Job tuyển (của công ty)", stats.totalJobs, <ProjectOutlined />, "#e0f2fe", "#0284c7")}
          </Col>
          <Col xs={12} sm={12} md={6}>
            {renderMiniCard("Job mở (của công ty)", stats.activeJobs, <CheckCircleOutlined />, "#dcfce7", "#16a34a")}
          </Col>
          <Col xs={12} sm={12} md={6}>
            {renderMiniCard("Tổng đơn (của công ty)", stats.totalApplications, <FileTextOutlined />, "#f3e8ff", "#9333ea")}
          </Col>
          <Col xs={12} sm={12} md={6}>
            {renderMiniCard("Chờ duyệt (của công ty)", stats.pendingApplications, <ClockCircleOutlined />, "#fef3c7", "#d97706")}
          </Col>
        </Row>
        <Card
          title={
            <span style={{ fontSize: "15px", fontWeight: 600, color: "#1e293b" }}>
              Thống kê tuyển dụng theo danh mục
            </span>
          }
          bordered={false}
          style={{
            borderRadius: "8px",
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
        <Card
          title={<span style={{ fontSize: 15, fontWeight: 600, color: "#1e293b" }}>Đơn ứng tuyển gần đây</span>}
          bordered={false}
          style={{
            borderRadius: "8px",
            marginTop: 24,
            boxShadow: "0 1px 3px rgba(0,0,0,0.02), 0 4px 12px rgba(0,0,0,0.03)",
          }}
          bodyStyle={{ padding: "8px 24px" }}
          loading={loading}
        >
          <List
            dataSource={recentApplications}
            locale={{ emptyText: "Chưa có đơn ứng tuyển nào cho công ty này." }}
            renderItem={(item: any) => {
              const status = item.status || "PENDING";
              const applicant = item.resume?.user?.email || item.createdBy || item.applicantEmail || "Ứng viên";
              const jobTitle = item.job?.title || item.job?.name || item.jobTitle || item.jobName || "Vị trí ứng tuyển";
              const statusColor = status === "APPROVED" ? "green" : status === "REJECTED" ? "red" : status === "REVIEWING" ? "blue" : "orange";
              return (
                <List.Item style={{ padding: "14px 0" }}>
                  <List.Item.Meta
                    avatar={
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 8,
                          background: "#e6f4ff",
                          color: "#1677ff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <FileTextOutlined />
                      </div>
                    }
                    title={<Text strong style={{ color: "#0f172a" }}>{jobTitle}</Text>}
                    description={<Text style={{ color: "#64748b", fontSize: 13 }}>{applicant}</Text>}
                  />
                  <Space>
                    <Tag color={statusColor} style={{ borderRadius: 4 }}>
                      {applicationStatusLabels[status as keyof typeof applicationStatusLabels] || status}
                    </Tag>
                    <Text style={{ color: "#94a3b8", fontSize: 12 }}>
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString("vi-VN") : "Mới cập nhật"}
                    </Text>
                  </Space>
                </List.Item>
              );
            }}
          />
        </Card>
      </div>
    </div>
  );
};
export default CompanyDashboard;
