import type { AuthenticationRepository, AuthUser, Unsubscribe } from '@tichu/application';
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  type Auth,
} from 'firebase/auth';

export class FirebaseAuthenticationRepository implements AuthenticationRepository {
  constructor(private readonly auth: Auth) {}

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
    if (window.matchMedia('(max-width: 700px)').matches) await signInWithRedirect(this.auth, provider);
    else await signInWithPopup(this.auth, provider);
  }

  async signOut(): Promise<void> {
    await signOut(this.auth);
  }
}
