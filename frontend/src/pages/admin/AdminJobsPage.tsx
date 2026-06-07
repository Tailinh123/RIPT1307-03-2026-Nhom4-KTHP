import React, { useEffect, useState } from 'react';
import type { ColumnsType } from 'antd/es/table';
import { Tag, Modal } from 'antd';
import { adminApi } from '@/api/adminApi';
import AdminCrudPage from '@/components/admin/AdminCrudPage';
import type { AdminJob, AdminCompany, AdminJobCategory, AdminSkill } from '@/types/admin';
import { formatCurrency, loadAll } from './adminUtils';
import dayjs from 'dayjs';

const columns: ColumnsType<AdminJob> = [
  { title: 'ID', dataIndex: 'id', width: 60 },
  { title: 'Tên công việc', dataIndex: 'name', ellipsis: true },
  { title: 'Công ty', dataIndex: 'company', ellipsis: true, render: (company) => company?.name || '-' },
  { title: 'Danh mục', dataIndex: 'jobCategory', ellipsis: true, render: (category) => category?.name || '-' },
  { title: 'Địa điểm', dataIndex: 'location', width: 120, ellipsis: true, render: (value) => value || '-' },
  { title: 'Mức lương', dataIndex: 'salary', width: 120, render: formatCurrency },
  { title: 'Level', dataIndex: 'level', width: 90, render: (value) => value || '-' },
  {
    title: 'Trạng thái',
    dataIndex: 'active',
    width: 100,
    render: (active) => <Tag color={active ? 'green' : 'default'}>{active ? 'Đang mở' : 'Tắt'}</Tag>,
  },
];

const AdminJobsPage = () => {
  const [companies, setCompanies] = useState<AdminCompany[]>([]);
  const [categories, setCategories] = useState<AdminJobCategory[]>([]);
  const [skills, setSkills] = useState<AdminSkill[]>([]);

  useEffect(() => {
    adminApi.companies.list<AdminCompany>({ page: 1, size: 500 }).then((res) => setCompanies(res.result));
    adminApi.categories.list<AdminJobCategory>({ page: 1, size: 500 }).then((res) => setCategories(res.result));
    adminApi.skills.list<AdminSkill>({ page: 1, size: 500 }).then((res) => setSkills(res.result));
  }, []);

  return (
    <AdminCrudPage<AdminJob>
      title="Tin tuyển dụng"
      description="Danh sách tin tuyển dụng từ các công ty."
      columns={columns}
      searchKeys={['name', 'company.name', 'location', 'level', 'workMode', 'jobCategory.name']}
      loadData={() => loadAll(adminApi.jobs.list<AdminJob>({ page: 1, size: 800, sort: 'id,desc' }))}
      canCreate={true}
      canEdit={true}
      canDelete={true}
      toFormValues={(record) => ({
        ...record,
        companyId: record.company?.id,
        jobCategoryId: record.jobCategory?.id,
        skillIds: record.skills?.map((s) => s.id),
        startDate: record.startDate ? dayjs(record.startDate) : undefined,
        endDate: record.endDate ? dayjs(record.endDate) : undefined,
      })}
      createData={async (values) => {
        const startDateObj = dayjs(values.startDate);
        const safeStartDate = startDateObj.isSame(dayjs(), 'day')
          ? dayjs().add(5, 'minute').toISOString()
          : startDateObj.startOf('day').toISOString();
        const safeEndDate = dayjs(values.endDate).endOf('day').toISOString();

        const res = await adminApi.jobs.create<AdminJob>({
          ...values,
          startDate: safeStartDate,
          endDate: safeEndDate,
          company: { id: values.companyId },
          jobCategory: { id: values.jobCategoryId },
          skills: values.skillIds?.map((id: number) => ({ id })),
        });
        Modal.success({
          title: <span style={{ fontSize: '18px', fontWeight: 600 }}>Đăng bài thành công</span>,
          content: 'Vị trí thực tập mới đã được đăng lên hệ thống.',
          centered: true,
          okText: 'Tuyệt vời',
          okButtonProps: { style: { borderRadius: '6px' } }
        });
        return res;
      }}
      updateData={async (record, values) => {
        const startDateObj = dayjs(values.startDate);
        const safeStartDate = startDateObj.isSame(dayjs(), 'day')
          ? dayjs().add(5, 'minute').toISOString()
          : startDateObj.startOf('day').toISOString();
        const safeEndDate = dayjs(values.endDate).endOf('day').toISOString();

        const res = await adminApi.jobs.update<AdminJob>({
          ...record,
          ...values,
          startDate: safeStartDate,
          endDate: safeEndDate,
          company: { id: values.companyId },
          jobCategory: { id: values.jobCategoryId },
          skills: values.skillIds?.map((id: number) => ({ id })),
        });
        Modal.success({
          title: <span style={{ fontSize: '18px', fontWeight: 600 }}>Cập nhật thành công</span>,
          content: 'Vị trí thực tập đã được cập nhật thành công.',
          centered: true,
          okText: 'Đóng',
          okButtonProps: { style: { borderRadius: '6px' } }
        });
        return res;
      }}
      deleteData={(record) => adminApi.jobs.remove(record.id)}
      fields={[
        { name: 'name', label: 'Tên công việc', required: true },
        { name: 'companyId', label: 'Công ty', type: 'select', required: true, options: companies.map((c) => ({ label: c.name, value: c.id })) },
        { name: 'jobCategoryId', label: 'Danh mục', type: 'select', required: true, options: categories.map((c) => ({ label: c.name, value: c.id })) },
        { name: 'skillIds', label: 'Kỹ năng', type: 'multiselect', required: true, options: skills.map((s) => ({ label: s.name, value: s.id })) },
        { name: 'description', label: 'Mô tả', type: 'richtext', required: true },
        { name: 'salary', label: 'Mức lương', type: 'number', required: true },
        { name: 'quantity', label: 'Số lượng', type: 'number', required: true },
        { name: 'location', label: 'Địa điểm', required: true },
        { name: 'level', label: 'Level', type: 'select', required: true, options: [
            { label: 'Intern', value: 'INTERN' },
            { label: 'Fresher', value: 'FRESHER' },
            { label: 'Junior', value: 'JUNIOR' },
            { label: 'Middle', value: 'MIDDLE' },
            { label: 'Senior', value: 'SENIOR' },
        ] },
        { name: 'jobType', label: 'Loại hình', type: 'select', required: true, options: [
            { label: 'Thực tập', value: 'INTERN' },
            { label: 'Toàn thời gian', value: 'FULL_TIME' },
            { label: 'Bán thời gian', value: 'PART_TIME' },
        ] },
        { name: 'workMode', label: 'Hình thức làm việc', type: 'select', required: true, options: [
            { label: 'Lên công ty (Offline)', value: 'ONSITE' },
            { label: 'Từ xa (Remote)', value: 'REMOTE' },
            { label: 'Linh hoạt (Hybrid)', value: 'HYBRID' },
        ] },
        { name: 'startDate', label: 'Ngày bắt đầu', type: 'date', required: true },
        { name: 'endDate', label: 'Ngày kết thúc', type: 'date', required: true },
        { name: 'active', label: 'Trạng thái', type: 'switch', switchLabels: ['Mở', 'Đóng'], initialValue: true },
      ]}
    />
  );
};

export default AdminJobsPage;
