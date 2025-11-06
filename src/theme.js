// theme.js or inside App.js
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: '"Poppins", "Noto Sans Tamil", sans-serif',
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 600,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          fontFamily: '"Poppins", "Noto Sans Tamil", sans-serif',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontFamily: '"Poppins", "Noto Sans Tamil", sans-serif',
          fontWeight: 500,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        label: {
          fontFamily: '"Poppins", "Noto Sans Tamil", sans-serif',
          fontWeight: 600,
        },
      },
    },
  },
});
