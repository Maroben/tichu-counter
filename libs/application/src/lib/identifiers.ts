export const normalizeHandle = (value: string): string => value.trim().toLowerCase();

export const validateHandle = (value: string): string | null => {
  const normalized = normalizeHandle(value);
  if (!/^[a-z0-9_]{3,20}$/.test(normalized)) return 'Use 3–20 lowercase letters, numbers, or underscores.';
  return null;
};

export const friendshipId = (uidA: string, uidB: string): string => [uidA, uidB].sort().join('_');

const JOIN_CODE_ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

export const createJoinCode = (random: () => number = Math.random): string =>
  Array.from({ length: 6 }, () => JOIN_CODE_ALPHABET[Math.floor(random() * JOIN_CODE_ALPHABET.length)]).join('');
