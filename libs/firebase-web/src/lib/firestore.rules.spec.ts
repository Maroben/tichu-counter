import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest';
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { deleteDoc, doc, getDoc, setDoc, Timestamp, updateDoc } from 'firebase/firestore';

let environment: RulesTestEnvironment;

beforeAll(async () => {
  environment = await initializeTestEnvironment({
    projectId: 'demo-no-project',
    firestore: { rules: readFileSync(resolve(process.cwd(), 'firestore.rules'), 'utf8') },
  });
});

beforeEach(async () => environment.clearFirestore());
afterAll(async () => environment.cleanup());

const profile = (uid: string) => ({
  schemaVersion: 1,
  uid,
  displayName: uid,
  handle: uid,
  avatarUrl: null,
  defaultTargetScore: 1000,
  colorMode: 'system',
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now(),
});

const seats = [0, 1, 2, 3].map((index) => ({
  index,
  team: index % 2,
  displayName: index === 0 ? 'Host' : `Guest ${index}`,
  userId: index === 0 ? 'host' : null,
  linkStatus: index === 0 ? 'accepted' : 'guest',
  linkSource: index === 0 ? 'host' : 'guest',
}));

const game = (overrides: Record<string, unknown> = {}) => {
  const now = Timestamp.now();
  return {
    schemaVersion: 1,
    storage: 'cloud',
    hostUid: 'host',
    status: 'lobby',
    teamNames: ['Dragon', 'Phoenix'],
    targetScore: 1000,
    seats,
    memberUids: ['host'],
    acceptedUids: ['host'],
    nextRoundNumber: 1,
    joinCode: 'ABC234',
    createdAt: now,
    updatedAt: now,
    startedAt: null,
    completedAt: null,
    summary: null,
    ...overrides,
  };
};

const draft = (overrides: Record<string, unknown> = {}) => ({
  basePointsTeamB: 50,
  doubleTeam: null,
  bets: [null, null, null, null],
  startedAt: Timestamp.now(),
  ...overrides,
});

describe('Firestore security rules', () => {
  it('requires authentication and profile ownership', async () => {
    const alice = environment.authenticatedContext('alice').firestore();
    const bob = environment.authenticatedContext('bob').firestore();
    const anonymous = environment.unauthenticatedContext().firestore();
    await assertSucceeds(setDoc(doc(alice, 'profiles', 'alice'), profile('alice')));
    await assertSucceeds(getDoc(doc(bob, 'profiles', 'alice')));
    await assertFails(updateDoc(doc(bob, 'profiles', 'alice'), { displayName: 'Impostor' }));
    await assertFails(getDoc(doc(anonymous, 'profiles', 'alice')));
  });

  it('keeps games private to their members', async () => {
    const host = environment.authenticatedContext('host').firestore();
    const outsider = environment.authenticatedContext('outsider').firestore();
    await assertSucceeds(setDoc(doc(host, 'games', 'game'), game()));
    await assertSucceeds(getDoc(doc(host, 'games', 'game')));
    await assertFails(getDoc(doc(outsider, 'games', 'game')));
  });

  it('allows accepted participants to edit valid active drafts only', async () => {
    const participant = environment.authenticatedContext('alice').firestore();
    const outsider = environment.authenticatedContext('outsider').firestore();
    await environment.withSecurityRulesDisabled(async (context) => {
      await setDoc(
        doc(context.firestore(), 'games', 'game'),
        game({
          status: 'active',
          memberUids: ['host', 'alice'],
          acceptedUids: ['host', 'alice'],
          seats: seats.map((seat, index) =>
            index === 2
              ? { ...seat, displayName: 'Alice', userId: 'alice', linkStatus: 'accepted', linkSource: 'friend' }
              : seat,
          ),
        }),
      );
      await setDoc(doc(context.firestore(), 'games', 'game', 'draft', 'current'), draft());
    });

    await assertSucceeds(
      updateDoc(doc(participant, 'games', 'game', 'draft', 'current'), draft({ basePointsTeamB: 75 })),
    );
    await assertFails(updateDoc(doc(participant, 'games', 'game', 'draft', 'current'), draft({ basePointsTeamB: 76 })));
    await assertFails(updateDoc(doc(outsider, 'games', 'game', 'draft', 'current'), draft({ basePointsTeamB: 25 })));
  });

  it('keeps lifecycle changes host-only', async () => {
    const host = environment.authenticatedContext('host').firestore();
    const participant = environment.authenticatedContext('alice').firestore();
    await environment.withSecurityRulesDisabled(async (context) => {
      await setDoc(
        doc(context.firestore(), 'games', 'game'),
        game({ memberUids: ['host', 'alice'], acceptedUids: ['host', 'alice'] }),
      );
    });

    await assertFails(
      updateDoc(doc(participant, 'games', 'game'), { status: 'active', joinCode: null, startedAt: Timestamp.now() }),
    );
    await assertSucceeds(
      updateDoc(doc(host, 'games', 'game'), { status: 'active', joinCode: null, startedAt: Timestamp.now() }),
    );
  });

  it('locks completed rounds until the host reopens the game', async () => {
    const host = environment.authenticatedContext('host').firestore();
    await environment.withSecurityRulesDisabled(async (context) => {
      await setDoc(
        doc(context.firestore(), 'games', 'game'),
        game({ status: 'completed', completedAt: Timestamp.now(), summary: { finalPoints: [1000, 850] } }),
      );
      await setDoc(doc(context.firestore(), 'games', 'game', 'rounds', 'round-1'), {
        id: 'round-1',
        number: 1,
        ...draft({ basePointsTeamB: 100 }),
        endedAt: Timestamp.now(),
        createdBy: 'host',
      });
    });

    await assertFails(updateDoc(doc(host, 'games', 'game', 'rounds', 'round-1'), { basePointsTeamB: 50 }));
    await assertFails(deleteDoc(doc(host, 'games', 'game', 'rounds', 'round-1')));
    await assertSucceeds(updateDoc(doc(host, 'games', 'game'), { status: 'active', completedAt: null, summary: null }));
    await assertSucceeds(updateDoc(doc(host, 'games', 'game', 'rounds', 'round-1'), { basePointsTeamB: 50 }));
  });
});
