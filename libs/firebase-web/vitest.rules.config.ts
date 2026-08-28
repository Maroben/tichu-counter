import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    name: 'firestore-rules',
    environment: 'node',
    include: ['libs/firebase-web/src/**/*.rules.spec.ts'],
    fileParallelism: false,
  },
});
