(() => {
  document.addEventListener("DOMContentLoaded", () => {
    const select = document.getElementById("statsMode");
    if (!select) return;

    const chapter = [...select.options].find((option) => option.value === "chapter");
    const category = [...select.options].find((option) => option.value === "category");
    if (!chapter || !category) return;

    select.replaceChildren(chapter, category);
    select.value = "chapter";
  });
})();
