import { defineConfig } from 'vitest/config';

export default defineConfig({
  root: import.meta.dirname,
  test: {
    name: 'domain',
    environment: 'node',
    include: ['src/**/*.spec.ts'],
    coverage: { reporter: ['text', 'html'] },
  },
});
