import { lazy, Suspense } from 'react';
import { Alert, Box, Button, CircularProgress } from '@mui/material';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import type { Services } from '@tichu/application';
import { AppProviders } from './app-context';
import { AppShell } from './components/app-shell';
import { Page, PageTitle } from './components/page';

const HomePage = lazy(() => import('./pages/home-page').then((module) => ({ default: module.HomePage })));
const OnboardingPage = lazy(() =>
  import('./pages/onboarding-page').then((module) => ({ default: module.OnboardingPage })),
);
const GameSetupPage = lazy(() =>
  import('./pages/game-setup-page').then((module) => ({ default: module.GameSetupPage })),
);
const GamePage = lazy(() => import('./pages/game-page').then((module) => ({ default: module.GamePage })));
const RoundsPage = lazy(() => import('./pages/rounds-page').then((module) => ({ default: module.RoundsPage })));
const FriendsPage = lazy(() => import('./pages/friends-page').then((module) => ({ default: module.FriendsPage })));
const StatisticsPage = lazy(() =>
  import('./pages/statistics-page').then((module) => ({ default: module.StatisticsPage })),
);
const SettingsPage = lazy(() => import('./pages/settings-page').then((module) => ({ default: module.SettingsPage })));

const NotFoundPage = () => (
  <Page maxWidth="sm">
    <PageTitle closeTo="/">Page not found</PageTitle>
    <Alert severity="warning">
      <Button component={Link} to="/">
        Back home
      </Button>
    </Alert>
  </Page>
);

export const TichuApp = ({ services }: { services: Services }) => (
  <AppProviders services={services}>
    <BrowserRouter>
      <Suspense
        fallback={
          <Box sx={{ minHeight: '60dvh', display: 'grid', placeItems: 'center' }}>
            <CircularProgress />
          </Box>
        }>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<HomePage />} />
            <Route path="onboarding" element={<OnboardingPage />} />
            <Route path="game/new" element={<GameSetupPage />} />
            <Route path="game/:gameId/settings" element={<GameSetupPage />} />
            <Route path="game/:gameId" element={<GamePage />} />
            <Route path="game/:gameId/rounds" element={<RoundsPage />} />
            <Route path="friends" element={<FriendsPage />} />
            <Route path="statistics" element={<StatisticsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  </AppProviders>
);
