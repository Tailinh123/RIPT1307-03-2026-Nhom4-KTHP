import apiClient from '@/api/api';
import { getBackendErrorMessage, getBackendMessage } from '@/utils/backendMessage';
import React, { useState, useEffect, useMemo } from "react";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Card,
  Row,
  Col,
  Tag,
  Popconfirm,
  message,
  Typography,
  DatePicker,
  Switch,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type {
  Job,
  JobFormData,
  JobLevel,
  JobType,
  WorkMode,
  JobStatus,
} from "@/types/job";
import {
  levelLabels,
  jobTypeLabels,
  workModeLabels,
  statusLabels,
  statusColors,
} from "@/types/job";
import dayjs from "dayjs";
import moment from "moment";
const { Title } = Typography;
const { TextArea } = Input;

const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['link', 'clean']
  ],
};

type ManageJobFilter = {
  name?: string;
  status?: JobStatus;
  categoryId?: number;
};
const categoryNameMap: Record<string, string> = {
  "Cong nghe thong tin": "Công nghệ thông tin",
  "Marketing": "Marketing",
  "Ke toan - Kiem toan": "Kế toán - Kiểm toán",
  "Kinh doanh": "Kinh doanh",
  "Nhan su": "Nhân sự",
  "Thiet ke": "Thiết kế",
  "Logistics": "Logistics",
  "Ngon ngu": "Ngôn ngữ",
};
export default function ManageJobs() {
const [companies, setCompanies] = useState<any[]>([]);
const [jobs, setJobs] = useState<Job[]>([]);
const [loading, setLoading] = useState<boolean>(true);
const [myCompanyId, setMyCompanyId] = useState<number | undefined>(undefined);
const [myCompanyName, setMyCompanyName] = useState<string>('');
const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
const [skills, setSkills] = useState<{ id: number; name: string }[]>([]);
useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        const cId = userObj?.company?.id || userObj?.companyId;
        const cName = userObj?.company?.name || userObj?.companyName || '';
        setMyCompanyId(cId ? Number(cId) : undefined);
        setMyCompanyName(cName);
      } catch {  }
    }
    const fetchJobs = async () => {
      try {
        const userStr2 = localStorage.getItem('user');
        const userObj2 = userStr2 ? JSON.parse(userStr2) : null;
        const cId = userObj2?.company?.id || userObj2?.companyId;
        const response = await apiClient.get('/api/v1/jobs', { params: { page: 1, size: 500, sort: 'id,desc' } });
        const data = response.data.data?.result || response.data.data || response.data;
        const allJobs = Array.isArray(data) ? data : [];
        const filtered = cId ? allJobs.filter((j: any) => String(j.company?.id) === String(cId)) : allJobs;
        setJobs(filtered);
      } catch (error: any) {
        console.error('Jobs API failed', error);
        message.error(getBackendErrorMessage(error, 'Không thể tải danh sách vị trí tuyển dụng.'));
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);;
  useEffect(() => {
    apiClient
      .get('/api/v1/job-categories', { params: { page: 1, size: 100 } })
      .then((res) => {
        const data = res.data?.data?.result || res.data?.data || [];
        setCategories(Array.isArray(data) ? data : []);
      })
      .catch(() => setCategories([]));
  }, []);
  useEffect(() => {
    apiClient
      .get('/api/v1/skills', { params: { page: 1, size: 200 } })
      .then((res) => {
        const data = res.data?.data?.result || res.data?.data || [];
        const skillsArray = Array.isArray(data) ? data : [];
        const mappedSkills = skillsArray.map((s: any) => ({
          ...s,
          name: s.name === 'Săn đầu người (Headhunter)' ? 'Tuyển dụng (Recruitment)' : 
                s.name === 'Săn đầu người' ? 'Tuyển dụng' : s.name
        }));
        setSkills(mappedSkills);
      })
      .catch(() => setSkills([]));
  }, []);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [modalLoading, setModalLoading] = useState<boolean>(false);
  const [filters, setFilters] = useState<ManageJobFilter>({
    name: undefined,
    status: undefined,
    categoryId: undefined,
  });
  const [form] = Form.useForm<JobFormData>();
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const jobTitle = (job.title || (job as any).name || '').toLowerCase();
      const nameMatch = !filters.name || jobTitle.includes(filters.name.toLowerCase());
      const jobStatus: string = job.status ||
        ((job as any).active === true || (job as any).active === 1 ? 'ACTIVE' :
         (job as any).active === false || (job as any).active === 0 ? 'PENDING' : '');
      const statusMatch = !filters.status || jobStatus === filters.status;
      const catId = (job as any).jobCategory?.id || (job as any).category?.id || undefined;
      const categoryMatch = !filters.categoryId || catId === filters.categoryId;
      return nameMatch && statusMatch && categoryMatch;
    });
  }, [jobs, filters]);
