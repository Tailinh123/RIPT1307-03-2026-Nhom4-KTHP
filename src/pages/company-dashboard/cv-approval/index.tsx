import React, { useState, useEffect } from 'react';
import { Table, Tag, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import axios from 'axios';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Typography
} from '@mui/material';

// 1. Định nghĩa Interface cho dữ liệu
interface Applicant {
  id: string;
  name: string;
  student_code: string;
  gpa: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'REVIEWING';
  hrNote?: string;
  url: string; // Đã thêm url để không bị lỗi TypeScript khi mở CV
}

const ApplicantTable: React.FC = () => {
  const [data, setData] = useState<Applicant[]>([]);
  const [openRejectModal, setOpenRejectModal] = useState<boolean>(false);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [hrNote, setHrNote] = useState<string>('');

  // Lấy danh sách CV khi component render
  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const jobId = 1; 
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/resumes/job/${jobId}`);
        
        if (response.data && response.data.statusCode === 200) {
          setData(response.data.data); 
        }
      } catch (error) {
        message.error('Lỗi khi tải danh sách CV từ Backend!');
      }
    };

    fetchResumes();
  }, []);

  // Xử lý khi bấm nút Xem CV
  const handleViewCV = (record: Applicant) => {
    if (record.url) {
      window.open(record.url, '_blank');
    } else {
      message.warning('Ứng viên này không có link CV!');
    }
  };

  // Xử lý khi bấm nút Approve (Gọi API PUT)
  const handleApprove = async (id: string) => {
    try {
      // Gọi API đổi trạng thái
      await axios.put(`${process.env.REACT_APP_API_URL}/api/v1/resumes/${id}/status`, {
        status: 'APPROVED'
      });

      // Cập nhật lại UI nếu API thành công
      setData((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: 'APPROVED' } : item))
      );
      message.success('Đã duyệt ứng viên thành công!');
    } catch (error) {
      message.error('Lỗi khi duyệt ứng viên. Vui lòng thử lại.');
    }
  };

  // Xử lý khi bấm nút Reject (Mở Modal)
  const handleOpenReject = (record: Applicant) => {
    setSelectedApplicant(record);
    setHrNote('');
    setOpenRejectModal(true);
  };

  // Đóng Modal Reject
  const handleCloseReject = () => {
    setOpenRejectModal(false);
    setSelectedApplicant(null);
  };

  // Xác nhận Reject ứng viên (Gọi API PUT và POST)
  const confirmReject = async () => {
    if (!selectedApplicant) return;

    try {
      // 1. Gọi API đổi trạng thái thành REJECTED
      await axios.put(`${process.env.REACT_APP_API_URL}/api/v1/resumes/${selectedApplicant.id}/status`, {
        status: 'REJECTED'
      });

      // 2. Gọi API lưu Note của HR
      await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/resumes/${selectedApplicant.id}/notes`, {
        note: hrNote
      });

      // Cập nhật lại UI
      setData((prev) =>
        prev.map((item) =>
          item.id === selectedApplicant.id
            ? { ...item, status: 'REJECTED', hrNote: hrNote }
            : item
        )
      );
      message.success(`Đã từ chối ứng viên ${selectedApplicant.name}`);
      handleCloseReject();
    } catch (error) {
      message.error('Có lỗi xảy ra khi từ chối ứng viên!');
    }
  };

  // 3. Cấu hình cột cho Ant Design Table
  const columns: ColumnsType<Applicant> = [
    {
      title: 'Tên sinh viên',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: 'Mã SV',
      dataIndex: 'student_code',
      key: 'student_code',
    },
    {
      title: 'GPA',
      dataIndex: 'gpa',
      key: 'gpa',
      sorter: (a, b) => a.gpa - b.gpa,
    },
    {
      title: 'Trạng thái',
      key: 'status',
      dataIndex: 'status',
      render: (status: Applicant['status']) => {
        let color = status === 'APPROVED' ? 'green' : status === 'REJECTED' ? 'red' : 'gold';
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => handleViewCV(record)}
          >
            Xem CV
          </Button>

          <Button
            variant="contained"
            color="success"
            size="small"
            disabled={record.status !== 'PENDING'}
            onClick={() => handleApprove(record.id)}
          >
            Approve
          </Button>

          <Button
            variant="contained"
            color="error"
            size="small"
            disabled={record.status !== 'PENDING'}
            onClick={() => handleOpenReject(record)}
          >
            Reject
          </Button>
        </Stack>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        Danh sách sinh viên ứng tuyển
      </Typography>

      <Table 
        columns={columns} 
        dataSource={data} 
        rowKey="id" 
        pagination={{ pageSize: 5 }} 
      />

      <Dialog open={openRejectModal} onClose={handleCloseReject} fullWidth maxWidth="sm">
        <DialogTitle>Từ chối ứng viên: {selectedApplicant?.name}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Vui lòng nhập lý do từ chối (HR Note) cho sinh viên này:
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Lý do từ chối (hrNote)"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={hrNote}
            onChange={(e) => setHrNote(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReject} color="inherit">
            Hủy
          </Button>
          <Button 
            onClick={confirmReject} 
            color="error" 
            variant="contained"
            disabled={!hrNote.trim()} 
          >
            Xác nhận Reject
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ApplicantTable;