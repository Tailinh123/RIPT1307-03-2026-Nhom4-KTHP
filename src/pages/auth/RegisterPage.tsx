import { Link } from 'react-router-dom';
import { Grid, Stack, Typography } from '@mui/material';
import { RegisterForm } from '../../features/auth/components/RegisterForm';

export function RegisterPage() {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Stack direction="row" sx={{ alignItems: 'baseline', justifyContent: 'space-between', mb: { xs: -0.5, sm: 0.5 } }}>
          <Typography variant="h3">Sign up</Typography>
          <Typography component={Link} to="/login" variant="body1" sx={{ textDecoration: 'none' }} color="primary">
            Already have an account?
          </Typography>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <RegisterForm />
      </Grid>
    </Grid>
  );
}
