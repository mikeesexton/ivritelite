(function initIvriQuestAppLesson(global) {
"use strict";

const app = global.IvriQuestApp = global.IvriQuestApp || {};
const lessonMode = app.lessonMode = app.lessonMode || {};

function getRuntime() {
  return app.runtime || {};
}

lessonMode.getLessonPromptSpeechPayload = lessonMode.getLessonPromptSpeechPayload || function getLessonPromptSpeechPayload(question = getRuntime().state.currentQuestion) {
  if (!question?.promptIsHebrew) return null;
  if (question.word && question.promptUsesWordSurface !== false) {
    return app.speech?.buildSpeechPayload?.({
      plain: question.word.he,
      niqqud: question.word.heNiqqud,
      speechOverridePlain: question.word.speechHe,
      speechOverrideNiqqud: question.word.speechHeNiqqud,
      source: "prompt",
    }) || null;
  }

  return app.speech?.buildSpeechPayload?.({
    plain: question.prompt,
    niqqud: question.promptNiqqud,
    source: "prompt",
  }) || null;
};

lessonMode.cloneLessonQuestionSnapshot = lessonMode.cloneLessonQuestionSnapshot || function cloneLessonQuestionSnapshot(question) {
  return {
    ...question,
    word: question.word ? { ...question.word } : null,
    options: question.options.map((option) => ({
      ...option,
      word: option.word ? { ...option.word } : null,
    })),
    locked: question.locked !== undefined ? Boolean(question.locked) : true,
    selectedOptionId: question.selectedOptionId ?? null,
  };
};
})(typeof window !== "undefined" ? window : globalThis);
