(() => {
  const moveFromBasicCategories = new Set(["uv", "静的解析・コード品質"]);
  const moveToBasicQuestions = new Set([
    "代入式（walrus演算子）はどれ？",
    "条件式の正しい構文はどれ？",
    "連鎖比較 `1 < x < 10` の説明として正しいものはどれ？",
    "短絡評価で `a and b` が返すものはどれ？",
    "短絡評価で `a or b` が返すものはどれ？",
    "`is` を数値や文字列の値比較へ使うべきでない主な理由はどれ？",
    "アンパック代入 `a, b = b, a` の効果はどれ？",
    "拡張アンパック `first, *rest = [1,2,3]` のrestはどれ？",
    "関数呼び出しで `*items` が行うことはどれ？",
    "関数呼び出しで `**options` が行うことはどれ？",
    "可変デフォルト引数を避ける主な理由はどれ？",
    "可変デフォルト引数の安全な代替として一般的なものはどれ？",
    "文字列のf-stringで式を埋め込む記号はどれ？",
    "raw文字列の主な特徴はどれ？",
    "bytesとstrの関係として正しいものはどれ？",
    "`'日本'.encode('utf-8')` が返す型はどれ？",
    "`b'abc'.decode('ascii')` が返す型はどれ？"
  ]);

  const originalBasic = [...window.PYTRAIN_BASIC_1, ...window.PYTRAIN_BASIC_2];
  const originalPractical = [...window.PYTRAIN_PRACTICAL_1, ...window.PYTRAIN_PRACTICAL_2];

  const movedToPractical = originalBasic.filter((question) => moveFromBasicCategories.has(question.category));
  const movedToBasic = originalPractical.filter((question) => moveToBasicQuestions.has(question.q));

  if (movedToPractical.length !== 17 || movedToBasic.length !== 17) {
    throw new Error(`PyTrain scope rebalance failed: basic→practical=${movedToPractical.length}, practical→basic=${movedToBasic.length}`);
  }

  const basic = [
    ...originalBasic.filter((question) => !moveFromBasicCategories.has(question.category)),
    ...movedToBasic
  ];
  const practical = [
    ...originalPractical.filter((question) => !moveToBasicQuestions.has(question.q)),
    ...movedToPractical
  ];

  window.PYTRAIN_REBALANCED_DATA = { basic, practical };
})();
