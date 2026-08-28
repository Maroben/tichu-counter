import { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Card,
  CardContent,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import type { ColorMode } from '@tichu/domain';
import { useAuth, usePreferences, useServices } from '../app-context';
import { Page, PageTitle } from '../components/page';
import { SignInButton } from '../components/auth-gate';
import { useAppInstall } from '../pwa/use-app-install';

export const SettingsPage = () => {
  const services = useServices();
  const { user, profile, refreshProfile } = useAuth();
  const { settings, save: saveLocal } = usePreferences();
  const { standalone, ios, canPrompt, install } = useAppInstall();
  const [displayName, setDisplayName] = useState('');
  const [handle, setHandle] = useState('');
  const [target, setTarget] = useState(1000);
  const [mode, setMode] = useState<ColorMode>('system');
  const [message, setMessage] = useState<string | null>(null);
  useEffect(() => {
    setDisplayName(profile?.displayName ?? '');
    setHandle(profile?.handle ?? '');
    setTarget(profile?.defaultTargetScore ?? settings.defaultTargetScore);
    setMode(profile?.colorMode ?? settings.colorMode);
  }, [profile, settings]);

  const save = async () => {
    try {
      if (profile && services.profiles) {
        await services.profiles.update(profile.uid, {
          displayName: displayName.trim(),
          handle,
          defaultTargetScore: target,
          colorMode: mode,
        });
        await refreshProfile();
      }
      await saveLocal({ defaultTargetScore: target, colorMode: mode });
      setMessage('Settings saved.');
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : 'Could not save settings.');
    }
  };

  return (
    <Page maxWidth="sm">
      <PageTitle closeTo="/">Settings</PageTitle>
      {message && (
        <Alert severity={message === 'Settings saved.' ? 'success' : 'error'} sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}
      <Card>
        <CardContent sx={{ display: 'grid', gap: 2, p: 3 }}>
          <Typography variant="h6">Game defaults</Typography>
          <TextField
            type="number"
            label="Default target score"
            value={target}
            onChange={(event) => setTarget(Math.max(100, Number(event.target.value)))}
            slotProps={{ htmlInput: { min: 100, step: 100 } }}
          />
          <FormControl>
            <InputLabel id="appearance-label">Appearance</InputLabel>
            <Select
              labelId="appearance-label"
              label="Appearance"
              value={mode}
              onChange={(event) => setMode(event.target.value as ColorMode)}>
              <MenuItem value="system">System</MenuItem>
              <MenuItem value="light">Light</MenuItem>
              <MenuItem value="dark">Dark</MenuItem>
            </Select>
          </FormControl>
          {profile && (
            <>
              <Divider />
              <Typography variant="h6">Public profile</Typography>
              <TextField
                label="Display name"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
              />
              <TextField
                label="Handle"
                value={handle}
                onChange={(event) => setHandle(event.target.value.toLowerCase())}
              />
            </>
          )}
          <Button variant="contained" onClick={() => void save()}>
            Save settings
          </Button>
        </CardContent>
      </Card>
      <Card sx={{ mt: 2 }}>
        <CardContent sx={{ display: 'grid', gap: 2, p: 3 }}>
          <Typography variant="h6">Install app</Typography>
          {standalone ? (
            <Typography color="text.secondary">Tichu Counter is installed on this device.</Typography>
          ) : canPrompt ? (
            <>
              <Typography color="text.secondary">Add Tichu Counter to your home screen for quicker access.</Typography>
              <Button variant="contained" onClick={() => void install()}>
                Install app
              </Button>
            </>
          ) : ios ? (
            <Typography color="text.secondary">
              Tap Share, then Add to Home Screen to install Tichu Counter on this iPhone or iPad.
            </Typography>
          ) : (
            <Typography color="text.secondary">
              Use your browser&apos;s install or Add to Home Screen option to pin Tichu Counter.
            </Typography>
          )}
        </CardContent>
      </Card>
      <Card sx={{ mt: 2 }}>
        <CardContent sx={{ display: 'grid', gap: 2, p: 3 }}>
          <Typography variant="h6">Local data</Typography>
          <Typography color="text.secondary">Clearing local data removes only the offline guest game.</Typography>
          <Button
            color="error"
            variant="outlined"
            onClick={() => void services.guestGames.clear().then(() => setMessage('Local game cleared.'))}>
            Clear local game
          </Button>
        </CardContent>
      </Card>
      <Card sx={{ mt: 2 }}>
        <CardContent sx={{ display: 'grid', gap: 2, p: 3 }}>
          <Typography variant="h6">Account</Typography>
          {user ? (
            <Button variant="outlined" onClick={() => void services.auth?.signOut()}>
              Sign out
            </Button>
          ) : (
            <SignInButton />
          )}
        </CardContent>
      </Card>
    </Page>
  );
};
