import { Box, Stack, Typography, useTheme } from '@mui/material';

export function InternshipLogo() {
  const theme = useTheme();

  return (
    <Stack direction="row" spacing={1.25} alignItems="center">
      <Box component="span" sx={{ display: 'inline-flex', width: 35, height: 35 }}>
        <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M4.63564 15.8644L6.94797 13.552L6.95038 13.5496H11.3006L9.56969 15.2806L9.12278 15.7275L7.35024 17.5L7.56977 17.7201L17.5 27.6498L27.6498 17.5L25.8766 15.7275L25.7518 15.602L23.6994 13.5496H28.0496L28.052 13.552L29.8644 15.3644L32 17.5L17.5 32L3 17.5L4.63564 15.8644ZM17.5 3L25.8784 11.3784H21.5282L17.5 7.35024L13.4718 11.3784H9.12158L17.5 3Z"
            fill={theme.palette.primary.dark}
          />
          <path d="M6.94549 13.5496L6.9479 13.552L9.12272 15.7275L17.4999 24.1041L28.0544 13.5496H6.94549Z" fill={theme.palette.primary.main} />
        </svg>
      </Box>
      <Typography sx={{ fontSize: 23, fontWeight: 700, color: 'text.primary', lineHeight: 1 }}>
        InternMatch
      </Typography>
    </Stack>
  );
}
