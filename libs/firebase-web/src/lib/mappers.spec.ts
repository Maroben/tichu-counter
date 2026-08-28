import { describe, expect, it } from 'vitest';
import { createGame, type SeatTuple } from '@tichu/domain';
import { draftFromDocument, draftToDocument, gameFromDocument, gameToDocument } from './mappers';

describe('Firestore mappers', () => {
  it('round-trips a schema-versioned game and draft', () => {
    const source = createGame({ id: 'game', storage: 'cloud', hostUid: 'host', hostName: 'Host', now: 100 });
    const draft = draftFromDocument(draftToDocument(source.draft));
    const result = gameFromDocument(source.id, gameToDocument(source), draft, []);
    expect(result).toEqual(source);
  });

  it('rejects duplicated account seats at the document boundary', () => {
    const source = createGame({ id: 'game', storage: 'cloud', hostUid: 'host', hostName: 'Host', now: 100 });
    const draft = draftFromDocument(draftToDocument(source.draft));
    const seats = source.seats.map((seat, index) =>
      index === 1 || index === 2
        ? { ...seat, userId: 'alice', linkStatus: 'pending' as const, linkSource: 'handle' as const }
        : seat,
    ) as unknown as SeatTuple;
    expect(() => gameToDocument({ ...source, seats })).toThrow('A player account can only occupy one seat.');
    expect(() => gameFromDocument(source.id, { ...gameToDocument(source), seats }, draft, [])).toThrow(
      'A player account can only occupy one seat.',
    );
  });
});
