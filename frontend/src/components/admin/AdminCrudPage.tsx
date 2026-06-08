import React, { useEffect, useMemo, useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import {
  Button,
  Card,
  Alert,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Space,
  Switch,
  Table,
  Tooltip,
  Typography,
  message,
  Row,
  Col,
} from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { ColumnsType } from 'antd/es/table';
import { getBackendErrorMessage, getBackendMessage } from '@/utils/backendMessage';
const { Text, Title } = Typography;
const { TextArea } = Input;

const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['link', 'clean']
  ],
};

export interface AdminField {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'textarea' | 'richtext' | 'number' | 'select' | 'multiselect' | 'switch' | 'date';
  required?: boolean;
  options?: { label: string; value: string | number | boolean }[];
  createOnly?: boolean;
  editOnly?: boolean;
  disabled?: boolean;
  initialValue?: unknown;
  placeholder?: string;
  switchLabels?: [string, string];
}
interface AdminCrudPageProps<T extends { id?: number | string }> {
  title: string;
  description?: string;
  notice?: string;
  columns: ColumnsType<T>;
  fields?: AdminField[];
  loadData: () => Promise<T[]>;
  createData?: (values: Record<string, any>) => Promise<unknown>;
  updateData?: (record: T, values: Record<string, any>) => Promise<unknown>;
  deleteData?: (record: T) => Promise<unknown>;
  toFormValues?: (record: T) => Record<string, any>;
  searchKeys?: string[];
  createLabel?: string;
  canCreate?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  canEditRow?: (record: T) => boolean;
  canDeleteRow?: (record: T) => boolean;
  deleteConfirmMessage?: string;
}
function getValueByPath(record: Record<string, any>, path: string) {
  return path.split('.').reduce((value, key) => value?.[key], record);
}
function getInitialValues(fields: AdminField[]) {
  return fields.reduce<Record<string, unknown>>((values, field) => {
    if (field.initialValue !== undefined) values[field.name] = field.initialValue;
    return values;
  }, {});
}
function normalizeDateFields(fields: AdminField[], values: Record<string, any>) {
  return fields.reduce<Record<string, any>>((nextValues, field) => {
    if (field.type !== 'date') return nextValues;
    const value = nextValues[field.name];
    if (!value) return nextValues;
    nextValues[field.name] = dayjs.isDayjs(value)
      ? value
      : dayjs(value).isValid()
        ? dayjs(value)
        : value;
    return nextValues;
  }, { ...values });
}
function toApiValues(fields: AdminField[], values: Record<string, any>) {
  return fields.reduce<Record<string, any>>((nextValues, field) => {
    if (field.type === 'date' && dayjs.isDayjs(nextValues[field.name])) {
      nextValues[field.name] = nextValues[field.name].format('YYYY-MM-DD');
    }
    return nextValues;
  }, { ...values });
}
function AdminCrudPage<T extends { id?: number | string }>({
  title,
  description,
  notice,
  columns,
  fields = [],
  loadData,
  createData,
  updateData,
  deleteData,
  toFormValues,
  searchKeys = ['name'],
  createLabel = 'Thêm mới',
  canCreate = Boolean(createData),
  canEdit = Boolean(updateData),
  canDelete = Boolean(deleteData),
  canEditRow = () => true,
  canDeleteRow = () => true,
  deleteConfirmMessage = 'Bạn có chắc chắn muốn xóa?',
}: AdminCrudPageProps<T>) {
  const [form] = Form.useForm();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);
  const fetchRows = async () => {
    setLoading(true);
    try {
      const rows = await loadData();
      setData(rows);
    } catch (error: any) {
      message.error(getBackendErrorMessage(error, 'Không thể tải dữ liệu.'));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchRows();
  }, []);
  const filteredData = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();
    if (!normalizedKeyword) return data;
    return data.filter((record) =>
      searchKeys.some((key) =>
        String(getValueByPath(record as Record<string, any>, key) ?? '')
          .toLowerCase()
          .includes(normalizedKeyword),
      ),
    );
  }, [data, keyword, searchKeys]);
  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue(getInitialValues(fields));
    setModalOpen(true);
  };
  const openEdit = (record: T) => {
    setEditing(record);
    form.resetFields();
    const values = toFormValues ? toFormValues(record) : record;
    form.setFieldsValue(normalizeDateFields(fields, values as Record<string, any>));
    setModalOpen(true);
  };
  const handleSave = async () => {
    if (saving) return;
    try {
      const values = toApiValues(fields, await form.validateFields());
      setSaving(true);
      if (editing && updateData) {
        const result = await updateData(editing, values);
        message.success(getBackendMessage(result, 'Cập nhật thành công.'));
      } else if (!editing && createData) {
        const result = await createData(values);
        message.success(getBackendMessage(result, 'Tạo mới thành công.'));
      }
      setModalOpen(false);
      await fetchRows();
    } catch (error: any) {
      if (error?.errorFields) return; // Prevent toast if it's just a form validation error
      message.error(getBackendErrorMessage(error, 'Không thể lưu dữ liệu.'));
    } finally {
      setSaving(false);
    }
  };
  const handleDelete = async (record: T) => {
    if (!deleteData) return;
    setLoading(true);
    try {
      const result = await deleteData(record);
      message.success(getBackendMessage(result, 'Xóa thành công.'));
      await fetchRows();
    } catch (error: any) {
      message.error(getBackendErrorMessage(error, 'Không thể xóa dữ liệu.'));
    } finally {
      setLoading(false);
    }
  };
  const actionColumn: ColumnsType<T>[number] = {
    title: 'Thao tác',
    key: 'actions',
    width: 112,
    fixed: 'right',
    render: (_, record) => (
      <Space size={4}>
        {canEdit && canEditRow(record) && (
          <Tooltip title="Chỉnh sửa">
            <Button type="text" icon={<EditOutlined />} onClick={() => openEdit(record)} />
          </Tooltip>
        )}
        {canDelete && canDeleteRow(record) && (
          <Popconfirm
            title={deleteConfirmMessage}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
            onConfirm={() => handleDelete(record)}
          >
            <Button type="text" danger icon={<DeleteOutlined />} title="Xóa" />
          </Popconfirm>
        )}
      </Space>
    ),
  };
  const tableColumns = canEdit || canDelete ? [...columns, actionColumn] : columns;
  const visibleFields = fields.filter((field) => {
    if (editing && field.createOnly) return false;
    if (!editing && field.editOnly) return false;
    return true;
  });
  return (
    <div className="page-enter">
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <Title level={3} style={{ margin: 0, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.01em' }}>
            {title}
          </Title>
          {description && <Text style={{ color: '#64748b', fontSize: 14, marginTop: 2, display: 'block' }}>{description}</Text>}
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <Tooltip title="Tải lại dữ liệu">
            <Button
              className="btn-refresh-modern"
              icon={<ReloadOutlined />}
              onClick={fetchRows}
            />
          </Tooltip>
          {canCreate && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={openCreate}
              className="btn-create-modern"
            >
              {createLabel}
            </Button>
          )}
        </div>
      </div>
      {notice && (
        <Alert
          type="info"
          showIcon
          message={notice}
          style={{ marginBottom: 16, borderRadius: 10 }}
        />
      )}
      <Card
        bordered={false}
        style={{
          borderRadius: 12,
          border: '1px solid #e8ecf3',
          boxShadow: '0 1px 3px rgba(15,23,42,0.04), 0 4px 16px rgba(15,23,42,0.03)',
        }}
        bodyStyle={{ padding: 0 }}
      >
        <div
          style={{
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          <Input
            allowClear
            prefix={<SearchOutlined style={{ color: '#94a3b8', fontSize: 15 }} />}
            placeholder="Tìm kiếm..."
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            style={{
              width: 340,
              maxWidth: '100%',
              borderRadius: 8,
              border: '1px solid #e2e8f0',
              height: 38,
            }}
          />
          <Text style={{ color: '#94a3b8', fontSize: 13 }}>
            Hiển thị <Text strong style={{ color: '#475569' }}>{filteredData.length}</Text> / {data.length} bản ghi
          </Text>
        </div>
        <Table<T>
          rowKey={(record) => String(record.id ?? JSON.stringify(record))}
          columns={tableColumns}
          dataSource={filteredData}
          loading={loading}
          size="middle"
          pagination={{ defaultPageSize: 10, showSizeChanger: true, showTotal: (total) => `Tổng ${total} bản ghi` }}
          scroll={{ x: 'max-content' }}
        />
      </Card>
      <Modal
        open={modalOpen}
        title={editing ? `Cập nhật ${title.toLowerCase()}` : createLabel}
        onCancel={() => setModalOpen(false)}
        onOk={handleSave}
        confirmLoading={saving}
        destroyOnClose
        width={800}
      >
        <Form 
          form={form} 
          layout="vertical" 
          style={{ marginTop: '12px' }} 
          scrollToFirstError={{ behavior: 'smooth', block: 'center' }}
          onFinish={handleSave}
        >
          <button type="submit" style={{ display: 'none' }} />
          <Row gutter={16}>
            {visibleFields.map((field) => {
              const isFullWidth = field.type === 'textarea' || field.type === 'richtext';
              const colSpan = isFullWidth ? 24 : 8;
              return (
                <Col span={colSpan} key={field.name}>
                  <Form.Item
                    name={field.name}
                    label={<span style={{ fontWeight: 500 }}>{field.label}</span>}
                    valuePropName={field.type === 'switch' ? 'checked' : 'value'}
                    rules={field.required ? [{ required: true, message: `Vui lòng nhập ${field.label.toLowerCase()}` }] : []}
                  >
                    {field.type === 'textarea' ? (
                      <TextArea rows={4} disabled={field.disabled} placeholder={field.placeholder} />
                    ) : field.type === 'richtext' ? (
                      <ReactQuill
                        theme="snow"
                        style={{ height: 200, marginBottom: 40 }}
                        modules={quillModules}
                        readOnly={field.disabled}
                        placeholder={field.placeholder}
                      />
                    ) : field.type === 'number' ? (
                      <InputNumber style={{ width: '100%' }} min={0} disabled={field.disabled} placeholder={field.placeholder} />
                    ) : field.type === 'select' ? (
                      <Select allowClear showSearch disabled={field.disabled} options={field.options as any} placeholder={field.placeholder} />
                    ) : field.type === 'multiselect' ? (
                      <Select
                        mode="multiple"
                        allowClear
                        showSearch
                        disabled={field.disabled}
                        options={field.options as any}
                        placeholder={field.placeholder}
                        maxTagCount={6}
                        maxTagTextLength={28}
                        maxTagPlaceholder={(omittedValues) => `+${omittedValues.length} quyền`}
                        optionFilterProp="label"
                        listHeight={320}
                        dropdownStyle={{ maxWidth: 620 }}
                        getPopupContainer={(triggerNode) => triggerNode.parentElement || document.body}
                        style={{ width: '100%' }}
                      />
                    ) : field.type === 'switch' ? (
                      <Switch
                        disabled={field.disabled}
                        checkedChildren={field.switchLabels?.[0]}
                        unCheckedChildren={field.switchLabels?.[1]}
                      />
                    ) : field.type === 'date' ? (
                      <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} disabled={field.disabled} placeholder={field.placeholder} />
                    ) : (
                      <Input
                        type={field.type === 'password' ? 'password' : field.type === 'email' ? 'email' : 'text'}
                        disabled={field.disabled}
                        placeholder={field.placeholder}
                      />
                    )}
                  </Form.Item>
                </Col>
              );
            })}
          </Row>
        </Form>
      </Modal>
    </div>
  );
}
export default AdminCrudPage;
