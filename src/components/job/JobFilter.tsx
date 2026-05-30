import React, { useState, useEffect } from 'react';
import {
  Input,
  Button,
  Select,
  Popover,
  Divider,
  Badge,
} from 'antd';
import {
  JOB_CATEGORY_OPTIONS,
  JOB_LEVEL_OPTIONS,
  WORK_MODE_OPTIONS,
  JOB_LOCATION_OPTIONS,
  CATEGORY_NAME_MAP
} from '@/utils/constants';
import {
  SearchOutlined,
  FilterOutlined,
  DownOutlined,
  CloseCircleFilled,
} from '@ant-design/icons';
import type { JobFilterParams, JobLevel, WorkMode } from '@/types/job';
import axiosClient from '@/api/axiosClient';

interface JobFilterProps {
  filters: JobFilterParams;
  onChange: (filters: JobFilterParams) => void;
  loading?: boolean;
}

// Location and Company options will be loaded dynamically

// Level options (matches backend enum)
const LEVEL_OPTIONS: { label: string; value: JobLevel }[] = [
  { label: 'Thực tập sinh', value: 'INTERN' },
  { label: 'Fresher', value: 'FRESHER' },
  { label: 'Junior', value: 'JUNIOR' },
  { label: 'Middle', value: 'MIDDLE' },
  { label: 'Senior', value: 'SENIOR' },
];

// WorkMode options (matches backend enum)
const WORKMODE_OPTIONS: { label: string; value: WorkMode }[] = [
  { label: 'Tại văn phòng', value: 'ONSITE' },
  { label: 'Từ xa', value: 'REMOTE' },
  { label: 'Kết hợp', value: 'HYBRID' },
];



// Ensure all Select dropdowns inside Popover escape overflow:hidden by mounting on body
const popupToBody = () => document.body;
const SELECT_DROPDOWN_STYLE: React.CSSProperties = { zIndex: 2000, borderRadius: 10 };

