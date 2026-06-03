import React, { useEffect, useState } from 'react';
import { Typography } from 'antd';
import {
  BankOutlined,
  CodeOutlined,
  FundProjectionScreenOutlined,
  GlobalOutlined,
  PictureOutlined,
  ReadOutlined,
  TeamOutlined,
  ToolOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axiosClient from '@/api/axiosClient';
import { CATEGORY_NAME_MAP } from '@/utils/constants';
const { Text, Title } = Typography;
interface CategoryItem {
  id: number;
  name: string;
}
interface CategoryGridProps {
  onSelectCategory?: (categoryId: number) => void;
}
const CATEGORY_STYLES = [
  { icon: <CodeOutlined />, color: '#1677ff', bg: '#e6f4ff', img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop' },
  { icon: <FundProjectionScreenOutlined />, color: '#52c41a', bg: '#f6ffed', img: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?q=80&w=600&auto=format&fit=crop' },
  { icon: <BankOutlined />, color: '#722ed1', bg: '#f9f0ff', img: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=600&auto=format&fit=crop' },
  { icon: <TeamOutlined />, color: '#fa8c16', bg: '#fff7e6', img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop' },
  { icon: <GlobalOutlined />, color: '#13c2c2', bg: '#e6fffb', img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop' },
  { icon: <ToolOutlined />, color: '#eb2f96', bg: '#fff0f6', img: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=600&auto=format&fit=crop' },
  { icon: <PictureOutlined />, color: '#faad14', bg: '#fffbe6', img: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?q=80&w=600&auto=format&fit=crop' },
  { icon: <ReadOutlined />, color: '#2f54eb', bg: '#f0f5ff', img: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=600&auto=format&fit=crop' },
];
const CategoryGrid: React.FC<CategoryGridProps> = ({ onSelectCategory }) => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  useEffect(() => {
    axiosClient
      .get('/api/v1/job-categories', { params: { page: 1, size: 8 } })
      .then((res) => {
        const result = res.data?.data?.result || [];
        setCategories(Array.isArray(result) ? result : []);
      })
      .catch(() => setCategories([]));
  }, []);
  if (!categories.length) return null;
  const handleSelect = (categoryId: number) => {
    if (onSelectCategory) {
      onSelectCategory(categoryId);
      return;
    }
    navigate(`/jobs?categoryId=${categoryId}`);
  };
  return (
    <section style={{ marginTop: 48, marginBottom: 48 }}>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <Title level={3} className="section-title">Khám phá ngành nghề</Title>
        <Text className="section-subtitle" style={{ display: 'block' }}>
          Chọn lĩnh vực bạn quan tâm để tìm cơ hội phù hợp
        </Text>
      </div>
      <div
        className="category-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16,
          maxWidth: 1040,
          margin: '0 auto',
        }}
      >
        {categories.map((category, index) => {
          const style = CATEGORY_STYLES[index % CATEGORY_STYLES.length];
          const label = CATEGORY_NAME_MAP[category.name] || category.name;
          return (
            <div
              key={category.id}
              className="stagger-item"
              onClick={() => handleSelect(category.id)}
              style={{
                background: '#fff',
                border: '1px solid var(--color-border)',
                borderRadius: 12,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative'
              }}
              onMouseEnter={(event) => {
                event.currentTarget.style.borderColor = style.color;
                event.currentTarget.style.boxShadow = `0 12px 28px ${style.color}22`;
                event.currentTarget.style.transform = 'translateY(-6px)';
                const img = event.currentTarget.querySelector('.cat-img') as HTMLElement;
                if (img) img.style.transform = 'scale(1.08)';
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.borderColor = 'var(--color-border)';
                event.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.04)';
                event.currentTarget.style.transform = 'translateY(0)';
                const img = event.currentTarget.querySelector('.cat-img') as HTMLElement;
                if (img) img.style.transform = 'scale(1)';
              }}
            >
              <div style={{ width: '100%', height: 140, overflow: 'hidden', position: 'relative' }}>
                <img 
                  className="cat-img"
                  src={style.img} 
                  alt={label} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} 
                />
                <div style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0, bottom: 0,
                  background: 'linear-gradient(to bottom, rgba(0,0,0,0) 30%, rgba(0,0,0,0.5) 100%)'
                }} />
              </div>
              
              <div style={{ padding: '24px 20px 20px', textAlign: 'left', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Text strong style={{ color: '#0f172a', fontSize: 16, marginBottom: 6 }}>{label}</Text>
                <Text style={{ color: '#64748b', fontSize: 13 }}>Khám phá cơ hội</Text>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
export default CategoryGrid;
