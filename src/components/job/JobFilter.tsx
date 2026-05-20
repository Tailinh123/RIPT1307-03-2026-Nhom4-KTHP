import React, { useEffect } from 'react';
import { Form, Input, Select, Button, Space, Row, Col } from 'antd';
import { SearchOutlined, FilterOutlined, ReloadOutlined } from '@ant-design/icons';
import type { JobFilterParams } from '@/types/job';
import { JOB_CATEGORY_OPTIONS, JOB_LEVEL_OPTIONS, WORK_MODE_OPTIONS } from '@/utils/constants';
import { useSkills } from '@/hooks/useSkills';

interface JobFilterProps {
  filters: JobFilterParams;
  onChange: (filters: JobFilterParams) => void;
  loading?: boolean;
}

const JobFilter: React.FC<JobFilterProps> = ({ filters, onChange, loading }) => {
  const [form] = Form.useForm();
  const { skills } = useSkills();

  useEffect(() => {
    form.setFieldsValue(filters);
  }, [filters, form]);

  const handleFinish = (values: JobFilterParams) => {
    onChange({ ...values });
  };

  const handleReset = () => {
    form.resetFields();
    onChange({});
  };

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 14,
        padding: '20px 24px',
        border: '1px solid #eef0f5',
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
        marginBottom: 24,
      }}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish} initialValues={filters}>
        <Row gutter={[16, 0]} align="bottom">
          {/* Keyword */}
          <Col xs={24} sm={24} md={8} lg={7}>
            <Form.Item name="keyword" label="Tìm kiếm" style={{ marginBottom: 0 }}>
              <Input
                prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                placeholder="Tên vị trí, công ty..."
                allowClear
                style={{ borderRadius: 8 }}
              />
            </Form.Item>
          </Col>

          {/* Category */}
          <Col xs={12} sm={12} md={4} lg={4}>
            <Form.Item name="category" label="Lĩnh vực" style={{ marginBottom: 0 }}>
              <Select
                placeholder="Tất cả"
                allowClear
                style={{ borderRadius: 8 }}
                options={JOB_CATEGORY_OPTIONS}
              />
            </Form.Item>
          </Col>

          {/* Level */}
          <Col xs={12} sm={12} md={3} lg={3}>
            <Form.Item name="level" label="Cấp bậc" style={{ marginBottom: 0 }}>
              <Select
                placeholder="Tất cả"
                allowClear
                style={{ borderRadius: 8 }}
                options={JOB_LEVEL_OPTIONS}
              />
            </Form.Item>
          </Col>

          {/* Work Mode */}
          <Col xs={12} sm={12} md={3} lg={3}>
            <Form.Item name="workMode" label="Hình thức" style={{ marginBottom: 0 }}>
              <Select
                placeholder="Tất cả"
                allowClear
                style={{ borderRadius: 8 }}
                options={WORK_MODE_OPTIONS}
              />
            </Form.Item>
          </Col>

          {/* Skills multi-select */}
          <Col xs={24} sm={24} md={9} lg={4}>
            <Form.Item name="skills" label="Kỹ năng" style={{ marginBottom: 0 }}>
              <Select
                mode="multiple"
                placeholder="Chọn kỹ năng..."
                allowClear
                maxTagCount="responsive"
                style={{ borderRadius: 8 }}
                options={skills.map((s) => ({ label: s.name, value: s.id }))}
                filterOption={(input, option) =>
                  String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
              />
            </Form.Item>
          </Col>

          {/* Actions */}
          <Col xs={24} sm={24} md={24} lg={3}>
            <Form.Item style={{ marginBottom: 0 }}>
              <Space style={{ width: '100%' }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<FilterOutlined />}
                  loading={loading}
                  style={{ borderRadius: 8, fontWeight: 500 }}
                >
                  Lọc
                </Button>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={handleReset}
                  style={{ borderRadius: 8 }}
                >
                  Đặt lại
                </Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default JobFilter;