const companyOptions = useMemo(() => {
    return companies.map((c: any) => ({
      value: c.id,  
      label: c.name, 
    }));
  }, [companies]);
const skillSelectOptions = useMemo(
    () => skills.map((skill) => ({ value: skill.id, label: skill.name })),
    [skills]
  );
  const handleAddNew = () => {
    setEditingJob(null);
    form.resetFields();
    if (myCompanyId) form.setFieldsValue({ companyId: myCompanyId });
    setIsModalOpen(true);
  };
  const handleEdit = (record: Job) => {
    setEditingJob(record);
    form.setFieldsValue({
      name: record.title || record.name,
      description: record.description,
      salary: record.salary,
      level: record.level,
      jobType: record.jobType,
      workMode: record.workMode,
      skills: Array.isArray(record.skills)
        ? record.skills.map((skill) => (typeof skill === 'object' ? skill.id : skill))
        : [],
      jobCategory: (record as any).jobCategory?.id || record.jobCategory || record.category || undefined,
      location: record.location,
      quantity: record.quantity,
      startDate: record.startDate ? moment(record.startDate) : undefined,
      endDate: record.endDate ? moment(record.endDate) : undefined,
      isActive: (record as any).active !== false,
    });
    setIsModalOpen(true);
  };
  const handleDelete = async (id: string | number) => {
    setLoading(true);
    try {
      const deleteRes = await apiClient.delete(`/api/v1/jobs/${id}`);
      setJobs((prev) => prev.filter((job) => job.id !== id));
      message.success(getBackendMessage(deleteRes.data, 'Xóa vị trí thực tập thành công!'));
    } catch (err: any) {
      message.error(getBackendErrorMessage(err, 'Có lỗi xảy ra khi xóa!'));
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = async (values: JobFormData) => {
    setModalLoading(true);
    try {
      const safeCategoryId = Number(values.jobCategory);
      if (!Number.isFinite(safeCategoryId) || safeCategoryId <= 0) {
        throw new Error('Vui lòng chọn phân loại ngành hợp lệ.');
      }
      const safeSkillIds = (values.skills || []).map((skillValue: number | string) => Number(skillValue));
      if (!safeSkillIds.length || safeSkillIds.some((skillId) => !Number.isFinite(skillId) || skillId <= 0)) {
        throw new Error('Vui lòng chọn kỹ năng hợp lệ.');
      }
      if (!values.location?.trim()) {
        throw new Error('Vui lòng nhập địa điểm.');
      }
      const safeJobType =
        String(values.jobType).toUpperCase() === "INTERNSHIP"
          ? ("INTERN" as unknown as JobType)
          : values.jobType;
      const payload = {
        name: values.name,
        description: values.description,
        salary: values.salary,
        level: values.level,
        jobType: safeJobType,
        workMode: values.workMode,
        jobCategory: { id: safeCategoryId },
        skills: safeSkillIds.map((id) => ({ id })),
        location: values.location.trim(),
        quantity: values.quantity ?? 1,
        startDate: values.startDate
          ? (moment(values.startDate).isSame(moment(), 'day')
              ? moment().add(5, 'minutes').toISOString()
              : moment(values.startDate).startOf('day').toISOString())
          : undefined,
        endDate: values.endDate
          ? moment(values.endDate).endOf('day').toISOString()
          : undefined,
        active: (values as any).active !== undefined ? (values as any).active : true,
      };
      if (editingJob) {
        const saveRes = await apiClient.put('/api/v1/jobs', { id: editingJob.id, ...payload });
        Modal.success({
          title: <span style={{ fontSize: '18px', fontWeight: 600 }}>Cập nhật thành công</span>,
          content: 'Vị trí thực tập đã được cập nhật thành công.',
          centered: true,
          okText: 'Đóng',
          okButtonProps: { style: { borderRadius: '6px' } }
        });
      } else {
        const saveRes = await apiClient.post('/api/v1/jobs', payload);
        Modal.success({
          title: <span style={{ fontSize: '18px', fontWeight: 600 }}>Đăng bài thành công</span>,
          content: 'Vị trí thực tập mới đã được đăng lên hệ thống.',
          centered: true,
          okText: 'Tuyệt vời',
          okButtonProps: { style: { borderRadius: '6px' } }
        });
      }
      setIsModalOpen(false);
      form.resetFields();
      const response = await apiClient.get('/api/v1/jobs', { params: { page: 1, size: 500, sort: 'id,desc' } });
      const data = response.data.data?.result || response.data.data || response.data;
      const allJobs = Array.isArray(data) ? data : [];
      const filtered = myCompanyId ? allJobs.filter((j: any) => String(j.company?.id) === String(myCompanyId)) : allJobs;
      setJobs(filtered);
    } catch (error: any) {
      console.error("Lỗi lưu dữ liệu:", error);
      const errMsgs = error?.response?.data?.errors || error?.response?.data?.message;
      let displayError = "Có lỗi xảy ra khi lưu vào Database!";
      
      if (Array.isArray(errMsgs)) {
        displayError = errMsgs.map((e: any) => typeof e === 'string' ? e : (e.defaultMessage || e.message || JSON.stringify(e))).join(", ");
      } else if (typeof errMsgs === 'string') {
        displayError = errMsgs;
      } else if (error.message) {
        displayError = error.message;
      }

      Modal.error({
        title: 'Không thể lưu bài đăng',
        content: displayError,
        centered: true,
        okText: 'Đóng',
      });
    } finally {
      setModalLoading(false);
    }
  };
  const handleResetFilters = () => {
    setFilters({ name: undefined, status: undefined, categoryId: undefined });
  };
  const columns: ColumnsType<Job> = [
    {
      title: "STT",
      key: "index",
      width: 60,
      align: "center",
      render: (_, __, index) => index + 1,
    },
   {
      title: "Tên công việc",
      dataIndex: "title",
      key: "title",
      width: 250,
      render: (title: string, record: Job) => {
        const levelText = levelLabels[record.level] || record.level || "Chưa xác định";
        const typeText = record.jobType ? (jobTypeLabels[record.jobType] || record.jobType) : "N/A";
        return (
          <div>
            <div className="font-medium text-gray-900">{title || record.name || "Không có tên"}</div>
            <div className="text-xs text-gray-500">
              {levelText} • {typeText}
            </div>
          </div>
        );
      },
    },
    {
      title: "Tên công ty",
      dataIndex: "companyName",
      key: "companyName",
      width: 180,
      render: (text: string, record: Job) => record.company?.name || record.companyName || text,
    },
    {
      title: "Mức lương",
      dataIndex: "salary",
      key: "salary",
      width: 140,
      align: "right",
      render: (salary: number) => (
        <span className="font-medium">
          {salary?.toLocaleString('vi-VN')} VNĐ
        </span>
      ),
    },
    {
      title: 'Phân loại',
      key: 'category',
      width: 140,
      render: (_: any, record: Job) => {
        const catName = (record as any).jobCategory?.name || (record as any).category || '';
        const displayCatName = categoryNameMap[catName] || catName;
        return displayCatName ? <Tag color="purple">{displayCatName}</Tag> : <span style={{ color: '#d1d5db' }}>—</span>;
      },
    },
    {
      title: 'Trạng thái',
      key: 'status',
      width: 130,
      align: 'center',
      render: (_: any, record: Job) => {
        const rawActive = (record as any).active;
        let resolvedStatus: string = record.status || '';
        if (!resolvedStatus) {
          resolvedStatus = (rawActive === true || rawActive === 1) ? 'ACTIVE' : 'PENDING';
        }
        const statusText = statusLabels[resolvedStatus as JobStatus] || resolvedStatus || 'Chờ duyệt';
        const statusColor = statusColors[resolvedStatus as JobStatus] || 'orange';
        return <Tag color={statusColor}>{statusText}</Tag>;
      },
    },
    {
      title: "Hành động",
      key: "actions",
      width: 100,
      align: "center",
      render: (_, record: Job) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            className="text-blue-600 hover:text-blue-800"
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa vị trí này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="text"
              icon={<DeleteOutlined />}
              className="text-red-600 hover:text-red-800"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];
return (
    <div className="page-enter">
      <div style={{ maxWidth: "1300px", margin: "0 auto" }}>
        <div className="mb-6">
          <Title level={3} className="!mb-1" style={{ fontWeight: 600, color: "#0f172a" }}>
            Quản lý vị trí thực tập
          </Title>
          <p className="text-gray-500" style={{ fontSize: "14px" }}>
            Quản lý các vị trí tuyển dụng của doanh nghiệp
          </p>
        </div>
        <Card className="mb-6" style={{ borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <Row gutter={[16, 16]} align="bottom">
            <Col xs={24} sm={12} md={6}>
              <div className="mb-1 text-sm font-medium text-gray-700">Tên công việc</div>
              <Input
                placeholder="Tìm theo tên công việc..."
                prefix={<SearchOutlined className="text-gray-400" />}
                value={filters.name || ''}
                onChange={(e) => setFilters((prev) => ({ ...prev, name: e.target.value || undefined }))}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div className="mb-1 text-sm font-medium text-gray-700">Trạng thái</div>
              <Select
                placeholder="Chọn trạng thái"
                className="w-full"
                style={{ width: '100%' }}
                value={filters.status}
                onChange={(value) => setFilters((prev) => ({ ...prev, status: value as JobStatus | undefined }))}
                allowClear
                options={Object.keys(statusLabels).map((status) => ({ value: status as JobStatus, label: statusLabels[status as JobStatus] }))}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div className="mb-1 text-sm font-medium text-gray-700">Ngành nghề</div>
              <Select
                placeholder="Chọn ngành nghề"
                className="w-full"
                style={{ width: '100%' }}
                value={filters.categoryId}
                onChange={(value) => setFilters((prev) => ({ ...prev, categoryId: value || undefined }))}
                allowClear
                showSearch
                filterOption={(input, option) =>
                  String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                options={categories.map((c) => ({ value: c.id, label: categoryNameMap[c.name] || c.name }))}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Space size={12} style={{ paddingBottom: '2px' }}>
                <Button 
                  icon={<ReloadOutlined />} 
                  onClick={handleResetFilters}
                  style={{
                    borderRadius: '8px',
                    fontWeight: 500,
                    color: '#475569',
                    borderColor: '#cbd5e1',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                    height: '36px',
                    padding: '0 16px'
                  }}
                  className="flex items-center justify-center hover:text-slate-800 hover:border-slate-400 hover:bg-slate-50 transition-all duration-200"
                >
                  Đặt lại
                </Button>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />} 
                  onClick={handleAddNew}
                  style={{
                    borderRadius: '8px',
                    fontWeight: 500,
                    background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(37,99,235,0.2)',
                    height: '36px',
                    padding: '0 16px'
                  }}
                  className="flex items-center justify-center hover:opacity-90 hover:-translate-y-0.5 transition-all duration-200"
                >
                  Thêm mới
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>
        <Card className="shadow-sm" style={{ borderRadius: 8 }}>
          <Table
            columns={columns}
            dataSource={filteredJobs}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Tổng ${total} vị trí`,
            }}
            size="middle"
            scroll={{ x: 'max-content' }}
          />
        </Card>
<Modal
          title={
            <span style={{ fontSize: "18px", fontWeight: 600, color: "#262626" }}>
              {editingJob ? "Cập nhật Job" : "Thêm vị trí thực tập mới"}
            </span>
          }
          open={isModalOpen}
          onCancel={() => {
            setIsModalOpen(false);
            form.resetFields();
          }}
          footer={null}
          width={850} 
          destroyOnClose
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            onFinishFailed={(errorInfo) => {
              message.error("Vui lòng điền đầy đủ và chính xác các trường bắt buộc!");
              console.log('Failed:', errorInfo);
            }}
            className="mt-4"
          >
            <Form.Item name="workMode" hidden initialValue="REMOTE"><Input /></Form.Item>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="name"
                  label={<span style={{ fontWeight: 500 }}>Tên công việc</span>}
                  rules={[
                    { required: true, message: "Vui lòng nhập tên công việc" },
                    { min: 5, message: "Tên công việc phải có ít nhất 5 ký tự" },
                  ]}
                >
                  <Input placeholder="Vd: Thực tập sinh Marketing, Lập trình viên ReactJS..." />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="jobCategory"
                  label={<span style={{ fontWeight: 500 }}>Phân loại ngành</span>}
                  rules={[{ required: true, message: "Vui lòng chọn phân loại" }]}
                >
                  <Select
                    placeholder="Chọn phân loại"
                    showSearch
                    allowClear
                    filterOption={(input, opt) =>
                      String(opt?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    options={categories.map((c) => ({ value: c.id, label: categoryNameMap[c.name] || c.name }))}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="skills"
                  label={<span style={{ fontWeight: 500 }}>Kỹ năng yêu cầu</span>}
                  rules={[{ required: true, message: "Vui lòng chọn ít nhất 1 kỹ năng" }]}
                >
                  <Select
                    mode="multiple"
                    placeholder="Chọn các kỹ năng"
                    options={skillSelectOptions}
                    maxTagCount="responsive"
                    filterOption={(input, option) =>
                      String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="location"
                  label={<span style={{ fontWeight: 500 }}>Địa điểm</span>}
                  rules={[{ required: true, message: "Vui lòng nhập địa điểm" }]}
                >
                  <Input placeholder="Ha Noi" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="salary"
                  label={<span style={{ fontWeight: 500 }}>Mức lương</span>}
                  rules={[{ required: true, message: "Vui lòng nhập mức lương" }]}
                >
                  <InputNumber<number>
                    className="w-full"
                    min={0}
                    step={500000}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    parser={(value) => Number(value?.replace(/\$\s?|(,*)/g, "")) || 0}
                    placeholder="1500"
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="quantity"
                  label={<span style={{ fontWeight: 500 }}>Số lượng</span>}
                  rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
                  initialValue={1}
                >
                  <InputNumber<number>
                    className="w-full"
                    min={1}
                    max={100}
                    placeholder="1"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="level"
                  label={<span style={{ fontWeight: 500 }}>Trình độ</span>}
                  rules={[{ required: true, message: "Vui lòng chọn cấp độ" }]}
                  initialValue="INTERN"
                >
                  <Select
                    placeholder="Chọn trình độ"
                    options={Object.keys(levelLabels).map((level) => ({
                      value: level,
                      label: levelLabels[level as JobLevel],
                    }))}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="jobType"
                  label={<span style={{ fontWeight: 500 }}>Loại hình</span>}
                  rules={[{ required: true, message: "Vui lòng chọn loại hình công việc" }]}
                  initialValue="INTERNSHIP"
                >
                  <Select
                    placeholder="Chọn loại hình"
                    options={['INTERNSHIP', 'FULL_TIME', 'PART_TIME'].map((type) => ({
                      value: type,
                      label: jobTypeLabels[type],
                    }))}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label={<span style={{ fontWeight: 500 }}>Công ty</span>}
                >
                  <Input
                    disabled
                    style={{ background: '#f9fafb', cursor: 'not-allowed' }}
                    value={myCompanyName || String(myCompanyId || '')}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="startDate"
                  label={<span style={{ fontWeight: 500 }}>Ngày bắt đầu</span>}
                  rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}
                >
                  <DatePicker 
                    style={{ width: '100%' }} 
                    format="YYYY-MM-DD" 
                    disabledDate={(current) => {
                      if (!current) return false;
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return current.valueOf() < today.getTime();
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="endDate"
                  label={<span style={{ fontWeight: 500 }}>Ngày kết thúc</span>}
                  rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc' }]}
                >
                  <DatePicker 
                    style={{ width: '100%' }} 
                    format="YYYY-MM-DD" 
                    disabledDate={(current) => {
                      if (!current) return false;
                      const startDate = form.getFieldValue('startDate');
                      if (startDate) {
                        return current.valueOf() < startDate.valueOf();
                      }
                      // Disable các ngày trước hôm nay (tính từ 00:00:00)
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return current.valueOf() < today.getTime();
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="active"
                  label={<span style={{ fontWeight: 500 }}>Trạng thái hiển thị</span>}
                  valuePropName="checked"
                  initialValue={true}
                >
                  <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
                </Form.Item>
              </Col>
            </Row>
            <div className="text-sm font-medium text-gray-700 mb-1" style={{ marginTop: "8px" }}>
              Miêu tả
            </div>
            <Form.Item
              name="description"
              rules={[
                { required: true, message: 'Vui lòng nhập mô tả công việc' },
                { 
                  validator: async (_, value) => {
                    const textOnly = value ? value.replace(/<[^>]*>?/gm, '').trim() : '';
                    if (!textOnly) {
                      return Promise.reject(new Error('Vui lòng nhập mô tả công việc'));
                    }
                    if (textOnly.length < 20) {
                      return Promise.reject(new Error('Mô tả phải có ít nhất 20 ký tự'));
                    }
                    return Promise.resolve();
                  }
                }
              ]}
            >
              <ReactQuill 
                theme="snow"
                style={{ height: 250, marginBottom: 50 }}
                modules={quillModules}
              />
            </Form.Item>
            <div className="flex justify-end gap-2 mt-6 pt-4 border-t" style={{ marginTop: "24px" }}>
              <Button
                onClick={() => {
                  setIsModalOpen(false);
                  form.resetFields();
                }}
              >
                Hủy
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={modalLoading}
                style={{
                  borderRadius: '6px',
                  fontWeight: 500,
                  background: 'linear-gradient(135deg, #1677ff 0%, #4096ff 100%)',
                  boxShadow: '0 2px 6px rgba(22,119,255,0.2)'
                }}
              >
                {editingJob ? "Cập nhật" : "Đăng bài"}
              </Button>
            </div>
          </Form>
        </Modal>
      </div>
    </div>
  );
}
