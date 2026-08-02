(() => {
  function applyProgressWidths() {
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

  document.addEventListener("DOMContentLoaded", () => {
    const bars = document.getElementById("statsBars");
    if (!bars) return;
    new MutationObserver(applyProgressWidths).observe(bars, { childList: true, subtree: true });
    applyProgressWidths();
  });
})();