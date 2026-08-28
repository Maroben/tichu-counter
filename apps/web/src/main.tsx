import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createServices, type FirebaseWebConfig } from '@tichu/firebase-web';
import { IndexedDbGuestGameRepository, IndexedDbLocalSettingsRepository } from '@tichu/local-data';
import { TichuApp } from '@tichu/ui';
import './styles.css';

const firebaseConfig: Partial<FirebaseWebConfig> = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  appCheckSiteKey: import.meta.env.VITE_FIREBASE_APP_CHECK_SITE_KEY,
  useEmulators: import.meta.env.VITE_USE_FIREBASE_EMULATORS === 'true',
};

const services = createServices(
  firebaseConfig,
  new IndexedDbGuestGameRepository(),
  new IndexedDbLocalSettingsRepository(),
);
const root = document.getElementById('root');
if (!root) throw new Error('Root element is missing.');
createRoot(root).render(
  <StrictMode>
    <TichuApp services={services} />
  </StrictMode>,
);
