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
