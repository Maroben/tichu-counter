import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { InstallBanner } from './install-banner';

export const AppShell = () => (
  <Box
    sx={{
      minHeight: '100dvh',
      pt: 'env(safe-area-inset-top)',
      pb: 'env(safe-area-inset-bottom)',
      pl: 'env(safe-area-inset-left)',
      pr: 'env(safe-area-inset-right)',
    }}>
    <Outlet />
    <InstallBanner />
  </Box>
);
