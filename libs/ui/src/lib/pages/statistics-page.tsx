import { useEffect, useMemo, useState } from 'react';
import { Alert, Box, Card, CardContent, LinearProgress, List, ListItem, ListItemText, Typography } from '@mui/material';
import { calculateUserStatistics, type Game } from '@tichu/domain';
import { useAuth, useServices } from '../app-context';
import { AuthGate } from '../components/auth-gate';
import { Page, PageTitle } from '../components/page';

const percent = (value: number) => `${Math.round(value * 100)}%`;
const StatCard = ({ value, label }: { value: string | number; label: string }) => (
  <Card>
    <CardContent>
      <Typography variant="h4" sx={{ fontWeight: 800 }}>
        {value}
      </Typography>
      <Typography color="text.secondary">{label}</Typography>
    </CardContent>
  </Card>
);

const StatisticsContent = () => {
  const services = useServices();
  const { user } = useAuth();
  const [games, setGames] = useState<readonly Game[]>([]);
  useEffect(() => services.games!.subscribeForUser(user!.uid, setGames), [services.games, user]);
  const stats = useMemo(() => calculateUserStatistics(user!.uid, games), [games, user]);
  useEffect(() => {
    void services.statistics!.publish(stats);
  }, [services.statistics, stats]);
  const recent = games.filter((game) => game.status === 'completed').slice(0, 5);

  if (stats.gamesPlayed === 0)
    return <Alert severity="info">Finish your first linked game to unlock statistics.</Alert>;
  return (
    <>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
        <StatCard value={stats.gamesPlayed} label="Games played" />
        <StatCard value={stats.gamesWon} label="Games won" />
        <StatCard value={percent(stats.winRate)} label="Game win rate" />
        <StatCard value={stats.declarationsPerGame.toFixed(1)} label="Bets per game" />
      </Box>
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Declaration success
          </Typography>
          {[
            ['All declarations', stats.declarationSuccessRate],
            ['Tichu', stats.tichuSuccessRate],
            ['Grand Tichu', stats.grandTichuSuccessRate],
          ].map(([label, value]) => (
            <Box key={String(label)} sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>{label}</Typography>
                <Typography sx={{ fontWeight: 700 }}>{percent(value as number)}</Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={(value as number) * 100}
                sx={{ height: 8, borderRadius: 8 }}
              />
            </Box>
          ))}
        </CardContent>
      </Card>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        <Card>
          <CardContent>
            <Typography variant="h6">Best teammates</Typography>
            <List>
              {stats.teammateStatistics.length ? (
                stats.teammateStatistics.map((teammate) => (
                  <ListItem key={teammate.userId} divider>
                    <ListItemText
                      primary={teammate.displayName}
                      secondary={`${teammate.wins} wins from ${teammate.games} games`}
                    />
                    <Typography sx={{ fontWeight: 700 }}>{percent(teammate.winRate)}</Typography>
                  </ListItem>
                ))
              ) : (
                <Typography color="text.secondary" sx={{ py: 2 }}>
                  Play with linked friends to compare records.
                </Typography>
              )}
            </List>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="h6">Recent games</Typography>
            <List>
              {recent.map((game) => {
                const seat = game.seats.find((candidate) => candidate.userId === user!.uid)!;
                const won = game.summary?.winnerTeam === seat.team;
                return (
                  <ListItem key={game.id} divider>
                    <ListItemText
                      primary={`${game.teamNames[0]} vs ${game.teamNames[1]}`}
                      secondary={new Date(game.completedAt!).toLocaleDateString()}
                    />
                    <Typography color={won ? 'primary' : 'secondary'} sx={{ fontWeight: 800 }}>
                      {won ? 'Won' : 'Lost'}
                    </Typography>
                  </ListItem>
                );
              })}
            </List>
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

export const StatisticsPage = () => (
  <Page>
    <PageTitle>Statistics</PageTitle>
    <AuthGate>
      <StatisticsContent />
    </AuthGate>
  </Page>
);
