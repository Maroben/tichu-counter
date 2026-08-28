import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

export const AppShell = () => (
  <Box sx={{ minHeight: '100dvh' }}>
    <Outlet />
  </Box>
);
