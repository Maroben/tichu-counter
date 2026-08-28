import { Alert, Box, Button, CircularProgress, Typography } from '@mui/material';
import { Google } from '@mui/icons-material';
import { useState, type PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, useServices } from '../app-context';

export const SignInButton = () => {
  const services = useServices();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const signIn = async () => {
    if (!services.auth) return;
    setPending(true);
    setError(null);
    try {
      await services.auth.signInWithGoogle();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not complete Google sign-in.');
    } finally {
      setPending(false);
    }
  };
  return (
    <Box>
      <Button
        variant="contained"
        startIcon={<Google />}
        disabled={!services.auth || pending}
        onClick={() => void signIn()}>
        Continue with Google
      </Button>
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
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
    return (
      <Alert
        severity="info"
        action={
          <Button component={Link} to="/onboarding">
            Create profile
          </Button>
        }>
        Finish creating your public player profile before using this feature.
      </Alert>
    );
  return children;
};
