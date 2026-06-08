import { useEffect, useMemo, useState } from 'react';
import type { ColumnsType } from 'antd/es/table';
import { Modal, Tag } from 'antd';
import { adminApi } from '@/api/adminApi';
import AdminCrudPage from '@/components/admin/AdminCrudPage';
import type { AdminCompany, AdminRole, AdminSkill, AdminUser } from '@/types/admin';
import { formatDate, loadAll, toIdObject, toIdObjects } from './adminUtils';
const genderOptions = [
  { label: 'Nam', value: 'MALE' },
  { label: 'Nữ', value: 'FEMALE' },
  { label: 'Khác', value: 'OTHER' },
];
const roleColors: Record<string, string> = {
  SUPER_ADMIN: 'red',
  HR_MANAGER: 'blue',
  CANDIDATE: 'green',
};
const columns: ColumnsType<AdminUser> = [
  { title: 'ID', dataIndex: 'id', width: 80 },
  { title: 'Họ tên', dataIndex: 'name', width: 180 },
  { title: 'Email', dataIndex: 'email', width: 240 },
  {
    title: 'Vai trò',
    dataIndex: 'role',
    width: 150,
    render: (role) => (role?.name ? <Tag color={roleColors[role.name] || 'default'}>{role.name}</Tag> : '-'),
  },
  { title: 'Công ty', dataIndex: 'company', width: 180, render: (company) => company?.name || '-' },
  { title: 'SĐT', dataIndex: 'phone', width: 140, render: (value) => value || '-' },
  { title: 'Ngày sinh', dataIndex: 'dateOfBirth', width: 130, render: formatDate },
];
columns.push({
  title: 'Trạng thái',
  dataIndex: 'active',
  width: 120,
  render: (active) => <Tag color={active === false ? 'default' : 'green'}>{active === false ? 'Đã khóa' : 'Đang mở'}</Tag>,
});
const readCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null') as AdminUser | null;
  } catch {
    return null;
  }
};
const isCurrentUser = (record: AdminUser, currentUser?: AdminUser | null) => {
  if (!currentUser) return false;
  return String(record.id) === String(currentUser.id) || record.email === currentUser.email;
};
const assertCurrentUserRoleIsSafe = (record: AdminUser, values: Record<string, any>) => {
  const currentUser = readCurrentUser();
  if (!isCurrentUser(record, currentUser)) return;
  const currentRoleId = currentUser?.role?.id ?? record.role?.id;
  if (values.roleId == null || String(values.roleId) !== String(currentRoleId)) {
    throw new Error('Không thể thay đổi vai trò của tài khoản đang đăng nhập.');
  }
  if (values.active === false) {
    throw new Error('Không thể khóa tài khoản đang đăng nhập.');
  }
};
const AdminUsersPage = () => {
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [companies, setCompanies] = useState<AdminCompany[]>([]);
  const [skills, setSkills] = useState<AdminSkill[]>([]);
  useEffect(() => {
    Promise.all([
      loadAll(adminApi.roles.list<AdminRole>({ page: 1, size: 500 })),
      loadAll(adminApi.companies.list<AdminCompany>({ page: 1, size: 500 })),
      loadAll(adminApi.skills.list<AdminSkill>({ page: 1, size: 500 })),
    ])
      .then(([nextRoles, nextCompanies, nextSkills]) => {
        setRoles(nextRoles);
        setCompanies(nextCompanies);
        setSkills(nextSkills);
      })
      .catch(() => {
        setRoles([]);
        setCompanies([]);
        setSkills([]);
      });
  }, []);
  const roleOptions = useMemo(() => roles.map((role) => ({ label: role.name, value: role.id })), [roles]);
  const companyOptions = useMemo(() => companies.map((company) => ({ label: company.name, value: company.id })), [companies]);
  const skillOptions = useMemo(() => skills.map((skill) => ({ label: skill.name, value: skill.id })), [skills]);
  return (
    <AdminCrudPage<AdminUser>
      title="Người dùng"
      description="Quản lý thông tin tài khoản, công ty, vai trò và kỹ năng."
      columns={columns}
      searchKeys={['name', 'email', 'role.name', 'company.name', 'phone']}
      loadData={() => loadAll(adminApi.users.list<AdminUser>({ page: 1, size: 800 }))}
      createData={(values) =>
        adminApi.users.create<AdminUser>({
          name: values.name,
          email: values.email,
          password: values.password,
        })
      }
      updateData={(record, values) => {
        assertCurrentUserRoleIsSafe(record, values);
        return adminApi.users.update<AdminUser>(record.id, {
          name: values.name,
          dateOfBirth: values.dateOfBirth || null,
          address: values.address || null,
          gender: values.gender || null,
          avatarUrl: values.avatarUrl || null,
          phone: values.phone || null,
          company: toIdObject(values.companyId),
          role: toIdObject(values.roleId),
          active: values.active !== false,
          skills: toIdObjects(values.skillIds),
        });
      }}
      deleteData={(record) => {
        if (isCurrentUser(record, readCurrentUser())) {
          throw new Error('Không thể xóa tài khoản đang đăng nhập.');
        }
        return adminApi.users.remove(record.id);
      }}
      toFormValues={(record) => ({
        name: record.name,
        dateOfBirth: record.dateOfBirth,
        address: record.address,
        gender: record.gender,
        avatarUrl: record.avatarUrl,
        phone: record.phone,
        companyId: record.company?.id,
        roleId: record.role?.id,
        active: record.active !== false,
        skillIds: record.skills?.map((skill) => skill.id) || [],
      })}
      fields={[
        { name: 'name', label: 'Họ tên', required: true },
        { name: 'email', label: 'Email', type: 'email', required: true, createOnly: true },
        { name: 'password', label: 'Mật khẩu', type: 'password', required: true, createOnly: true },
        { name: 'phone', label: 'Số điện thoại', editOnly: true },
        { name: 'address', label: 'Địa chỉ', editOnly: true },
        { name: 'dateOfBirth', label: 'Ngày sinh', type: 'date', editOnly: true },
        { name: 'gender', label: 'Giới tính', type: 'select', options: genderOptions, editOnly: true },
        { name: 'avatarUrl', label: 'Avatar URL', editOnly: true },
        { name: 'companyId', label: 'Công ty', type: 'select', options: companyOptions, editOnly: true },
        { name: 'roleId', label: 'Vai trò', type: 'select', options: roleOptions, editOnly: true },
        { name: 'active', label: 'Trạng thái', type: 'switch', switchLabels: ['Mở', 'Khóa'], editOnly: true, initialValue: true },
        { name: 'skillIds', label: 'Kỹ năng', type: 'multiselect', options: skillOptions, editOnly: true },
      ]}
    />
  );
};
export default AdminUsersPage;
