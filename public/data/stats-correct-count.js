(() => {
  const HISTORY_KEY = "pytrain_question_stats_v1";
  let scheduled = false;

  function loadStats() {
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || "{}"); }
    catch { return {}; }
  }

  function bankWithIds() {
    const data = window.PYTRAIN_REBALANCED_DATA;
    if (!data) return [];
    return [
      ...data.basic.map((q, i) => ({ ...q, id: `b${i}`, level: "基礎" })),
      ...data.practical.map((q, i) => ({ ...q, id: `p${i}`, level: "実践" })),
    ];
  }

  function groupLabel(question, mode) {
    if (mode === "chapter") {
      if (question.level === "基礎") return "基礎";
      return window.PYTRAIN_CHAPTERS?.find((chapter) => chapter.value === question.chapter)?.label || `Chapter ${question.chapter}`;
    }
    return `${question.level}・${question.category || "未分類"}`;
  }

  function correctCounts(mode) {
    const stats = loadStats();
    const counts = new Map();
    bankWithIds().forEach((question) => {
      const label = groupLabel(question, mode);
      if (!counts.has(label)) counts.set(label, 0);
      const item = stats[question.id];
      if (!item?.attempts) return;
      const latestCorrect = typeof item.lastCorrect === "boolean"
        ? item.lastCorrect
        : (item.correct || 0) === item.attempts;
      if (latestCorrect) counts.set(label, counts.get(label) + 1);
    });
    return counts;
  }

  function applyCorrectCount() {
    scheduled = false;
    const table = document.querySelector("#statsTableView .stats-table");
    if (!table) return;

    const headerRow = table.querySelector("thead tr");
    if (headerRow && !headerRow.querySelector(".stats-correct-count-head")) {
      const th = document.createElement("th");
      th.className = "stats-correct-count-head";
      th.textContent = "正解数";
      const accuracyHead = [...headerRow.children].find((cell) => cell.textContent.trim() === "正答率");
      headerRow.insertBefore(th, accuracyHead || null);
    }

    const mode = document.getElementById("statsMode")?.value || "chapter";
    const counts = correctCounts(mode);
    document.querySelectorAll("#statsRows tr").forEach((row) => {
      const label = row.querySelector("td")?.textContent.trim();
      if (!label) return;
      let cell = row.querySelector(".stats-correct-count-cell");
      if (!cell) {
        cell = document.createElement("td");
        cell.className = "stats-correct-count-cell";
        const accuracyCell = row.lastElementChild;
        row.insertBefore(cell, accuracyCell);
      }
      cell.textContent = String(counts.get(label) || 0);
    });
  }

  function scheduleUpdate() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(applyCorrectCount);
  }

  document.addEventListener("DOMContentLoaded", () => {
    const rows = document.getElementById("statsRows");
    if (!rows) return;
    new MutationObserver(scheduleUpdate).observe(rows, { childList: true, subtree: true });
    document.getElementById("statsMode")?.addEventListener("change", scheduleUpdate);
    document.getElementById("openStats")?.addEventListener("click", scheduleUpdate);
    scheduleUpdate();
  });
})();
