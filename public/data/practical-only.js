(() => {
  const data = window.PYTRAIN_REBALANCED_DATA;
  if (!data) throw new Error("PyTrain practical-only migration failed: data is unavailable");

  const includesAny = (text, words) => words.some((word) => text.includes(word));
  function inferChapter(question) {
    if (question.chapter) return question.chapter;
    const text = `${question.category || ""} ${question.q || ""} ${question.explanation || ""}`.toLowerCase();
    if (includesAny(text,["pip","venv","仮想環境","パッケージ管理"," uv","`uv","uv ","pyproject","wheel"])) return "01";
    if (includesAny(text,["mypy","型ヒント","typing","typealias","newtype","protocol","callable","literal","annotated","optional["])) return "05";
    if (includesAny(text,["pep 8","ruff","black","flake8","静的解析","コーディング規約","スタイルガイド","フォーマッター","リンター"])) return "02";
    if (includesAny(text,["dataclass","namedtuple","__getattr__","__getattribute__","__setattr__","__getitem__","__len__","__bool__","__eq__","__hash__","weakref","id(","type(","isinstance","issubclass","help(","dir(","クラス","継承","メソッド","属性"])) return "04";
    if (includesAny(text,["unicodedata","正規表現","re.","regex","f-string","文字列","string.","str.","bytes","encode","decode"])) return "06";
    if (includesAny(text,["decimal","statistics","random","math.","数値計算","擬似乱数","統計","演算子","int","float","complex","bool("])) return "07";
    if (includesAny(text,["datetime","zoneinfo","dateutil","time.","タイムゾーン","日付","時刻"])) return "08";
    if (includesAny(text,["sorted",".sort","operator","collections","bisect","enum","pprint","itertools","copy.","ソート","二分法","列挙型","コンテナ","リスト","タプル","集合","辞書","内包表記","イテレータ","ジェネレータ","zip(","enumerate(","all(","any("])) return "09";
    if (includesAny(text,["argparse","click","sys.","io.","os.","コマンドライン","ストリーム","インタープリター","input(","print(","モジュール","import"])) return "10";
    if (includesAny(text,["pathlib","tempfile","shutil","ファイルパス","一時ファイル","ディレクトリ","open(","ファイルを"])) return "11";
    if (includesAny(text,["gzip","zipfile","tarfile","pickle","圧縮","アーカイブ","シリアライズ"])) return "12";
    if (includesAny(text,["openpyxl","pillow","pyyaml","yaml","tomllib","toml","csv","json","excel","画像"])) return "13";
    if (includesAny(text,["urllib","requests","httpx","base64","base16","url","httpクライアント","インターネット"])) return "14";
    if (includesAny(text,["elementtree","element tree","lxml","beautifulsoup","beautiful soup","html","xml"])) return "15";
    if (includesAny(text,["doctest","unittest","pytest","mock","テスト","テストケース"])) return "16";
    if (includesAny(text,["breakpoint","pdb","timeit","traceback","logging","デバッグ","スタックトレース","ログ"])) return "17";
    if (includesAny(text,["secrets","hashlib","cryptography","ハッシュ","暗号","安全な乱数"])) return "18";
    if (includesAny(text,["asyncio","concurrent.futures","threading","multiprocessing","subprocess","イベントループ","マルチプロセス","マルチスレッド","非同期","並行処理","並列処理","サブプロセス"])) return "19";
    return "03";
  }

  const previousPracticalCount = data.practical.length;
  const migratedBasic = data.basic.map((question) => ({
    ...question,
    chapter: inferChapter(question),
    recipeSection: question.recipeSection || null,
  }));
  data.practical = [...data.practical, ...migratedBasic];
  data.basic = [];

  const blackQuestion = data.practical.find((question) => question.q === "Pythonコードフォーマッターとして有名なツールはどれ？");
  if (blackQuestion) {
    blackQuestion.q = "Blackでカレントディレクトリ以下のPythonコードを整形する基本コマンドはどれ？";
    blackQuestion.choices = ["black --check .", "black .", "black lint .", "python -m black --scan ."];
    blackQuestion.answer = 1;
    blackQuestion.explanation = "`black .` はカレントディレクトリ以下の対象ファイルをBlackで整形します。`black --check .` は変更せず、整形が必要かだけを確認します。";
  }

  try {
    const statsKey = "pytrain_question_stats_v1";
    const stats = JSON.parse(localStorage.getItem(statsKey) || "{}");
    let changed = false;
    Object.keys(stats).forEach((key) => {
      const match = /^b(\d+)$/.exec(key);
      if (!match) return;
      const target = `p${previousPracticalCount + Number(match[1])}`;
      if (!stats[target]) stats[target] = stats[key];
      delete stats[key];
      changed = true;
    });
    if (changed) localStorage.setItem(statsKey, JSON.stringify(stats));
  } catch (error) {
    console.warn("PyTrain stats migration failed:", error);
  }

  document.title = `PyTrain 実践検定対策${data.practical.length}問`;
  const description = document.querySelector('meta[name="description"]');
  if (description) description.content = `実践問題${data.practical.length}問をオフラインで学べるPythonクイズアプリ`;
  const badge = document.querySelector(".badge");
  if (badge) badge.textContent = `OFFLINE ${data.practical.length}問`;
  const menuSummary = document.querySelector("#menu h2 + .muted");
  if (menuSummary) menuSummary.textContent = `実践問題${data.practical.length}問。端末内だけで動作します。`;

  const level = document.getElementById("level");
  if (level) {
    level.innerHTML = `<option value="practical">実践試験クラス（${data.practical.length}問）</option>`;
    level.value = "practical";
    const label = level.closest("label");
    if (label) label.style.display = "none";
  }
})();