import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { DeleteRounded, EditRounded } from '@mui/icons-material';
import { Navigate, useParams } from 'react-router-dom';
import { scoreRound, type Round } from '@tichu/domain';
import { useAuth } from '../app-context';
import { CounterEditor } from '../game/counter-editor';
import { useGame, useOnline } from '../game/use-game';
import { Page, PageTitle } from '../components/page';

export const RoundsPage = () => {
  const { gameId = '' } = useParams();
  const { user } = useAuth();
  const online = useOnline();
  const { game, loading, guest, updateRound, deleteRound } = useGame(gameId);
  const [editing, setEditing] = useState<Round | null>(null);
  const [deleting, setDeleting] = useState<Round | null>(null);
  const [error, setError] = useState<string | null>(null);
  if (loading)
    return (
      <Page>
        <CircularProgress />
      </Page>
    );
  if (!game) return <Navigate to="/" replace />;
  const editable =
    game.status === 'active' &&
    (guest || online) &&
    (guest || game.seats.some((seat) => seat.userId === user?.uid && seat.linkStatus === 'accepted'));
  const save = async () => {
    if (!editing) return;
    try {
      await updateRound(editing);
      setEditing(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not update round.');
    }
  };
  const remove = async () => {
    if (!deleting) return;
    try {
      await deleteRound(deleting.id);
      setDeleting(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not delete round.');
    }
  };

  return (
    <Page maxWidth="sm">
      <PageTitle closeTo={`/game/${game.id}`}>Rounds</PageTitle>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {game.rounds.length === 0 ? (
        <Alert severity="info">No rounds have been added yet.</Alert>
      ) : (
        game.rounds.map((round) => {
          const points = scoreRound(round);
          return (
            <Card key={round.id} sx={{ mb: 1.5 }}>
              <CardActionArea disabled={!editable} onClick={() => editable && setEditing(round)}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Chip label={`#${round.number}`} />
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontWeight: 700 }}>
                        {points[0]} – {points[1]}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(round.endedAt).toLocaleString()}
                      </Typography>
                    </Box>
                    {round.doubleTeam !== null && (
                      <Chip
                        color={round.doubleTeam === 0 ? 'primary' : 'secondary'}
                        label={`${game.teamNames[round.doubleTeam]} double`}
                      />
                    )}
                    {editable && <EditRounded color="action" />}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    {round.bets.map(
                      (bet, seat) =>
                        bet && (
                          <Chip
                            key={seat}
                            size="small"
                            color={bet.successful ? 'success' : 'error'}
                            label={`${game.seats[seat]?.displayName}: ${bet.kind === 'tichu' ? 'T' : 'GT'}`}
                          />
                        ),
                    )}
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          );
        })
      )}
      <Dialog open={Boolean(editing)} onClose={() => setEditing(null)} fullScreen>
        <DialogTitle>Edit round #{editing?.number}</DialogTitle>
        <DialogContent>
          {editing && (
            <Box sx={{ maxWidth: 600, mx: 'auto' }}>
              <CounterEditor
                draft={editing}
                seats={game.seats}
                teamNames={game.teamNames}
                onChange={(draft) => setEditing({ ...editing, ...draft })}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            color="error"
            startIcon={<DeleteRounded />}
            onClick={() => {
              setDeleting(editing);
              setEditing(null);
            }}>
            Delete
          </Button>
          <Box sx={{ flex: 1 }} />
          <Button onClick={() => setEditing(null)}>Cancel</Button>
          <Button variant="contained" onClick={() => void save()}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={Boolean(deleting)} onClose={() => setDeleting(null)}>
        <DialogTitle>Delete round #{deleting?.number}?</DialogTitle>
        <DialogContent>
          <Typography>The game totals will be recalculated immediately.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleting(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={() => void remove()}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Page>
  );
};
