import { Alert, Box, Button, CircularProgress, Typography } from '@mui/material';
import { Google } from '@mui/icons-material';
import type { PropsWithChildren } from 'react';
import { useAuth, useServices } from '../app-context';

export const SignInButton = () => {
  const services = useServices();
  return (
    <Button
      variant="contained"
      startIcon={<Google />}
      disabled={!services.auth}
      onClick={() => void services.auth?.signInWithGoogle()}>
      Continue with Google
    </Button>
  );
};

export const AuthGate = ({ children }: PropsWithChildren) => {
  const { user, profile, loading } = useAuth();
  const { firebaseConfigured } = useServices();
  if (loading)
    return (
      <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 240 }}>
        <CircularProgress />
      </Box>
    );
  if (!firebaseConfigured)
    return (
      <Alert severity="info">
        Firebase is not configured. Add the VITE_FIREBASE_* environment values to enable accounts.
      </Alert>
    );
  if (!user)
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h5" gutterBottom>
          Sign in to continue
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Google sign-in unlocks friends, synchronized games, and statistics.
        </Typography>
        <SignInButton />
      </Box>
    );
  if (!profile)
    return <Alert severity="info">Finish creating your public player profile before using this feature.</Alert>;
  return children;
};
