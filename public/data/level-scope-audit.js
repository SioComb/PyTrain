(() => {
  const data = window.PYTRAIN_REBALANCED_DATA;
  if (!data) return;

  const practicalPatterns = [
    /\buv\b/i, /ruff/i, /black/i, /flake8/i, /pyproject\.toml/i,
    /pathlib/i, /shutil/i, /tempfile/i, /glob\(/i,
    /datetime/i, /timedelta/i, /zoneinfo/i, /strptime/i, /strftime/i,
    /json/i, /csv/i, /tomllib/i, /toml/i, /yaml/i, /openpyxl/i, /pillow/i,
    /argparse/i, /logging/i, /traceback/i, /pdb/i, /breakpoint\(/i, /timeit/i,
    /unittest/i, /pytest/i, /doctest/i, /mock/i,
    /asyncio/i, /async\s+def/i, /\bawait\b/i, /concurrent\.futures/i,
    /threading/i, /multiprocessing/i, /subprocess/i,
    /urllib/i, /requests/i, /httpx/i, /base64/i,
    /gzip/i, /zipfile/i, /tarfile/i, /pickle/i,
    /hashlib/i, /secrets/i, /cryptography/i,
    /dataclass/i, /default_factory/i, /namedtuple/i,
    /typing/i, /typealias/i, /newtype/i, /protocol/i, /annotated/i,
    /weakref/i, /__getattr__/i, /__getattribute__/i, /__setattr__/i,
    /descriptor/i, /metaclass/i, /mro/i,
    /正規表現/, /静的解析/, /コーディング規約/, /型ヒント/,
    /ファイルとディレクトリ/, /日付と時刻/, /並行処理/, /並列処理/,
    /暗号/, /アーカイブ/, /シリアライズ/, /デバッグ/, /テストケース/
  ];

  const textOf = (q) => `${q.category || ""}\n${q.q || ""}\n${q.explanation || ""}`;
  const isPractical = (q) => practicalPatterns.some((pattern) => pattern.test(textOf(q)));

  const previousBasic = [...data.basic];
  const moved = previousBasic.filter(isPractical);
  if (!moved.length) return;

  const remainingBasic = previousBasic.filter((q) => !isPractical(q));
  const existingPracticalKeys = new Set(data.practical.map((q) => `${q.q}\u0000${q.category || ""}`));
  const movedWithoutDuplicates = moved.filter((q) => !existingPracticalKeys.has(`${q.q}\u0000${q.category || ""}`));

  const inferChapter = (q) => {
    const text = textOf(q).toLowerCase();
    if (/uv|pip|venv|仮想環境|パッケージ管理/.test(text)) return "01";
    if (/ruff|black|flake8|pep 8|静的解析|コーディング規約/.test(text)) return "02";
    if (/dataclass|namedtuple|weakref|__getattr__|__getattribute__|__setattr__|descriptor|metaclass|mro|クラス|継承/.test(text)) return "04";
    if (/typing|typealias|newtype|protocol|annotated|型ヒント/.test(text)) return "05";
    if (/正規表現|regex|re\.|文字列処理/.test(text)) return "06";
    if (/datetime|timedelta|zoneinfo|strptime|strftime|日付|時刻/.test(text)) return "08";
    if (/argparse|logging|traceback|pdb|breakpoint|timeit|subprocess/.test(text)) return "10";
    if (/pathlib|shutil|tempfile|glob|ファイル|ディレクトリ/.test(text)) return "11";
    if (/gzip|zipfile|tarfile|pickle|圧縮|アーカイブ|シリアライズ/.test(text)) return "12";
    if (/json|csv|toml|yaml|openpyxl|pillow|excel|画像/.test(text)) return "13";
    if (/urllib|requests|httpx|base64|http/.test(text)) return "14";
    if (/unittest|pytest|doctest|mock|テスト/.test(text)) return "16";
    if (/logging|traceback|pdb|breakpoint|timeit|デバッグ/.test(text)) return "17";
    if (/hashlib|secrets|cryptography|暗号/.test(text)) return "18";
    if (/asyncio|async\s+def|await|concurrent\.futures|threading|multiprocessing|並行処理|並列処理/.test(text)) return "19";
    return "03";
  };

  data.basic = remainingBasic;
  data.practical = [
    ...data.practical,
    ...movedWithoutDuplicates.map((q) => ({...q, chapter: q.chapter || inferChapter(q), recipeSection: q.recipeSection || null}))
  ];

  window.PYTRAIN_SCOPE_AUDIT = {
    movedCount: movedWithoutDuplicates.length,
    basicCount: data.basic.length,
    practicalCount: data.practical.length,
    movedQuestions: movedWithoutDuplicates.map((q) => q.q)
  };

  document.addEventListener("DOMContentLoaded", () => {
    const badge = document.querySelector(".badge");
    if (badge) badge.textContent = `OFFLINE ${data.basic.length + data.practical.length}問`;

    const level = document.getElementById("level");
    if (level) {
      const basicOption = level.querySelector('option[value="basic"]');
      const practicalOption = level.querySelector('option[value="practical"]');
      const mixedOption = level.querySelector('option[value="mixed"]');
      if (basicOption) basicOption.textContent = `基礎試験クラス（${data.basic.length}問）`;
      if (practicalOption) practicalOption.textContent = `実践試験クラス（${data.practical.length}問）`;
      if (mixedOption) mixedOption.textContent = `混合（${data.basic.length + data.practical.length}問）`;
    }

    const summary = document.querySelector("#menu h2 + .muted");
    if (summary) summary.textContent = `基礎${data.basic.length}問＋実践${data.practical.length}問。基礎問題を出題範囲に沿って再精査済みです。`;

    if (typeof fillCategories === "function") fillCategories();
    if (typeof loadRecord === "function") loadRecord();
  });
})();
