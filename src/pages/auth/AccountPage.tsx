import { Alert, Box, Button, Divider, Paper, Stack, Typography } from '@mui/material';
import { useAuth } from '../../features/auth/hooks/useAuth';

export function AccountPage() {
  const { currentUser, logout } = useAuth();

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, md: 4 },
        borderRadius: 6,
        border: '1px solid rgba(148,163,184,0.16)',
        boxShadow: '0 20px 55px rgba(15, 23, 42, 0.08)'
      }}
    >
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4" sx={{ mb: 1 }}>
            Da dang nhap
          </Typography>
          <Typography color="text.secondary">
            Trang nay chi dung de xac nhan auth flow dang hoat dong dung scope. Khong co dashboard gia.
          </Typography>
        </Box>

        <Alert severity="success">JWT da duoc luu va thong tin profile da duoc lay tu backend.</Alert>

        <Stack spacing={1.25}>
          <Typography>
            <strong>Email:</strong> {currentUser?.email || 'Chua co'}
          </Typography>
          <Typography>
            <strong>Ten:</strong> {currentUser?.name || 'Chua co'}
          </Typography>
          <Typography>
            <strong>Role:</strong> {currentUser?.roleName || 'Chua co'}
          </Typography>
        </Stack>

        <Divider />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" color="secondary" onClick={logout}>
            Dang xuat
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
}
