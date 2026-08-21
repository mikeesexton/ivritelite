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
    server.listen(0, "localhost", () => resolve(server));
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
  const shell = document.querySelector('.lesson-shell:not(.hidden)');
  const header = shell?.querySelector('.lesson-header-main');
  const prompt = shell?.querySelector('.prompt-card:not(.hidden)');
  const builder = shell?.querySelector('.sentence-builder');
  const choices = document.querySelector('.lesson-shell:not(.hidden) .choices');
  const footer = document.querySelector('.lesson-shell:not(.hidden) .lesson-footer');
  const feedback = shell?.querySelector('.feedback-tray:not(.hidden)');
  const rect = (element) => element ? ({
    top: element.getBoundingClientRect().top,
    bottom: element.getBoundingClientRect().bottom,
    height: element.getBoundingClientRect().height,
  }) : null;
  return {
    body: { clientHeight: body.clientHeight, scrollHeight: body.scrollHeight },
    shell: rect(shell),
    header: rect(header),
    prompt: rect(prompt),
    builder: rect(builder),
    choices: rect(choices),
    footer: rect(footer),
    feedback: feedback ? {
      ...rect(feedback),
      clientHeight: feedback.clientHeight,
      scrollHeight: feedback.scrollHeight,
    } : null,
    footerPosition: footer ? getComputedStyle(footer).position : "",
  };
})()`;

// The feedback tray animates in with `feedbackTrayIn 180ms` (styles.css), and a
// transformed descendant still contributes to an ancestor's scrollable overflow
// in Chrome. Measuring at t=0 therefore reports up to 6px of phantom
// scrollHeight — the animation's starting translateY. Settle first, and re-check
// fonts: the boot-time `document.fonts.ready` only settles loads pending on the
// home screen, and the Hebrew display faces used by .choice-btn load later.
async function measureGeometry(cdp) {
  await evaluate(cdp, `(async () => {
    await document.fonts.ready;
    await Promise.all(document.getAnimations().map((animation) => animation.finished.catch(() => {})));
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  })()`);
  return evaluate(cdp, GAMEPLAY_GEOMETRY);
}

function assertNoGameplayScroll(geometry, label) {
  assert.ok(
    geometry.body.scrollHeight <= geometry.body.clientHeight + 1,
    `${label} scrolls (${geometry.body.scrollHeight}px > ${geometry.body.clientHeight}px): ${JSON.stringify(geometry)}`,
  );
}

function assertChoicesClearFooter(geometry, label) {
  assert.ok(geometry.choices && geometry.footer, `${label} must render choices and a footer`);
  assert.ok(
    geometry.choices.bottom <= geometry.footer.top + 0.5,
    `${label} choices overlap the footer`,
  );
}

function assertFeedbackFooterInFlow(geometry, label) {
  assert.equal(geometry.footerPosition, "static", `${label} footer must stay in normal flow`);
  assert.ok(
    geometry.footer.top - geometry.choices.bottom >= 6,
    `${label} needs visible space between the answers and feedback controls`,
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
  const appUrl = `http://localhost:${address.port}/`;
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
    await evaluate(pageCdp, "document.querySelector('[data-character-action=\"free\"]')?.click()");
    await evaluate(pageCdp, "document.querySelector('#welcomeModalCloseBtn')?.click()");

    // The board draws 6 of 80 roots at random, and a tile is as tall as the
    // number of lines its core meaning wraps to (64 roots wrap to one line, 15
    // to two, 1 to three). A grid row takes the taller tile of its pair, so a
    // draw lands on one of five discrete board heights spaced 15.22px apart.
    // Only the tallest — a three-line row above two two-line rows — overflows,
    // which is why this scrolled on 3 of 400 sampled draws instead of never.
    //
    // Pin the draw to the tallest content the data can produce, the way the
    // Conjugation+ block below does, so every run measures the worst case
    // rather than sampling it. Wrapped line count is not knowable before
    // layout, so the proxy is formatted core-meaning length. The deck
    // assertion is load-bearing: selectBinyanRoundRoots falls back to a plain
    // random shuffle when pickWeightedSubset is absent, which would silently
    // restore the sampling this pin exists to remove.
    const boardDeck = await evaluate(pageCdp, `(() => {
      IvriQuestApp.runtime.state.language = 'he';
      IvriQuestApp.i18n.applyLanguage();

      const meaningLength = (root) => IvriQuestApp.binyanBoard
        .formatBinyanRootMeaning(root.core_meaning || '').length;
      const tallestRootIds = IvriQuestVerbGameData.ROOTS
        .filter((root) => Object.values(root.forms || {}).some((form) => form && form.exists === true))
        .sort((first, second) => (
          meaningLength(second) - meaningLength(first) || first.id.localeCompare(second.id)
        ))
        .slice(0, 6)
        .map((root) => root.id);

      const originalPickWeightedSubset = IvriQuestApp.utils.pickWeightedSubset;
      try {
        IvriQuestApp.utils.pickWeightedSubset = (items) => tallestRootIds.map(
          (id) => items.find((item) => item.word.id === id).word,
        );
        IvriQuestApp.binyanBoard.startBinyanBoard();
        IvriQuestApp.binyanBoard.beginBinyanBoardFromIntro();
      } finally {
        IvriQuestApp.utils.pickWeightedSubset = originalPickWeightedSubset;
      }

      return {
        expected: tallestRootIds,
        rendered: IvriQuestApp.runtime.state.binyanBoard.deck.map((root) => root.id),
      };
    })()`);
    assert.deepEqual(
      boardDeck.rendered,
      boardDeck.expected,
      "the Binyanim board draw must stay pinned to the tallest roots",
    );
    const boardGeometry = await measureGeometry(pageCdp);
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
    const questionGeometry = await measureGeometry(pageCdp);
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
    const feedbackGeometry = await measureGeometry(pageCdp);
    assertNoGameplayScroll(feedbackGeometry, "Binyanim feedback");
    assertChoicesClearFooter(feedbackGeometry, "Binyanim feedback");

    // Conjugation+ used to draw at random from a 22,000-entry deck, so this
    // assertion was a coin flip: it failed intermittently at 496px against a
    // 488px body while every passing run reported a flush 488, because
    // .shell-body centers content and so reports no slack whenever it fits.
    //
    // Pin the draw the way the Shema block below does — monkey-patch, start,
    // restore — so the measurement is reproducible. Math.random is stubbed
    // because buildAdvConjDeck picks a direction per entry with
    // `Math.random() < 0.5`, and the answer is deliberately wrong so the longer
    // "לא בדיוק" feedback prefix is the one measured.
    //
    // This pins the longest-*text* question, which is a proxy: rendered height
    // is driven by line count, and a shorter string can wrap to more lines. It
    // buys determinism, not a proof that the tallest case is covered. The
    // headroom rule in styles.css is what actually bounds the height.
    const advConjWorstCase = await evaluate(pageCdp, `(() => {
      const originalRandom = Math.random;
      const originalWeightedRandomWord = IvriQuestApp.utils.weightedRandomWord;
      const cost = (question) => (
        String(question?.promptText || '').length
        + String(question?.correctAnswer || '').length
        + (question?.showMeaning ? String(question?.colloquialMeaning || '').length : 0)
        + Math.max(0, ...(question?.options || []).map((option) => String(option.text || '').length))
      );
      try {
        // buildAdvConjDeck picks a direction per entry with Math.random() < 0.5.
        Math.random = () => 0;
        IvriQuestApp.utils.weightedRandomWord = (items) => items.reduce(
          (worst, item) => (cost(item.word) > cost(worst.word) ? item : worst),
          items[0],
        ).word;
        IvriQuestApp.advConj.startAdvConj();
        IvriQuestApp.advConj.beginAdvConjFromIntro();
      } finally {
        Math.random = originalRandom;
        IvriQuestApp.utils.weightedRandomWord = originalWeightedRandomWord;
      }

      const question = IvriQuestApp.runtime.state.advConj.currentQuestion;
      const wrong = question.options.find((option) => !option.isCorrect) || question.options[0];
      question.selectedOptionId = wrong.id;
      IvriQuestApp.advConj.applyAdvConjAnswer();
      return { idiomId: question.idiomId, direction: question.direction, cost: cost(question) };
    })()`);
    assert.ok(advConjWorstCase.cost > 0, "Conjugation+ worst case should resolve a question");
    const advConjFeedback = await measureGeometry(pageCdp);
    assertNoGameplayScroll(advConjFeedback, "Conjugation+ feedback");
    assertChoicesClearFooter(advConjFeedback, "Conjugation+ feedback");
    assertFeedbackFooterInFlow(advConjFeedback, "Conjugation+ feedback");

    await evaluate(pageCdp, `(() => {
      IvriQuestApp.prepositions.startPrepositions();
      IvriQuestApp.prepositions.beginPrepositionsFromIntro();
      const question = IvriQuestApp.runtime.state.prepositions.currentQuestion;
      question.selectedOptionId = question.options[0].id;
      IvriQuestApp.prepositions.applyPrepositionsAnswer();
    })()`);
    const prepositionsFeedback = await measureGeometry(pageCdp);
    assertNoGameplayScroll(prepositionsFeedback, "Prepositions feedback");
    assertChoicesClearFooter(prepositionsFeedback, "Prepositions feedback");
    assertFeedbackFooterInFlow(prepositionsFeedback, "Prepositions feedback");

    const shemaFeedback = await evaluate(pageCdp, `(() => {
      const originalWeightedRandomWord = IvriQuestApp.utils.weightedRandomWord;
      IvriQuestApp.utils.weightedRandomWord = (items) => items.reduce((longest, item) => (
        String(item.word?.sentence?.english || '').length > String(longest.word?.sentence?.english || '').length
          ? item
          : longest
      ), items[0]).word;
      IvriQuestApp.sentenceBank.startShema();
      IvriQuestApp.sentenceBank.beginSentenceBankFromIntro();
      IvriQuestApp.utils.weightedRandomWord = originalWeightedRandomWord;

      const question = IvriQuestApp.runtime.state.sentenceBank.currentQuestion;
      const usedTokenIds = new Set();
      question.slotTokenIds = question.targetTokens.map((text) => {
        const token = question.bankTokens.find((candidate) => (
          candidate.text === text && !usedTokenIds.has(candidate.id)
        ));
        usedTokenIds.add(token.id);
        return token.id;
      });
      question.placedBankTokenIds = [...question.slotTokenIds];
      IvriQuestApp.sentenceBank.applySentenceBankAnswer();

      const rows = [...document.querySelectorAll('#feedbackItems .feedback-item')];
      return {
        geometry: ${GAMEPLAY_GEOMETRY},
        result: document.querySelector('#feedbackItems .feedback-result')?.textContent || '',
        rows: rows.map((row) => ({
          label: row.querySelector('.feedback-item-label')?.textContent || '',
          dir: row.querySelector('.feedback-item-value')?.getAttribute('dir') || '',
          lang: row.querySelector('.feedback-item-value')?.getAttribute('lang') || '',
        })),
      };
    })()`);
    assertNoGameplayScroll(shemaFeedback.geometry, "Shema structured feedback");
    assertChoicesClearFooter(shemaFeedback.geometry, "Shema structured feedback");
    assertFeedbackFooterInFlow(shemaFeedback.geometry, "Shema structured feedback");
    assert.ok(shemaFeedback.geometry.prompt?.height > 0, "Shema feedback keeps the prompt visible");
    assert.ok(shemaFeedback.geometry.builder?.height > 0, "Shema feedback keeps the answer builder visible");
    assert.equal(shemaFeedback.result, "", "A correct answer leans on the green tray instead of a headline");
    assert.equal(shemaFeedback.rows.length, 2, "Shema feedback must not add a tip row");
    assert.deepEqual(
      shemaFeedback.rows.slice(0, 2),
      [
        { label: "שמעת", dir: "rtl", lang: "he" },
        { label: "משמעות", dir: "ltr", lang: "en" },
      ],
    );

    await pageCdp.send("Emulation.setDeviceMetricsOverride", {
      width: 360,
      height: 720,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await measureGeometry(pageCdp);
    const mobileFeedbackBottomSpace = await evaluate(pageCdp, `(() => {
      const tray = document.querySelector('#feedbackTray').getBoundingClientRect();
      const lastRow = document.querySelector('#feedbackItems .feedback-item:last-child').getBoundingClientRect();
      return tray.bottom - lastRow.bottom;
    })()`);
    assert.ok(
      mobileFeedbackBottomSpace >= 10,
      `wrapped feedback keeps visible space above the tray edge (${mobileFeedbackBottomSpace}px)`,
    );
    await pageCdp.send("Emulation.setDeviceMetricsOverride", {
      width: 360,
      height: 640,
      deviceScaleFactor: 1,
      mobile: false,
    });

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
    const handwritingFeedback = await measureGeometry(pageCdp);
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

    await evaluate(pageCdp, `(() => {
      IvriQuestApp.session.showSessionSummary({
        game: 'abbrMatch',
        correctCount: 17,
        incorrectCount: 3,
        elapsedSeconds: 95,
        mistakes: [{
          fields: [
            { label: 'קיצור', value: 'מפכ״ל', dir: 'rtl', lang: 'he' },
            { label: 'משמעות', value: 'Police Commissioner (Israel)', dir: 'ltr', lang: 'en' },
            { label: 'הניסוח המלא', value: 'המפקח הכללי', dir: 'rtl', lang: 'he' },
          ],
        }],
        corrects: [{
          fields: [
            { label: 'קיצור', value: 'יו״ש', dir: 'rtl', lang: 'he' },
            { label: 'משמעות', value: 'Judea & Samaria / West Bank', dir: 'ltr', lang: 'en' },
            { label: 'הניסוח המלא', value: 'יהודה ושומרון', dir: 'rtl', lang: 'he' },
          ],
        }],
      });
    })()`);
    const abbreviationResults = await evaluate(pageCdp, `(() => {
      const grid = document.querySelector('.results-mistakes--abbreviation');
      const cards = [...grid.querySelectorAll('.compact-row')];
      return {
        columns: getComputedStyle(grid).gridTemplateColumns.split(' ').filter(Boolean).length,
        overflowsHorizontally: grid.scrollWidth > grid.clientWidth + 1,
        cardWidths: cards.map((card) => card.getBoundingClientRect().width),
        gridWidth: grid.getBoundingClientRect().width,
        fieldCounts: cards.map((card) => card.querySelectorAll('.feedback-item').length),
      };
    })()`);
    assert.equal(abbreviationResults.columns, 1);
    assert.equal(abbreviationResults.overflowsHorizontally, false);
    assert.ok(abbreviationResults.cardWidths.every((width) => Math.abs(width - abbreviationResults.gridWidth) <= 0.5));
    assert.deepEqual(abbreviationResults.fieldCounts, [3, 3]);

    const missionResultsGeometry = await evaluate(pageCdp, `(() => {
      IvriQuestApp.runtime.characterState = {
        dayKey: IvriQuestApp.character.getTodayKey(),
        gender: 'm',
        dailyChoice: 'idan',
        lensCharacter: 'idan',
        screen: 'results',
        reviewOpen: false,
        mission: {
          active: false,
          completed: true,
          activities: ['lessonMatch', 'sentenceBank'],
          skippedActivities: [],
          currentIndex: 2,
          currentActivity: '',
          results: [
            { nameEn: 'Vocabulary', nameHe: 'אוצר מילים', correctCount: 20, incorrectCount: 4, elapsedSeconds: 101, mistakes: [] },
            { nameEn: 'Sentences', nameHe: 'משפטים', correctCount: 10, incorrectCount: 1, elapsedSeconds: 136, mistakes: [] },
          ],
          visible: true,
          sprite: 'mission-complete',
          dialogueKey: 'mission',
        },
      };
      Object.assign(IvriQuestApp.runtime.state.summary, {
        active: true,
        game: 'characterMission',
        correctCount: 30,
        incorrectCount: 5,
        elapsedSeconds: 237,
        mistakes: [],
      });
      IvriQuestApp.runtime.state.route = 'results';
      IvriQuestApp.runtime.helpers.renderAll();
      const box = (selector) => {
        const rect = document.querySelector(selector).getBoundingClientRect();
        return { top: rect.top, bottom: rect.bottom, height: rect.height };
      };
      return {
        head: box('.results-head'),
        summary: box('.mission-results-summary'),
        hero: box('.mission-results-hero'),
        character: box('.mission-results-character'),
        dialogue: box('.mission-results-dialogue'),
        sprite: box('.mission-results-sprite'),
        metrics: box('.mission-results-metrics'),
      };
    })()`);
    assert.ok(
      missionResultsGeometry.summary.top - missionResultsGeometry.head.bottom <= 8,
      `mission title leaves too much space before its hero: ${JSON.stringify(missionResultsGeometry)}`,
    );
    assert.ok(
      Math.abs(missionResultsGeometry.character.top - missionResultsGeometry.hero.top) <= 0.5,
      "mission character starts at the top of the completion hero",
    );

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
      const body = document.querySelector('.shell-body');
      const bodyRect = body.getBoundingClientRect();
      const settings = document.querySelector('#settingsView').getBoundingClientRect();
      return {
        bodyMid: (bodyRect.top + bodyRect.bottom) / 2,
        settingsMid: (settings.top + settings.bottom) / 2,
        fits: settings.height <= bodyRect.height,
        scrollable: body.scrollHeight > body.clientHeight,
        topIsReachable: settings.top >= bodyRect.top - 1,
      };
    })()`);
    // Settings grows as groups are added, so it is centered only while it fits.
    // Once it is taller than the shell it must behave like the compact case:
    // scrollable, with nothing clipped above the top edge.
    if (settingsCentering.fits) {
      assert.ok(Math.abs(settingsCentering.bodyMid - settingsCentering.settingsMid) <= 1);
    } else {
      assert.equal(settingsCentering.scrollable, true);
      assert.equal(settingsCentering.topIsReachable, true);
    }

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
    // SIGTERM only asks. Chrome keeps writing to its profile directory for a
    // moment after, so removing it immediately raced and threw ENOTEMPTY on
    // roughly one run in fifteen. Wait for the process to actually exit, then
    // let rmSync retry — it handles ENOTEMPTY/EBUSY when given maxRetries.
    const exited = new Promise((resolve) => chrome.once("exit", resolve));
    chrome.kill("SIGTERM");
    await Promise.race([exited, new Promise((resolve) => setTimeout(resolve, 5000))]);
    await new Promise((resolve) => server.close(resolve));
    fs.rmSync(userDataDir, { recursive: true, force: true, maxRetries: 10, retryDelay: 100 });
  }
});
