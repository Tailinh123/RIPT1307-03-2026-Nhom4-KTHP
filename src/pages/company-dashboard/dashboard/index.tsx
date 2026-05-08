import React from 'react';
import { 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Stack, 
  Paper 
} from '@mui/material';
import WorkIcon from '@mui/icons-material/WorkOutline';
import DescriptionIcon from '@mui/icons-material/DescriptionOutlined';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

// 1. Định nghĩa Type cho Mock Data
interface ChartData {
  jobName: string;
  cvCount: number;
}

// 2. Mock Data
const summaryStats = {
  totalJobs: 12,
  totalCVs: 345,
};

const cvChartData: ChartData[] = [
  { jobName: 'Frontend Intern', cvCount: 85 },
  { jobName: 'Backend Fresher', cvCount: 62 },
  { jobName: 'UI/UX Designer', cvCount: 45 },
  { jobName: 'Business Analyst', cvCount: 73 },
  { jobName: 'DevOps Engineer', cvCount: 30 },
  { jobName: 'Security Analyst', cvCount: 50 },
];

const CompanyDashboard: React.FC = () => {
  return (
    <Box sx={{ p: 4, bgcolor: '#f4f6f8', minHeight: '100vh' }}>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 4, color: '#333' }}>
        Tổng quan tuyển dụng
      </Typography>

      {/* --- PHẦN 1: THẺ THỐNG KÊ --- */}
      <Grid container spacing={4} sx={{ mb: 5 }}>
        {/* Thẻ Tổng số Job đang tuyển (Màu Xanh dương) */}
        <Grid item xs={12} sm={6}>
          <Card 
            sx={{ 
              borderRadius: 3, 
              boxShadow: '0 8px 24px rgba(21, 101, 192, 0.12)', 
              bgcolor: '#ffffff',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Vạch màu trang trí */}
            <Box sx={{ width: '8px', height: '100%', bgcolor: '#1976d2', position: 'absolute', left: 0, top: 0 }} />
            
            <CardContent sx={{ p: 3, pl: 4 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="subtitle1" color="text.secondary" fontWeight="500">
                    Tổng số Job đang tuyển
                  </Typography>
                  <Typography variant="h3" fontWeight="bold" sx={{ color: '#1976d2', mt: 1 }}>
                    {summaryStats.totalJobs}
                  </Typography>
                </Box>
                <Box 
                  sx={{ 
                    bgcolor: '#e3f2fd', 
                    p: 2, 
                    borderRadius: '50%', 
                    display: 'flex' 
                  }}
                >
                  <WorkIcon sx={{ fontSize: 40, color: '#1976d2' }} />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Thẻ Tổng số CV nhận được (Màu Xanh lá) */}
        <Grid item xs={12} sm={6}>
          <Card 
            sx={{ 
              borderRadius: 3, 
              boxShadow: '0 8px 24px rgba(46, 125, 50, 0.12)', 
              bgcolor: '#ffffff',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Vạch màu trang trí */}
            <Box sx={{ width: '8px', height: '100%', bgcolor: '#2e7d32', position: 'absolute', left: 0, top: 0 }} />

            <CardContent sx={{ p: 3, pl: 4 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="subtitle1" color="text.secondary" fontWeight="500">
                    Tổng số CV nhận được
                  </Typography>
                  <Typography variant="h3" fontWeight="bold" sx={{ color: '#2e7d32', mt: 1 }}>
                    {summaryStats.totalCVs}
                  </Typography>
                </Box>
                <Box 
                  sx={{ 
                    bgcolor: '#e8f5e9', 
                    p: 2, 
                    borderRadius: '50%', 
                    display: 'flex' 
                  }}
                >
                  <DescriptionIcon sx={{ fontSize: 40, color: '#2e7d32' }} />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* --- PHẦN 2: BIỂU ĐỒ (RECHARTS) --- */}
      <Paper sx={{ p: 4, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 4 }}>
          Số lượng CV theo từng Công việc
        </Typography>
        
        {/* ResponsiveContainer giúp biểu đồ tự động co giãn theo màn hình */}
        <Box sx={{ width: '100%', height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={cvChartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
              <XAxis 
                dataKey="jobName" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#666', fontSize: 13 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#666', fontSize: 13 }}
                dx={-10}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(0,0,0,0.04)' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar 
                dataKey="cvCount" 
                name="Số lượng CV" 
                fill="#8884d8" 
                radius={[6, 6, 0, 0]} // Bo góc trên của cột
                barSize={40} // Độ rộng của cột
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Paper>
    </Box>
  );
};

export default CompanyDashboard;