import { useEffect, useMemo, useState } from 'react';
import type { ColumnsType } from 'antd/es/table';
import { Tag } from 'antd';
import { adminApi } from '@/api/adminApi';
import AdminCrudPage from '@/components/admin/AdminCrudPage';
import type { AdminPermission, AdminRole } from '@/types/admin';
import { loadAll, toIdObjects } from './adminUtils';
const columns: ColumnsType<AdminRole> = [
  { title: 'ID', key: 'index', width: 80, render: (_, __, index) => index + 1 },
  { title: 'Tên vai trò', dataIndex: 'name', width: 180 },
  { title: 'Mô tả', dataIndex: 'description', width: 260, render: (value) => value || '-' },
  {
    title: 'Trạng thái',
    dataIndex: 'active',
    width: 130,
    render: (active) => <Tag color={active ? 'green' : 'default'}>{active ? 'Đang bật' : 'Tắt'}</Tag>,
  },
  {
    title: 'Quyền',
    dataIndex: 'permissions',
    render: (permissions: AdminPermission[] = []) =>
      permissions.length ? `${permissions.length} quyền` : '-',
  },
];
const readCurrentRole = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    return user?.role as { id?: number | string; name?: string } | undefined;
  } catch {
    return undefined;
  }
};
const isCurrentRole = (record: AdminRole, currentRole?: { id?: number | string; name?: string }) => {
  if (!currentRole) return false;
  return String(record.id) === String(currentRole.id) || record.name === currentRole.name;
};
const getPermissionIds = (role?: Pick<AdminRole, 'permissions'>) =>
  [...(role?.permissions?.map((permission) => String(permission.id)) || [])].sort();
const assertCurrentRoleIsSafe = (record: AdminRole, values: Record<string, any>) => {
  const currentRole = readCurrentRole();
  if (!isCurrentRole(record, currentRole)) return;
  if (values.active === false) {
    throw new Error('Không thể vô hiệu hóa vai trò đang đăng nhập của chính bạn.');
  }
  if (values.name && values.name !== record.name) {
    throw new Error('Không thể đổi tên vai trò đang đăng nhập của chính bạn.');
  }
  const previousPermissionIds = getPermissionIds(record);
  const nextPermissionIds = [...((values.permissionIds || []) as Array<number | string>).map(String)].sort();
  if (previousPermissionIds.join(',') !== nextPermissionIds.join(',')) {
    throw new Error('Không thể thay đổi quyền hạn của vai trò đang đăng nhập.');
  }
};
const AdminRolesPage = () => {
  const [permissions, setPermissions] = useState<AdminPermission[]>([]);
  useEffect(() => {
    loadAll(adminApi.permissions.list<AdminPermission>({ page: 1, size: 1000 })).then(setPermissions).catch(() => setPermissions([]));
  }, []);
  const permissionOptions = useMemo(
    () =>
      permissions.map((permission) => ({
        label: `${permission.name} (${permission.method} ${permission.apiPath})`,
        value: permission.id,
      })),
    [permissions],
  );
  return (
    <AdminCrudPage<AdminRole>
      title="Vai trò"
      description="Quản lý vai trò và tập quyền được gán cho từng vai trò."
      columns={columns}
      searchKeys={['name', 'description']}
      loadData={async () => {
        const roles = await loadAll(adminApi.roles.list<AdminRole>({ page: 1, size: 500 }));
        return roles.filter((role) => role.name !== 'SUPER_ADMIN');
      }}
      createData={(values) =>
        adminApi.roles.create<AdminRole>({
          name: values.name,
          description: values.description,
          active: Boolean(values.active),
          permissions: toIdObjects(values.permissionIds),
        })
      }
      updateData={(record, values) => {
        assertCurrentRoleIsSafe(record, values);
        return adminApi.roles.update<AdminRole>({
          id: record.id,
          name: values.name,
          description: values.description,
          active: Boolean(values.active),
          permissions: toIdObjects(values.permissionIds),
        });
      }}
      deleteData={(record) => {
        if (isCurrentRole(record, readCurrentRole())) {
          throw new Error('Không thể xóa vai trò đang đăng nhập của chính bạn.');
        }
        return adminApi.roles.remove(record.id);
      }}
      toFormValues={(record) => ({
        ...record,
        permissionIds: record.permissions?.map((permission) => permission.id) || [],
      })}
      canEditRow={(record) => record.name !== 'SUPER_ADMIN'}
      canDeleteRow={(record) => !['SUPER_ADMIN', 'CANDIDATE', 'HR_MANAGER'].includes(record.name)}
      fields={[
        { name: 'name', label: 'Tên vai trò', required: true },
        { name: 'description', label: 'Mô tả', type: 'textarea' },
        { name: 'active', label: 'Kích hoạt', type: 'switch', initialValue: true },
        { name: 'permissionIds', label: 'Quyền hạn', type: 'multiselect', options: permissionOptions },
      ]}
    />
  );
};
export default AdminRolesPage;
