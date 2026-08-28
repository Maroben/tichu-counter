import { defineConfig } from 'vitest/config';

export default defineConfig({
  root: import.meta.dirname,
  resolve: { tsconfigPaths: true },
  test: { name: 'firebase-web', environment: 'node', include: ['src/**/*.spec.ts'], exclude: ['**/*.rules.spec.ts'] },
});
