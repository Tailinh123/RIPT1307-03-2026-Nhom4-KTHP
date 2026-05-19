import type { ReactNode } from 'react';
import { Box, Card, useTheme } from '@mui/material';

interface AuthCardProps {
  children: ReactNode;
}

export function AuthCard({ children }: AuthCardProps) {
  const theme = useTheme();

  return (
    <Card
      elevation={0}
      sx={{
        maxWidth: { xs: 400, sm: 475 },
        margin: { xs: 2.5, md: 3 },
        borderRadius: 1,
        boxShadow: '0 2px 14px 0 rgb(32 40 45 / 8%)',
        '&:hover': { boxShadow: '0 2px 14px 0 rgb(32 40 45 / 8%)' },
        border: `1px solid ${theme.palette.divider}`,
        backgroundImage: 'none'
      }}
    >
      <Box sx={{ p: { xs: 2, sm: 3, md: 4, xl: 5 } }}>{children}</Box>
    </Card>
  );
}