const JobFilter: React.FC<JobFilterProps> = ({ filters, onChange, loading }) => {
  // Local controlled state – mirrors filters prop
  const [keyword, setKeyword] = useState(filters.keyword ?? '');
  const [location, setLocation] = useState<string | undefined>(filters.location);
  const [level, setLevel] = useState<JobLevel | undefined>(filters.level);
  const [workMode, setWorkMode] = useState<WorkMode | undefined>(filters.workMode);
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState<{ label: string; value: number }[]>([]);
  const [locationOptions, setLocationOptions] = useState<{ label: string; value: string }[]>([]);
  const [companyOptions, setCompanyOptions] = useState<{ label: string; value: number }[]>([]);
  const [companyId, setCompanyId] = useState<number | undefined>(filters.companyId);

  // Load categories từ API
  useEffect(() => {
    axiosClient
      .get('/api/v1/job-categories', { params: { page: 0, size: 100 } })
      .then((res) => {
        const data = res.data?.data?.result || res.data?.data || res.data || [];
        const list = Array.isArray(data) ? data : [];
        setCategoryOptions(list.map((c: any) => ({
          label: CATEGORY_NAME_MAP[c.name] || c.name,
          value: c.id
        })));
      })
      .catch(() => setCategoryOptions([]));

    // Load jobs to extract locations
    axiosClient
      .get('/api/v1/jobs', { params: { page: 0, size: 500 } })
      .then((res) => {
        const data = res.data?.data?.result || [];
        const locSet = new Set<string>();
        data.forEach((job: any) => {
          if (job.location) locSet.add(job.location);
        });
        const opts = Array.from(locSet).map((loc) => ({ label: loc, value: loc }));
        setLocationOptions(opts);
      })
      .catch(() => {});

    // Load companies
    axiosClient
      .get('/api/v1/companies', { params: { page: 0, size: 500 } })
      .then((res) => {
        const data = res.data?.data?.result || [];
        const opts = data.map((c: any) => ({ label: c.name, value: c.id }));
        setCompanyOptions(opts);
      })
      .catch(() => {});
  }, []);

  // Count active advanced filters (not counting keyword)
  const activeCount = [location, level, workMode, categoryId, companyId].filter(Boolean).length;

  const handleSearch = () => {
    onChange({
      keyword: keyword.trim() || undefined,
      location,
      level,
      workMode,
      categoryId: categoryId,
      companyId: companyId,
    } as any);
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

  // ── Shared label style ──
  const labelStyle: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 700,
    color: '#6b7280',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    display: 'block',
  };

  // ── Popover content ──
  const popoverContent = (
    <div style={{ width: 300, padding: '2px 0 0' }}>

      {/* Phân loại ngành */}
      <div style={{ marginBottom: 14 }}>
        <span style={labelStyle}>Phân loại ngành</span>
        <Select
          placeholder="Tất cả ngành"
          allowClear
          showSearch
          style={{ width: '100%' }}
          options={categoryOptions}
          value={categoryId}
          onChange={(v) => setCategoryId(v)}
          filterOption={(input, opt) => String(opt?.label ?? '').toLowerCase().includes(input.toLowerCase())}
          getPopupContainer={popupToBody}
          dropdownStyle={SELECT_DROPDOWN_STYLE}
          listHeight={200}
        />
      </div>

      {/* Công ty */}
      <div style={{ marginBottom: 14 }}>
        <span style={labelStyle}>Công ty</span>
        <Select
          placeholder="Tất cả công ty"
          allowClear
          showSearch
          style={{ width: '100%' }}
          options={companyOptions}
          value={companyId}
          onChange={(v) => setCompanyId(v)}
          filterOption={(input, opt) => String(opt?.label ?? '').toLowerCase().includes(input.toLowerCase())}
          getPopupContainer={popupToBody}
          dropdownStyle={SELECT_DROPDOWN_STYLE}
          listHeight={200}
        />
      </div>

      {/* Địa chỉ */}
      <div style={{ marginBottom: 14 }}>
        <span style={labelStyle}>Địa chỉ</span>
        <Select
          placeholder="Tất cả địa chỉ"
          allowClear
          showSearch
          style={{ width: '100%' }}
          options={locationOptions}
          value={location}
          onChange={(v) => setLocation(v)}
          filterOption={(input, opt) => String(opt?.label ?? '').toLowerCase().includes(input.toLowerCase())}
          getPopupContainer={popupToBody}
          dropdownStyle={SELECT_DROPDOWN_STYLE}
          listHeight={200}
        />
      </div>

      {/* Cấp độ */}
      <div style={{ marginBottom: 14 }}>
        <span style={labelStyle}>Cấp độ</span>
        <Select
          placeholder="Tất cả cấp độ"
          allowClear
          style={{ width: '100%' }}
          options={JOB_LEVEL_OPTIONS}
          value={level}
          onChange={(v) => setLevel(v)}
          getPopupContainer={popupToBody}
          dropdownStyle={SELECT_DROPDOWN_STYLE}
          listHeight={200}
        />
      </div>

      {/* Hình thức làm việc */}
      <div style={{ marginBottom: 14 }}>
        <span style={labelStyle}>Hình thức làm việc</span>
        <Select
          placeholder="Tất cả hình thức"
          allowClear
          style={{ width: '100%' }}
          options={WORKMODE_OPTIONS}
          value={workMode}
          onChange={(v) => setWorkMode(v)}
          getPopupContainer={popupToBody}
          dropdownStyle={SELECT_DROPDOWN_STYLE}
          listHeight={200}
        />
      </div>

      <Divider style={{ margin: '10px 0 12px' }} />

      {/* Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          type="text"
          size="small"
          icon={<CloseCircleFilled />}
          onClick={handleReset}
          style={{ color: '#9ca3af', fontSize: 13 }}
        >
          Xóa bộ lọc
        </Button>
        <Button
          type="primary"
          size="small"
          onClick={handleSearch}
          style={{
            borderRadius: 6,
            background: 'linear-gradient(135deg, #0a3d8f 0%, #1155cc 100%)',
            border: 'none',
            fontWeight: 600,
            padding: '0 18px',
            height: 32,
          }}
        >
          Áp dụng
        </Button>
      </div>
    </div>
  );

  return (
    /* ── Pill-shaped outer container ── */
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        background: '#ffffff',
        borderRadius: 50,
        padding: '6px 6px 6px 4px',
        boxShadow: '0 8px 32px rgba(10,61,143,0.18), 0 2px 8px rgba(0,0,0,0.08)',
        border: '1px solid rgba(255,255,255,0.6)',
      }}
    >
      {/* ── Part 1: Bộ lọc trigger ── */}
      <Popover
        content={popoverContent}
        title={
          <div style={{ fontWeight: 700, fontSize: 15, color: '#111827', padding: '4px 0' }}>
            Bộ lọc nâng cao
          </div>
        }
        trigger="click"
        open={popoverOpen}
        onOpenChange={setPopoverOpen}
        placement="bottomLeft"
        overlayStyle={{ zIndex: 1100 }}
        overlayInnerStyle={{ borderRadius: 14, padding: '16px 20px', boxShadow: '0 12px 40px rgba(0,0,0,0.15)' }}
        getTooltipContainer={popupToBody}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '0 20px',
            height: 44,
            cursor: 'pointer',
            borderRight: '1px solid #e5e7eb',
            whiteSpace: 'nowrap',
            userSelect: 'none',
            flexShrink: 0,
          }}
        >
          <FilterOutlined style={{ color: '#1155cc', fontSize: 16 }} />
          <span style={{ color: '#111827', fontWeight: 600, fontSize: 14 }}>
            Bộ lọc
          </span>
          {activeCount > 0 && (
            <Badge
              count={activeCount}
              size="small"
              style={{ background: '#1155cc', fontSize: 10 }}
            />
          )}
          <DownOutlined style={{ color: '#9ca3af', fontSize: 11, marginLeft: 2 }} />
        </div>
      </Popover>

      {/* ── Part 2: Keyword Input ── */}
      <div style={{ flex: 1, minWidth: 0, padding: '0 4px 0 12px' }}>
        <Input
          prefix={<SearchOutlined style={{ color: '#9ca3af', fontSize: 15 }} />}
          placeholder="Tên vị trí, công ty..."
          bordered={false}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onPressEnter={handleSearch}
          style={{
            fontSize: 14,
            color: '#374151',
            background: 'transparent',
            height: 44,
          }}
          allowClear
        />
      </div>

      {/* ── Search Button ── */}
      <Button
        type="primary"
        icon={<SearchOutlined />}
        loading={loading}
        onClick={handleSearch}
        style={{
          borderRadius: 50,
          height: 44,
          padding: '0 28px',
          fontWeight: 700,
          fontSize: 14,
          background: 'linear-gradient(135deg, #0a3d8f 0%, #1155cc 100%)',
          border: 'none',
          boxShadow: '0 4px 14px rgba(17,85,204,0.4)',
          flexShrink: 0,
          letterSpacing: '0.2px',
        }}
      >
        Tìm kiếm
      </Button>
    </div>
  );
};

export default JobFilter;
