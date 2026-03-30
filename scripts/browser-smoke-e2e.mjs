import { spawn } from "node:child_process";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const BASE_URL = "http://localhost:5173/memory-game/";
const DEBUG_PORT = 9333;

const browserCandidates = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
];

const browserPath = browserCandidates.find(existsSync);

if (!browserPath) {
  throw new Error("No supported local browser found for headless smoke testing.");
}

const userDataDir = mkdtempSync(join(tmpdir(), "memory-game-e2e-"));

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitFor(fn, label, timeoutMs = 15000, intervalMs = 200) {
  const startTime = Date.now();
  let lastError = null;

  while (Date.now() - startTime < timeoutMs) {
    try {
      const result = await fn();
      if (result) {
        return result;
      }
    } catch (error) {
      lastError = error;
    }

    await sleep(intervalMs);
  }

  throw new Error(
    `${label} timed out${lastError instanceof Error ? `: ${lastError.message}` : ""}`,
  );
}

async function getJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status} for ${url}`);
  }
  return response.json();
}

function createCdpClient(webSocketUrl) {
  const ws = new WebSocket(webSocketUrl);
  const pending = new Map();
  let messageId = 0;

  const ready = new Promise((resolve, reject) => {
    ws.addEventListener("open", () => resolve());
    ws.addEventListener("error", (event) => reject(new Error(`WebSocket error: ${event.type}`)));
  });

  ws.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);

    if (!message.id) {
      return;
    }

    const callbacks = pending.get(message.id);
    if (!callbacks) {
      return;
    }

    pending.delete(message.id);

    if (message.error) {
      callbacks.reject(new Error(message.error.message));
      return;
    }

    callbacks.resolve(message.result);
  });

  return {
    ready,
    async send(method, params = {}) {
      await ready;

      return new Promise((resolve, reject) => {
        const id = ++messageId;
        pending.set(id, { resolve, reject });
        ws.send(JSON.stringify({ id, method, params }));
      });
    },
    close() {
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close();
      }
    },
  };
}

async function main() {
  const browser = spawn(
    browserPath,
    [
      "--headless=new",
      "--disable-gpu",
      `--remote-debugging-port=${DEBUG_PORT}`,
      `--user-data-dir=${userDataDir}`,
      "--no-first-run",
      "--no-default-browser-check",
      "about:blank",
    ],
    {
      stdio: "ignore",
    },
  );

  let cdp = null;

  const cleanup = () => {
    try {
      cdp?.close();
    } catch {
      // ignore cleanup errors
    }

    try {
      browser.kill();
    } catch {
      // ignore cleanup errors
    }

    try {
      rmSync(userDataDir, { recursive: true, force: true });
    } catch {
      // ignore cleanup errors
    }
  };

  try {
    const target = await waitFor(async () => {
      const targets = await getJson(`http://127.0.0.1:${DEBUG_PORT}/json/list`);
      return targets.find((entry) => entry.type === "page" && entry.webSocketDebuggerUrl);
    }, "Chrome DevTools target");

    cdp = createCdpClient(target.webSocketDebuggerUrl);

    await cdp.send("Page.enable");
    await cdp.send("Runtime.enable");
    await cdp.send("Page.navigate", { url: BASE_URL });

    const evaluate = async (expression) => {
      const payload = await cdp.send("Runtime.evaluate", {
        expression,
        returnByValue: true,
        awaitPromise: true,
      });

      if (payload.exceptionDetails) {
        throw new Error(payload.exceptionDetails.text || "Runtime evaluation failed");
      }

      return payload.result.value;
    };

    await waitFor(
      () => evaluate("document.readyState === 'complete' && !!document.querySelector('form')"),
      "start page form",
    );

    const initialHeading = await evaluate(
      "document.querySelector('h1')?.textContent?.trim()?.toLowerCase() || ''",
    );

    await evaluate(
      "document.querySelector('form button[type=\"submit\"]')?.click(); true;",
    );

    await waitFor(
      () =>
        evaluate(
          "location.pathname.includes('/game') && document.querySelectorAll('[id^=\"game-btn-\"]').length === 16",
        ),
      "game board route",
    );

    const boardCardCount = await evaluate(
      "document.querySelectorAll('[id^=\"game-btn-\"]').length",
    );

    await evaluate(
      "(() => { const cards = [...document.querySelectorAll('[id^=\"game-btn-\"]')]; cards[0]?.click(); cards[1]?.click(); return true; })()",
    );

    await waitFor(
      async () => {
        const movesValue = await evaluate(`(() => {
          const sections = [...document.querySelectorAll('footer > div')];
          const movesSection = sections.find((section) => /Moves/.test(section.innerText));
          if (!movesSection) return null;
          const values = [...movesSection.querySelectorAll('p')].map((node) => node.textContent?.trim() || '');
          return Number(values.at(-1));
        })()`);

        return movesValue === 1;
      },
      "first move resolution",
      5000,
      250,
    );

    const movesAfterFirstTurn = await evaluate(`(() => {
      const sections = [...document.querySelectorAll('footer > div')];
      const movesSection = sections.find((section) => /Moves/.test(section.innerText));
      if (!movesSection) return null;
      const values = [...movesSection.querySelectorAll('p')].map((node) => node.textContent?.trim() || '');
      return Number(values.at(-1));
    })()`);

    await evaluate(
      "Array.from(document.querySelectorAll('button')).find((button) => button.textContent?.trim() === 'Restart')?.click(); true;",
    );

    await waitFor(
      () =>
        evaluate(`(() => {
          const sections = [...document.querySelectorAll('footer > div')];
          const movesSection = sections.find((section) => /Moves/.test(section.innerText));
          if (!movesSection) return false;
          const values = [...movesSection.querySelectorAll('p')].map((node) => node.textContent?.trim() || '');
          const moves = Number(values.at(-1));
          const pressedCount = [...document.querySelectorAll('[id^="game-btn-"]')].filter((node) => node.getAttribute('aria-pressed') === 'true').length;
          return moves === 0 && pressedCount === 0 && document.querySelectorAll('[id^="game-btn-"]').length === 16;
        })()`),
      "restart reset",
    );

    await evaluate(
      "Array.from(document.querySelectorAll('button')).find((button) => button.textContent?.trim() === 'New Game')?.click(); true;",
    );

    await waitFor(
      () =>
        evaluate(
          "!!document.querySelector('form') && !location.pathname.includes('/game') && !!document.querySelector('button[type=\"submit\"]')",
        ),
      "return to setup page",
    );

    const result = {
      browser: browserPath,
      checks: {
        startPageLoaded: initialHeading === "memory",
        boardLoadedWithSixteenCards: boardCardCount === 16,
        firstTurnIncrementedMoves: movesAfterFirstTurn === 1,
        restartResetBoardAndMoves: true,
        newGameReturnedToSetup: true,
      },
    };

    console.log(JSON.stringify(result, null, 2));
  } finally {
    cleanup();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});