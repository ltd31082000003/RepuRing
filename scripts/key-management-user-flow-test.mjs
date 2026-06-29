import { spawn } from "node:child_process";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const WebSocket = require("../cmd/rpc/web/wallet/node_modules/ws");

const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const baseUrl = "http://127.0.0.1:5173";
const url = `${baseUrl}/key-management`;
const port = 9337;
const userDataDir = join(tmpdir(), `repuring-edge-test-${Date.now()}`);

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const waitForExit = (child) => new Promise((resolve) => {
  if (child.exitCode !== null || child.killed) return resolve();
  child.once("exit", resolve);
  setTimeout(resolve, 3000);
});

async function fetchJson(endpoint) {
  const response = await fetch(endpoint);
  if (!response.ok) throw new Error(`${endpoint} -> ${response.status}`);
  return response.json();
}

class Cdp {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.nextId = 1;
    this.pending = new Map();
    this.events = [];
    this.ws.on("message", (data) => {
      const message = JSON.parse(data.toString());
      if (message.id && this.pending.has(message.id)) {
        const { resolve, reject } = this.pending.get(message.id);
        this.pending.delete(message.id);
        if (message.error) reject(new Error(message.error.message));
        else resolve(message.result);
        return;
      }
      this.events.push(message);
    });
  }

  open() {
    return new Promise((resolve, reject) => {
      this.ws.once("open", resolve);
      this.ws.once("error", reject);
    });
  }

  send(method, params = {}) {
    const id = this.nextId++;
    this.ws.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
    });
  }

  close() {
    this.ws.close();
  }
}

async function waitForTarget() {
  const deadline = Date.now() + 10_000;
  while (Date.now() < deadline) {
    try {
      const targets = await fetchJson(`http://127.0.0.1:${port}/json`);
      const page = targets.find((target) => target.type === "page");
      if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
    } catch {
      await wait(250);
    }
  }
  throw new Error("Timed out waiting for Edge DevTools target");
}

async function evalValue(cdp, expression) {
  const result = await cdp.send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.text || "Runtime evaluation failed");
  }
  return result.result.value;
}

async function waitUntil(cdp, expression, timeoutMs = 10_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await evalValue(cdp, expression)) return true;
    await wait(250);
  }
  return false;
}

async function clickText(cdp, text) {
  return evalValue(
    cdp,
    `(() => {
      const candidates = Array.from(document.querySelectorAll('button, [role="button"], a'));
      const el = candidates.find((node) => node.textContent && node.textContent.includes(${JSON.stringify(text)}));
      if (!el) return false;
      el.click();
      return true;
    })()`,
  );
}

async function clickTextWithin(cdp, rootSelector, text) {
  return evalValue(
    cdp,
    `(() => {
      const root = document.querySelector(${JSON.stringify(rootSelector)});
      if (!root) return false;
      const candidates = Array.from(root.querySelectorAll('button, [role="button"], a'));
      const el = candidates.find((node) => node.textContent && node.textContent.includes(${JSON.stringify(text)}));
      if (!el) return false;
      el.click();
      return true;
    })()`,
  );
}

async function typeInto(cdp, selector, value) {
  return evalValue(
    cdp,
    `(() => {
      const el = document.querySelector(${JSON.stringify(selector)});
      if (!el) return false;
      el.focus();
      const setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el), 'value')?.set;
      if (setter) setter.call(el, ${JSON.stringify(value)});
      else el.value = ${JSON.stringify(value)};
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
      return el.value === ${JSON.stringify(value)};
    })()`,
  );
}

async function navigate(cdp, targetUrl, readyExpression = `document.readyState === 'complete'`) {
  await cdp.send("Page.navigate", { url: targetUrl });
  return waitUntil(cdp, readyExpression);
}

