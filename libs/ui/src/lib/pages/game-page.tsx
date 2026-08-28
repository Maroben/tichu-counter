import { useState } from 'react';
import { Alert, Box, Button, Card, CardContent, Chip, CircularProgress, Paper, Typography } from '@mui/material';
import { CheckRounded, ContentCopyRounded, ListRounded, PlayArrowRounded, RefreshRounded } from '@mui/icons-material';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { isGameComplete, scoreGame } from '@tichu/domain';
import { useAuth, useServices } from '../app-context';
import { Page, PageTitle } from '../components/page';
import { CounterEditor } from '../game/counter-editor';
import { useGame, useOnline } from '../game/use-game';

export const GamePage = () => {
  const { gameId = '' } = useParams();
  const navigate = useNavigate();
  const services = useServices();
  const { user } = useAuth();
  const online = useOnline();
  const { game, loading, error, setError, guest, updateDraft, addRound, finalize, reopen, remove } = useGame(gameId);
  const [busy, setBusy] = useState(false);
  if (loading)
    return (
      <Page>
        <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 300 }}>
          <CircularProgress />
        </Box>
      </Page>
    );
  if (!game) return <Navigate to="/" replace />;
  const totals = scoreGame(game.rounds);
  const isHost = guest || game.hostUid === user?.uid;
  const accepted = guest || game.seats.some((seat) => seat.userId === user?.uid && seat.linkStatus === 'accepted');
  const editable = game.status === 'active' && accepted && (guest || online);
  const canFinish = isGameComplete(totals, game.targetScore);
  const run = async (action: () => Promise<void>) => {
    try {
      setBusy(true);
      setError(null);
      await action();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Action failed.');
    } finally {
      setBusy(false);
    }
  };
  const changeDraft = async (draft: Parameters<typeof updateDraft>[0]) => {
    try {
      setError(null);
      await updateDraft(draft);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Draft update failed.');
    }
  };

  if (game.status === 'lobby')
    return (
      <Page maxWidth="sm">
        <PageTitle>Game lobby</PageTitle>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6">
              {game.teamNames[0]} vs {game.teamNames[1]}
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              The game starts when handle invitations are accepted.
            </Typography>
            {game.seats.map((seat) => (
              <Box
                key={seat.index}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  py: 1,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                }}>
                <Typography>
                  Seat {seat.index + 1} · {seat.displayName}
                </Typography>
                <Chip
                  size="small"
                  label={seat.linkStatus}
                  color={
                    seat.linkStatus === 'accepted' ? 'success' : seat.linkStatus === 'pending' ? 'warning' : 'default'
                  }
                />
              </Box>
            ))}
            {game.joinCode && (
              <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', mt: 3 }}>
                <Typography variant="overline">Join code</Typography>
                <Typography variant="h3" sx={{ letterSpacing: '.16em' }}>
                  {game.joinCode}
                </Typography>
                <Button
                  startIcon={<ContentCopyRounded />}
                  onClick={() => void navigator.clipboard.writeText(game.joinCode!)}>
                  Copy
                </Button>
                {isHost && (
                  <Button
                    startIcon={<RefreshRounded />}
                    onClick={() =>
                      void run(async () => {
                        await services.games!.regenerateJoinCode(game.id, user!.uid);
                      })
                    }>
                    Regenerate
                  </Button>
                )}
              </Paper>
            )}
            {isHost ? (
              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={<PlayArrowRounded />}
                disabled={game.seats.some((seat) => seat.linkStatus === 'pending') || busy}
                sx={{ mt: 3 }}
                onClick={() => void run(() => services.games!.start(game.id, user!.uid))}>
                Start game
              </Button>
            ) : (
              <Alert severity="info" sx={{ mt: 3 }}>
                Waiting for the host to start.
              </Alert>
            )}
          </CardContent>
        </Card>
      </Page>
    );

  if (game.status === 'completed')
    return (
      <Page maxWidth="sm">
        <PageTitle>Game complete</PageTitle>
        <Card>
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="overline">Winner</Typography>
            <Typography variant="h3" color={game.summary?.winnerTeam === 0 ? 'primary' : 'secondary'}>
              {game.teamNames[game.summary!.winnerTeam]}
            </Typography>
            <Typography variant="h4" sx={{ my: 2 }}>
              {game.summary?.finalPoints[0]} – {game.summary?.finalPoints[1]}
            </Typography>
            <Typography color="text.secondary">
              {game.summary?.roundCount} rounds · {Math.round((game.summary?.durationMs ?? 0) / 60000)} minutes
            </Typography>
            <Box sx={{ display: 'grid', gap: 1, mt: 4 }}>
              <Button component={Link} to={`/game/${game.id}/rounds`} startIcon={<ListRounded />}>
                View rounds
              </Button>
              {isHost && (
                <Button variant="outlined" onClick={() => void run(reopen)}>
                  Reopen to correct
                </Button>
              )}
              <Button
                color="error"
                onClick={() =>
                  void run(async () => {
                    await remove();
                    navigate('/');
                  })
                }>
                Delete game
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Page>
    );

  return (
    <Page maxWidth="sm">
      <PageTitle action={<Chip label={`First to ${game.targetScore}`} />}>
        {game.teamNames[0]} vs {game.teamNames[1]}
      </PageTitle>
      {!guest && !online && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Connection lost. Cached scores remain visible, but synchronized editing is paused.
        </Alert>
      )}
      {game.status === 'finalizing' && (
        <Alert severity="info" icon={<CircularProgress size={18} />} sx={{ mb: 2 }}>
          The host is finalizing this game.
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Paper sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', textAlign: 'center', p: 2.5, mb: 2 }}>
        <Box>
          <Typography variant="h3" color="primary">
            {totals[0]}
          </Typography>
          <Typography>{game.teamNames[0]}</Typography>
        </Box>
        <Box>
          <Typography variant="h3" color="secondary">
            {totals[1]}
          </Typography>
          <Typography>{game.teamNames[1]}</Typography>
        </Box>
      </Paper>
      <CounterEditor
        draft={game.draft}
        seats={game.seats}
        teamNames={game.teamNames}
        disabled={!editable}
        onChange={(draft) => void changeDraft(draft)}
      />
      <Paper
        elevation={8}
        sx={{
          position: 'sticky',
          bottom: 8,
          mt: 2,
          p: 1.5,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 1,
          zIndex: 2,
          '@media (pointer: fine)': {
            position: 'static',
          },
        }}>
        <Button component={Link} to={`/game/${game.id}/rounds`} startIcon={<ListRounded />}>
          Rounds ({game.rounds.length})
        </Button>
        <Button
          variant="contained"
          disabled={!editable || busy}
          startIcon={<CheckRounded />}
          onClick={() => void run(addRound)}>
          Add round
        </Button>
        {canFinish && isHost && (
          <Button
            color="secondary"
            variant="contained"
            disabled={!editable || busy}
            sx={{ gridColumn: '1 / -1' }}
            onClick={() => void run(finalize)}>
            Finish game
          </Button>
        )}
      </Paper>
    </Page>
  );
};
