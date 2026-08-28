import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';
import {
  AddCircleRounded,
  BarChartRounded,
  GroupsRounded,
  PlayArrowRounded,
  SettingsRounded,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import type { Game, SeatIndex } from '@tichu/domain';
import { useAuth, useServices } from '../app-context';
import { Page, PageTitle } from '../components/page';
import { SignInButton } from '../components/auth-gate';

const ActionCard = ({
  to,
  title,
  description,
  icon,
}: {
  to: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}) => (
  <Card>
    <CardActionArea component={Link} to={to} sx={{ height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ color: 'primary.main', mb: 1 }}>{icon}</Box>
        <Typography variant="h6">{title}</Typography>
        <Typography color="text.secondary">{description}</Typography>
      </CardContent>
    </CardActionArea>
  </Card>
);

export const HomePage = () => {
  const services = useServices();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [guestGame, setGuestGame] = useState<Game | null>(null);
  const [cloudGames, setCloudGames] = useState<readonly Game[]>([]);
  const [joinOpen, setJoinOpen] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [joinSeat, setJoinSeat] = useState<SeatIndex>(1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void services.guestGames.load().then(setGuestGame);
  }, [services.guestGames]);
  useEffect(() => {
    if (!user || !services.games) {
      setCloudGames([]);
      return;
    }
    return services.games.subscribeForUser(user.uid, setCloudGames);
  }, [services.games, user]);

  const pending = cloudGames.filter(
    (game) =>
      game.status === 'lobby' && game.seats.some((seat) => seat.userId === user?.uid && seat.linkStatus === 'pending'),
  );
  const active = cloudGames.filter((game) => game.status === 'active' || game.status === 'finalizing');
  const recent = cloudGames.filter((game) => game.status === 'completed').slice(0, 3);

  const accept = async (game: Game) => {
    if (!user || !services.games) return;
    await services.games.acceptInvitation(game.id, user.uid);
    navigate(`/game/${game.id}`);
  };

  const claim = async () => {
    if (!user || !profile || !services.games) return;
    try {
      setError(null);
      const gameId = await services.games.claimSeat(joinCode, user.uid, profile.displayName, joinSeat);
      setJoinOpen(false);
      navigate(`/game/${gameId}`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not join that game.');
    }
  };

  return (
    <Page>
      <Box
        sx={{
          py: { xs: 2, sm: 5 },
          display: 'flex',
          alignItems: 'center',
          gap: { xs: 2, sm: 3 },
        }}>
        <Box
          component="img"
          src="/icons/icon-512.png"
          alt="Tichu Counter"
          decoding="async"
          sx={{
            width: { xs: 88, sm: 128 },
            height: { xs: 88, sm: 128 },
            borderRadius: 4,
            flexShrink: 0,
          }}
        />
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="overline" color="primary" sx={{ fontWeight: 800 }}>
            Your table is ready
          </Typography>
          <PageTitle sx={{ fontSize: { xs: '2.3rem', sm: '3.5rem' } }}>Count less. Play more.</PageTitle>
          <Typography color="text.secondary" sx={{ maxWidth: 620, mt: -2, mb: 4, fontSize: '1.1rem' }}>
            A familiar Tichu counter with synchronized games, friends, and statistics when you want them.
          </Typography>
        </Box>
      </Box>

      {!services.firebaseConfigured && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Accounts are disabled until Firebase environment values are configured. Guest counting is ready now.
        </Alert>
      )}
      {user && !profile && (
        <Alert
          severity="warning"
          action={
            <Button component={Link} to="/onboarding">
              Create profile
            </Button>
          }
          sx={{ mb: 3 }}>
          Choose a public handle to finish setting up your account.
        </Alert>
      )}

      {(guestGame?.status === 'active' || active.length > 0) && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Resume
          </Typography>
          <Box sx={{ display: 'grid', gap: 2 }}>
            {guestGame?.status === 'active' && (
              <Button
                component={Link}
                to="/game/guest"
                variant="contained"
                size="large"
                startIcon={<PlayArrowRounded />}>
                Resume local game
              </Button>
            )}
            {active.map((game) => (
              <Button
                key={game.id}
                component={Link}
                to={`/game/${game.id}`}
                variant="contained"
                size="large"
                startIcon={<PlayArrowRounded />}>
                Resume {game.teamNames[0]} vs {game.teamNames[1]}
              </Button>
            ))}
          </Box>
        </Box>
      )}

      {pending.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Invitations
          </Typography>
          {pending.map((game) => (
            <Card key={game.id} sx={{ mb: 1 }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontWeight: 700 }}>
                    {game.teamNames[0]} vs {game.teamNames[1]}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    You have been invited to a seat.
                  </Typography>
                </Box>
                <Button onClick={() => void accept(game)}>Accept</Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
        <ActionCard
          to="/game/new"
          title="Start a game"
          description="Play locally or create a synchronized table."
          icon={<AddCircleRounded fontSize="large" />}
        />
        <ActionCard
          to="/friends"
          title="Friends"
          description="Requests, player handles, and shared stats."
          icon={<GroupsRounded fontSize="large" />}
        />
        <ActionCard
          to="/statistics"
          title="Statistics"
          description="Wins, declarations, and teammate records."
          icon={<BarChartRounded fontSize="large" />}
        />
        <ActionCard
          to="/settings"
          title="Settings"
          description="Profile, target score, and appearance."
          icon={<SettingsRounded fontSize="large" />}
        />
      </Box>

      {user && profile && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button onClick={() => setJoinOpen(true)}>Join with a code</Button>
        </Box>
      )}

      {recent.length > 0 && (
        <Box sx={{ mt: 5 }}>
          <Typography variant="h6" gutterBottom>
            Recent games
          </Typography>
          {recent.map((game) => (
            <Card key={game.id} sx={{ mb: 1 }}>
              <CardActionArea component={Link} to={`/game/${game.id}`}>
                <CardContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>
                    {game.teamNames[0]} vs {game.teamNames[1]}
                  </Typography>
                  <Chip label={`${game.summary?.finalPoints[0]} – ${game.summary?.finalPoints[1]}`} />
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Box>
      )}

      {!user && services.firebaseConfigured && (
        <Box sx={{ textAlign: 'center', mt: 5 }}>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Sign in to sync games and play with friends.
          </Typography>
          <SignInButton />
        </Box>
      )}

      <Dialog open={joinOpen} onClose={() => setJoinOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Join a table</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            autoFocus
            fullWidth
            label="6-character code"
            value={joinCode}
            onChange={(event) => setJoinCode(event.target.value.toUpperCase())}
            slotProps={{ htmlInput: { maxLength: 6 } }}
            sx={{ my: 1 }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Choose an open seat number shown on the host’s setup screen.
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {([0, 1, 2, 3] as SeatIndex[]).map((seat) => (
              <Button
                key={seat}
                variant={joinSeat === seat ? 'contained' : 'outlined'}
                onClick={() => setJoinSeat(seat)}>
                {seat + 1}
              </Button>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setJoinOpen(false)}>Cancel</Button>
          <Button variant="contained" disabled={joinCode.length !== 6} onClick={() => void claim()}>
            Join
          </Button>
        </DialogActions>
      </Dialog>
    </Page>
  );
};
