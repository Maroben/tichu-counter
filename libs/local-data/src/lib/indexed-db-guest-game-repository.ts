import type { GuestGameRepository, LocalSettings, LocalSettingsRepository } from '@tichu/application';
import { SCHEMA_VERSION, type Game } from '@tichu/domain';
import { openDB, type IDBPDatabase } from 'idb';

const DATABASE = 'tichu-counter-v1';
const STORE = 'guest-state';
const ACTIVE_GAME = 'active-game';
const SETTINGS = 'settings';
const DEFAULT_SETTINGS: LocalSettings = { defaultTargetScore: 1000, colorMode: 'system' };

export class IndexedDbGuestGameRepository implements GuestGameRepository {
  private readonly database: Promise<IDBPDatabase>;

  constructor() {
    this.database = openDB(DATABASE, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
      },
    });
  }

  async load(): Promise<Game | null> {
    const value = (await (await this.database).get(STORE, ACTIVE_GAME)) as Game | undefined;
    return value?.schemaVersion === SCHEMA_VERSION ? value : null;
  }

  async save(game: Game): Promise<void> {
    await (await this.database).put(STORE, structuredClone(game), ACTIVE_GAME);
  }

  async clear(): Promise<void> {
    await (await this.database).delete(STORE, ACTIVE_GAME);
  }
}

export class IndexedDbLocalSettingsRepository implements LocalSettingsRepository {
  private readonly database = openDB(DATABASE, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
    },
  });

  async load(): Promise<LocalSettings> {
    return ((await (await this.database).get(STORE, SETTINGS)) as LocalSettings | undefined) ?? DEFAULT_SETTINGS;
  }

  async save(settings: LocalSettings): Promise<void> {
    await (await this.database).put(STORE, settings, SETTINGS);
  }
}

export class MemoryGuestGameRepository implements GuestGameRepository {
  private game: Game | null = null;

  async load(): Promise<Game | null> {
    return this.game;
  }

  async save(game: Game): Promise<void> {
    this.game = structuredClone(game);
  }

  async clear(): Promise<void> {
    this.game = null;
  }
}

export class MemoryLocalSettingsRepository implements LocalSettingsRepository {
  private settings = DEFAULT_SETTINGS;
  async load(): Promise<LocalSettings> {
    return this.settings;
  }
  async save(settings: LocalSettings): Promise<void> {
    this.settings = settings;
  }
}
