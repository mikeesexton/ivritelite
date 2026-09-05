(function initIvriQuestAppAdvConj(global) {
"use strict";

const app = global.IvriQuestApp = global.IvriQuestApp || {};
const advConj = app.advConj = app.advConj || {};

function getRuntime() {
  return app.runtime || {};
}

function getHelpers() {
  return getRuntime().helpers || {};
}

function getSession() {
  return app.session || {};
}

function getIdioms() {
  return Array.isArray(global.HEBREW_IDIOMS) ? global.HEBREW_IDIOMS : [];
}

function sanitizeEnglishText(text) {
  return app.utils?.sanitizeEnglishDisplayText
    ? app.utils.sanitizeEnglishDisplayText(text)
    : String(text || "").trim();
}

function translate(key, vars = {}) {
  return getHelpers().t ? getHelpers().t(key, vars) : key;
}

function getIdiomById(id) {
  return getIdioms().find((entry) => entry.id === id) || null;
}

function getAdvConjMeaningDetail(question) {
  const idiom = getIdiomById(question?.idiomId);
  const showMeaning = question?.showMeaning ?? idiom?.showMeaning;
  const meaning = sanitizeEnglishText(question?.colloquialMeaning || question?.englishMeaning || idiom?.english_meaning || idiom?.english);
  if (!showMeaning || !meaning) return "";
  return meaning;
}

advConj.getAdvConjDisplayText = advConj.getAdvConjDisplayText || function getAdvConjDisplayText(plain, niqqud, isHebrew = true) {
  const showNiqqud = Boolean(getRuntime().state?.showNiqqudInline);
  return isHebrew && showNiqqud && niqqud ? niqqud : plain;
};

function getAdvConjCorrectAnswerDisplay(question) {
  return advConj.getAdvConjDisplayText(
    question?.correctAnswer || "",
    question?.correctAnswerNiqqud || "",
    Boolean(question?.correctAnswerIsHebrew),
  );
}

advConj.getAdvConjPromptSpeechPayload = advConj.getAdvConjPromptSpeechPayload || function getAdvConjPromptSpeechPayload(question = getRuntime().state.advConj.currentQuestion) {
  if (!question?.promptIsHebrew) return null;
  return app.speech?.buildSpeechPayload?.({
    plain: question.promptText,
    niqqud: question.promptNiqqud,
    speechOverridePlain: question.promptSpeechText,
    speechOverrideNiqqud: question.promptSpeechTextNiqqud,
    source: "prompt",
  }) || null;
};

advConj.getAdvConjSelectionSpeechPayload = advConj.getAdvConjSelectionSpeechPayload || function getAdvConjSelectionSpeechPayload(question, option) {
  if (!question?.correctAnswerIsHebrew || !option) return null;
  return app.speech?.buildSpeechPayload?.({
    plain: option.text,
    niqqud: option.textNiqqud,
    speechOverridePlain: option.speechText,
    speechOverrideNiqqud: option.speechTextNiqqud,
    source: "answer",
  }) || null;
};

// Same rule as prepositions.subjectCoreferencesObject: an identical pair always
// corefers, and first or second person collides across number too, because the
// singular addressee sits inside the plural one. Disjoint third person is left
// alone — "he breaks his heart" can be two different people.
function subjectCoreferencesObject(subject, object) {
  const subjectKey = subject?.personKey;
  const objectKey = object?.key;
  if (!subjectKey || !objectKey) return false;
  if (subjectKey === objectKey) return true;
  const subjectPerson = String(subjectKey).charAt(0);
  const objectPerson = String(objectKey).charAt(0);
  if (subjectPerson !== objectPerson) return false;
  return subjectPerson === "1" || subjectPerson === "2";
}

let advConjParadigmsByLemma = null;

function getVerbParadigmsByLemma() {
  if (advConjParadigmsByLemma) return advConjParadigmsByLemma;
  const api = getRuntime().verbApi || global.IvriQuestHebrewVerbs;
  const entries = typeof api?.getSeedVerbEntries === "function" ? api.getSeedVerbEntries() : [];
  // Deliberately not cached when empty: this can run before the runtime has its
  // verbApi, and memoizing that would silently disable the join for the session.
  if (!entries.length) return new Map();
  advConjParadigmsByLemma = new Map(entries.map((entry) => [entry.lemma, entry]));
  return advConjParadigmsByLemma;
}

// Hebrew present does not inflect for person, so an idiom's own four-slot table
// serves every subject there. Past and future do, and those four slots hold
// third-person forms only — so a first- or second-person subject reads the
// verb's full paradigm out of hebrew-verbs.js instead, joined on the idiom's
// `verb` lemma. This is the same join PREPOSITION_VERB_LINKS uses. An idiom
// whose verb has no paradigm degrades to third person in past and future,
// exactly as the whole file behaved before.
function resolveAdvConjVerbForm(idiom, subject, tense) {
  if (!idiom || !subject) return null;

  if (tense === "present") {
    const plain = idiom.present_tense?.[subject.form];
    if (!plain) return null;
    return { plain, niqqud: idiom.present_tense_niqqud?.[subject.form] || "" };
  }

  const slot = tense === "past" ? subject.pastSlot : subject.futureSlot;
  const stored = slot ? getVerbParadigmsByLemma().get(idiom.verb)?.forms?.[tense]?.[slot] : null;
  if (stored) {
    const plain = typeof stored === "string" ? stored : stored.plain;
    if (plain) return { plain, niqqud: typeof stored === "string" ? "" : (stored.niqqud || "") };
  }

  if (String(subject.personKey || "").charAt(0) !== "3") return null;
  const table = tense === "past" ? idiom.past_tense : idiom.future_tense;
  const plain = table?.[subject.form];
  if (!plain) return null;
  const pointed = tense === "past" ? idiom.past_tense_niqqud : idiom.future_tense_niqqud;
  return { plain, niqqud: pointed?.[subject.form] || "" };
}

function usesPresentBaseVerb(subject) {
  const label = stripAdvConjEnglishQualifier(String(subject?.en || "")).trim().toLowerCase();
  if (!label) return false;
  return label.startsWith("you") || label === "i" || label === "we" || label.startsWith("they");
}

function stripAdvConjEnglishQualifier(text) {
  return String(text || "").replace(/\s\([^()]+\)$/, "");
}

function getAdvConjSubjectEnglishLabel(idiom, subj, tense) {
  const label = sanitizeEnglishText(subj?.en);
  const baseLabel = stripAdvConjEnglishQualifier(label);
  if (!label || baseLabel === label) return label;

  const current = resolveAdvConjVerbForm(idiom, subj, tense);
  if (!current) return label;

  // Keep the gender/number qualifier when another subject sharing the same bare
  // English label (e.g. another "you") conjugates to a different verb form.
  // Dropping it there would make a distractor built from that other subject a
  // valid reading of the bare label, so the prompt would be ambiguous. Only
  // collapse to the bare label when every same-label subject shares one form —
  // "I (m.)" and "I (f.)" split in the present and merge again in the past.
  const hasDivergentSubject = advConj.getAdvConjSubjectsForTense(tense).some((candidate) => {
    if (!candidate || candidate === subj) return false;
    if (stripAdvConjEnglishQualifier(sanitizeEnglishText(candidate.en)) !== baseLabel) return false;
    const candidateForm = resolveAdvConjVerbForm(idiom, candidate, tense);
    return candidateForm && candidateForm.plain !== current.plain;
  });

  return hasDivergentSubject ? label : baseLabel;
}

advConj.buildAdvConjHebrewAnswer = advConj.buildAdvConjHebrewAnswer || function buildAdvConjHebrewAnswer(idiom, subject, objectKey, tense) {
  const runtime = getRuntime();
  const obj = runtime.constants.ADV_CONJ_OBJECTS.find((entry) => entry.key === objectKey);
  if (!obj) return "";
  const verbForm = resolveAdvConjVerbForm(idiom, subject, tense)?.plain;
  if (!verbForm) return "";
  const neg = idiom.negated ? "לא " : "";
  if (idiom.object_type === "direct") {
    return `${neg}${verbForm} ${obj.dirObj}`;
  }
  if (idiom.object_type === "l_dative") {
    return `${neg}${verbForm} ${obj.lObj} ${idiom.fixed_object}`;
  }
  if (idiom.object_type === "possessive_suffix") {
    const suffix = idiom.suffix_forms[objectKey];
    if (!suffix) return "";
    return `${neg}${verbForm} ${obj.dirObj} ${suffix}`;
  }
  return "";
};

advConj.buildAdvConjHebrewAnswerNiqqud = advConj.buildAdvConjHebrewAnswerNiqqud || function buildAdvConjHebrewAnswerNiqqud(idiom, subject, objectKey, tense) {
  const runtime = getRuntime();
  const obj = runtime.constants.ADV_CONJ_OBJECTS.find((entry) => entry.key === objectKey);
  // The fixed object and suffix forms are only pointed on reviewed idioms, so
  // an unreviewed entry cannot render a fully pointed answer even when the verb
  // form itself arrives pointed from a linked paradigm.
  if (!obj || idiom?.niqqud_status !== "reviewed") return "";
  const verbForm = resolveAdvConjVerbForm(idiom, subject, tense)?.niqqud;
  if (!verbForm) return "";
  const neg = idiom.negated ? "לֹא " : "";
  if (idiom.object_type === "direct" && obj.dirObjNiqqud) {
    return `${neg}${verbForm} ${obj.dirObjNiqqud}`;
  }
  if (idiom.object_type === "l_dative" && obj.lObjNiqqud && idiom.fixed_object_niqqud) {
    return `${neg}${verbForm} ${obj.lObjNiqqud} ${idiom.fixed_object_niqqud}`;
  }
  if (idiom.object_type === "possessive_suffix" && obj.dirObjNiqqud) {
    const suffix = idiom.suffix_forms_niqqud?.[objectKey];
    if (suffix) return `${neg}${verbForm} ${obj.dirObjNiqqud} ${suffix}`;
  }
  return "";
};

advConj.buildAdvConjEnglishSentence = advConj.buildAdvConjEnglishSentence || function buildAdvConjEnglishSentence(idiom, subj, obj, tense) {
  let tpl;
  if (tense === "past") {
    tpl = idiom.literal_past;
  } else if (tense === "future") {
    tpl = idiom.literal_future;
  } else {
    tpl = usesPresentBaseVerb(subj) ? idiom.literal_pl : idiom.literal_sg;
  }
  if (!tpl) return "";

  const subjectText = getAdvConjSubjectEnglishLabel(idiom, subj, tense);
  let objectText = obj.en;
  let possessiveText = obj.poss;
  let collapsedQualifier = "";
  const usesObject = tpl.includes("{o}");
  const usesPossessive = tpl.includes("{p}");
  if (usesObject && usesPossessive) {
    const objectQualifier = advConj.getAdvConjTrailingQualifier(obj.en);
    const possessiveQualifier = advConj.getAdvConjTrailingQualifier(obj.poss);
    if (objectQualifier && objectQualifier === possessiveQualifier) {
      objectText = advConj.stripAdvConjTrailingQualifier(obj.en);
      possessiveText = advConj.stripAdvConjTrailingQualifier(obj.poss);
      collapsedQualifier = ` ${objectQualifier}`;
    }
  }

  return sanitizeEnglishText(
    tpl
    .replace(/\{s\}/g, subjectText)
    .replace(/\{o\}/g, objectText)
    .replace(/\{p\}/g, possessiveText) + collapsedQualifier
  );
};

advConj.getAdvConjSubjectsForTense = advConj.getAdvConjSubjectsForTense || function getAdvConjSubjectsForTense(tense) {
  return getRuntime().constants.ADV_CONJ_SUBJECTS.filter((subj) => !Array.isArray(subj.tenses) || subj.tenses.includes(tense));
};

advConj.getAdvConjTrailingQualifier = advConj.getAdvConjTrailingQualifier || function getAdvConjTrailingQualifier(text) {
  const match = String(text || "").match(/\s(\([^()]+\))$/);
  return match ? match[1] : "";
};

advConj.stripAdvConjTrailingQualifier = advConj.stripAdvConjTrailingQualifier || function stripAdvConjTrailingQualifier(text) {
  return String(text || "").replace(/\s\([^()]+\)$/, "");
};

advConj.buildAdvConjDeck = advConj.buildAdvConjDeck || function buildAdvConjDeck() {
  const runtime = getRuntime();
  const shuffle = app.utils?.shuffle;
  const deck = [];
  const tenses = ["present", "past", "future"];
  for (const idiom of getIdioms()) {
    if (!idiom.literal_sg) continue;
    for (const tense of tenses) {
      const tenseData = tense === "past" ? idiom.past_tense : tense === "future" ? idiom.future_tense : idiom.present_tense;
      if (!tenseData) continue;
      const subjects = advConj.getAdvConjSubjectsForTense(tense);
      for (const subj of subjects) {
        const subjectForm = resolveAdvConjVerbForm(idiom, subj, tense);
        if (!subjectForm) continue;
        for (const obj of runtime.constants.ADV_CONJ_OBJECTS) {
          if (subjectCoreferencesObject(subj, obj)) continue;
          if (idiom.object_type === "possessive_suffix" && !idiom.suffix_forms[obj.key]) continue;
          const hebrewAnswer = advConj.buildAdvConjHebrewAnswer(idiom, subj, obj.key, tense);
          const hebrewAnswerNiqqud = advConj.buildAdvConjHebrewAnswerNiqqud(idiom, subj, obj.key, tense);
          if (!hebrewAnswer) continue;
          const englishSentence = advConj.buildAdvConjEnglishSentence(idiom, subj, obj, tense);
          if (!englishSentence) continue;
          const direction = Math.random() < 0.5 ? "en2he" : "he2en";

          if (direction === "he2en") {
            // Reading Hebrew back to English only works when the verb form
            // names one subject. Present is person-neutral, so it almost never
            // does; past and future usually do once a paradigm supplies them.
            const ambiguous = subjects.some((candidate) => {
              if (candidate === subj) return false;
              const candidateForm = resolveAdvConjVerbForm(idiom, candidate, tense);
              return candidateForm && candidateForm.plain === subjectForm.plain;
            });
            if (ambiguous) continue;
          }

          const otherObjs = runtime.constants.ADV_CONJ_OBJECTS.filter((entry) => entry.key !== obj.key);
          // Compared by identity, not by label: several subjects now share a
          // label stem ("I (m.)" / "I (f.)") and several share a `form`.
          const otherSubjs = subjects.filter((subject) => subject !== subj);
          const correctText = direction === "en2he" ? hebrewAnswer : englishSentence;
          const correctTextNiqqud = direction === "en2he" ? hebrewAnswerNiqqud : "";
          const subjectLabel = getAdvConjSubjectEnglishLabel(idiom, subj, tense);
          const objectLabel = sanitizeEnglishText(obj.en);

          function buildDistractor(subject, object) {
            if (idiom.object_type === "possessive_suffix" && !idiom.suffix_forms[object.key]) return null;
            if (!resolveAdvConjVerbForm(idiom, subject, tense)) return null;
            const text = direction === "en2he"
              ? advConj.buildAdvConjHebrewAnswer(idiom, subject, object.key, tense)
              : advConj.buildAdvConjEnglishSentence(idiom, subject, object, tense);
            if (!text) return null;
            return {
              text,
              textNiqqud: direction === "en2he"
                ? advConj.buildAdvConjHebrewAnswerNiqqud(idiom, subject, object.key, tense)
                : "",
            };
          }

          let d1 = null;
          for (const wrongObject of typeof shuffle === "function" ? shuffle([...otherObjs]) : otherObjs) {
            const answer = buildDistractor(subj, wrongObject);
            if (answer && answer.text !== correctText) {
              d1 = answer;
              break;
            }
          }

          let d2 = null;
          for (const wrongSubject of typeof shuffle === "function" ? shuffle([...otherSubjs]) : otherSubjs) {
            const answer = buildDistractor(wrongSubject, obj);
            if (answer && answer.text !== correctText && answer.text !== d1?.text) {
              d2 = answer;
              break;
            }
          }

          let d3 = null;
          for (const wrongSubject of typeof shuffle === "function" ? shuffle([...otherSubjs]) : otherSubjs) {
            for (const wrongObject of typeof shuffle === "function" ? shuffle([...otherObjs]) : otherObjs) {
              const answer = buildDistractor(wrongSubject, wrongObject);
              if (answer && answer.text !== correctText && answer.text !== d1?.text && answer.text !== d2?.text) {
                d3 = answer;
                break;
              }
            }
            if (d3) break;
          }

          if (!d1 || !d2 || !d3) continue;
          const options = typeof shuffle === "function"
            ? shuffle([
                { id: "correct", text: correctText, textNiqqud: correctTextNiqqud, isCorrect: true },
                { id: "d1", text: d1.text, textNiqqud: d1.textNiqqud, isCorrect: false },
                { id: "d2", text: d2.text, textNiqqud: d2.textNiqqud, isCorrect: false },
                { id: "d3", text: d3.text, textNiqqud: d3.textNiqqud, isCorrect: false },
              ])
            : [
                { id: "correct", text: correctText, textNiqqud: correctTextNiqqud, isCorrect: true },
                { id: "d1", text: d1.text, textNiqqud: d1.textNiqqud, isCorrect: false },
                { id: "d2", text: d2.text, textNiqqud: d2.textNiqqud, isCorrect: false },
                { id: "d3", text: d3.text, textNiqqud: d3.textNiqqud, isCorrect: false },
              ];

          deck.push({
            idiomId: idiom.id,
            tense,
            direction,
            subjectForm: subj.form,
            subjectLabel,
            objectKey: obj.key,
            objectLabel,
            promptText: direction === "en2he" ? englishSentence : hebrewAnswer,
            promptNiqqud: direction === "he2en" ? hebrewAnswerNiqqud : "",
            promptIsHebrew: direction === "he2en",
            correctAnswer: correctText,
            correctAnswerNiqqud: correctTextNiqqud,
            correctAnswerIsHebrew: direction === "en2he",
            showMeaning: Boolean(idiom.showMeaning),
            colloquialMeaning: sanitizeEnglishText(idiom.english_meaning),
            options,
            selectedOptionId: null,
            locked: false,
          });
        }
      }
    }
  }
  return deck;
};

advConj.pickAdvConjQuestions = advConj.pickAdvConjQuestions || function pickAdvConjQuestions(deck, count) {
  const utils = app.utils || {};
  if (typeof utils.pickWeightedSubset !== "function" || typeof utils.getAdaptiveWeight !== "function") {
    const shuffled = typeof utils.shuffle === "function" ? utils.shuffle(deck) : [...deck];
    return shuffled.slice(0, count);
  }

  const stats = advConj.getAdvConjItemStats();
  const idiomWeights = {};
  const weighted = deck.map((question) => {
    if (!(question.idiomId in idiomWeights)) {
      idiomWeights[question.idiomId] = utils.getAdaptiveWeight(stats[question.idiomId]);
    }
    return { word: question, weight: idiomWeights[question.idiomId] };
  });
  return utils.pickWeightedSubset(weighted, count);
};

advConj.startAdvConj = advConj.startAdvConj || function startAdvConj() {
  const runtime = getRuntime();
  const h = getHelpers();
  const s = getSession();
  app.speech?.cancel?.();
  s.resetAllModeSessions?.();
  s.clearSummaryState?.();
  h.resetSessionScore?.();
  runtime.state.mode = "advConj";
  runtime.state.route = "home";
  runtime.state.lastPlayedMode = "advConj";
  const deck = advConj.buildAdvConjDeck();
  const beat = app.character?.getActiveBeat?.();
  const rounds = beat?.repair
    ? 0
    : (s.getModeRoundTarget?.("advConj", runtime.constants.ADV_CONJ_ROUNDS) || runtime.constants.ADV_CONJ_ROUNDS);
  runtime.state.advConj.questionQueue = advConj.pickAdvConjQuestions(deck, rounds);
  const repair = app.character?.takeRepairQueue?.("advConj") || [];
  if (repair.length) runtime.state.advConj.reviewQueue = repair;
  runtime.state.advConj.active = true;
  runtime.state.advConj.startMs = Date.now();
  runtime.state.advConj.timerId = runtime.global.setInterval(() => {
    runtime.state.advConj.elapsedSeconds = Math.floor((Date.now() - runtime.state.advConj.startMs) / 1000);
    h.renderAll?.();
  }, 1000);
  advConj.playAdvConjIntro();
};

advConj.playAdvConjIntro = advConj.playAdvConjIntro || function playAdvConjIntro() {
  const runtime = getRuntime();
  runtime.state.advConj.introActive = true;
  if (runtime.el.advConjIntro) {
    getHelpers().showBlockingOverlay?.(runtime.el.advConjIntro);
  }
  getSession().scheduleIntroAutoAdvance?.(() => advConj.beginAdvConjFromIntro());
};

advConj.beginAdvConjFromIntro = advConj.beginAdvConjFromIntro || function beginAdvConjFromIntro() {
  const runtime = getRuntime();
  if (!runtime.state.advConj.active) return;
  getSession().clearAdvConjIntro?.();
  advConj.loadAdvConjQuestion();
};

advConj.tryStartAdvConjReviewPhase = advConj.tryStartAdvConjReviewPhase || function tryStartAdvConjReviewPhase() {
  const state = getRuntime().state.advConj;
  if (state.inReview || !state.reviewQueue.length) return false;
  // Inside a mission the misses are held back to a repair beat at the end
  // instead of being re-asked two questions later. Returns false in free play,
  // which keeps today's per-session behaviour there byte for byte.
  if (app.character?.deferReviewQueue?.("advConj", state.reviewQueue)) {
    state.reviewQueue = [];
    return false;
  }
  state.inReview = true;
  state.secondChanceTotal = state.reviewQueue.length;
  state.secondChanceCurrent = 0;
  return true;
};

advConj.loadAdvConjQuestion = advConj.loadAdvConjQuestion || function loadAdvConjQuestion() {
  const runtime = getRuntime();
  const state = runtime.state.advConj;
  if (state.questionQueue.length === 0) {
    if (!state.inReview && advConj.tryStartAdvConjReviewPhase()) {
      state.questionQueue = state.reviewQueue;
      state.reviewQueue = [];
      state.currentQuestion = null;
      getHelpers().renderSessionHeader?.();
      advConj.playAdvConjIntro();
      return;
    }
    getSession().finishAdvConj?.();
    return;
  }
  app.character?.clearTransientReaction?.();
  state.currentQuestion = state.questionQueue.shift();
  if (state.inReview) state.secondChanceCurrent += 1;
  else state.currentRound += 1;
  getHelpers().clearFeedback?.();
  advConj.renderAdvConjQuestion();
};

advConj.renderAdvConjQuestion = advConj.renderAdvConjQuestion || function renderAdvConjQuestion() {
  const runtime = getRuntime();
  const h = getHelpers();
  const question = runtime.state.advConj.currentQuestion;
  if (!question) return;
  h.setGamePickerVisibility?.(false);
  h.setPromptCardVisibility?.(true);
  runtime.el.choiceContainer.classList.remove("summary-grid");
  runtime.el.choiceContainer.classList.remove("match-grid", "match-bubble-grid");
  h.renderSessionHeader?.();
  app.ui?.renderPromptLabel?.("", false);
  if (runtime.el.promptText) {
    runtime.el.promptText.textContent = advConj.getAdvConjDisplayText(
      question.promptText,
      question.promptNiqqud,
      question.promptIsHebrew,
    );
    runtime.el.promptText.classList.remove("hidden");
    runtime.el.promptText.classList.toggle("hebrew", question.promptIsHebrew);
    runtime.el.promptText.classList.toggle("english-prompt", !question.promptIsHebrew);
  }
  advConj.renderAdvConjChoices(question);
  if (question.locked) {
    advConj.renderAdvConjFeedback(question);
  }
  h.renderNiqqudToggle?.();
  app.ui?.renderPromptSpeechButton?.();
};

advConj.renderAdvConjChoices = advConj.renderAdvConjChoices || function renderAdvConjChoices(question) {
  const runtime = getRuntime();
  runtime.el.choiceContainer.innerHTML = "";
  for (const option of question.options) {
    const btn = global.document.createElement("button");
    btn.type = "button";
    btn.className = "choice-btn";
    if (question.correctAnswerIsHebrew) {
      btn.classList.add("hebrew");
      btn.dir = "rtl";
      btn.setAttribute("lang", "he");
    }
    btn.textContent = advConj.getAdvConjDisplayText(
      option.text,
      option.textNiqqud,
      question.correctAnswerIsHebrew,
    );
    btn.addEventListener("click", () => {
      if (question.locked) return;
      question.selectedOptionId = option.id;
      runtime.el.choiceContainer.querySelectorAll(".choice-btn").forEach((button, index) => {
        button.classList.toggle("selected", question.options[index]?.id === option.id);
      });
      getHelpers().renderSessionHeader?.();
      app.speech?.speak?.(advConj.getAdvConjSelectionSpeechPayload(question, option));
    });
    btn.classList.toggle("selected", question.selectedOptionId === option.id && !question.locked);
    runtime.el.choiceContainer.appendChild(btn);
  }
  if (question.locked) {
    advConj.markAdvConjChoiceResults(question);
  }
};

advConj.markAdvConjChoiceResults = advConj.markAdvConjChoiceResults || function markAdvConjChoiceResults(question) {
  const runtime = getRuntime();
  const buttons = runtime.el.choiceContainer.querySelectorAll(".choice-btn");
  question.options.forEach((option, index) => {
    if (!buttons[index]) return;
    if (option.isCorrect) buttons[index].classList.add("correct");
    else if (option.id === question.selectedOptionId) buttons[index].classList.add("wrong");
    buttons[index].disabled = true;
  });
};

advConj.renderAdvConjFeedback = advConj.renderAdvConjFeedback || function renderAdvConjFeedback(question) {
  if (!question?.locked) return;
  const selected = question.options?.find((option) => option.id === question.selectedOptionId);
  const isCorrect = selected?.isCorrect ?? false;
  getHelpers().setFeedback?.({
    tone: isCorrect ? "success" : "error",
    sentence: translate(
      isCorrect ? "feedback.advConjCorrectSentence" : "feedback.advConjWrongSentence",
      { answer: getAdvConjCorrectAnswerDisplay(question) },
    ),
    detail: (() => {
      const meaning = getAdvConjMeaningDetail(question);
      return meaning ? translate("feedback.advConjMeaningDetail", { meaning }) : "";
    })(),
  });
};

advConj.applyAdvConjAnswer = advConj.applyAdvConjAnswer || function applyAdvConjAnswer() {
  const runtime = getRuntime();
  const h = getHelpers();
  const question = runtime.state.advConj.currentQuestion;
  if (!question || question.locked) return;
  app.speech?.cancel?.();
  question.locked = true;
  const selected = question.options.find((option) => option.id === question.selectedOptionId);
  const isCorrect = selected?.isCorrect ?? false;
  if (isCorrect) {
    runtime.state.sessionStreak += 1;
    if (!question.isReview) {
      runtime.state.sessionScore += 1;
    }
  } else {
    runtime.state.sessionStreak = 0;
    runtime.state.advConj.wrongAnswers += 1;
    if (!runtime.state.advConj.sessionMistakeIds.includes(question.idiomId)) {
      runtime.state.advConj.sessionMistakeIds.push(question.idiomId);
    }
    const mistakeKey = [
      question.idiomId,
      question.tense,
      question.subjectForm || question.subjectLabel,
      question.objectKey || question.objectLabel,
      question.direction,
    ].join("::");
    if (!Array.isArray(runtime.state.advConj.sessionMistakes)) {
      runtime.state.advConj.sessionMistakes = [];
    }
    if (!runtime.state.advConj.sessionMistakes.some((item) => item.key === mistakeKey)) {
      const meaning = getAdvConjMeaningDetail(question);
      runtime.state.advConj.sessionMistakes.push({
        key: mistakeKey,
        primary: question.correctAnswerNiqqud || question.correctAnswer,
        secondary: meaning || question.promptText,
        clinicKey: "results.advConjClinic",
        clinicVars: {
          subject: question.subjectLabel || "",
          tense: question.tense || "",
          object: question.objectLabel || "",
        },
      });
    }
    if (!question.isReview && !runtime.state.advConj.reviewQueue.some((entry) => entry.key === mistakeKey)) {
      const shuffle = app.utils?.shuffle || ((list) => list);
      runtime.state.advConj.reviewQueue.push({
        ...question,
        key: mistakeKey,
        options: shuffle(question.options.map((option) => ({ ...option }))),
        selectedOptionId: null,
        locked: false,
        isReview: true,
      });
    }
  }

  advConj.renderAdvConjFeedback(question);
  h.playAnswerFeedbackSound?.(isCorrect);
  advConj.updateAdvConjStats(isCorrect);
  advConj.updateAdvConjItemStats(question.idiomId, isCorrect);
  advConj.markAdvConjChoiceResults(runtime.state.advConj.currentQuestion);
  h.renderSessionHeader?.();
  h.renderDomainPerformance?.();
  h.renderMostMissed?.();
};

advConj.updateAdvConjStats = advConj.updateAdvConjStats || function updateAdvConjStats(isCorrect) {
  const runtime = getRuntime();
  const stats = runtime.storageApi.loadJson(runtime.constants.STORAGE_KEYS.advConjStats, { attempts: 0, correct: 0 });
  stats.attempts += 1;
  if (isCorrect) stats.correct += 1;
  runtime.storageApi.saveJson(runtime.constants.STORAGE_KEYS.advConjStats, stats);
};

advConj.getAdvConjItemStats = advConj.getAdvConjItemStats || function getAdvConjItemStats() {
  const runtime = getRuntime();
  return runtime.storageApi.loadJson(runtime.constants.STORAGE_KEYS.advConjItemStats, {}) || {};
};

advConj.updateAdvConjItemStats = advConj.updateAdvConjItemStats || function updateAdvConjItemStats(idiomId, isCorrect) {
  if (!idiomId || typeof app.utils?.normalizeAdaptiveRecord !== "function") return;
  const runtime = getRuntime();
  const stats = advConj.getAdvConjItemStats();
  const rec = app.utils.normalizeAdaptiveRecord(stats[idiomId]);
  rec.attempts += 1;
  if (isCorrect) {
    rec.correct += 1;
  } else {
    rec.misses += 1;
  }
  rec.lastSeen = Date.now();
  stats[idiomId] = rec;
  runtime.storageApi.saveJson(runtime.constants.STORAGE_KEYS.advConjItemStats, stats);
};

advConj.buildAdvConjMistakeSummary = advConj.buildAdvConjMistakeSummary || function buildAdvConjMistakeSummary() {
  const runtime = getRuntime();
  if (Array.isArray(runtime.state.advConj.sessionMistakes) && runtime.state.advConj.sessionMistakes.length) {
    return runtime.state.advConj.sessionMistakes.slice();
  }
  return runtime.state.advConj.sessionMistakeIds
    .map((id) => {
      const idiom = getIdioms().find((entry) => entry.id === id);
      if (!idiom) return null;
      const subj = advConj.getAdvConjSubjectsForTense("present").find((subject) => idiom.present_tense[subject.form]);
      const obj = runtime.constants.ADV_CONJ_OBJECTS[0];
      const answer = subj ? advConj.buildAdvConjHebrewAnswer(idiom, subj, obj.key, "present") : "";
      const answerNiqqud = subj
        ? advConj.buildAdvConjHebrewAnswerNiqqud(idiom, subj, obj.key, "present")
        : "";
      return {
        primary: answerNiqqud || answer,
        secondary: sanitizeEnglishText(idiom.english_meaning),
      };
    })
    .filter(Boolean);
};
})(typeof window !== "undefined" ? window : globalThis);
