(() => {
  const moveFromBasicCategories = new Set(["uv", "静的解析・コード品質"]);

  const originalBasic = [...window.PYTRAIN_BASIC_1, ...window.PYTRAIN_BASIC_2];
  const originalPractical = [...window.PYTRAIN_PRACTICAL_1, ...window.PYTRAIN_PRACTICAL_2];

  const movedToPractical = originalBasic.filter((question) => moveFromBasicCategories.has(question.category));

  if (movedToPractical.length !== 17) {
    throw new Error(`PyTrain scope move failed: basic→practical=${movedToPractical.length}`);
  }

  const basic = originalBasic.filter((question) => !moveFromBasicCategories.has(question.category));
  const practical = [...originalPractical, ...movedToPractical];

  if (basic.length !== 183 || practical.length !== 217) {
    throw new Error(`PyTrain question count failed: basic=${basic.length}, practical=${practical.length}`);
  }

  window.PYTRAIN_REBALANCED_DATA = { basic, practical };

  // メニュー画面のランク要素IDを、共通のランク描画処理が参照する形式へ統一する。
  const rankIdMap = {
    rankSymbol: "RankSymbol",
    rankTitle: "RankTitle",
    rankDetail: "RankDetail",
  };
  Object.entries(rankIdMap).forEach(([currentId, expectedId]) => {
    const element = document.getElementById(currentId);
    if (element) element.id = expectedId;
  });
})();
