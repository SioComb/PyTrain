(() => {
  function selectChapterMode() {
    const mode = document.getElementById("statsMode");
    if (mode) mode.value = "chapter";
  }

  document.addEventListener("DOMContentLoaded", selectChapterMode);
  document.addEventListener("click", (event) => {
    if (event.target.closest("#openStats")) selectChapterMode();
  }, true);
})();
