import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material';
import { Close, PersonAddRounded } from '@mui/icons-material';
import type { FriendshipWithProfile } from '@tichu/application';
import type { UserProfile, UserStatistics } from '@tichu/domain';
import { useAuth, useServices } from '../app-context';
import { AuthGate } from '../components/auth-gate';
import { Page, PageTitle } from '../components/page';

const percent = (value: number) => `${Math.round(value * 100)}%`;

const FriendsContent = () => {
  const services = useServices();
  const { user } = useAuth();
  const [items, setItems] = useState<readonly FriendshipWithProfile[]>([]);
  const [handle, setHandle] = useState('');
  const [found, setFound] = useState<UserProfile | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [stats, setStats] = useState<{ profile: UserProfile; value: UserStatistics | null } | null>(null);
  useEffect(() => services.friendships!.subscribe(user!.uid, setItems), [services.friendships, user]);
  const incoming = useMemo(
    () => items.filter((item) => item.status === 'pending' && item.recipientUid === user!.uid),
    [items, user],
  );
  const outgoing = useMemo(
    () => items.filter((item) => item.status === 'pending' && item.requesterUid === user!.uid),
    [items, user],
  );
  const friends = useMemo(() => items.filter((item) => item.status === 'accepted'), [items]);

  const search = async () => {
    const profile = await services.profiles!.findByHandle(handle);
    setFound(profile);
    setMessage(profile ? null : 'No player has that exact handle.');
  };
  const request = async () => {
    if (!found) return;
    try {
      await services.friendships!.request(user!.uid, found.uid);
      setFound(null);
      setHandle('');
      setMessage('Friend request sent.');
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : 'Could not send request.');
    }
  };
  const showStats = async (profile: UserProfile) =>
    setStats({ profile, value: await services.statistics!.getShared(profile.uid, user!.uid) });

  return (
    <>
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Find a player
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              label="Exact handle"
              value={handle}
              onChange={(event) => setHandle(event.target.value.toLowerCase())}
            />
            <Button variant="contained" onClick={() => void search()}>
              Find
            </Button>
          </Box>
          {found && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
              <Avatar src={found.avatarUrl ?? undefined}>{found.displayName[0]}</Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontWeight: 700 }}>{found.displayName}</Typography>
                <Typography color="text.secondary">@{found.handle}</Typography>
              </Box>
              <Button startIcon={<PersonAddRounded />} onClick={() => void request()}>
                Add
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
      {message && (
        <Alert severity={message.includes('sent') ? 'success' : 'info'} sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}
      {incoming.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6">Requests</Typography>
            <List>
              {incoming.map((item) => (
                <ListItem
                  key={item.id}
                  secondaryAction={
                    <Box>
                      <Button onClick={() => void services.friendships!.accept(item.id, user!.uid)}>Accept</Button>
                      <IconButton onClick={() => void services.friendships!.declineOrRemove(item.id, user!.uid)}>
                        <Close />
                      </IconButton>
                    </Box>
                  }>
                  <ListItemAvatar>
                    <Avatar src={item.otherProfile.avatarUrl ?? undefined} />
                  </ListItemAvatar>
                  <ListItemText primary={item.otherProfile.displayName} secondary={`@${item.otherProfile.handle}`} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}
      {outgoing.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Pending
          </Typography>
          {outgoing.map((item) => (
            <Chip
              key={item.id}
              label={`@${item.otherProfile.handle}`}
              onDelete={() => void services.friendships!.declineOrRemove(item.id, user!.uid)}
              sx={{ mr: 1 }}
            />
          ))}
        </Box>
      )}
      <Card>
        <CardContent>
          <Typography variant="h6">Friends</Typography>
          {friends.length === 0 ? (
            <Typography color="text.secondary" sx={{ py: 3 }}>
              Accepted friends will appear here.
            </Typography>
          ) : (
            <List>
              {friends.map((item) => (
                <ListItem
                  key={item.id}
                  divider
                  secondaryAction={<Button onClick={() => void showStats(item.otherProfile)}>Statistics</Button>}>
                  <ListItemAvatar>
                    <Avatar src={item.otherProfile.avatarUrl ?? undefined} />
                  </ListItemAvatar>
                  <ListItemText primary={item.otherProfile.displayName} secondary={`@${item.otherProfile.handle}`} />
                  <IconButton
                    edge="end"
                    aria-label="Remove friend"
                    onClick={() => void services.friendships!.declineOrRemove(item.id, user!.uid)}>
                    <Close />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
      <Dialog open={Boolean(stats)} onClose={() => setStats(null)} fullWidth maxWidth="sm">
        <DialogTitle>{stats?.profile.displayName}'s statistics</DialogTitle>
        <DialogContent>
          {stats?.value ? (
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h4">{stats.value.gamesPlayed}</Typography>
                  <Typography color="text.secondary">games</Typography>
                </CardContent>
              </Card>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h4">{percent(stats.value.winRate)}</Typography>
                  <Typography color="text.secondary">wins</Typography>
                </CardContent>
              </Card>
              <Typography variant="body2" color="text.secondary" sx={{ gridColumn: '1 / -1' }}>
                Updated {new Date(stats.value.updatedAt).toLocaleString()}
              </Typography>
            </Box>
          ) : (
            <Alert severity="info">This friend has not published statistics yet.</Alert>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export const FriendsPage = () => (
  <Page>
    <PageTitle closeTo="/">Friends</PageTitle>
    <AuthGate>
      <FriendsContent />
    </AuthGate>
  </Page>
);
