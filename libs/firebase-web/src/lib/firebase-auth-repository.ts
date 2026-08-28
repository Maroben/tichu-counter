import type { AuthenticationRepository, AuthUser, Unsubscribe } from '@tichu/application';
import {
  GoogleAuthProvider,
  getRedirectResult,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type Auth,
} from 'firebase/auth';

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
    await signInWithPopup(this.auth, provider);
  }

  async signOut(): Promise<void> {
    await signOut(this.auth);
  }
}
