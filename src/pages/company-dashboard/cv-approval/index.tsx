import React, { useState } from 'react';
import { Table, Tag, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
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
  studentId: string;
  gpa: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  hrNote?: string;
}

// 2. Khởi tạo Mock Data
const initialData: Applicant[] = [
  { id: '1', name: 'Nguyễn Văn A', studentId: 'B20DCCN001', gpa: 3.8, status: 'Pending' },
  { id: '2', name: 'Trần Thị B', studentId: 'B20DCCN002', gpa: 3.5, status: 'Approved' },
  { id: '3', name: 'Lê Văn C', studentId: 'B20DCCN003', gpa: 2.9, status: 'Rejected', hrNote: 'Chưa phù hợp định hướng' },
  { id: '4', name: 'Phạm Thị D', studentId: 'B20DCCN004', gpa: 3.2, status: 'Pending' },
];

const ApplicantTable: React.FC = () => {
  const [data, setData] = useState<Applicant[]>(initialData);
  const [openRejectModal, setOpenRejectModal] = useState<boolean>(false);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [hrNote, setHrNote] = useState<string>('');

  // Xử lý khi bấm nút Xem CV
  const handleViewCV = (record: Applicant) => {
    message.info(`Đang mở CV của sinh viên: ${record.name}`);
  };

  // Xử lý khi bấm nút Approve
  const handleApprove = (id: string) => {
    setData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'Approved' } : item))
    );
    message.success('Đã duyệt ứng viên thành công!');
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

  // Xác nhận Reject ứng viên
  const confirmReject = () => {
    if (!selectedApplicant) return;

    setData((prev) =>
      prev.map((item) =>
        item.id === selectedApplicant.id
          ? { ...item, status: 'Rejected', hrNote: hrNote }
          : item
      )
    );
    message.error(`Đã từ chối ứng viên ${selectedApplicant.name}`);
    handleCloseReject();
  };

  // 3. Cấu hình cột cho Ant Design Table
  const columns: ColumnsType<Applicant> = [
    {
      title: 'Tên sinh viên',
      dataIndex: 'name',
      key: 'name',
      fontWeight: 'bold',
    },
    {
      title: 'Mã SV',
      dataIndex: 'studentId',
      key: 'studentId',
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
        let color = status === 'Approved' ? 'green' : status === 'Rejected' ? 'red' : 'gold';
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
            color="primary" // Xanh dương
            size="small"
            onClick={() => handleViewCV(record)}
          >
            Xem CV
          </Button>

          <Button
            variant="contained"
            color="success" // Xanh lá
            size="small"
            disabled={record.status !== 'Pending'}
            onClick={() => handleApprove(record.id)}
          >
            Approve
          </Button>

          <Button
            variant="contained"
            color="error" // Đỏ
            size="small"
            disabled={record.status !== 'Pending'}
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

      {/* Bảng dữ liệu của Ant Design */}
      <Table 
        columns={columns} 
        dataSource={data} 
        rowKey="id" 
        pagination={{ pageSize: 5 }} 
      />

      {/* Modal / Dialog của MUI cho việc Reject */}
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
            disabled={!hrNote.trim()} // Bắt buộc nhập lý do mới cho Reject
          >
            Xác nhận Reject
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ApplicantTable;