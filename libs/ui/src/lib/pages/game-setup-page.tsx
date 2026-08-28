import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { CloudRounded, PersonSearchRounded, PhoneAndroidRounded } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import type { FriendshipWithProfile } from '@tichu/application';
import { createGame, type PlayerSeat, type SeatIndex, type SeatTuple, type UserProfile } from '@tichu/domain';
import { useAuth, usePreferences, useServices } from '../app-context';
import { Page, PageTitle } from '../components/page';

type Mode = 'guest' | 'cloud';

export const GameSetupPage = () => {
  const services = useServices();
  const { user, profile } = useAuth();
  const { settings } = usePreferences();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>(user && profile ? 'cloud' : 'guest');
  const [teamNames, setTeamNames] = useState<[string, string]>(['Dragon', 'Phoenix']);
  const [target, setTarget] = useState(profile?.defaultTargetScore ?? settings.defaultTargetScore);
  const [hostSeat, setHostSeat] = useState<SeatIndex>(0);
  const [names, setNames] = useState<[string, string, string, string]>([
    'Player 1',
    'Player 2',
    'Player 3',
    'Player 4',
  ]);
  const [linked, setLinked] = useState<
    [UserProfile | null, UserProfile | null, UserProfile | null, UserProfile | null]
  >([null, null, null, null]);
  const [handles, setHandles] = useState<[string, string, string, string]>(['', '', '', '']);
  const [friendships, setFriendships] = useState<readonly FriendshipWithProfile[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && profile) {
      setNames(
        (current) => current.map((name, index) => (index === hostSeat ? profile.displayName : name)) as typeof current,
      );
      return services.friendships?.subscribe(user.uid, (items) =>
        setFriendships(items.filter((item) => item.status === 'accepted')),
      );
    }
  }, [hostSeat, profile, services.friendships, user]);

  const friends = useMemo(() => friendships.map((item) => item.otherProfile), [friendships]);
  const setName = (seat: SeatIndex, value: string) =>
    setNames((current) => current.map((item, index) => (index === seat ? value : item)) as typeof current);
  const setHandle = (seat: SeatIndex, value: string) =>
    setHandles((current) => current.map((item, index) => (index === seat ? value : item)) as typeof current);
  const setLink = (seat: SeatIndex, value: UserProfile | null) => {
    setLinked((current) => current.map((item, index) => (index === seat ? value : item)) as typeof current);
    if (value) setName(seat, value.displayName);
  };

  const searchHandle = async (seat: SeatIndex) => {
    const found = await services.profiles?.findByHandle(handles[seat]);
    if (!found) {
      setError(`No player found for @${handles[seat]}.`);
      return;
    }
    if (found.uid === user?.uid) {
      setError('Your account is already in the host seat.');
      return;
    }
    if (linked.some((item) => item?.uid === found.uid)) {
      setError('That player already has a seat.');
      return;
    }
    setLink(seat, found);
    setError(null);
  };

  const chooseHostSeat = (seat: SeatIndex) => {
    const previous = hostSeat;
    setHostSeat(seat);
    if (profile) {
      setNames(
        (current) =>
          current.map((name, index) =>
            index === seat ? profile.displayName : index === previous ? `Player ${index + 1}` : name,
          ) as typeof current,
      );
      setLink(seat, null);
    }
  };

  const submit = async () => {
    try {
      setError(null);
      if (names.some((name) => !name.trim()) || teamNames.some((name) => !name.trim()))
        throw new Error('Every team and player needs a name.');
      const now = Date.now();
      if (mode === 'guest') {
        const seats = names.map((displayName, index) => ({
          index: index as SeatIndex,
          team: (index % 2) as 0 | 1,
          displayName: displayName.trim(),
          userId: null,
          linkStatus: 'guest' as const,
          linkSource: 'guest' as const,
        })) as unknown as SeatTuple;
        const game = {
          ...createGame({ id: 'guest', storage: 'guest', targetScore: target, now }),
          teamNames,
          seats,
          status: 'active' as const,
          startedAt: now,
        };
        await services.guestGames.save(game);
        navigate('/game/guest');
        return;
      }
      if (!user || !profile || !services.games)
        throw new Error('Sign in and create a profile to start a synchronized game.');
      const friendIds = new Set(friends.map((friend) => friend.uid));
      const seats = names.map((displayName, index) => {
        const seat = index as SeatIndex;
        if (seat === hostSeat)
          return {
            index: seat,
            team: (index % 2) as 0 | 1,
            displayName: profile.displayName,
            userId: user.uid,
            linkStatus: 'accepted' as const,
            linkSource: 'host' as const,
          };
        const account = linked[seat];
        if (!account)
          return {
            index: seat,
            team: (index % 2) as 0 | 1,
            displayName: displayName.trim(),
            userId: null,
            linkStatus: 'guest' as const,
            linkSource: 'guest' as const,
          };
        const isFriend = friendIds.has(account.uid);
        return {
          index: seat,
          team: (index % 2) as 0 | 1,
          displayName: account.displayName,
          userId: account.uid,
          linkStatus: isFriend ? ('accepted' as const) : ('pending' as const),
          linkSource: isFriend ? ('friend' as const) : ('handle' as const),
        };
      }) as PlayerSeat[];
      const game = await services.games.create({
        hostUid: user.uid,
        hostName: profile.displayName,
        hostSeat,
        targetScore: target,
        teamNames,
        seats,
      });
      navigate(`/game/${game.id}`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not create game.');
    }
  };

  return (
    <Page maxWidth="md">
      <PageTitle>Start a game</PageTitle>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <ToggleButtonGroup
        exclusive
        fullWidth
        value={mode}
        onChange={(_, value: Mode | null) => value && setMode(value)}
        sx={{ mb: 3 }}>
        <ToggleButton value="guest">
          <PhoneAndroidRounded sx={{ mr: 1 }} />
          Local guest
        </ToggleButton>
        <ToggleButton value="cloud" disabled={!user || !profile}>
          <CloudRounded sx={{ mr: 1 }} />
          Synced game
        </ToggleButton>
      </ToggleButtonGroup>
      <Card>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <TextField
              label="Team one"
              value={teamNames[0]}
              onChange={(event) => setTeamNames([event.target.value, teamNames[1]])}
            />
            <TextField
              label="Team two"
              value={teamNames[1]}
              onChange={(event) => setTeamNames([teamNames[0], event.target.value])}
            />
          </Box>
          <TextField
            type="number"
            label="Target score"
            value={target}
            onChange={(event) => setTarget(Number(event.target.value))}
            sx={{ mt: 2 }}
            slotProps={{ htmlInput: { min: 100, step: 100 } }}
          />
          <Divider sx={{ my: 3 }} />
          <Typography variant="h6" gutterBottom>
            Players
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Seats 1 and 3 play for {teamNames[0]}; seats 2 and 4 play for {teamNames[1]}.
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            {([0, 1, 2, 3] as SeatIndex[]).map((seat) => (
              <Card
                key={seat}
                variant="outlined"
                sx={{ borderColor: seat % 2 === 0 ? 'primary.main' : 'secondary.main' }}>
                <CardContent sx={{ display: 'grid', gap: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontWeight: 800 }}>Seat {seat + 1}</Typography>
                    {mode === 'cloud' && (
                      <Chip
                        size="small"
                        label={hostSeat === seat ? 'You' : linked[seat] ? linked[seat]!.handle : 'Guest / open'}
                        color={hostSeat === seat ? 'primary' : 'default'}
                      />
                    )}
                  </Box>
                  {mode === 'cloud' && hostSeat === seat ? (
                    <TextField label="Player" value={profile?.displayName ?? ''} disabled />
                  ) : (
                    <TextField
                      label="Player name"
                      value={names[seat]}
                      onChange={(event) => {
                        setName(seat, event.target.value);
                        setLink(seat, null);
                      }}
                    />
                  )}
                  {mode === 'cloud' && hostSeat !== seat && (
                    <>
                      <FormControl size="small">
                        <InputLabel>Choose friend</InputLabel>
                        <Select
                          label="Choose friend"
                          value={
                            linked[seat] && friends.some((friend) => friend.uid === linked[seat]?.uid)
                              ? linked[seat]!.uid
                              : ''
                          }
                          onChange={(event) =>
                            setLink(seat, friends.find((friend) => friend.uid === event.target.value) ?? null)
                          }>
                          <MenuItem value="">Guest / open seat</MenuItem>
                          {friends.map((friend) => (
                            <MenuItem key={friend.uid} value={friend.uid}>
                              {friend.displayName} (@{friend.handle})
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextField
                          size="small"
                          label="Or exact handle"
                          value={handles[seat]}
                          onChange={(event) => setHandle(seat, event.target.value.toLowerCase())}
                        />
                        <Button aria-label="Find handle" onClick={() => void searchHandle(seat)}>
                          <PersonSearchRounded />
                        </Button>
                      </Box>
                    </>
                  )}
                  {mode === 'cloud' && (
                    <Button
                      size="small"
                      variant={hostSeat === seat ? 'contained' : 'text'}
                      onClick={() => chooseHostSeat(seat)}>
                      I sit here
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </Box>
          <Button variant="contained" size="large" fullWidth sx={{ mt: 3 }} onClick={() => void submit()}>
            {mode === 'cloud' ? 'Create lobby' : 'Start local game'}
          </Button>
        </CardContent>
      </Card>
    </Page>
  );
};
