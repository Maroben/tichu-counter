import { useEffect, useState } from 'react';
import { Alert, Button, Card, CardContent, TextField, Typography } from '@mui/material';
import { Navigate, useNavigate } from 'react-router-dom';
import { normalizeHandle, validateHandle } from '@tichu/application';
import { SCHEMA_VERSION } from '@tichu/domain';
import { useAuth, useServices } from '../app-context';
import { Page, PageTitle } from '../components/page';
import { SignInButton } from '../components/auth-gate';

export const OnboardingPage = () => {
  const { user, profile, loading, refreshProfile } = useAuth();
  const services = useServices();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('');
  const [handle, setHandle] = useState('');
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName);
      setHandle(
        normalizeHandle(user.displayName.replace(/\s+/g, '_'))
          .replace(/[^a-z0-9_]/g, '')
          .slice(0, 20),
      );
    }
  }, [user]);
  if (!loading && profile) return <Navigate to="/" replace />;
  if (!user)
    return (
      <Page maxWidth="sm">
        <PageTitle>Create your profile</PageTitle>
        <SignInButton />
      </Page>
    );

  const submit = async () => {
    const handleError = validateHandle(handle);
    if (handleError) {
      setError(handleError);
      return;
    }
    if (!displayName.trim()) {
      setError('Enter a display name.');
      return;
    }
    try {
      setError(null);
      const now = Date.now();
      await services.profiles!.create({
        schemaVersion: SCHEMA_VERSION,
        uid: user.uid,
        displayName: displayName.trim(),
        handle: normalizeHandle(handle),
        avatarUrl: user.avatarUrl,
        defaultTargetScore: 1000,
        colorMode: 'system',
        createdAt: now,
        updatedAt: now,
      });
      await refreshProfile();
      navigate('/');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not create your profile.');
    }
  };

  return (
    <Page maxWidth="sm">
      <PageTitle>Create your profile</PageTitle>
      <Card>
        <CardContent sx={{ display: 'grid', gap: 2, p: 3 }}>
          <Typography color="text.secondary">
            Your display name and handle are visible to other signed-in players. Your Google email is never searchable.
          </Typography>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Display name"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
          />
          <TextField
            label="Public handle"
            value={handle}
            onChange={(event) => setHandle(normalizeHandle(event.target.value))}
            helperText="3–20 lowercase letters, numbers, or underscores"
          />
          <Button variant="contained" onClick={() => void submit()}>
            Create profile
          </Button>
        </CardContent>
      </Card>
    </Page>
  );
};
