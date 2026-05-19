import { Link } from 'react-router-dom';
import { Grid, Stack, Typography } from '@mui/material';
import { LoginForm } from '../../features/auth/components/LoginForm';

export function LoginPage() {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Stack direction="row" sx={{ alignItems: 'baseline', justifyContent: 'space-between', mb: { xs: -0.5, sm: 0.5 } }}>
          <Typography variant="h3">Login</Typography>
          <Typography component={Link} to="/register" variant="body1" sx={{ textDecoration: 'none' }} color="primary">
            Don&apos;t have an account?
          </Typography>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <LoginForm />
      </Grid>
    </Grid>
  );
}
