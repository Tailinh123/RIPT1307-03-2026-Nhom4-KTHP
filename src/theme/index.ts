import { createTheme } from '@mui/material/styles';

export const appTheme = createTheme({
  palette: {
    primary: {
      main: '#1677ff',
      light: '#69b1ff',
      dark: '#0958d9'
    },
    secondary: {
      main: '#8c8c8c'
    },
    success: {
      main: '#52c41a',
      light: '#b7eb8f'
    },
    error: {
      main: '#ff4d4f',
      light: '#ffccc7'
    },
    background: {
      default: '#fafafb',
      paper: '#ffffff'
    },
    text: {
      primary: '#262626',
      secondary: '#8c8c8c'
    }
  },
  typography: {
    fontFamily: '"Public Sans", "Segoe UI", sans-serif',
    h3: {
      fontSize: '1.5rem',
      lineHeight: 1.33,
      fontWeight: 600
    },
    h4: {
      fontSize: '1.25rem',
      lineHeight: 1.4,
      fontWeight: 600
    },
    h5: {
      fontSize: '1rem',
      lineHeight: 1.5,
      fontWeight: 600
    },
    h6: {
      fontSize: '0.875rem',
      lineHeight: 1.57,
      fontWeight: 400
    },
    body1: {
      fontSize: '0.875rem',
      lineHeight: 1.57
    },
    body2: {
      fontSize: '0.75rem',
      lineHeight: 1.66
    },
    subtitle1: {
      fontSize: '0.875rem',
      lineHeight: 1.57,
      fontWeight: 600
    },
    subtitle2: {
      fontSize: '0.75rem',
      lineHeight: 1.66,
      fontWeight: 500
    },
    button: {
      textTransform: 'capitalize'
    }
  },
  shape: {
    borderRadius: 8
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          boxShadow: 'none'
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 4
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none'
        }
      }
    }
  }
});
