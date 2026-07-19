const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");
const fs = require("node:fs");
const http = require("node:http");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const PROJECT_ROOT = path.resolve(__dirname, "..");
const CHROME_CANDIDATES = [
  process.env.CHROME_BIN,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].filter(Boolean);

function findChrome() {
  return CHROME_CANDIDATES.find((candidate) => fs.existsSync(candidate)) || "";
}

function startStaticServer() {
  const mimeTypes = {
    ".css": "text/css; charset=utf-8",
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".svg": "image/svg+xml",
  };

  const server = http.createServer((request, response) => {
    const requestUrl = new URL(request.url, "http://127.0.0.1");
    const relativePath = decodeURIComponent(requestUrl.pathname === "/" ? "/index.html" : requestUrl.pathname);
    const filePath = path.resolve(PROJECT_ROOT, `.${relativePath}`);
    if (!filePath.startsWith(`${PROJECT_ROOT}${path.sep}`)) {
      response.writeHead(403).end();
      return;
    }
    fs.stat(filePath, (error, stat) => {
      if (error || !stat.isFile()) {
        response.writeHead(404).end();
        return;
      }
      response.writeHead(200, {
        "cache-control": "no-store",
        "content-type": mimeTypes[path.extname(filePath)] || "application/octet-stream",
      });
      fs.createReadStream(filePath).pipe(response);
    });
  });

  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => resolve(server));
  });
}

function waitForChromeWebSocket(chrome) {
  return new Promise((resolve, reject) => {
    let output = "";
    const timer = setTimeout(() => reject(new Error(`Chrome did not expose DevTools. ${output}`)), 10000);
    chrome.stderr.on("data", (chunk) => {
      output += chunk.toString();
      const match = output.match(/DevTools listening on (ws:\/\/[^\s]+)/);
      if (!match) return;
      clearTimeout(timer);
      resolve(match[1]);
    });
    chrome.once("exit", (code) => {
      clearTimeout(timer);
      reject(new Error(`Chrome exited before DevTools was ready (${code}). ${output}`));
    });
  });
}

function connectCdp(webSocketUrl) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(webSocketUrl);
    const pending = new Map();
    let nextId = 0;

    socket.addEventListener("error", reject, { once: true });
    socket.addEventListener("open", () => {
      socket.addEventListener("message", (event) => {
        const message = JSON.parse(event.data);
        if (!message.id || !pending.has(message.id)) return;
        const { resolve: resolveCall, reject: rejectCall } = pending.get(message.id);
        pending.delete(message.id);
        if (message.error) rejectCall(new Error(message.error.message));
        else resolveCall(message.result);
      });
      resolve({
        close: () => socket.close(),
        send(method, params = {}) {
          const id = ++nextId;
          socket.send(JSON.stringify({ id, method, params }));
          return new Promise((resolveCall, rejectCall) => {
            pending.set(id, { resolve: resolveCall, reject: rejectCall });
          });
        },
      });
    }, { once: true });
  });
}

async function waitForPage(cdp) {
  const deadline = Date.now() + 10000;
  while (Date.now() < deadline) {
    const result = await cdp.send("Runtime.evaluate", {
      expression: "document.readyState === 'complete' && Boolean(window.IvriQuestApp?.runtime?.helpers?.renderAll)",
      returnByValue: true,
    });
    if (result.result.value) return;
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  throw new Error("The app did not finish starting in Chrome.");
}

async function evaluate(cdp, expression) {
  const result = await cdp.send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
  }
  return result.result.value;
}

const GAMEPLAY_GEOMETRY = `(() => {
  const body = document.querySelector('.shell-body');
  const choices = document.querySelector('.lesson-shell:not(.hidden) .choices');
  const footer = document.querySelector('.lesson-shell:not(.hidden) .lesson-footer');
  const rect = (element) => element ? ({
    top: element.getBoundingClientRect().top,
    bottom: element.getBoundingClientRect().bottom,
    height: element.getBoundingClientRect().height,
  }) : null;
  return {
    body: { clientHeight: body.clientHeight, scrollHeight: body.scrollHeight },
    choices: rect(choices),
    footer: rect(footer),
  };
})()`;

