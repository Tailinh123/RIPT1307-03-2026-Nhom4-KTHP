import type { ColumnsType } from 'antd/es/table';
import { Tag } from 'antd';
import { adminApi } from '@/api/adminApi';
import AdminCrudPage from '@/components/admin/AdminCrudPage';
import type { AdminPermission } from '@/types/admin';
import { loadAll } from './adminUtils';
const methodColors: Record<string, string> = {
  GET: 'green',
  POST: 'blue',
  PUT: 'orange',
  PATCH: 'purple',
  DELETE: 'red',
};
const columns: ColumnsType<AdminPermission> = [
  { title: 'ID', dataIndex: 'id', width: 80 },
  { title: 'Tên quyền', dataIndex: 'name', width: 220 },
  { title: 'Module', dataIndex: 'module', width: 150, render: (value) => value || '-' },
  {
    title: 'Method',
    dataIndex: 'method',
    width: 110,
    render: (value) => <Tag color={methodColors[value] || 'default'}>{value}</Tag>,
  },
  { title: 'API path', dataIndex: 'apiPath', ellipsis: true },
];
const AdminPermissionsPage = () => {
  return (
    <AdminCrudPage<AdminPermission>
      title="Quyền hạn"
      description="Quản lý permission theo API path, method và module."
      columns={columns}
      searchKeys={['name', 'module', 'method', 'apiPath']}
      loadData={() => loadAll(adminApi.permissions.list<AdminPermission>({ page: 1, size: 800 }))}
      createData={(values) => adminApi.permissions.create<AdminPermission>(values)}
      updateData={(record, values) => adminApi.permissions.update<AdminPermission>({ ...values, id: record.id })}
      deleteData={(record) => adminApi.permissions.remove(record.id)}
      fields={[
        { name: 'name', label: 'Tên quyền', required: true },
        { name: 'apiPath', label: 'API path', required: true, placeholder: '/api/v1/users' },
        {
          name: 'method',
          label: 'Method',
          type: 'select',
          required: true,
          options: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map((method) => ({ label: method, value: method })),
        },
        { name: 'module', label: 'Module', required: true },
      ]}
    />
  );
};
export default AdminPermissionsPage;
