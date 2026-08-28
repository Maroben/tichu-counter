import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './src',
  use: { baseURL: 'http://127.0.0.1:4210', trace: 'on-first-retry' },
  projects: [
    { name: 'mobile-chromium', use: { ...devices['Pixel 7'] } },
    { name: 'desktop-chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'pnpm exec vite --config apps/web/vite.config.ts --host 127.0.0.1 --port 4210 --strictPort',
    url: 'http://127.0.0.1:4210',
    reuseExistingServer: !process.env.CI,
  },
});
