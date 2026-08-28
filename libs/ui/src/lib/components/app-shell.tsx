import { AppBar, Avatar, Box, Button, IconButton, Toolbar, Typography } from '@mui/material';
import { ArrowBack, HomeRounded } from '@mui/icons-material';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../app-context';

export const AppShell = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  return (
    <Box sx={{ minHeight: '100dvh' }}>
      <AppBar
        position="sticky"
        color="primary"
        elevation={0}
        sx={{ borderBottom: '1px solid', borderColor: 'rgba(255,255,255,.16)' }}>
        <Toolbar sx={{ maxWidth: 1200, width: '100%', mx: 'auto' }}>
          {location.pathname !== '/' && (
            <IconButton color="inherit" onClick={() => navigate(-1)} aria-label="Back">
              <ArrowBack />
            </IconButton>
          )}
          <Typography
            variant="h6"
            component={Link}
            to="/"
            color="inherit"
            sx={{ color: 'common.white', textDecoration: 'none', flex: 1, fontWeight: 800 }}>
            Tichu Counter
          </Typography>
          {user ? (
            <IconButton component={Link} to="/settings" color="inherit" aria-label="Open settings">
              <Avatar src={user.avatarUrl ?? undefined} sx={{ width: 32, height: 32 }}>
                {user.displayName[0]}
              </Avatar>
            </IconButton>
          ) : (
            <Button component={Link} to="/settings" color="inherit">
              Sign in
            </Button>
          )}
          {location.pathname !== '/' && (
            <IconButton component={Link} to="/" color="inherit" aria-label="Home">
              <HomeRounded />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
      <Outlet />
    </Box>
  );
};
