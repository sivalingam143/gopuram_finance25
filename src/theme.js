import { createTheme } from "@mui/material/styles";

const baseTypography = {
  fontFamily: '"Poppins", "Noto Sans Tamil", sans-serif',
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 600,
};

const baseComponents = {
  MuiPaper: {
    styleOverrides: {
      root: ({ theme }) => ({
        // Ensure all Paper elements (which tables often use) use the paper background
        backgroundColor: theme.palette.background.paper, 
      }),
    },
  },
  MuiTableContainer: {
    styleOverrides: {
      root: ({ theme }) => ({
        // This ensures the main table area uses the white 'paper' background
        backgroundColor: theme.palette.background.paper, 
      }),
    },
  },
  // Your existing component overrides for buttons, tables, etc.
  MuiButton: {
    styleOverrides: {
      root: {
        textTransform: "none",
        fontWeight: 500,
        ...baseTypography, // Apply typography here
      },
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: {
        fontWeight: 500,
        ...baseTypography,
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      label: {
        fontWeight: 600,
        ...baseTypography,
      },
    },
  },
};

// ---------------------------
// 1. THEME A (Gold/Light)
// ---------------------------
export const themeA = createTheme({
  typography: baseTypography,
  components: baseComponents,
  palette: {
    mode: "light",
    primary: {
      main: "#d4af37", // Deep metallic gold
    },
    secondary: {
      main: "#721e25ff", // Accent blue
    },
    background: {
      // default: "#350303ff", // Light page background
      paper: "#ffffff", // White card background
    },
    text: {
      primary: "#3b2f1e", // Dark text
    },
  },
});

// ---------------------------
// 2. THEME B (Blue/Dark)
// ---------------------------
export const themeB = createTheme({
  typography: baseTypography,
  components: baseComponents,
  palette: {
    mode: "dark", // Use 'dark' mode palette for MUI defaults
    primary: {
      main: "#ffefba", // Gold glow highlight for primary actions
    },
    secondary: {
      main: "#52c242", // Accent green
    },
    background: {
      default: "#ffffff", // Light page background
      paper: "#ffffff", // White card background
    },
    text: {
      primary: "#3b2f1e", // Dark text
    },
  },
});