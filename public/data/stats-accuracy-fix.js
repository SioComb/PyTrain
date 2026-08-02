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

  function latestAccuracyByLabel(mode) {
    const stats = loadStats();
    const groups = new Map();

    bankWithIds().forEach((question) => {
      const label = groupLabel(question, mode);
      if (!groups.has(label)) groups.set(label, { answered: 0, latestCorrect: 0 });
      const item = stats[question.id];
      if (!item?.attempts) return;

      const group = groups.get(label);
      group.answered += 1;
      const isLatestCorrect = typeof item.lastCorrect === "boolean"
        ? item.lastCorrect
        : (item.correct || 0) === item.attempts;
      if (isLatestCorrect) group.latestCorrect += 1;
    });

    return new Map([...groups].map(([label, group]) => [
      label,
      group.answered ? Math.round(group.latestCorrect / group.answered * 100) : 0,
    ]));
  }

  function applyLatestAccuracy() {
    scheduled = false;
    const mode = document.getElementById("statsMode")?.value || "chapter";
    const accuracyMap = latestAccuracyByLabel(mode);

    document.querySelectorAll("#statsRows tr").forEach((row) => {
      const cells = row.querySelectorAll("td");
      if (cells.length < 5) return;
      const label = cells[0].textContent.trim();
      const accuracy = accuracyMap.get(label) ?? 0;
      cells[4].textContent = `${accuracy}%`;
      cells[4].classList.toggle("stats-weak", accuracy < 60 && Number.parseInt(cells[1].textContent, 10) > 0);
      cells[4].classList.toggle("stats-unmeasured", Number.parseInt(cells[1].textContent, 10) === 0);
    });

    document.querySelectorAll("#statsBars .stats-bar-item").forEach((bar) => {
      const label = bar.querySelector(".stats-bar-label")?.textContent.trim();
      if (!label) return;
      const accuracy = accuracyMap.get(label) ?? 0;
      const rate = bar.querySelector(".stats-bar-rate");
      if (rate) rate.textContent = `正答率 ${accuracy}%`;
    });

    const measured = [...accuracyMap.entries()].filter(([label]) => {
      const row = [...document.querySelectorAll("#statsRows tr")].find((tr) => tr.querySelector("td")?.textContent.trim() === label);
      return row && Number.parseInt(row.querySelectorAll("td")[1].textContent, 10) > 0;
    });
    measured.sort((a, b) => a[1] - b[1]);
    const summary = document.getElementById("statsSummary");
    if (summary && measured.length) summary.textContent = `現在もっとも弱い項目: ${measured[0][0]}（正答率 ${measured[0][1]}%）`;
  }

  function scheduleUpdate() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(applyLatestAccuracy);
  }

  document.addEventListener("DOMContentLoaded", () => {
    const rows = document.getElementById("statsRows");
    const bars = document.getElementById("statsBars");
    if (!rows || !bars) return;
    const observer = new MutationObserver(scheduleUpdate);
    observer.observe(rows, { childList: true, subtree: true });
    observer.observe(bars, { childList: true, subtree: true });
    document.getElementById("statsMode")?.addEventListener("change", scheduleUpdate);
    document.getElementById("openStats")?.addEventListener("click", scheduleUpdate);
    scheduleUpdate();
  });
})();