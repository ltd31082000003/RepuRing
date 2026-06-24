import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { chromium, type Page } from 'playwright';

const desktopViewport = { width: 1440, height: 1000 };

type RouteTarget = {
  name: string;
  path: string;
};

const routes: RouteTarget[] = [
  { name: 'overview', path: '/repuring' },
  { name: 'circles', path: '/repuring/circles' },
  { name: 'community', path: '/repuring/community' },
  { name: 'post-work', path: '/repuring/contributions' },
  { name: 'review-work', path: '/repuring/endorse' },
  { name: 'leaderboard', path: '/repuring/leaderboard' },
  { name: 'admin', path: '/repuring/admin' },
  { name: 'my-account', path: '/key-management' },
];

const outputDir = path.resolve(process.cwd(), 'ui-screenshots');

function argValue(name: string): string | undefined {
  const prefix = `${name}=`;
  const inline = process.argv.find((arg) => arg.startsWith(prefix));
  if (inline) return inline.slice(prefix.length);

  const index = process.argv.indexOf(name);
  if (index >= 0) return process.argv[index + 1];

  return undefined;
}

function baseUrl(): string {
  return (
    argValue('--url') ||
    process.env.UI_AUDIT_URL ||
    process.env.VITE_DEV_SERVER_URL ||
    'http://localhost:5173'
  ).replace(/\/+$/, '');
}

function targetUrl(base: string, routePath: string): string {
  return `${base}${routePath}`;
}

async function waitForApp(page: Page) {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => undefined);
  await page.locator('body').waitFor({ state: 'visible', timeout: 15_000 });
  await page.waitForTimeout(750);
}

async function auditDesktop(base: string) {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: desktopViewport,
    deviceScaleFactor: 1,
    isMobile: false,
    hasTouch: false,
  });
  const page = await context.newPage();

  try {
    for (const route of routes) {
      const url = targetUrl(base, route.path);
      const filePath = path.join(outputDir, `desktop-${route.name}.png`);

      console.log(`[ui-audit] desktop ${route.path} -> ${filePath}`);
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45_000 });
      await waitForApp(page);
      await page.screenshot({ path: filePath, fullPage: true });
    }
  } finally {
    await context.close();
    await browser.close();
  }
}

async function main() {
  const base = baseUrl();
  await mkdir(outputDir, { recursive: true });
  await auditDesktop(base);
  console.log(`[ui-audit] Saved screenshots to ${outputDir}`);
}

main().catch((error) => {
  console.error('[ui-audit] Failed:', error);
  process.exitCode = 1;
});
