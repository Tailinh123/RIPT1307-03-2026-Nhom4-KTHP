import React, { useEffect, useState } from 'react';
import { Button, Card, Input, Space, Table, Typography } from 'antd';
import { PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { BackendPage } from '@/api/adminApi';
const { Text, Title } = Typography;
interface AdminDataTableProps<T extends { id?: number | string }> {
  title: string;
  description?: string;
  columns: ColumnsType<T>;
  fetchData: (params: { page: number; size: number; keyword?: string }) => Promise<BackendPage<T>>;
  rowKey?: string;
  searchPlaceholder?: string;
  onCreate?: () => void;
  createLabel?: string;
  extra?: React.ReactNode;
}
function AdminDataTable<T extends { id?: number | string }>({
  title,
  description,
  columns,
  fetchData,
  rowKey = 'id',
  searchPlaceholder = 'Tìm kiếm...',
  onCreate,
  createLabel = 'Thêm mới',
  extra,
}: AdminDataTableProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const loadData = async (nextPage = page, nextSize = size, nextKeyword = keyword) => {
    setLoading(true);
    try {
      const result = await fetchData({ page: nextPage, size: nextSize, keyword: nextKeyword.trim() || undefined });
      setData(result.result || []);
      setTotal(result.meta?.total || 0);
      setPage(result.meta?.page || nextPage);
      setSize(result.meta?.pageSize || nextSize);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadData(1, size, keyword);
  }, []);
  const handleSearch = () => {
    setPage(1);
    loadData(1, size, keyword);
  };
  const handleTableChange = (pagination: TablePaginationConfig) => {
    const nextPage = pagination.current || 1;
    const nextSize = pagination.pageSize || size;
    setPage(nextPage);
    setSize(nextSize);
    loadData(nextPage, nextSize, keyword);
  };
  return (
    <Card
      bordered={false}
      style={{
        borderRadius: 12,
        boxShadow: '0 1px 3px rgba(15,23,42,0.04), 0 10px 28px rgba(15,23,42,0.05)',
      }}
      bodyStyle={{ padding: 24 }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 16,
          marginBottom: 20,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <Title level={4} style={{ margin: 0, color: '#0f172a' }}>
            {title}
          </Title>
          {description && <Text style={{ color: '#64748b' }}>{description}</Text>}
        </div>
        <Space wrap>
          {extra}
          {onCreate && (
            <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
              {createLabel}
            </Button>
          )}
        </Space>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 16 }}>
        <Input
          allowClear
          value={keyword}
          placeholder={searchPlaceholder}
          prefix={<SearchOutlined />}
          onChange={(event) => setKeyword(event.target.value)}
          onPressEnter={handleSearch}
          style={{ maxWidth: 360 }}
        />
        <Space>
          <Button icon={<SearchOutlined />} onClick={handleSearch}>
            Tìm kiếm
          </Button>
          <Button icon={<ReloadOutlined />} onClick={() => loadData(page, size, keyword)}>
            Làm mới
          </Button>
        </Space>
      </div>
      <Table<T>
        columns={columns}
        dataSource={data}
        rowKey={rowKey}
        loading={loading}
        pagination={{
          current: page,
          pageSize: size,
          total,
          showSizeChanger: true,
          showTotal: (count) => `Tổng ${count} bản ghi`,
        }}
        onChange={handleTableChange}
        scroll={{ x: 900 }}
      />
    </Card>
  );
}
export default AdminDataTable;
