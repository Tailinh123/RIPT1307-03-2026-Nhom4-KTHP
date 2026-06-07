import React, { useEffect, useState } from 'react';
import { Typography } from 'antd';
import { BankOutlined, EnvironmentOutlined } from '@ant-design/icons';
import axiosClient from '@/api/axiosClient';
const { Text, Title } = Typography;
interface CompanyItem {
  id: number;
  name: string;
  address?: string;
  description?: string;
  logoUrl?: string;
}
const TopCompanies: React.FC = () => {
  const [companies, setCompanies] = useState<CompanyItem[]>([]);
  const [brokenLogoIds, setBrokenLogoIds] = useState<Set<number>>(new Set());
  useEffect(() => {
    axiosClient
      .get('/api/v1/companies', { params: { page: 1, size: 8 } })
      .then((res) => {
        const result = res.data?.data?.result || [];
        setCompanies(Array.isArray(result) ? result : []);
      })
      .catch(() => setCompanies([]));
  }, []);
  if (!companies.length) return null;
  return (
    <section style={{ marginTop: 48, marginBottom: 24 }}>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <Title level={3} className="section-title">Doanh nghiệp nổi bật</Title>
        <Text className="section-subtitle" style={{ display: 'block' }}>
          Những doanh nghiệp nổi bật đang tuyển dụng trên InternMatching
        </Text>
      </div>
      <div
        className="top-company-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16,
        }}
      >
        {companies.map((company) => {
          const canShowLogo = Boolean(company.logoUrl) && !brokenLogoIds.has(company.id);
          return (
            <div
              key={company.id}
              className="stagger-item"
              style={{
                background: '#fff',
                border: '1px solid var(--color-border)',
                borderRadius: 8,
                padding: 20,
                boxShadow: 'var(--shadow-sm)',
                minHeight: 174,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 8,
                    background: '#f8fafc',
                    border: '1px solid #eef0f5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    flexShrink: 0,
                  }}
                >
                  {canShowLogo ? (
                    <img
                      src={company.logoUrl}
                      alt={company.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={() =>
                        setBrokenLogoIds((prev) => {
                          const next = new Set(prev);
                          next.add(company.id);
                          return next;
                        })
                      }
                    />
                  ) : (
                    <BankOutlined style={{ fontSize: 22, color: '#94a3b8' }} />
                  )}
                </div>
                <div style={{ minWidth: 0 }}>
                  <Text strong ellipsis style={{ display: 'block', color: '#0f172a' }}>
                    {company.name}
                  </Text>
                  <Text style={{ display: 'block', color: '#64748b', fontSize: 12 }}>Đang tuyển dụng</Text>
                </div>
              </div>
              <Text
                style={{
                  color: '#64748b',
                  fontSize: 13,
                  lineHeight: '20px',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  minHeight: 40,
                }}
              >
                {company.description || 'Chua co mo ta tu doanh nghiep.'}
              </Text>
              {company.address && (
                <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 6, color: '#64748b', fontSize: 12 }}>
                  <EnvironmentOutlined />
                  <span>{company.address}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
export default TopCompanies;
