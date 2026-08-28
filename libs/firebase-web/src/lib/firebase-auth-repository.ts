import type { AuthenticationRepository, AuthUser, Unsubscribe } from '@tichu/application';
import {
  GoogleAuthProvider,
  getRedirectResult,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  type Auth,
} from 'firebase/auth';
import { shouldFallBackToRedirect } from './config';

export class FirebaseAuthenticationRepository implements AuthenticationRepository {
  constructor(private readonly auth: Auth) {
    void getRedirectResult(auth);
  }

  subscribe(listener: (user: AuthUser | null) => void): Unsubscribe {
    return onAuthStateChanged(this.auth, (user) =>
      listener(
        user ? { uid: user.uid, displayName: user.displayName ?? 'Tichu player', avatarUrl: user.photoURL } : null,
      ),
    );
  }

  async signInWithGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      await signInWithPopup(this.auth, provider);
    } catch (error) {
      if (!shouldFallBackToRedirect(error)) throw error;
      await signInWithRedirect(this.auth, provider);
    }
  }

  async signOut(): Promise<void> {
    await signOut(this.auth);
  }
}
