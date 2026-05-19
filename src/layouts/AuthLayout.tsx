import { Box, ButtonBase, Grid, Link, Stack, Typography } from '@mui/material';
import { Link as RouterLink, Outlet } from 'react-router-dom';
import { AuthBackground } from '../features/auth/components/mantis/AuthBackground';
import { AuthCard } from '../features/auth/components/mantis/AuthCard';
import { InternshipLogo } from '../features/auth/components/mantis/InternshipLogo';

export function AuthLayout() {
  return (
    <Box sx={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <AuthBackground />

      <Stack sx={{ minHeight: '100vh', justifyContent: 'flex-end' }}>
        <Box sx={{ px: 3, mt: 3 }}>
          <ButtonBase disableRipple component={RouterLink} to="/login" aria-label="Internship Matching">
            <InternshipLogo />
          </ButtonBase>
        </Box>

        <Box>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            sx={{
              minHeight: {
                xs: 'calc(100vh - 210px)',
                sm: 'calc(100vh - 134px)',
                md: 'calc(100vh - 132px)'
              }
            }}
          >
            <Grid item>
              <AuthCard>
                <Outlet />
              </AuthCard>
            </Grid>
          </Grid>
        </Box>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          sx={{
            gap: 2,
            justifyContent: { xs: 'center', sm: 'space-between' },
            textAlign: { xs: 'center', sm: 'inherit' },
            px: { xs: 2, sm: 3 },
            py: 2
          }}
        >
          <Typography variant="subtitle2" color="secondary">
            Internship Matching - PTIT Web Practice
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: { xs: 1, sm: 3 } }}>
            <Typography variant="subtitle2" color="secondary">
              ReactTS
            </Typography>
            <Typography variant="subtitle2" color="secondary">
              Spring Boot JWT
            </Typography>
            <Typography variant="subtitle2" color="secondary" component={Link} href="#" underline="hover">
              Auth
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}
