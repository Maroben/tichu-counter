import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import type { AuthUser, LocalSettings, Services } from '@tichu/application';
import type { UserProfile } from '@tichu/domain';
import { CssBaseline, useMediaQuery } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createTichuTheme } from './theme';

const ServicesContext = createContext<Services | null>(null);

interface AuthState {
  readonly user: AuthUser | null;
  readonly profile: UserProfile | null;
  readonly loading: boolean;
  readonly refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

interface PreferencesState {
  readonly settings: LocalSettings;
  readonly save: (settings: LocalSettings) => Promise<void>;
}

const PreferencesContext = createContext<PreferencesState | null>(null);

export const useServices = (): Services => {
  const value = useContext(ServicesContext);
  if (!value) throw new Error('Services are not available.');
  return value;
};

export const useAuth = (): AuthState => {
  const value = useContext(AuthContext);
  if (!value) throw new Error('Authentication is not available.');
  return value;
};

export const usePreferences = (): PreferencesState => {
  const value = useContext(PreferencesContext);
  if (!value) throw new Error('Preferences are not available.');
  return value;
};

const AuthProvider = ({ children }: PropsWithChildren) => {
  const services = useServices();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(
    async (current: AuthUser | null) => {
      setProfile(current && services.profiles ? await services.profiles.get(current.uid) : null);
    },
    [services.profiles],
  );

  useEffect(() => {
    if (!services.auth) {
      setLoading(false);
      return;
    }
    return services.auth.subscribe((nextUser) => {
      setUser(nextUser);
      void loadProfile(nextUser).finally(() => setLoading(false));
    });
  }, [loadProfile, services.auth]);

  const refreshProfile = useCallback(() => loadProfile(user), [loadProfile, user]);
  const value = useMemo(() => ({ user, profile, loading, refreshProfile }), [user, profile, loading, refreshProfile]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const PreferencesProvider = ({ children }: PropsWithChildren) => {
  const services = useServices();
  const [settings, setSettings] = useState<LocalSettings>({ defaultTargetScore: 1000, colorMode: 'system' });
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  useEffect(() => {
    void services.localSettings.load().then(setSettings);
  }, [services.localSettings]);
  const save = useCallback(
    async (next: LocalSettings) => {
      await services.localSettings.save(next);
      setSettings(next);
    },
    [services.localSettings],
  );
  const resolvedMode = settings.colorMode === 'system' ? (prefersDark ? 'dark' : 'light') : settings.colorMode;
  const theme = useMemo(() => createTichuTheme(resolvedMode), [resolvedMode]);
  return (
    <PreferencesContext.Provider value={{ settings, save }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </PreferencesContext.Provider>
  );
};

export const AppProviders = ({ services, children }: PropsWithChildren<{ services: Services }>) => {
  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: { queries: { staleTime: 30_000, retry: 1 } } }),
  );
  return (
    <ServicesContext.Provider value={services}>
      <QueryClientProvider client={queryClient}>
        <PreferencesProvider>
          <AuthProvider>{children}</AuthProvider>
        </PreferencesProvider>
      </QueryClientProvider>
    </ServicesContext.Provider>
  );
};
