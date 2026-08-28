export interface FirebaseWebConfig {
  readonly apiKey: string;
  readonly authDomain: string;
  readonly projectId: string;
  readonly storageBucket?: string;
  readonly messagingSenderId?: string;
  readonly appId: string;
  readonly appCheckSiteKey?: string;
  readonly useEmulators?: boolean;
}

export const hasFirebaseConfig = (config: Partial<FirebaseWebConfig>): config is FirebaseWebConfig =>
  Boolean(config.apiKey && config.authDomain && config.projectId && config.appId);

export const resolveAuthDomain = (
  config: Pick<FirebaseWebConfig, 'authDomain' | 'useEmulators'>,
  hostname: string,
): string => {
  if (config.useEmulators || hostname === 'localhost' || hostname === '127.0.0.1') return config.authDomain;
  return hostname;
};

export const shouldFallBackToRedirect = (error: unknown): boolean => {
  const code = typeof error === 'object' && error !== null && 'code' in error ? String(error.code) : '';
  return code === 'auth/popup-blocked' || code === 'auth/operation-not-supported-in-this-environment';
};
