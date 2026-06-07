import { useEffect, useMemo, useState } from 'react';
import { Alert, Card, Col, Row, Statistic, Typography } from 'antd';
import {
  BankOutlined,
  CheckSquareOutlined,
  FileTextOutlined,
  KeyOutlined,
  ProfileOutlined,
  SafetyCertificateOutlined,
  TagsOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { adminApi } from '@/api/adminApi';
import type {
  AdminApplication,
  AdminCompany,
  AdminJob,
  AdminPermission,
  AdminResume,
  AdminRole,
  AdminSkill,
  AdminUser,
} from '@/types/admin';
const { Text, Title } = Typography;
type DashboardKey =
  | 'users'
  | 'companies'
  | 'jobs'
  | 'skills'
  | 'resumes'
  | 'applications'
  | 'roles'
  | 'permissions';
type DashboardCounts = Record<DashboardKey, number>;
const emptyCounts: DashboardCounts = {
  users: 0,
  companies: 0,
  jobs: 0,
  skills: 0,
  resumes: 0,
  applications: 0,
  roles: 0,
  permissions: 0,
};
const statCards = [
  { key: 'users', title: 'Người dùng', icon: <TeamOutlined />, color: '#1677ff' },
  { key: 'companies', title: 'Công ty', icon: <BankOutlined />, color: '#13c2c2' },
  { key: 'jobs', title: 'Công việc', icon: <ProfileOutlined />, color: '#0f766e' },
  { key: 'applications', title: 'Ứng tuyển', icon: <CheckSquareOutlined />, color: '#fa8c16' },
  { key: 'resumes', title: 'Hồ sơ', icon: <FileTextOutlined />, color: '#eb2f96' },
  { key: 'skills', title: 'Kỹ năng', icon: <TagsOutlined />, color: '#059669' },
  { key: 'roles', title: 'Vai trò', icon: <SafetyCertificateOutlined />, color: '#faad14' },
  { key: 'permissions', title: 'Quyền hạn', icon: <KeyOutlined />, color: '#dc2626' },
] as const;
const getTotal = async (loader: Promise<{ meta: { total: number } }>) => {
  const page = await loader;
  return page.meta?.total || 0;
};
const AdminDashboard = () => {
  const [counts, setCounts] = useState<DashboardCounts>(emptyCounts);
  const [failedKeys, setFailedKeys] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const loadCounts = async () => {
      setLoading(true);
      const entries: Array<[DashboardKey, Promise<number>]> = [
        ['users', getTotal(adminApi.users.list<AdminUser>({ page: 1, size: 1 }))],
        ['companies', getTotal(adminApi.companies.list<AdminCompany>({ page: 1, size: 1 }))],
        ['jobs', getTotal(adminApi.jobs.list<AdminJob>({ page: 1, size: 1 }))],
        ['skills', getTotal(adminApi.skills.list<AdminSkill>({ page: 1, size: 1 }))],
        ['resumes', getTotal(adminApi.resumes.list<AdminResume>({ page: 1, size: 1 }))],
        ['applications', getTotal(adminApi.applications.list<AdminApplication>({ page: 1, size: 1 }))],
        ['roles', getTotal(adminApi.roles.list<AdminRole>({ page: 1, size: 1 }))],
        ['permissions', getTotal(adminApi.permissions.list<AdminPermission>({ page: 1, size: 1 }))],
      ];
      const results = await Promise.allSettled(entries.map(([, promise]) => promise));
      const nextCounts = { ...emptyCounts };
      const nextFailedKeys: string[] = [];
      entries.forEach(([key], index) => {
        const result = results[index];
        if (result.status === 'fulfilled') nextCounts[key] = result.value;
        else nextFailedKeys.push(key);
      });
      setCounts(nextCounts);
      setFailedKeys(nextFailedKeys);
      setLoading(false);
    };
    loadCounts();
  }, []);
  const chartData = useMemo(
    () =>
      statCards.map((item) => ({
        name: item.title,
        total: counts[item.key],
        color: item.color,
      })),
    [counts],
  );
  const userName = (() => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user?.name || 'Admin';
    } catch {
      return 'Admin';
    }
  })();
  const todayStr = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  return (
    <div className="page-enter">
      <Card
        bordered={false}
        style={{
          borderRadius: 8,
          marginBottom: 20,
          background: 'linear-gradient(135deg, #1677ff 0%, #0f766e 100%)',
          border: 'none',
        }}
        bodyStyle={{ padding: '28px 32px' }}
      >
        <Title level={4} style={{ color: '#fff', margin: 0, marginBottom: 4, fontWeight: 750 }}>
          Chào mừng quay lại, {userName}!
        </Title>
        <Text style={{ color: 'rgba(255,255,255,0.84)', fontSize: 14 }}>
          {todayStr} — Tổng quan dữ liệu hệ thống InternMatch.
        </Text>
      </Card>
      {failedKeys.length > 0 && (
        <Alert
          type="warning"
          showIcon
          style={{ marginBottom: 16, borderRadius: 8 }}
          message={`Một số API chưa trả dữ liệu: ${failedKeys.join(', ')}. Kiểm tra token/quyền SUPER_ADMIN hoặc response backend.`}
        />
      )}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        {statCards.map((item) => (
          <Col xs={24} sm={12} lg={6} key={item.key}>
            <Card
              bordered={false}
              style={{
                borderRadius: 8,
                border: '1px solid #eef0f5',
                boxShadow: 'var(--shadow-sm)',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={(event) => {
                event.currentTarget.style.transform = 'translateY(-3px)';
                event.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)';
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.transform = 'translateY(0)';
                event.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              }}
              loading={loading}
            >
              <Statistic title={item.title} value={counts[item.key]} prefix={<span style={{ color: item.color }}>{item.icon}</span>} />
            </Card>
          </Col>
        ))}
      </Row>
      <Card bordered={false} style={{ borderRadius: 8, border: '1px solid #eef0f5', boxShadow: 'var(--shadow-sm)' }}>
        <Title level={5} style={{ marginTop: 0 }}>
          Phân bố dữ liệu
        </Title>
        <div style={{ height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};
export default AdminDashboard;
