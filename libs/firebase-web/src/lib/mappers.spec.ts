import { describe, expect, it } from 'vitest';
import { createGame } from '@tichu/domain';
import { draftFromDocument, draftToDocument, gameFromDocument, gameToDocument } from './mappers';

describe('Firestore mappers', () => {
  it('round-trips a schema-versioned game and draft', () => {
    const source = createGame({ id: 'game', storage: 'cloud', hostUid: 'host', hostName: 'Host', now: 100 });
    const draft = draftFromDocument(draftToDocument(source.draft));
    const result = gameFromDocument(source.id, gameToDocument(source), draft, []);
    expect(result).toEqual(source);
  });
});
