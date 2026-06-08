import type { ColumnsType } from 'antd/es/table';
import { Tag } from 'antd';
import { adminApi } from '@/api/adminApi';
import AdminCrudPage from '@/components/admin/AdminCrudPage';
import type { AdminSkill } from '@/types/admin';
import { loadAll } from './adminUtils';
const columns: ColumnsType<AdminSkill> = [
  { title: 'ID', dataIndex: 'id', width: 80 },
  {
    title: 'Kỹ năng',
    dataIndex: 'name',
    render: (value) => <Tag color="blue">{value}</Tag>,
  },
];
const AdminSkillsPage = () => {
  return (
    <AdminCrudPage<AdminSkill>
      title="Kỹ năng"
      description="Danh mục kỹ năng dùng cho hồ sơ ứng viên và tin tuyển dụng."
      columns={columns}
      loadData={() => loadAll(adminApi.skills.list<AdminSkill>({ page: 1, size: 500 }))}
      createData={async (values) => {
        const res = await adminApi.skills.list<AdminSkill>({ page: 1, size: 2000 });
        const allSkills = res.result || [];
        const newName = String(values.name || '').trim().toLowerCase();
        if (allSkills.some(s => s.name.trim().toLowerCase() === newName)) {
          return Promise.reject(new Error('Kỹ năng này đã tồn tại'));
        }
        return adminApi.skills.create<AdminSkill>(values);
      }}
      updateData={async (record, values) => {
        const res = await adminApi.skills.list<AdminSkill>({ page: 1, size: 2000 });
        const allSkills = res.result || [];
        const newName = String(values.name || '').trim().toLowerCase();
        if (allSkills.some(s => s.id !== record.id && s.name.trim().toLowerCase() === newName)) {
          return Promise.reject(new Error('Kỹ năng này đã tồn tại'));
        }
        return adminApi.skills.update<AdminSkill>({ ...values, id: record.id });
      }}
      deleteData={(record) => adminApi.skills.remove(record.id)}
      deleteConfirmMessage="Xóa kỹ năng này sẽ loại bỏ nó khỏi tất cả Hồ sơ và Tin tuyển dụng đang sử dụng. Bạn có chắc chắn muốn xóa không?"
      fields={[{ name: 'name', label: 'Tên kỹ năng', required: true }]}
    />
  );
};
export default AdminSkillsPage;
