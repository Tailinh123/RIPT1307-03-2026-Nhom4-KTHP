import React, { useState } from 'react';
import {
  Input,
  Button,
  Select,
  Popover,
  Divider,
  Badge,
} from 'antd';
import {
  SearchOutlined,
  AppstoreOutlined,
  DownOutlined,
  CloseCircleFilled,
} from '@ant-design/icons';
import type { JobFilterParams } from '@/types/job';
import { JOB_CATEGORY_OPTIONS, JOB_LEVEL_OPTIONS, WORK_MODE_OPTIONS } from '@/utils/constants';
import { useSkills } from '@/hooks/useSkills';

interface JobFilterProps {
  filters: JobFilterParams;
  onChange: (filters: JobFilterParams) => void;
  loading?: boolean;
}

// Ensure all Select dropdowns inside Popover escape overflow:hidden by mounting on body
const popupToBody = () => document.body;
const SELECT_DROPDOWN_STYLE: React.CSSProperties = { zIndex: 2000, borderRadius: 10 };

const JobFilter: React.FC<JobFilterProps> = ({ filters, onChange, loading }) => {
  const { skills } = useSkills();

  // Local controlled state
  const [keyword, setKeyword] = useState(filters.keyword ?? '');
  const [category, setCategory] = useState(filters.category ?? undefined);
  const [level, setLevel] = useState(filters.level ?? undefined);
  const [workMode, setWorkMode] = useState(filters.workMode ?? undefined);
  const [selectedSkills, setSelectedSkills] = useState<number[]>(filters.skills ?? []);
  const [popoverOpen, setPopoverOpen] = useState(false);

  // Count active sub-filters
  const activeCount = [category, level, workMode, ...(selectedSkills.length ? [1] : [])].filter(Boolean).length;

  const handleSearch = () => {
    onChange({ keyword, category, level, workMode, skills: selectedSkills });
    setPopoverOpen(false);
  };

  const handleReset = () => {
    setKeyword('');
    setCategory(undefined);
    setLevel(undefined);
    setWorkMode(undefined);
    setSelectedSkills([]);
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
    <div style={{ width: 350, padding: '2px 0 0' }}>

      {/* Lĩnh vực */}
      <div style={{ marginBottom: 14 }}>
        <span style={labelStyle}>Lĩnh vực</span>
        <Select
          placeholder="Tất cả lĩnh vực"
          allowClear
          style={{ width: '100%' }}
          options={JOB_CATEGORY_OPTIONS}
          value={category}
          onChange={(v) => setCategory(v)}
          getPopupContainer={popupToBody}
          dropdownStyle={SELECT_DROPDOWN_STYLE}
          listHeight={200}
        />
      </div>

      {/* Cấp bậc */}
      <div style={{ marginBottom: 14 }}>
        <span style={labelStyle}>Cấp bậc</span>
        <Select
          placeholder="Tất cả cấp bậc"
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
          options={WORK_MODE_OPTIONS}
          value={workMode}
          onChange={(v) => setWorkMode(v)}
          getPopupContainer={popupToBody}
          dropdownStyle={SELECT_DROPDOWN_STYLE}
          listHeight={200}
        />
      </div>

      {/* Kỹ năng */}
      <div style={{ marginBottom: 14 }}>
        <span style={labelStyle}>Kỹ năng</span>
        <Select
          mode="multiple"
          placeholder="Tìm và chọn kỹ năng..."
          allowClear
          maxTagCount={3}
          style={{ width: '100%' }}
          options={skills.map((s) => ({ label: s.name, value: s.id }))}
          value={selectedSkills}
          onChange={(v) => setSelectedSkills(v)}
          filterOption={(input, option) =>
            String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
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
      {/* ── Part 1: Danh mục trigger ── */}
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
        // Allow popover content to overflow so Select dropdowns are not clipped
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
          <AppstoreOutlined style={{ color: '#1155cc', fontSize: 16 }} />
          <span style={{ color: '#111827', fontWeight: 600, fontSize: 14 }}>
            Danh mục
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