function assertNoGameplayScroll(geometry, label) {
  assert.ok(
    geometry.body.scrollHeight <= geometry.body.clientHeight + 1,
    `${label} scrolls (${geometry.body.scrollHeight}px > ${geometry.body.clientHeight}px)`,
  );
}

function assertChoicesClearFooter(geometry, label) {
  assert.ok(geometry.choices && geometry.footer, `${label} must render choices and a footer`);
  assert.ok(
    geometry.choices.bottom <= geometry.footer.top + 0.5,
    `${label} choices overlap the footer`,
  );
}

test("compact gameplay and safe centering hold in rendered Chrome", { timeout: 30000 }, async (t) => {
  const chromePath = findChrome();
  if (!chromePath) {
    t.skip("Chrome is not installed on this machine");
    return;
  }

  const server = await startStaticServer();
  const address = server.address();
  const appUrl = `http://127.0.0.1:${address.port}/`;
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), "ivriquest-layout-"));
  const chrome = spawn(chromePath, [
    "--headless=new",
    "--disable-background-networking",
    "--disable-default-apps",
    "--disable-extensions",
    "--disable-gpu",
    "--no-default-browser-check",
    "--no-first-run",
    "--remote-debugging-port=0",
    `--user-data-dir=${userDataDir}`,
    "about:blank",
  ], { stdio: ["ignore", "ignore", "pipe"] });

  let browserCdp;
  let pageCdp;
  try {
    const browserWebSocketUrl = await waitForChromeWebSocket(chrome);
    browserCdp = await connectCdp(browserWebSocketUrl);
    const { targetId } = await browserCdp.send("Target.createTarget", { url: "about:blank" });
    const targetsEndpoint = new URL(browserWebSocketUrl);
    const targets = await fetch(`http://${targetsEndpoint.host}/json/list`).then((response) => response.json());
    const pageTarget = targets.find((target) => target.id === targetId);
    assert.ok(pageTarget?.webSocketDebuggerUrl, "Chrome page target must expose a debugger URL");
    pageCdp = await connectCdp(pageTarget.webSocketDebuggerUrl);
    await pageCdp.send("Page.enable");
    await pageCdp.send("Runtime.enable");
    await pageCdp.send("Emulation.setDeviceMetricsOverride", {
      width: 360,
      height: 640,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await pageCdp.send("Page.navigate", { url: appUrl });
    await waitForPage(pageCdp);
    await evaluate(pageCdp, "document.fonts.ready");
    await evaluate(pageCdp, "document.querySelector('#welcomeModalCloseBtn')?.click()");

    await evaluate(pageCdp, `(() => {
      IvriQuestApp.runtime.state.language = 'he';
      IvriQuestApp.i18n.applyLanguage();
      IvriQuestApp.binyanBoard.startBinyanBoard();
      IvriQuestApp.binyanBoard.beginBinyanBoardFromIntro();
    })()`);
    const boardGeometry = await evaluate(pageCdp, GAMEPLAY_GEOMETRY);
    assertNoGameplayScroll(boardGeometry, "Binyanim board");
    const compactRootTiles = await evaluate(pageCdp, `(() => {
      const tiles = [...document.querySelectorAll('.binyan-root-tile')];
      const gridStyles = getComputedStyle(document.querySelector('.binyan-board-grid'));
      return {
        arrowContent: getComputedStyle(tiles[0], '::after').content,
        gridAutoRows: gridStyles.gridAutoRows,
        gridAlignSelf: gridStyles.alignSelf,
      };
    })()`);
    assert.ok(["none", "normal", '""'].includes(compactRootTiles.arrowContent));
    assert.equal(compactRootTiles.gridAutoRows, "max-content");
    assert.equal(compactRootTiles.gridAlignSelf, "center");

    await evaluate(pageCdp, `(() => {
      const board = IvriQuestApp.runtime.state.binyanBoard;
      IvriQuestApp.binyanBoard.openRoot(board.deck[0].id);
    })()`);
    const questionGeometry = await evaluate(pageCdp, GAMEPLAY_GEOMETRY);
    assertNoGameplayScroll(questionGeometry, "Binyanim question");
    assertChoicesClearFooter(questionGeometry, "Binyanim question");
    const promptSymmetry = await evaluate(pageCdp, `(() => {
      const center = (element) => {
        const box = element.getBoundingClientRect();
        return {
          x: (box.left + box.right) / 2,
          y: (box.top + box.bottom) / 2,
        };
      };
      const card = document.querySelector('.prompt-card.mode-binyan-board');
      return {
        cardCenter: center(card),
        formCenter: center(document.querySelector('#promptText')),
        formationCenter: center(document.querySelector('#promptLabel')),
        emojiCenter: center(document.querySelector('#promptRootEmoji')),
      };
    })()`);
    assert.ok(Math.abs(promptSymmetry.cardCenter.x - promptSymmetry.formCenter.x) <= 0.5);
    assert.ok(Math.abs(
      (promptSymmetry.formCenter.x - promptSymmetry.formationCenter.x)
      - (promptSymmetry.emojiCenter.x - promptSymmetry.formCenter.x)
    ) <= 0.5);
    assert.ok(Math.abs(promptSymmetry.formCenter.y - promptSymmetry.formationCenter.y) <= 0.5);
    assert.ok(Math.abs(promptSymmetry.formCenter.y - promptSymmetry.emojiCenter.y) <= 0.5);

    await evaluate(pageCdp, `(() => {
      const question = IvriQuestApp.runtime.state.binyanBoard.currentQuestion;
      question.selectedOptionId = question.options.find((option) => !option.isCorrect).id;
      IvriQuestApp.binyanBoard.applyBinyanBoardAnswer();
    })()`);
    const feedbackGeometry = await evaluate(pageCdp, GAMEPLAY_GEOMETRY);
    assertNoGameplayScroll(feedbackGeometry, "Binyanim feedback");
    assertChoicesClearFooter(feedbackGeometry, "Binyanim feedback");

    await evaluate(pageCdp, `(() => {
      IvriQuestApp.handwriting.startHandwriting();
      IvriQuestApp.handwriting.beginHandwritingFromIntro();
    })()`);
    const handwritingInitial = await evaluate(pageCdp, `(() => {
      const body = document.querySelector('.shell-body');
      const canvasBox = document.querySelector('.handwriting-canvas').getBoundingClientRect();
      const buttons = [...document.querySelectorAll('.handwriting-tool-btn')].map((button) => {
        const box = button.getBoundingClientRect();
        return { top: box.top, height: box.height };
      });
      return {
        body: { clientHeight: body.clientHeight, scrollHeight: body.scrollHeight },
        canvas: { width: canvasBox.width, height: canvasBox.height },
        buttons,
      };
    })()`);
    assertNoGameplayScroll(handwritingInitial, "Handwriting");
    assert.equal(handwritingInitial.buttons.length, 4);
    assert.ok(handwritingInitial.buttons.every((button) => button.height >= 44));
    assert.ok(Math.max(...handwritingInitial.buttons.map((button) => button.top))
      - Math.min(...handwritingInitial.buttons.map((button) => button.top)) <= 0.5);

    await evaluate(pageCdp, `(() => {
      const handwriting = IvriQuestApp.runtime.state.handwriting;
      handwriting.currentStrokes = [[{ x: 0.05, y: 0.05 }, { x: 0.08, y: 0.08 }]];
      IvriQuestApp.handwriting.checkHandwritingAttempt();
    })()`);
    const handwritingFeedback = await evaluate(pageCdp, GAMEPLAY_GEOMETRY);
    assertNoGameplayScroll(handwritingFeedback, "Handwriting feedback");
    const handwritingFeedbackCanvas = await evaluate(pageCdp, `(() => {
      const box = document.querySelector('.handwriting-canvas').getBoundingClientRect();
      return {
        width: box.width,
        height: box.height,
        feedbackVisible: !document.querySelector('.feedback-tray').classList.contains('hidden'),
      };
    })()`);
    assert.equal(handwritingFeedbackCanvas.feedbackVisible, true);
    assert.ok(Math.abs(handwritingFeedbackCanvas.width - handwritingInitial.canvas.width) <= 0.5);
    assert.ok(Math.abs(handwritingFeedbackCanvas.height - handwritingInitial.canvas.height) <= 0.5);

    await evaluate(pageCdp, `(() => {
      IvriQuestApp.session.showSessionSummary({
        game: 'handwriting',
        correctCount: 6,
        incorrectCount: 3,
        elapsedSeconds: 42,
        mistakes: [
          { primary: 'כ', secondary: 'kaf' },
          { primary: 'ה', secondary: 'he' },
          { primary: 'ר', secondary: 'resh' },
        ],
        corrects: [
          { primary: 'ל', secondary: 'lamed' },
          { primary: 'ק', secondary: 'qof' },
          { primary: 'מ', secondary: 'mem' },
          { primary: 'נ', secondary: 'nun' },
          { primary: 'ס', secondary: 'samekh' },
          { primary: 'ע', secondary: 'ayin' },
        ],
      });
    })()`);
    const handwritingResultsGrid = await evaluate(pageCdp, `(() => {
      const grid = document.querySelector('.results-mistakes--letter-grid');
      const style = getComputedStyle(grid);
      const rows = [...grid.querySelectorAll('.compact-row')];
      const headings = [...grid.querySelectorAll('.results-section-title')];
      return {
        columns: style.gridTemplateColumns.split(' ').filter(Boolean).length,
        overflowsHorizontally: grid.scrollWidth > grid.clientWidth + 1,
        minimumRowWidth: Math.min(...rows.map((row) => row.getBoundingClientRect().width)),
        headingsSpanGrid: headings.every((heading) => {
          const headingStyle = getComputedStyle(heading);
          return headingStyle.gridColumnStart === '1' && headingStyle.gridColumnEnd === '-1';
        }),
      };
    })()`);
    assert.equal(handwritingResultsGrid.columns, 3);
    assert.equal(handwritingResultsGrid.overflowsHorizontally, false);
    assert.ok(handwritingResultsGrid.minimumRowWidth >= 85);
    assert.equal(handwritingResultsGrid.headingsSpanGrid, true);

    await pageCdp.send("Emulation.setDeviceMetricsOverride", {
      width: 1366,
      height: 768,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await evaluate(pageCdp, `(() => {
      IvriQuestApp.binyanBoard.startBinyanBoard();
      IvriQuestApp.binyanBoard.beginBinyanBoardFromIntro();
      const board = IvriQuestApp.runtime.state.binyanBoard;
      IvriQuestApp.binyanBoard.openRoot(board.deck[0].id);
    })()`);
    const gameplayCentering = await evaluate(pageCdp, `(() => {
      const body = document.querySelector('.shell-body').getBoundingClientRect();
      const stage = document.querySelector('#homeLessonStage').getBoundingClientRect();
      return { bodyMid: (body.top + body.bottom) / 2, stageMid: (stage.top + stage.bottom) / 2 };
    })()`);
    assert.ok(Math.abs(gameplayCentering.bodyMid - gameplayCentering.stageMid) <= 1);

    await pageCdp.send("Emulation.setDeviceMetricsOverride", {
      width: 1366,
      height: 1000,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await evaluate(pageCdp, "IvriQuestApp.session.endSessionAndNavigate('settings')");
    const settingsCentering = await evaluate(pageCdp, `(() => {
      const body = document.querySelector('.shell-body').getBoundingClientRect();
      const settings = document.querySelector('#settingsView').getBoundingClientRect();
      return { bodyMid: (body.top + body.bottom) / 2, settingsMid: (settings.top + settings.bottom) / 2 };
    })()`);
    assert.ok(Math.abs(settingsCentering.bodyMid - settingsCentering.settingsMid) <= 1);

    await pageCdp.send("Emulation.setDeviceMetricsOverride", {
      width: 360,
      height: 640,
      deviceScaleFactor: 1,
      mobile: false,
    });
    const compactSettings = await evaluate(pageCdp, `(() => {
      const body = document.querySelector('.shell-body');
      const bodyRect = body.getBoundingClientRect();
      const settingsRect = document.querySelector('#settingsView').getBoundingClientRect();
      return {
        scrollable: body.scrollHeight > body.clientHeight,
        topIsReachable: settingsRect.top >= bodyRect.top - 1,
      };
    })()`);
    assert.deepEqual(compactSettings, { scrollable: true, topIsReachable: true });
  } finally {
    pageCdp?.close();
    browserCdp?.close();
    chrome.kill("SIGTERM");
    await new Promise((resolve) => server.close(resolve));
    fs.rmSync(userDataDir, { recursive: true, force: true });
  }
});
