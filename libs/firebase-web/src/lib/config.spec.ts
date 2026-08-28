import { describe, expect, it } from 'vitest';
import { resolveAuthDomain, shouldFallBackToRedirect } from './config';

const config = { authDomain: 'tichu-helbling-io.firebaseapp.com', useEmulators: false };

describe('resolveAuthDomain', () => {
  it('keeps the configured domain on localhost and emulators', () => {
    expect(resolveAuthDomain(config, 'localhost')).toBe(config.authDomain);
    expect(resolveAuthDomain({ ...config, useEmulators: true }, 'tichu.helbling.io')).toBe(config.authDomain);
  });

  it('uses the page hostname on Firebase Hosting', () => {
    expect(resolveAuthDomain(config, 'tichu.helbling.io')).toBe('tichu.helbling.io');
    expect(resolveAuthDomain(config, 'tichu-helbling-io.web.app')).toBe('tichu-helbling-io.web.app');
  });
});

describe('shouldFallBackToRedirect', () => {
  it('falls back when a popup cannot be used', () => {
    expect(shouldFallBackToRedirect({ code: 'auth/popup-blocked' })).toBe(true);
    expect(shouldFallBackToRedirect({ code: 'auth/popup-closed-by-user' })).toBe(false);
    expect(shouldFallBackToRedirect(new Error('blocked'))).toBe(false);
  });
});
