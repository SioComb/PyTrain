(() => {
  const byId = (id) => document.getElementById(id);
  let updateQueued = false;

  function selectedValue(...ids) {
    for (const id of ids) {
      const element = byId(id);
      if (element) return element.value;
    }
    return "all";
  }

  function filteredBank() {
    if (typeof activeBank !== "function") return [];

    let questions = activeBank();
    const category = selectedValue("category");
    const chapter = selectedValue("chapter", "practicalChapter");
    const section = selectedValue("recipeSection", "chapterItem", "practicalItem");

    if (category !== "all") {
      questions = questions.filter((question) => question.category === category);
    }
    if (chapter !== "all") {
      questions = questions.filter((question) => String(question.chapter || "") === String(chapter));
    }
    if (section !== "all") {
      questions = questions.filter((question) => String(question.recipeSection || "") === String(section));
    }

    return questions;
  }

  function updateStartButton() {
    const start = byId("start");
    const count = byId("count");
    const unansweredOnly = byId("unansweredOnly");
    if (!start || !count || !unansweredOnly) return;

    let questions = filteredBank();
    if (unansweredOnly.checked && typeof loadAnswered === "function") {
      const answeredIds = loadAnswered();
      questions = questions.filter((question) => !answeredIds.has(question.id));
    }

    const requested = count.value === "all" ? questions.length : Number(count.value);
    const actual = Math.min(Number.isFinite(requested) ? requested : 0, questions.length);
    const label = unansweredOnly.checked
      ? `未回答 ${actual}問を開始（残り${questions.length}問）`
      : `${actual}問を開始`;
    const disabled = actual === 0;
    const opacity = disabled ? ".45" : "1";

    // 同じ値を再代入するとMutationObserverが再発火するため、変更時だけ更新する。
    if (start.textContent !== label) start.textContent = label;
    if (start.disabled !== disabled) start.disabled = disabled;
    if (start.style.opacity !== opacity) start.style.opacity = opacity;
  }

  function scheduleUpdate() {
    if (updateQueued) return;
    updateQueued = true;
    queueMicrotask(() => {
      updateQueued = false;
      bindControls();
    });
  }

  function bind(element) {
    if (!element || element.dataset.startButtonSyncBound === "1") return;
    element.dataset.startButtonSyncBound = "1";
    element.addEventListener("change", updateStartButton);
    element.addEventListener("input", updateStartButton);
  }

  function bindControls() {
    [
      "count",
      "unansweredOnly",
      "level",
      "category",
      "chapter",
      "practicalChapter",
      "recipeSection",
      "chapterItem",
      "practicalItem",
    ].forEach((id) => bind(byId(id)));
    updateStartButton();
  }

  document.addEventListener("DOMContentLoaded", bindControls);

  // UI部品が後から追加された場合だけ再同期する。文字列更新は監視しない。
  const observer = new MutationObserver((mutations) => {
    const hasAddedElement = mutations.some((mutation) =>
      [...mutation.addedNodes].some((node) => node.nodeType === Node.ELEMENT_NODE)
    );
    if (hasAddedElement) scheduleUpdate();
  });
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
})();
