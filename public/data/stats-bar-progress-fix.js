(() => {
  let scheduled = false;

  function applyProgressWidths() {
    scheduled = false;
    const bars = [...document.querySelectorAll("#statsBars .stats-bar-item")];
    const rows = [...document.querySelectorAll("#statsRows tr")];
    if (!bars.length || bars.length !== rows.length) return;

    bars.forEach((bar, index) => {
      const cells = rows[index].querySelectorAll("td");
      if (cells.length < 5) return;
      const progress = Math.max(0, Math.min(100, Number.parseFloat(cells[3].textContent) || 0));
      const accuracy = Math.max(0, Math.min(100, Number.parseFloat(cells[4].textContent) || 0));
      const attemptsFill = bar.querySelector(".stats-bar-attempts");
      const correctFill = bar.querySelector(".stats-bar-correct");
      if (attemptsFill) attemptsFill.style.width = `${progress}%`;
      if (correctFill) correctFill.style.width = `${progress * accuracy / 100}%`;
    });
  }

  function scheduleProgressUpdate() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(applyProgressWidths);
  }

  document.addEventListener("DOMContentLoaded", () => {
    const bars = document.getElementById("statsBars");
    const rows = document.getElementById("statsRows");
    if (!bars || !rows) return;

    const observer = new MutationObserver(scheduleProgressUpdate);
    observer.observe(bars, { childList: true, subtree: true });
    observer.observe(rows, { childList: true, subtree: true });
    scheduleProgressUpdate();
  });
})();