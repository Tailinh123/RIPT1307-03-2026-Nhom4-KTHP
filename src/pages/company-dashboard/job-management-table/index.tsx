import React, { useState } from 'react';
import { Table, Tag, message, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import axios from 'axios';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Typography,
  SelectChangeEvent
} from '@mui/material';

// 1. Định nghĩa Data Interfaces
interface Major {
  id: number;
  name: string;
  description: string;
}

interface Job {
  id: string | number;
  name: string;
  salary: string;
  level: 'INTERN' | 'FRESHER';
  required_gpa: number;
  major_id: number;
}

const JobManagementTable: React.FC = () => {
const [jobs, setJobs] = useState<Job[]>([]);

  const [majors, setMajors] = useState<Major[]>([]); 
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  
  // State lưu trữ dữ liệu form
const [formData, setFormData] = useState<Partial<Job>>({
    name: '',
    salary: '',
    level: 'INTERN',
    required_gpa: 0,
    major_id: undefined 
  });
  
  // Gọi API lấy dữ liệu khi component render lần đầu
  const fetchData = async () => {
    try {
      // Gọi API lấy danh sách Job
      const resJobs = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/jobs`);
      if (resJobs.data?.statusCode === 200) {
        setJobs(resJobs.data.data); // Nhớ kỹ rule lấy data.data
      }

      // Gọi API lấy danh sách Chuyên ngành (Major)
      const resMajors = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/majors`);
      if (resMajors.data?.statusCode === 200) {
        setMajors(resMajors.data.data);
      }
    } catch (error) {
      message.error('Có lỗi xảy ra khi tải dữ liệu!');
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);
  
  // Mở Dialog để thêm mới
  const handleOpenAdd = () => {
    setFormData({
      name: '',
      salary: '',
      level: 'INTERN',
      required_gpa: 0,
      major_id: undefined
    });
    setIsEditMode(false);
    setOpenDialog(true);
  };

  // Mở Dialog để sửa
  const handleOpenEdit = (job: Job) => {
    setFormData(job);
    setIsEditMode(true);
    setOpenDialog(true);
  };

  // Đóng Dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Xử lý thay đổi dữ liệu trong TextField
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'required_gpa' ? Number(value) : value,
    }));
  };

  // Xử lý thay đổi dữ liệu trong Select (MUI)
  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Lưu Job (Thêm mới hoặc Cập nhật)
const handleSave = async () => {
    // Validate cơ bản
    if (!formData.name || !formData.salary || formData.required_gpa === undefined || !formData.major_id) {
      message.warning('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    try {
      const payload = {
        name: formData.name,
        salary: formData.salary,
        level: formData.level,
        required_gpa: Number(formData.required_gpa),
        major_id: Number(formData.major_id)
      };

      if (isEditMode) {
        // API Cập nhật (Sửa)
        await axios.put(`${process.env.REACT_APP_API_URL}/api/v1/jobs/${formData.id}`, payload);
        message.success('Cập nhật công việc thành công!');
      } else {
        // API Thêm mới
        await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/jobs`, payload);
        message.success('Thêm công việc thành công!');
      }
      
      handleCloseDialog();
      fetchData(); // Load lại dữ liệu mới nhất từ server
    } catch (error) {
      message.error('Lưu công việc thất bại. Vui lòng kiểm tra lại!');
    }
  };

  // Xóa Job
const handleDelete = async (id: string | number) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/v1/jobs/${id}`);
      message.success('Đã xóa công việc!');
      fetchData(); // Load lại bảng
    } catch (error) {
      message.error('Xóa công việc thất bại!');
    }
  };

  // 3. Cấu hình cột cho Ant Design Table
  const columns: ColumnsType<Job> = [
{
      title: 'Tên công việc',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <strong>{text}</strong>
    },
    {
      title: 'Mức lương',
      dataIndex: 'salary',
      key: 'salary',
    },
    {
      title: 'Cấp bậc',
      dataIndex: 'level',
      key: 'level',
      render: (level: Job['level']) => (
        <Tag color={level === 'FRESHER' ? 'blue' : 'cyan'}>
          {level}
        </Tag>
      ),
    },
    {
      title: 'Yêu cầu GPA',
      dataIndex: 'required_gpa',
      key: 'required_gpa',
      sorter: (a, b) => a.required_gpa - b.required_gpa,
    },
{
      title: 'Chuyên ngành',
      key: 'major',
      render: (_, record) => {
        const major = majors.find(m => m.id === record.major_id); 
        return <span>{major?.name || 'Không xác định'}</span>;
      }
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Stack direction="row" spacing={1}>
          <Button 
            variant="outlined" 
            size="small" 
            color="primary"
            onClick={() => handleOpenEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa công việc"
            description="Bạn có chắc chắn muốn xóa công việc này không?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button variant="outlined" size="small" color="error">
              Xóa
            </Button>
          </Popconfirm>
        </Stack>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          Quản lý công việc
        </Typography>
        <Button variant="contained" color="primary" onClick={handleOpenAdd}>
          + Thêm mới Job
        </Button>
      </Stack>

      {/* Ant Design Table */}
      <Table
        columns={columns}
        dataSource={jobs}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        bordered
      />

      {/* MUI Dialog (Kèm Form Thêm/Sửa) */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>
          {isEditMode ? 'Sửa thông tin công việc' : 'Thêm mới công việc'}
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Tên công việc"
              name="name"
              value={formData.name || ''}
              onChange={handleTextChange}
              fullWidth
              size="small"
            />
            <TextField
              label="Mức lương (VND)"
              name="salary"
              value={formData.salary || ''}
              onChange={handleTextChange}
              fullWidth
              size="small"
            />
            
            <Stack direction="row" spacing={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Cấp bậc</InputLabel>
                <Select
                  name="level"
                  value={formData.level || 'INTERN'}
                  label="Cấp bậc"
                  onChange={handleSelectChange}
                >
                  <MenuItem value="INTERN">INTERN</MenuItem>
                  <MenuItem value="FRESHER">FRESHER</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Yêu cầu GPA"
                name="required_gpa"
                type="number"
                inputProps={{ step: "0.1", min: "0", max: "4" }}
                value={formData.required_gpa ?? ''}
                onChange={handleTextChange}
                fullWidth
                size="small"
              />
            </Stack>

            <FormControl fullWidth size="small">
              <InputLabel>Chuyên ngành yêu cầu</InputLabel>
            <Select
              name="major_id"
              value={formData.major_id?.toString() || ''} 
              label="Chuyên ngành yêu cầu"
              onChange={handleSelectChange}
            >
              {/* Thay MOCK_MAJORS thành majors */}
              {majors.map((major) => (
                <MenuItem key={major.id} value={major.id.toString()}>
                  {major.name}
                </MenuItem>
              ))}
            </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog} color="inherit">
            Hủy
          </Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            {isEditMode ? 'Lưu thay đổi' : 'Thêm mới'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default JobManagementTable;