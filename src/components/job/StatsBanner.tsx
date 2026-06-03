import React, { useEffect, useRef, useState } from 'react';
import { Skeleton, Typography } from 'antd';
import { BankOutlined, CheckCircleOutlined, FileSearchOutlined, TeamOutlined } from '@ant-design/icons';
import axiosClient from '@/api/axiosClient';
const { Text } = Typography;
interface StatsData {
  totalJobs: number;
  totalCompanies: number;
  totalCategories: number;
}
const useCountUp = (end: number, duration = 1200, start = false) => {
  const [count, setCount] = useState(0);
  const frameRef = useRef<number | null>(null);
  useEffect(() => {
    if (!start || end === 0) { setCount(end); return; }
    let startTime: number | null = null;
    setCount(0);
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * end));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [end, duration, start]);
  return count;
};
const StatsBanner: React.FC = () => {
  const [data, setData] = useState<StatsData>({ totalJobs: 0, totalCompanies: 0, totalCategories: 0 });
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      const results = await Promise.allSettled([
        axiosClient.get('/api/v1/jobs', { params: { page: 1, size: 1 } }),
        axiosClient.get('/api/v1/companies', { params: { page: 1, size: 1 } }),
        axiosClient.get('/api/v1/job-categories', { params: { page: 1, size: 1 } }),
      ]);
      const getTotal = (res: PromiseSettledResult<any>) => {
        if (res.status !== 'fulfilled') return 0;
        return res.value?.data?.data?.meta?.total || res.value?.data?.data?.result?.length || 0;
      };
      setData({
        totalJobs: getTotal(results[0]),
        totalCompanies: getTotal(results[1]),
        totalCategories: getTotal(results[2]),
      });
      setLoading(false);
    };
    fetchStats();
  }, []);
  const shouldAnimate = !loading && visible;
  const countJobs = useCountUp(data.totalJobs, 1200, shouldAnimate);
  const countCompanies = useCountUp(data.totalCompanies, 1400, shouldAnimate);
  const countCategories = useCountUp(data.totalCategories, 1600, shouldAnimate);
  const stats = [
    { icon: <FileSearchOutlined />, value: countJobs, label: 'vị trí đang mở', color: '#1677ff', bg: '#e6f4ff' },
    { icon: <BankOutlined />, value: countCompanies, label: 'doanh nghiệp', color: '#0f766e', bg: '#ecfdf5' },
    { icon: <TeamOutlined />, value: countCategories, label: 'ngành nghề', color: '#fa8c16', bg: '#fff7e6' },
    { icon: <CheckCircleOutlined />, value: 4, label: 'trạng thái xét duyệt', color: '#722ed1', bg: '#f9f0ff' },
  ];
  return (
    <section
      ref={ref}
      className="stats-banner"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 14,
        margin: '4px 0 34px',
      }}
    >
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="stagger-item card-lift"
          style={{
            background: '#fff',
            border: '1px solid var(--color-border)',
            borderRadius: 8,
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 8,
              background: stat.bg,
              color: stat.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              flexShrink: 0,
            }}
          >
            {stat.icon}
          </div>
          <div>
            {loading ? (
              <Skeleton.Input active size="small" style={{ width: 48, height: 22 }} />
            ) : (
              <div className="count-up" style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>
                {stat.value}
              </div>
            )}
            <Text style={{ color: '#64748b', fontSize: 13 }}>{stat.label}</Text>
          </div>
        </div>
      ))}
    </section>
  );
};
export default React.memo(StatsBanner);
