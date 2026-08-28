# Tichu Counter

A mobile-first Tichu scorekeeper for local play and synchronized games with friends.

## Stack

- Nx integrated monorepo with pnpm
- React, TypeScript, Vite, Material UI, and TanStack Query
- Firebase Authentication, Cloud Firestore, Hosting, Security Rules, and App Check
- IndexedDB for offline guest games
- Vitest, Firebase Emulator Suite, and Playwright

## Workspace

```text
apps/web             Browser bootstrap, routing providers, and environment config
libs/domain          Pure platform-neutral rules, reducers, scoring, and statistics
libs/application     Use-case ports and shared identifiers
libs/firebase-web    Firebase web adapters and realtime repositories
libs/local-data      IndexedDB guest adapters
libs/ui              MUI shell, features, pages, and counter controls
```

The dependency rules keep `domain` and `application` free of browser, React, MUI, and Firebase SDK types. A future Expo application can reuse those libraries while supplying native UI and native Firebase adapters.

## Development

Requirements: Node 24, Corepack, pnpm 10, and Java for the Firestore emulator.

```bash
corepack enable
pnpm install
cp .env.example .env.local
pnpm start
```

Firebase is optional for guest-mode development. To enable accounts, copy the web configuration from the Firebase console into `.env.local`, enable Google Authentication and Firestore, then add `tichu.helbling.io`, preview domains, and localhost as authorized Authentication domains.

For local Firebase development set `VITE_USE_FIREBASE_EMULATORS=true` and run:

```bash
pnpm firebase emulators:start
```

## Quality checks

```bash
pnpm typecheck
pnpm test
pnpm test:rules
pnpm build
pnpm e2e
```

Firestore and Hosting deployments use `firebase.json`, `firestore.rules`, and `firestore.indexes.json`. Enable App Check only after the preview environment has been verified; local emulators intentionally skip it.

## React Native path

Add an Expo wrapper under `apps/mobile`, a native UI library, and a native implementation of the application repository ports. Scoring, schemas, statistics, validation, and use-case contracts remain reusable. The MUI feature library stays browser-only.
