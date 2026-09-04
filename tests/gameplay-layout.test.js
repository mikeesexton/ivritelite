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

// Chrome's startup on a cold CI runner is not reliably fast. A 10s deadline
// failed 4 of 9 runs on ubuntu-latest in one evening — on unchanged `main` as
// often as on a branch — always with stderr either silent or carrying only
// `dbus/bus.cc:405 Failed to connect`, meaning the browser was alive and
// logging but had not yet bound the debug port. Both numbers below are
// deliberately generous: a slow launch should cost seconds, never a red gate.
const CHROME_LAUNCH_TIMEOUT_MS = 30000;
const CHROME_LAUNCH_ATTEMPTS = 3;

function waitForChromeWebSocket(chrome) {
  return new Promise((resolve, reject) => {
    let output = "";
    const timer = setTimeout(
      () => reject(
        new Error(
          `Chrome did not expose DevTools within ${CHROME_LAUNCH_TIMEOUT_MS}ms. stderr: ${output || "(silent)"}`,
        ),
      ),
      CHROME_LAUNCH_TIMEOUT_MS,
    );
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

// Retrying the *launch* is safe in a way that retrying the test would not be:
// every assertion in this file runs after the browser is up, so a real layout
// overflow still fails on the first attempt and is never retried away. Each
// attempt gets its own profile directory — a killed Chrome leaves a singleton
// lock behind, and reusing the directory would turn attempt 2 into a guaranteed
// second failure.
async function launchChrome(chromePath) {
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), "ivriquest-layout-"));
  const chrome = spawn(chromePath, [
    "--headless=new",
    "--disable-background-networking",
    "--disable-default-apps",
    "--disable-extensions",
    "--disable-gpu",
    "--no-default-browser-check",
    "--no-first-run",
    // Chrome asks the D-Bus secret service (gnome-keyring/kwallet) for its
    // password store during startup. A CI runner has no session bus, which is
    // what the `dbus/bus.cc:405` line in the failing runs was reporting. These
    // two skip that lookup rather than waiting on it.
    "--password-store=basic",
    "--use-mock-keychain",
    "--remote-debugging-port=0",
    `--user-data-dir=${userDataDir}`,
    "about:blank",
  ], { stdio: ["ignore", "ignore", "pipe"] });

  try {
    const browserWebSocketUrl = await waitForChromeWebSocket(chrome);
    return { browserWebSocketUrl, chrome, userDataDir };
  } catch (error) {
    const exited = new Promise((resolve) => chrome.once("exit", resolve));
    chrome.kill("SIGKILL");
    await Promise.race([exited, new Promise((resolve) => setTimeout(resolve, 2000))]);
    fs.rmSync(userDataDir, { recursive: true, force: true, maxRetries: 10, retryDelay: 100 });
    throw error;
  }
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
  const deadline = Date.now() + 30000;
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

const GAMEPLAY_GEOMETRY_FN = `(() => {
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
})`;

// The feedback tray animates in with `feedbackTrayIn 180ms` (styles.css), and a
// transformed descendant still contributes to an ancestor's scrollable overflow
// in Chrome. Measuring at t=0 therefore reports up to 6px of phantom
// scrollHeight — the animation's starting translateY.
//
// Awaiting the animations once and then waiting two frames is not enough, and
// this test failed roughly one full-suite run in four because of it:
//
//   * `getAnimations()` lists only animations that have ALREADY started, so one
//     queued during the current frame is never awaited; and
//   * `document.fonts.ready` resolves immediately when no load is pending *at
//     that moment*, which is exactly the case for the Hebrew display faces on
//     .choice-btn — Chrome has not yet requested them for choices that rendered
//     in this frame.
//
// Either one lands after the settle and reflows the shell before the read, which
// is why the failures were geometry assertions that tripped FASTER than a passing
// run. Under a parallel `npm test` the local static server is slow enough to make
// the font case likely; run on its own the file passes.
//
// So poll the real measurement rather than guess a duration: sample until nothing
// is animating and two consecutive frames agree.
//
// Use this at EVERY geometry read. The Sentences and Shema blocks below start a
// question and measured in the same synchronous tick, so they never settled at
// all — that is the most likely origin of the failures, since
// `assertNoGameplayScroll` is exactly the phantom-scrollHeight assertion the
// paragraph above describes.
const SETTLED_GEOMETRY = `(async () => {
  const measure = ${GAMEPLAY_GEOMETRY_FN};
  const nextFrame = () => new Promise((resolve) => requestAnimationFrame(() => resolve()));
  const deadline = performance.now() + 4000;
  await document.fonts.ready;
  let current = measure();
  let agreements = 0;
  while (performance.now() < deadline) {
    await Promise.all(document.getAnimations().map((animation) => animation.finished.catch(() => {})));
    await nextFrame();
    const previous = current;
    current = measure();
    const animating = document.getAnimations().some((animation) => animation.playState === 'running');
    if (!animating && JSON.stringify(current) === JSON.stringify(previous)) {
      agreements += 1;
      if (agreements >= 2) break;
    } else {
      agreements = 0;
    }
  }
  return current;
})()`;

async function measureGeometry(cdp) {
  return evaluate(cdp, SETTLED_GEOMETRY);
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

async function measureFeedbackPadding(cdp, width, height) {
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await measureGeometry(cdp);
  return evaluate(cdp, `(() => {
    const styles = getComputedStyle(document.querySelector('#feedbackTray'));
    return {
      top: parseFloat(styles.paddingTop),
      right: parseFloat(styles.paddingRight),
      bottom: parseFloat(styles.paddingBottom),
      left: parseFloat(styles.paddingLeft),
    };
  })()`);
}

function assertEvenFeedbackPadding(padding, label) {
  assert.ok(padding.top > 0, `${label} feedback padding must stay visible`);
  [padding.right, padding.bottom, padding.left].forEach((value) => {
    assert.ok(Math.abs(value - padding.top) <= 0.01, `${label} feedback padding is uneven: ${JSON.stringify(padding)}`);
  });
}

// The budget has to cover the worst launch case rather than the typical one:
// three attempts at CHROME_LAUNCH_TIMEOUT_MS plus the ~15s of measurement work.
// At the old 30s a raised launch deadline would just have moved the failure to
// this line instead.
test("compact gameplay and safe centering hold in rendered Chrome", { timeout: 150000 }, async (t) => {
  const chromePath = findChrome();
  if (!chromePath) {
    t.skip("Chrome is not installed on this machine");
    return;
  }

  const server = await startStaticServer();
  const address = server.address();
  const appUrl = `http://localhost:${address.port}/`;
  let chrome;
  let userDataDir;
  let browserWebSocketUrl;
  for (let attempt = 1; attempt <= CHROME_LAUNCH_ATTEMPTS; attempt += 1) {
    try {
      ({ browserWebSocketUrl, chrome, userDataDir } = await launchChrome(chromePath));
      break;
    } catch (error) {
      if (attempt === CHROME_LAUNCH_ATTEMPTS) {
        // Nothing below this loop has been allocated yet, so the shared
        // teardown never runs on this path and the server has to be closed here
        // or `node --test` hangs on the open handle instead of reporting.
        await new Promise((resolve) => server.close(resolve));
        throw error;
      }
      console.error(`Chrome launch attempt ${attempt} failed, retrying: ${error.message}`);
    }
  }

  let browserCdp;
  let pageCdp;
  try {
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
    // The topic screen carries the longest list in the daily flow — Ivri is
    // offered 13 topics across the two tiers — and the rest of this test
    // dismisses the picker before it measures anything, so this is the only
    // place it is seen. The scene card is allowed to scroll by design
    // (.character-scene { overflow: auto }), unlike a gameplay surface; what
    // must hold is that the list scrolls *inside* its own container so the
    // title, the readout and Continue stay on screen, and that a row keeps its
    // 44px touch target.
    await evaluate(pageCdp, "document.querySelector('#welcomeModalCloseBtn')?.click()");
    const focusScreen = await evaluate(pageCdp, `(() => {
      IvriQuestApp.character.setGender('m');
      IvriQuestApp.character.chooseCharacter('ivri');
      return IvriQuestApp.runtime.characterState.screen;
    })()`);
    assert.equal(focusScreen, "focus", "choosing a character must open the topic screen");
    await measureGeometry(pageCdp);
    const focusGeometry = await evaluate(pageCdp, `(() => {
      const card = document.querySelector('.character-scene-card');
      const scroller = document.querySelector('.character-focus-scroll');
      const options = [...document.querySelectorAll('.character-focus-option')];
      const readout = document.querySelector('.character-focus-readout');
      const confirm = document.querySelector('[data-character-action="confirmFocus"]');
      const cardRect = card.getBoundingClientRect();
      return {
        topics: options.length,
        sections: document.querySelectorAll('.character-focus-section').length,
        cardScrolls: card.scrollHeight > card.clientHeight + 1,
        listScrolls: scroller.scrollHeight > scroller.clientHeight + 1,
        minOptionHeight: Math.min(...options.map((el) => el.getBoundingClientRect().height)),
        selected: options.filter((el) => el.getAttribute('aria-pressed') === 'true').length,
        readoutText: readout.textContent,
        confirmEnabled: confirm && !confirm.disabled,
        confirmInsideCard: confirm.getBoundingClientRect().bottom <= cardRect.bottom + 0.5,
        confirmInViewport: confirm.getBoundingClientRect().bottom <= window.innerHeight + 0.5,
      };
    })()`);
    assert.equal(focusGeometry.topics, 13, "Ivri must be offered 13 topics");
    assert.equal(focusGeometry.sections, 2, "the two tiers must render as two sections");
    assert.equal(focusGeometry.cardScrolls, false, `topic screen scrolls: ${JSON.stringify(focusGeometry)}`);
    assert.equal(focusGeometry.listScrolls, true, "13 rows must scroll inside the list, not the card");
    assert.ok(
      focusGeometry.minOptionHeight >= 44,
      `topic rows are ${focusGeometry.minOptionHeight}px, under the 44px touch floor`,
    );
    // The default is a real selection, not everything: "everything" is the whole
    // 2,206-card deck, which defeats the point of choosing.
    assert.ok(focusGeometry.selected >= 3, "the default selection must clear the minimum");
    assert.ok(focusGeometry.selected < focusGeometry.topics, "the default must not be everything");
    assert.match(focusGeometry.readoutText, /\d+ topics · \d+ words/);
    assert.equal(focusGeometry.confirmEnabled, true, "Continue must be live at the default selection");
    assert.equal(focusGeometry.confirmInsideCard, true, "Continue must sit inside the scene card");
    assert.equal(focusGeometry.confirmInViewport, true, "Continue must be reachable without scrolling");

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

    const sentenceFeedback = await evaluate(pageCdp, `(async () => {
      const originalWeightedRandomWord = IvriQuestApp.utils.weightedRandomWord;
      IvriQuestApp.utils.weightedRandomWord = (items) => (
        items.find((item) => item.word?.sentence?.id === 'everyday_127') || items[0]
      ).word;
      IvriQuestApp.sentenceBank.startSentenceBank();
      IvriQuestApp.sentenceBank.beginSentenceBankFromIntro();
      IvriQuestApp.utils.weightedRandomWord = originalWeightedRandomWord;

      const question = IvriQuestApp.runtime.state.sentenceBank.currentQuestion;
      const active = {
        geometry: await ${SETTLED_GEOMETRY},
        promptFont: parseFloat(getComputedStyle(document.querySelector('.prompt-text')).fontSize),
        slotFont: parseFloat(getComputedStyle(document.querySelector('.sentence-slot')).fontSize),
        bankFont: parseFloat(getComputedStyle(document.querySelector('.sentence-token')).fontSize),
      };

      const usedTokenIds = new Set();
      question.slotTokenIds = question.targetTokens.map((text, index) => {
        const token = index === 0
          ? question.bankTokens.find((candidate) => !question.targetTokens.includes(candidate.text))
          : question.bankTokens.find((candidate) => candidate.text === text && !usedTokenIds.has(candidate.id));
        usedTokenIds.add(token.id);
        return token.id;
      });
      question.placedBankTokenIds = [...question.slotTokenIds];
      IvriQuestApp.sentenceBank.applySentenceBankAnswer();

      const tray = document.querySelector('#feedbackTray');
      return {
        active,
        feedback: {
          geometry: await ${SETTLED_GEOMETRY},
          bankCount: document.querySelectorAll('.sentence-token-bank').length,
          metaCount: document.querySelectorAll('.sentence-answer-meta').length,
          promptVisible: document.querySelector('.prompt-card')?.getBoundingClientRect().height > 0,
          answerVisible: document.querySelector('.sentence-answer-line')?.getBoundingClientRect().height > 0,
          nextVisible: document.querySelector('#nextBtn')?.getBoundingClientRect().height > 0,
          trayClientHeight: tray?.clientHeight || 0,
          trayScrollHeight: tray?.scrollHeight || 0,
        },
      };
    })()`);
    assertNoGameplayScroll(sentenceFeedback.active.geometry, "Sentences long active question");
    assertChoicesClearFooter(sentenceFeedback.active.geometry, "Sentences long active question");
    assert.ok(sentenceFeedback.active.promptFont > 19.9, `sentence prompt font increased (${sentenceFeedback.active.promptFont}px)`);
    assert.ok(sentenceFeedback.active.slotFont > 15.1, `sentence answer font increased (${sentenceFeedback.active.slotFont}px)`);
    assert.ok(sentenceFeedback.active.bankFont > 13.8, `sentence bank font increased (${sentenceFeedback.active.bankFont}px)`);
    assertNoGameplayScroll(sentenceFeedback.feedback.geometry, "Sentences expanded feedback");
    assertChoicesClearFooter(sentenceFeedback.feedback.geometry, "Sentences expanded feedback");
    assertFeedbackFooterInFlow(sentenceFeedback.feedback.geometry, "Sentences expanded feedback");
    assert.equal(sentenceFeedback.feedback.bankCount, 0, "locked Sentences feedback collapses the word bank");
    assert.equal(sentenceFeedback.feedback.metaCount, 0, "locked Sentences feedback collapses the word counter");
    assert.equal(sentenceFeedback.feedback.promptVisible, true, "Sentences feedback keeps the prompt visible");
    assert.equal(sentenceFeedback.feedback.answerVisible, true, "Sentences feedback keeps the marked answer visible");
    assert.equal(sentenceFeedback.feedback.nextVisible, true, "Sentences feedback keeps Next visible");
    assert.equal(
      sentenceFeedback.feedback.trayScrollHeight,
      sentenceFeedback.feedback.trayClientHeight,
      "Sentences feedback must not scroll internally",
    );

    const shemaFeedback = await evaluate(pageCdp, `(async () => {
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
        geometry: await ${SETTLED_GEOMETRY},
        result: document.querySelector('#feedbackItems .feedback-result')?.textContent || '',
        bankCount: document.querySelectorAll('.sentence-token-bank').length,
        metaCount: document.querySelectorAll('.sentence-answer-meta').length,
        replayCount: document.querySelectorAll('.shema-play-btn').length,
        trayClientHeight: document.querySelector('#feedbackTray')?.clientHeight || 0,
        trayScrollHeight: document.querySelector('#feedbackTray')?.scrollHeight || 0,
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
    assert.equal(shemaFeedback.bankCount, 0, "locked Shema feedback collapses the word bank");
    assert.equal(shemaFeedback.metaCount, 0, "locked Shema feedback collapses the word counter");
    assert.equal(shemaFeedback.replayCount, 2, "Shema feedback keeps both replay controls");
    assert.equal(shemaFeedback.trayScrollHeight, shemaFeedback.trayClientHeight, "Shema feedback must not scroll internally");
    assert.equal(shemaFeedback.result, "", "A correct answer leans on the green tray instead of a headline");
    assert.equal(shemaFeedback.rows.length, 2, "Shema feedback must not add a tip row");
    assert.deepEqual(
      shemaFeedback.rows.slice(0, 2),
      [
        { label: "שמעת", dir: "rtl", lang: "he" },
        { label: "משמעות", dir: "ltr", lang: "en" },
      ],
    );

    const shortMobileFeedbackPadding = await measureFeedbackPadding(pageCdp, 360, 640);
    assertEvenFeedbackPadding(shortMobileFeedbackPadding, "short mobile");
    const mobileFeedbackPadding = await measureFeedbackPadding(pageCdp, 360, 800);
    assertEvenFeedbackPadding(mobileFeedbackPadding, "mobile");
    const mobileFeedbackBottomSpace = await evaluate(pageCdp, `(() => {
      const tray = document.querySelector('#feedbackTray').getBoundingClientRect();
      const lastRow = document.querySelector('#feedbackItems .feedback-item:last-child').getBoundingClientRect();
      return tray.bottom - lastRow.bottom;
    })()`);
    assert.ok(
      mobileFeedbackBottomSpace >= 10,
      `wrapped feedback keeps visible space above the tray edge (${mobileFeedbackBottomSpace}px)`,
    );
    const baseFeedbackPadding = await measureFeedbackPadding(pageCdp, 1024, 900);
    assertEvenFeedbackPadding(baseFeedbackPadding, "base");
    await measureFeedbackPadding(pageCdp, 360, 640);

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
