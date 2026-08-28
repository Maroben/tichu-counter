import { createTheme } from '@mui/material/styles';
import type { PaletteMode } from '@mui/material';

const lightPalette = {
  primary: { main: '#00884f', dark: '#00683c', light: '#28b978', contrastText: '#ffffff' },
  secondary: { main: '#e02f22', dark: '#b82419', light: '#ff665b', contrastText: '#ffffff' },
  background: { default: '#fbf7ee', paper: '#ffffff' },
  divider: '#dccfbd',
  text: { primary: '#152019', secondary: '#506058' },
  action: {
    active: '#152019',
    hover: 'rgba(0,136,79,.08)',
    selected: 'rgba(0,136,79,.14)',
    disabled: 'rgba(21,32,25,.34)',
    disabledBackground: 'rgba(21,32,25,.1)',
  },
};

const darkPalette = {
  primary: { main: '#35d08c', dark: '#16a06a', light: '#7ef0bc', contrastText: '#06150f' },
  secondary: { main: '#ff6b5f', dark: '#d94b40', light: '#ffa097', contrastText: '#1f0705' },
  background: { default: '#070d0a', paper: '#101a15' },
  divider: '#2d473b',
  text: { primary: '#f3fff8', secondary: '#b8cfc4' },
  action: {
    active: '#f3fff8',
    hover: 'rgba(126,240,188,.1)',
    selected: 'rgba(53,208,140,.16)',
    disabled: 'rgba(243,255,248,.34)',
    disabledBackground: 'rgba(243,255,248,.12)',
  },
};

export const createTichuTheme = (mode: PaletteMode) => {
  const palette = mode === 'light' ? lightPalette : darkPalette;

  return createTheme({
    palette: {
      mode,
      ...palette,
    },
    shape: { borderRadius: 16 },
    typography: {
      fontFamily: 'Inter, Roboto, system-ui, sans-serif',
      h1: { fontWeight: 800, letterSpacing: '-0.04em' },
      h2: { fontWeight: 750, letterSpacing: '-0.03em' },
      h3: { fontWeight: 700, letterSpacing: '-0.02em' },
      button: { fontWeight: 700, textTransform: 'none' },
    },
    components: {
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: { root: { borderRadius: 12, minHeight: 44 } },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            boxShadow: 'none',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            border: '1px solid',
            borderColor: mode === 'light' ? lightPalette.divider : darkPalette.divider,
            boxShadow: mode === 'light' ? '0 12px 32px rgba(21,32,25,.09)' : '0 18px 42px rgba(0,0,0,.32)',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 700,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            borderColor: mode === 'light' ? lightPalette.divider : darkPalette.divider,
          },
        },
      },
      MuiSlider: {
        styleOverrides: {
          rail: {
            opacity: mode === 'light' ? 0.38 : 0.42,
          },
          track: {
            boxShadow: mode === 'light' ? '0 0 10px rgba(0,136,79,.22)' : '0 0 16px rgba(53,208,140,.32)',
          },
        },
      },
    },
  });
};
