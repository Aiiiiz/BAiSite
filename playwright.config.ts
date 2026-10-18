import { defineConfig } from '@playwright/test';
import { existsSync } from 'node:fs';
const systemChrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || (process.platform === 'win32' && existsSync(systemChrome) ? systemChrome : undefined);

export default defineConfig({
  testDir: './test/browser',
  outputDir: '.qa/test-results',
  workers: 1,
  fullyParallel: false,
  reporter: [['list']],
  timeout: 30000,
  use: {
    baseURL: 'http://127.0.0.1:4321',
    browserName: 'chromium',
    launchOptions: { executablePath },
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run dev -- --port 4321',
    url: 'http://127.0.0.1:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 60000,
  },
});
