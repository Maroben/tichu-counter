import type { Services } from '@tichu/application';
import type { GuestGameRepository, LocalSettingsRepository } from '@tichu/application';
import { initializeApp, getApps } from 'firebase/app';
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import {
  connectFirestoreEmulator,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from 'firebase/firestore';
import { FirebaseAuthenticationRepository } from './firebase-auth-repository';
import { FirestoreGameRepository } from './firebase-game-repository';
import {
  FirestoreFriendshipRepository,
  FirestoreProfileRepository,
  FirestoreStatisticsRepository,
} from './firebase-social-repositories';
import { hasFirebaseConfig, resolveAuthDomain, type FirebaseWebConfig } from './config';

export const createServices = (
  config: Partial<FirebaseWebConfig>,
  guestGames: GuestGameRepository,
  localSettings: LocalSettingsRepository,
): Services => {
  if (!hasFirebaseConfig(config)) {
    return {
      auth: null,
      profiles: null,
      friendships: null,
      games: null,
      statistics: null,
      guestGames,
      localSettings,
      firebaseConfigured: false,
    };
  }

  const app =
    getApps()[0] ??
    initializeApp({
      ...config,
      authDomain: resolveAuthDomain(config, window.location.hostname),
    });
  const auth = getAuth(app);
  const firestore = initializeFirestore(app, {
    localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
  });

  if (config.useEmulators) {
    connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
    connectFirestoreEmulator(firestore, '127.0.0.1', 8080);
  } else if (config.appCheckSiteKey) {
    initializeAppCheck(app, {
      provider: new ReCaptchaEnterpriseProvider(config.appCheckSiteKey),
      isTokenAutoRefreshEnabled: true,
    });
  }

  const profiles = new FirestoreProfileRepository(firestore);
  return {
    auth: new FirebaseAuthenticationRepository(auth),
    profiles,
    friendships: new FirestoreFriendshipRepository(firestore, profiles),
    games: new FirestoreGameRepository(firestore),
    statistics: new FirestoreStatisticsRepository(firestore),
    guestGames,
    localSettings,
    firebaseConfigured: true,
  };
};
