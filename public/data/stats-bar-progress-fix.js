(() => {
  const HISTORY_KEY = "pytrain_question_stats_v1";
  let scheduled = false;

  function loadStats() {
    try {
      return JSON.parse(localStorage.getItem(HISTORY_KEY) || "{}");
    } catch {
      return {};
    }
  }

  function bankWithIds() {
    const data = window.PYTRAIN_REBALANCED_DATA;
    if (!data) return [];
    return [
      ...data.basic.map((q, i) => ({ ...q, id: `b${i}`, level: "基礎" })),
      ...data.practical.map((q, i) => ({ ...q, id: `p${i}`, level: "実践" })),
    ];
  }

  function chapterLabel(question) {
    if (question.level === "基礎") return "基礎";
    return window.PYTRAIN_CHAPTERS?.find((chapter) => chapter.value === question.chapter)?.label
      || `Chapter ${question.chapter}`;
  }

  function buildProgressMap(mode) {
    const stats = loadStats();
    const groups = new Map();

    bankWithIds().forEach((question) => {
      const label = mode === "chapter"
        ? chapterLabel(question)
        : `${question.level}・${question.category || "未分類"}`;
      if (!groups.has(label)) groups.set(label, { total: 0, answered: 0, latestCorrect: 0 });

      const group = groups.get(label);
      group.total += 1;
      const item = stats[question.id];
      if (!item?.attempts) return;

      group.answered += 1;
      const isLatestCorrect = typeof item.lastCorrect === "boolean"
        ? item.lastCorrect
        : (item.correct || 0) === item.attempts;
      if (isLatestCorrect) group.latestCorrect += 1;
    });

    const result = new Map();
    groups.forEach((group, label) => {
      const answeredProgress = group.total ? group.answered / group.total * 100 : 0;
      const correctProgress = group.total ? group.latestCorrect / group.total * 100 : 0;
      result.set(label, {
        answeredProgress: Math.max(0, Math.min(100, answeredProgress)),
        correctProgress: Math.max(0, Math.min(100, correctProgress)),
      });
    });
    return result;
  }

  function applyProgressWidths() {
    scheduled = false;
    const mode = document.getElementById("statsMode")?.value || "chapter";
    const progressMap = buildProgressMap(mode);

    document.querySelectorAll("#statsBars .stats-bar-item").forEach((bar) => {
      const label = bar.querySelector(".stats-bar-label")?.textContent?.trim();
      const widths = label ? progressMap.get(label) : null;
      if (!widths) return;

      const attemptsFill = bar.querySelector(".stats-bar-attempts");
      const correctFill = bar.querySelector(".stats-bar-correct");
      if (attemptsFill) attemptsFill.style.width = `${widths.answeredProgress}%`;
      if (correctFill) correctFill.style.width = `${widths.correctProgress}%`;
    });
  }

  function scheduleProgressUpdate() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(applyProgressWidths);
  }

  document.addEventListener("DOMContentLoaded", () => {
    const bars = document.getElementById("statsBars");
    const mode = document.getElementById("statsMode");
    if (!bars) return;

    new MutationObserver(scheduleProgressUpdate).observe(bars, { childList: true, subtree: true });
    mode?.addEventListener("change", scheduleProgressUpdate);
    document.getElementById("openStats")?.addEventListener("click", scheduleProgressUpdate);
    scheduleProgressUpdate();
  });
})();