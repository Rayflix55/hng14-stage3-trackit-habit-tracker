import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // 1. Only look for tests in the E2E directory
  testDir: './src/tests/e2e',
  
  // 2. Only run files ending in .spec.ts
  testMatch: '**/*.spec.ts',

  fullyParallel: true,
  reporter: 'html',
  use: {
    // 3. Set your dev server URL
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});