async function main() {
  await mkdir(userDataDir, { recursive: true });
  const browser = spawn(edgePath, [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--window-size=1440,1000",
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    url,
  ], { stdio: "ignore" });

  let cdp;
  const checks = [];
  const errors = [];
  try {
    cdp = new Cdp(await waitForTarget());
    await cdp.open();
    await cdp.send("Page.enable");
    await cdp.send("Runtime.enable");
    await cdp.send("Log.enable");
    await cdp.send("Network.enable");
    await navigate(cdp, `${baseUrl}/`, `document.readyState === 'complete' && !!document.querySelector('h1')`);
    await wait(1000);

    const home = await evalValue(cdp, `({
      title: document.querySelector('h1')?.textContent?.trim() || '',
      hasSidebar: ['Overview','My Account','Community circles','Community','Post Work','Review Work','Leaderboard','Admin'].every((text) => document.body.innerText.includes(text)),
      bodyText: document.body.innerText.slice(0, 1200),
    })`);
    checks.push(["home route renders", home.title.length > 0 && home.bodyText.includes("RepuRing"), home.title]);
    checks.push(["sidebar nav items visible", home.hasSidebar, String(home.hasSidebar)]);

    for (const [label, hash] of [["Community circles", "#circles"], ["Review Work", "#endorse"], ["Leaderboard", "#leaderboard"], ["Admin", "#admin"]]) {
      checks.push([`click sidebar ${label}`, await clickText(cdp, label), ""]);
      await wait(500);
      const hashState = await evalValue(cdp, `({ hash: location.hash, hasTarget: !!document.querySelector(${JSON.stringify(hash)}) })`);
      checks.push([`${label} anchor updates hash`, hashState.hash === hash, JSON.stringify(hashState)]);
    }

    checks.push(["collapse sidebar button works", await clickText(cdp, "Collapse"), ""]);
    await wait(500);
    const collapsed = await evalValue(cdp, `!Array.from(document.querySelectorAll('aside nav span')).some((span) => span.textContent?.trim() === 'Community circles')`);
    checks.push(["sidebar collapsed hides labels", collapsed, String(collapsed)]);

    await navigate(cdp, url, `document.readyState === 'complete' && !!document.querySelector('h1')`);
    await wait(1000);
    const initial = await evalValue(cdp, `({
      title: document.querySelector('h1')?.textContent?.trim() || '',
      hasImport: document.body.innerText.includes('Import Wallet'),
      hasCreate: document.body.innerText.includes('Create New Key'),
      hasSecurityWarning: document.body.innerText.includes('Security Warning'),
      bodyText: document.body.innerText.slice(0, 800),
    })`);
    checks.push(["initial render title", initial.title === "Key Management", initial.title]);
    checks.push(["import action visible", initial.hasImport, String(initial.hasImport)]);
    checks.push(["create action visible", initial.hasCreate, String(initial.hasCreate)]);
    checks.push(["security warning visible", initial.hasSecurityWarning, String(initial.hasSecurityWarning)]);

    checks.push(["empty keystore download shows user-facing error", await clickText(cdp, "Download Full Keystore"), ""]);
    await wait(700);
    const noKeysToast = await evalValue(cdp, `document.body.innerText.includes('No keys available') && document.body.innerText.includes('Keystore data has not loaded yet')`);
    checks.push(["no-keystore toast visible", noKeysToast, String(noKeysToast)]);

    checks.push(["click Import Wallet", await clickText(cdp, "Import Wallet"), ""]);
    await wait(500);
    const importModal = await evalValue(cdp, `({
      dialog: document.querySelector('[role="dialog"]')?.innerText || '',
      hasPrivateKeyTab: document.body.innerText.includes('Private Key'),
      hasKeystoreTab: document.body.innerText.includes('Keystore'),
    })`);
    checks.push(["import modal opens", importModal.dialog.includes("Import Wallet"), importModal.dialog.slice(0, 120)]);
    checks.push(["import private key tab visible", importModal.hasPrivateKeyTab, String(importModal.hasPrivateKeyTab)]);
    checks.push(["import keystore tab visible", importModal.hasKeystoreTab, String(importModal.hasKeystoreTab)]);

    checks.push(["click Keystore tab", await clickTextWithin(cdp, '[role="dialog"]', "Keystore"), ""]);
    await wait(300);
    const keystoreTab = await evalValue(cdp, `document.querySelector('[role="dialog"]')?.innerText || ''`);
    checks.push(["keystore upload state visible", /Upload|encrypted JSON|keystore file/i.test(keystoreTab), keystoreTab.slice(0, 160)]);

    await cdp.send("Input.dispatchKeyEvent", { type: "keyDown", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27 });
    await cdp.send("Input.dispatchKeyEvent", { type: "keyUp", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27 });
    await wait(500);
    checks.push(["import modal closes with Escape", await evalValue(cdp, `!document.querySelector('[role="dialog"]')`), ""]);

    checks.push(["click Create New Key", await clickText(cdp, "Create New Key"), ""]);
    await wait(500);
    const createModal = await evalValue(cdp, `document.querySelector('[role="dialog"]')?.innerText || ''`);
    checks.push(["create modal opens", createModal.includes("Create New Key"), createModal.slice(0, 120)]);

    const passwordTyped = await typeInto(cdp, '[role="dialog"] input[type="password"]', "TestPassword123!");
    const nicknameTyped = await typeInto(cdp, '[role="dialog"] input:not([type]), [role="dialog"] input[type="text"]', "QA Test Wallet");
    checks.push(["password field accepts typing", passwordTyped, ""]);
    checks.push(["nickname/text field accepts typing", nicknameTyped, ""]);

    await cdp.send("Emulation.setDeviceMetricsOverride", {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await navigate(cdp, url, `document.readyState === 'complete' && !!document.querySelector('h1')`);
    await wait(800);
    checks.push(["mobile menu button opens", await evalValue(cdp, `(() => {
      const button = document.querySelector('button[aria-label="Open menu"]');
      if (!button) return false;
      button.click();
      return true;
    })()`), ""]);
    await wait(500);
    const mobileDrawer = await evalValue(cdp, `document.body.innerText.includes('Leaderboard') && document.body.innerText.includes('My Account')`);
    checks.push(["mobile drawer nav visible", mobileDrawer, String(mobileDrawer)]);

    const screenshot = await cdp.send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
    await writeFile("key-management-user-flow.png", Buffer.from(screenshot.data, "base64"));

    for (const event of cdp.events) {
      if (event.method === "Runtime.exceptionThrown") errors.push(event.params.exceptionDetails.text);
      if (event.method === "Log.entryAdded" && ["error", "warning"].includes(event.params.entry.level)) {
        errors.push(`${event.params.entry.level}: ${event.params.entry.text}`);
      }
      if (event.method === "Network.loadingFailed") errors.push(`network failed: ${event.params.errorText}`);
    }
  } finally {
    cdp?.close();
    browser.kill();
    await waitForExit(browser);
    await wait(500);
    await rm(userDataDir, { recursive: true, force: true }).catch(() => {});
  }

  const failed = checks.filter(([, ok]) => !ok);
  console.log(JSON.stringify({ url, checks, errors, failed }, null, 2));
  if (failed.length) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
