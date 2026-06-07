import React, { useEffect, useState } from 'react';
import { Badge, Button, Divider, Input, Popover, Select } from 'antd';
import {
  CloseCircleFilled,
  DownOutlined,
  FilterOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { CATEGORY_NAME_MAP, JOB_LEVEL_OPTIONS, WORK_MODE_OPTIONS } from '@/utils/constants';
import type { JobFilterParams, JobLevel, WorkMode } from '@/types/job';
import axiosClient from '@/api/axiosClient';
interface JobFilterProps {
  filters: JobFilterParams;
  onChange: (filters: JobFilterParams) => void;
  loading?: boolean;
}
const popupToBody = () => document.body;
const dropdownStyle: React.CSSProperties = { zIndex: 2000, borderRadius: 8 };
const labelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: '#64748b',
  marginBottom: 6,
  textTransform: 'uppercase',
  letterSpacing: 0,
  display: 'block',
};
const JobFilter: React.FC<JobFilterProps> = ({ filters, onChange, loading }) => {
  const [keyword, setKeyword] = useState(filters.keyword ?? '');
  const [location, setLocation] = useState<string | undefined>(filters.location);
  const [level, setLevel] = useState<JobLevel | undefined>(filters.level);
  const [workMode, setWorkMode] = useState<WorkMode | undefined>(filters.workMode);
  const [categoryId, setCategoryId] = useState<number | undefined>(filters.categoryId);
  const [companyId, setCompanyId] = useState<number | undefined>(filters.companyId);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState<{ label: string; value: number }[]>([]);
  const [locationOptions, setLocationOptions] = useState<{ label: string; value: string }[]>([]);
  const [companyOptions, setCompanyOptions] = useState<{ label: string; value: number }[]>([]);
  useEffect(() => {
    axiosClient
      .get('/api/v1/job-categories', { params: { page: 1, size: 100 } })
      .then((res) => {
        const data = res.data?.data?.result || res.data?.data || res.data || [];
        const list = Array.isArray(data) ? data : [];
        setCategoryOptions(
          list.map((category: any) => ({
            label: CATEGORY_NAME_MAP[category.name] || category.name,
            value: category.id,
          })),
        );
      })
      .catch(() => setCategoryOptions([]));
    axiosClient
      .get('/api/v1/jobs', { params: { page: 1, size: 500 } })
      .then((res) => {
        const data = res.data?.data?.result || [];
        const locSet = new Set<string>();
        data.forEach((job: any) => {
          if (job.location) locSet.add(job.location);
        });
        setLocationOptions(Array.from(locSet).map((loc) => ({ label: loc, value: loc })));
      })
      .catch(() => setLocationOptions([]));
    axiosClient
      .get('/api/v1/companies', { params: { page: 1, size: 500 } })
      .then((res) => {
        const data = res.data?.data?.result || [];
        setCompanyOptions(data.map((company: any) => ({ label: company.name, value: company.id })));
      })
      .catch(() => setCompanyOptions([]));
  }, []);
  const activeCount = [location, level, workMode, categoryId, companyId].filter(Boolean).length;
  const handleSearch = () => {
    onChange({
      keyword: keyword.trim() || undefined,
      location,
      level,
      workMode,
      categoryId,
      companyId,
    });
    setPopoverOpen(false);
  };
  const handleReset = () => {
    setKeyword('');
    setLocation(undefined);
    setLevel(undefined);
    setWorkMode(undefined);
    setCategoryId(undefined);
    setCompanyId(undefined);
    onChange({});
    setPopoverOpen(false);
  };
  const popoverContent = (
    <div style={{ width: 320 }}>
      <div style={{ marginBottom: 14 }}>
        <span style={labelStyle}>Ngành nghề</span>
        <Select
          placeholder="Tất cả ngành nghề"
          allowClear
          showSearch
          style={{ width: '100%' }}
          options={categoryOptions}
          value={categoryId}
          onChange={setCategoryId}
          filterOption={(input, option) => String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
          getPopupContainer={popupToBody}
          dropdownStyle={dropdownStyle}
        />
      </div>
      <div style={{ marginBottom: 14 }}>
        <span style={labelStyle}>Công ty</span>
        <Select
          placeholder="Tất cả công ty"
          allowClear
          showSearch
          style={{ width: '100%' }}
          options={companyOptions}
          value={companyId}
          onChange={setCompanyId}
          filterOption={(input, option) => String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
          getPopupContainer={popupToBody}
          dropdownStyle={dropdownStyle}
        />
      </div>
      <div style={{ marginBottom: 14 }}>
        <span style={labelStyle}>Địa điểm</span>
        <Select
          placeholder="Tất cả địa điểm"
          allowClear
          showSearch
          style={{ width: '100%' }}
          options={locationOptions}
          value={location}
          onChange={setLocation}
          filterOption={(input, option) => String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
          getPopupContainer={popupToBody}
          dropdownStyle={dropdownStyle}
        />
      </div>
      <div style={{ marginBottom: 14 }}>
        <span style={labelStyle}>Cấp độ</span>
        <Select
          placeholder="Tất cả cấp độ"
          allowClear
          style={{ width: '100%' }}
          options={JOB_LEVEL_OPTIONS}
          value={level}
          onChange={setLevel}
          getPopupContainer={popupToBody}
          dropdownStyle={dropdownStyle}
        />
      </div>
      <div style={{ marginBottom: 14 }}>
        <span style={labelStyle}>Hình thức làm việc</span>
        <Select
          placeholder="Tất cả hình thức"
          allowClear
          style={{ width: '100%' }}
          options={WORK_MODE_OPTIONS}
          value={workMode}
          onChange={setWorkMode}
          getPopupContainer={popupToBody}
          dropdownStyle={dropdownStyle}
        />
      </div>
      <Divider style={{ margin: '10px 0 12px' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button type="text" size="small" icon={<CloseCircleFilled />} onClick={handleReset} style={{ color: '#64748b' }}>
          Xóa bộ lọc
        </Button>
        <Button type="primary" size="small" onClick={handleSearch} style={{ borderRadius: 8, fontWeight: 700, height: 32 }}>
          Áp dụng
        </Button>
      </div>
    </div>
  );
  return (
    <div
      className="job-filter-bar"
      style={{
        display: 'grid',
        gridTemplateColumns: '132px minmax(260px, 1fr) 132px',
        alignItems: 'center',
        gap: 6,
        background: '#ffffff',
        borderRadius: 8,
        padding: 6,
        border: '1px solid rgba(226,232,240,0.95)',
        boxShadow: '0 12px 30px rgba(15, 23, 42, 0.14)',
        width: '100%',
      }}
    >
      <Popover
        content={popoverContent}
        title={<div style={{ fontWeight: 700, color: '#0f172a' }}>Bộ lọc nâng cao</div>}
        trigger="click"
        open={popoverOpen}
        onOpenChange={setPopoverOpen}
        placement="bottomLeft"
        overlayStyle={{ zIndex: 1100 }}
        overlayInnerStyle={{ borderRadius: 8, padding: '16px 20px', boxShadow: '0 12px 40px rgba(15,23,42,0.18)' }}
        getTooltipContainer={popupToBody}
      >
        <Button
          icon={<FilterOutlined />}
          style={{
            height: 40,
            width: '100%',
            borderRadius: 8,
            border: '1px solid #e5e7eb',
            background: '#f8fafc',
            fontWeight: 650,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          Bộ lọc
          {activeCount > 0 && <Badge count={activeCount} size="small" style={{ background: '#1677ff' }} />}
          <DownOutlined style={{ fontSize: 10, color: '#94a3b8' }} />
        </Button>
      </Popover>
      <Input
        prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
        placeholder="Tên vị trí, công ty, địa điểm..."
        bordered={false}
        value={keyword}
        onChange={(event) => setKeyword(event.target.value)}
        onPressEnter={handleSearch}
        allowClear
        style={{
          height: 40,
          minWidth: 0,
          padding: '0 12px',
          fontSize: 14,
          borderLeft: '1px solid #eef2f7',
          borderRight: '1px solid #eef2f7',
        }}
      />
      <Button
        type="primary"
        icon={<SearchOutlined />}
        loading={loading}
        onClick={handleSearch}
        style={{
          height: 40,
          width: '100%',
          borderRadius: 8,
          padding: '0 18px',
          fontWeight: 750,
          boxShadow: '0 6px 14px rgba(22,119,255,0.22)',
        }}
      >
        Tìm kiếm
      </Button>
    </div>
  );
};
export default JobFilter;
