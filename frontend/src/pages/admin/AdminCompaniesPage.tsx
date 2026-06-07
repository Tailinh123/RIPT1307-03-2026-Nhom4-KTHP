import type { ColumnsType } from 'antd/es/table';
import { Typography, Avatar, Tooltip } from 'antd';
import { adminApi } from '@/api/adminApi';
import AdminCrudPage from '@/components/admin/AdminCrudPage';
import type { AdminCompany } from '@/types/admin';
import { loadAll } from './adminUtils';

const { Text } = Typography;

const columns: ColumnsType<AdminCompany> = [
  { title: 'ID', dataIndex: 'id', width: 60, align: 'center' },
  { 
    title: 'Logo', 
    dataIndex: 'logoUrl', 
    width: 80, 
    align: 'center',
    render: (value) => (value ? <Avatar src={value} shape="square" size={40} /> : '-'),
  },
  { title: 'Tên công ty', dataIndex: 'name', width: 250 },
  { title: 'Địa chỉ', dataIndex: 'address', width: 200, render: (value) => value || '-' },
  {
    title: 'Mô tả',
    dataIndex: 'description',
    render: (value) => value ? (
      <Tooltip title={value} placement="topLeft">
        <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {value}
        </span>
      </Tooltip>
    ) : '-',
  },
];
const AdminCompaniesPage = () => {
  return (
    <AdminCrudPage<AdminCompany>
      title="Công ty"
      description="Quản lý danh sách công ty dùng cho tài khoản HR và tin tuyển dụng."
      columns={columns}
      searchKeys={['name', 'address', 'description']}
      loadData={() => loadAll(adminApi.companies.list<AdminCompany>({ page: 1, size: 500 }))}
      createData={(values) => adminApi.companies.create<AdminCompany>(values)}
      updateData={(record, values) => adminApi.companies.update<AdminCompany>({ ...values, id: record.id })}
      deleteData={(record) => adminApi.companies.remove(record.id)}
      fields={[
        { name: 'name', label: 'Tên công ty', required: true },
        { name: 'address', label: 'Địa chỉ' },
        { name: 'logoUrl', label: 'URL logo' },
        { name: 'description', label: 'Mô tả', type: 'textarea' },
      ]}
    />
  );
};
export default AdminCompaniesPage;
