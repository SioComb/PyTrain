(() => {
  const byId = (id) => document.getElementById(id);

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

    if (unansweredOnly.checked) {
      start.textContent = `未回答 ${actual}問を開始（残り${questions.length}問）`;
    } else {
      start.textContent = `${actual}問を開始`;
    }

    start.disabled = actual === 0;
    start.style.opacity = actual === 0 ? ".45" : "1";
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

  const observer = new MutationObserver(() => bindControls());
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["class"],
  });
})();
