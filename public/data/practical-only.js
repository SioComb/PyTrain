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

  const unpackingQuestions = [
    {
      q: "次のコードの実行後、`name` と `score` の値はどれ？\n\n`name, (math, score) = (\"Sora\", (80, 92))`",
      choices: ["name='Sora', score=80", "name='Sora', score=92", "name=(80, 92), score='Sora'", "ValueErrorになる"],
      answer: 1,
      explanation: "ネストしたタプルは同じ入れ子構造でアンパックできます。`name` には `'Sora'`、`math` には `80`、`score` には `92` が入ります。",
      category: "アンパック",
      chapter: "03",
      recipeSection: null,
    },
    {
      q: "次のコードの実行後、`a`, `b`, `c` の値はどれ？\n\n`a, b, c = [10, 20, 30]`",
      choices: ["a=10, b=20, c=30", "a=[10], b=[20], c=[30]", "a=30, b=20, c=10", "リストはアンパックできない"],
      answer: 0,
      explanation: "リストも反復可能オブジェクトなので、要素数と変数数が一致すれば順番にアンパックできます。",
      category: "アンパック",
      chapter: "03",
      recipeSection: null,
    },
    {
      q: "次のコードの実行後、`middle` の値はどれ？\n\n`first, *middle, last = [1, 2, 3, 4, 5]`",
      choices: ["[2, 3, 4]", "(2, 3, 4)", "2", "[1, 2, 3, 4]"],
      answer: 0,
      explanation: "代入先の `*middle` は、先頭と末尾に割り当てられなかった残りの要素をリストとして受け取ります。",
      category: "アンパック",
      chapter: "03",
      recipeSection: null,
    },
    {
      q: "次のコードの出力はどれ？\n\n`def add(a, b):`\n`    return a + b`\n\n`values = [3, 7]`\n`print(add(*values))`",
      choices: ["[3, 7]", "10", "37", "TypeErrorになる"],
      answer: 1,
      explanation: "関数呼び出しの `*values` は、リストの要素を位置引数として展開します。したがって `add(3, 7)` と同じです。",
      category: "アンパック",
      chapter: "03",
      recipeSection: null,
    },
    {
      q: "辞書からキーと値を同時に取り出して表示するコードとして正しいものはどれ？\n\n`scores = {\"A\": 80, \"B\": 90}`",
      choices: ["`for key, value in scores.items(): print(key, value)`", "`for key, value in scores: print(key, value)`", "`for pair in scores.keys(), scores.values(): print(pair)`", "`for key = value in scores.items(): print(key, value)`"],
      answer: 0,
      explanation: "`dict.items()` は `(キー, 値)` のタプルを順に返します。`for key, value in scores.items()` では、そのタプルを各ループで2変数へアンパックしています。",
      category: "アンパック",
      chapter: "03",
      recipeSection: null,
    },
  ];
  data.practical.push(...unpackingQuestions);

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