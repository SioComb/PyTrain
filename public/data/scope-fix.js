(() => {
  const moveFromBasicCategories = new Set(["uv", "静的解析・コード品質"]);
  const objectInspectionQuestions = [
    {q:"`id(obj)` の戻り値について正しいものはどれ？",choices:["オブジェクトの識別値を表す整数","オブジェクトの型名を表す文字列","参照カウント","メモリアドレスを表す文字列"],answer:0,explanation:"`id(obj)` は、そのオブジェクトの識別値を整数で返します。同じ生存期間中の同一オブジェクトでは同じ値です。",category:"オブジェクト"},
    {q:"次のコードで `id(a) == id(b)` の結果はどれ？\n\n```python\na = []\nb = a\n```",choices:["False","True","実行ごとに変わる","TypeError"],answer:1,explanation:"`b = a` は同じリストオブジェクトへの参照を代入します。そのため `id(a)` と `id(b)` は等しくなります。",category:"オブジェクト"},
    {q:"次の説明として正しいものはどれ？\n\n```python\na = [1, 2]\nb = [1, 2]\n```",choices:["`a == b` も `id(a) == id(b)` も常にFalse","`a == b` がTrueなら必ず同一オブジェクト","値は等しいが、別オブジェクトなので識別値が異なる","リストでは `id()` を使用できない"],answer:2,explanation:"2つのリストは値としては等しいため `a == b` はTrueですが、別々に生成されたオブジェクトなので通常は `id(a) != id(b)` です。",category:"オブジェクト"},
    {q:"`type(obj)` が返すものはどれ？",choices:["継承元クラスの一覧","真偽値","型名の文字列","オブジェクトの型オブジェクト"],answer:3,explanation:"`type(obj)` は、`obj` の型を表す型オブジェクトを返します。たとえば `type(1)` は `int` です。",category:"組み込み関数"},
    {q:"次のコードの結果はどれ？\n\n```python\nclass Parent:\n    pass\n\nclass Child(Parent):\n    pass\nobj = Child()\nprint(type(obj) is Parent)\nprint(isinstance(obj, Parent))\n```",choices:["False と True","True と True","False と False","True と False"],answer:0,explanation:"`type(obj) is Parent` は型の完全一致を見るためFalseです。`isinstance(obj, Parent)` は継承関係も考慮するためTrueです。",category:"クラス"},
    {q:"`type(obj) is Class` と `isinstance(obj, Class)` の違いとして正しいものはどれ？",choices:["どちらも常に同じ結果","前者は型の完全一致、後者はサブクラスも含めて判定","前者だけ継承関係を考慮","後者は型名の文字列を比較"],answer:1,explanation:"`type(obj) is Class` は実際の型がClassそのものかを判定します。`isinstance()` はClassまたはそのサブクラスのインスタンスもTrueになります。",category:"クラス"},
    {q:"次のコードの結果はどれ？\n\n```python\nvalue = 3.14\nisinstance(value, (int, float, complex))\n```",choices:["False","TypeError","True","`float`"],answer:2,explanation:"`isinstance()` の第2引数には型のタプルを渡せます。いずれかの型に該当すればTrueです。",category:"組み込み関数"},
    {q:"`issubclass(Child, Parent)` が判定するものはどれ？",choices:["Childのインスタンス数","ChildとParentの値の等価性","ParentがChildのインスタンスか","ChildがParentのサブクラスか"],answer:3,explanation:"`issubclass(Child, Parent)` は、第1引数のクラスが第2引数のクラスのサブクラスであるかを判定します。",category:"クラス"},
    {q:"次の4つの式の評価結果として正しい組み合わせはどれ？\n\n```python\ntype(True) is bool\ntype(True) is int\nisinstance(True, int)\nissubclass(bool, int)\n```",choices:["True, False, True, True","True, True, True, True","False, False, True, True","True, False, False, False"],answer:0,explanation:"`True` の実際の型は `bool` なので前2つはTrue、Falseです。`bool` は `int` のサブクラスなので、後2つはTrueになります。",category:"クラス"},
    {q:"`help(obj)` の主な用途はどれ？",choices:["オブジェクトを削除する","オブジェクトや型に関するヘルプを表示する","属性を追加する","識別値を変更する"],answer:1,explanation:"`help(obj)` は、対象のドキュメントや利用方法などのヘルプ情報を表示します。",category:"組み込み関数"},
    {q:"`dir(obj)` が返す内容として最も適切なものはどれ？",choices:["オブジェクトの識別値","オブジェクトの継承段数","属性名やメソッド名の一覧","ヘルプ文書そのもの"],answer:2,explanation:"`dir(obj)` は、そのオブジェクトから参照できる属性名やメソッド名などを一覧として返します。",category:"オブジェクト"},
    {q:"`dir(obj)` の戻り値の型はどれ？",choices:["tuple","set","dict","list"],answer:3,explanation:"`dir(obj)` の戻り値は、属性名を文字列要素として持つリストです。",category:"組み込み関数"},
  ];
  const CHAPTERS = [
    ["01","Chapter 1　Pythonの環境"],["02","Chapter 2　コーディング規約"],["03","Chapter 3　Pythonの言語仕様"],["04","Chapter 4　Pythonのクラス"],["05","Chapter 5　型ヒント"],["06","Chapter 6　テキストの処理"],["07","Chapter 7　数値の処理"],["08","Chapter 8　日付と時刻の処理"],["09","Chapter 9　データ型とアルゴリズム"],["10","Chapter 10　汎用OS・ランタイムサービス"],["11","Chapter 11　ファイルとディレクトリへのアクセス"],["12","Chapter 12　データ圧縮、アーカイブと永続化"],["13","Chapter 13　特定のデータフォーマットを扱う"],["14","Chapter 14　インターネット上のデータを扱う"],["15","Chapter 15　HTML/XMLを扱う"],["16","Chapter 16　テスト"],["17","Chapter 17　デバッグ"],["18","Chapter 18　暗号関連"],["19","Chapter 19　並行処理、並列処理"],
  ];
  const CHAPTER4_SECTIONS = [["4.1","4.1　class構文"],["4.2","4.2　属性とメソッド"],["4.3","4.3　継承"],["4.4","4.4　dataclass"],["4.5","4.5　オブジェクト関連関数"]];
  const chapterLabel = Object.fromEntries(CHAPTERS);
  const chapter4Label = Object.fromEntries(CHAPTER4_SECTIONS);
  const includesAny = (text, words) => words.some((word) => text.includes(word));
  function inferChapter(question) {
    const text = `${question.category || ""} ${question.q || ""} ${question.explanation || ""}`.toLowerCase();
    if (includesAny(text,["pip","venv","仮想環境","パッケージ管理"," uv","`uv","uv "])) return "01";
    if (includesAny(text,["pep 8","ruff","black","flake8","静的解析","コーディング規約","スタイルガイド"])) return "02";
    if (includesAny(text,["dataclass","namedtuple","__getattr__","__getattribute__","__setattr__","__getitem__","__len__","__bool__","__eq__","__hash__","weakref","id(","type(","isinstance","issubclass","help(","dir(","クラス","継承","メソッド","属性"])) return "04";
    if (includesAny(text,["mypy","型ヒント","typing","typealias","newtype","protocol","callable","literal","annotated","iterable","iterator["])) return "05";
    if (includesAny(text,["unicodedata","正規表現","re.","regex","f-string","t-string","文字列","string.","str."])) return "06";
    if (includesAny(text,["decimal","statistics","random","math.","数値計算","擬似乱数","統計"])) return "07";
    if (includesAny(text,["datetime","zoneinfo","dateutil","time.","タイムゾーン","日付","時刻"])) return "08";
    if (includesAny(text,["sorted",".sort","operator","collections","bisect","enum","pprint","itertools","copy.","ソート","二分法","列挙型","コンテナ"])) return "09";
    if (includesAny(text,["argparse","click","sys.","io.","os.","コマンドライン","ストリーム","インタープリター"])) return "10";
    if (includesAny(text,["pathlib","tempfile","shutil","ファイルパス","一時ファイル","ディレクトリ"])) return "11";
    if (includesAny(text,["gzip","zipfile","tarfile","pickle","圧縮","アーカイブ","シリアライズ"])) return "12";
    if (includesAny(text,["openpyxl","pillow","pyyaml","yaml","tomllib","toml","csv","json","excel","画像"])) return "13";
    if (includesAny(text,["urllib","requests","httpx","base64","base16","url","httpクライアント"])) return "14";
    if (includesAny(text,["elementtree","element tree","lxml","beautifulsoup","beautiful soup","html","xml"])) return "15";
    if (includesAny(text,["doctest","unittest","pytest","mock","テスト","テストケース"])) return "16";
    if (includesAny(text,["breakpoint","pdb","timeit","traceback","logging","デバッグ","スタックトレース","ログ"])) return "17";
    if (includesAny(text,["secrets","hashlib","cryptography","ハッシュ","暗号","安全な乱数"])) return "18";
    if (includesAny(text,["asyncio","concurrent.futures","subprocess","マルチプロセス","マルチスレッド","非同期","並行処理","並列処理"])) return "19";
    return "03";
  }
  function inferChapter4Section(question) {
    const text = `${question.category || ""} ${question.q || ""} ${question.explanation || ""}`.toLowerCase();
    if (includesAny(text,["id(","type(","isinstance","issubclass","help(","dir(","weakref","オブジェクトの識別","組み込み関数"])) return "4.5";
    if (includesAny(text,["dataclass","namedtuple","default_factory","frozen=","field("])) return "4.4";
    if (includesAny(text,["継承","super(","mro","サブクラス","基底クラス","親クラス","子クラス","parent","child("])) return "4.3";
    if (includesAny(text,["属性","メソッド","__getattr__","__getattribute__","__setattr__","__getitem__","__setitem__","__len__","__bool__","__eq__","__hash__","classmethod","staticmethod","property","self."])) return "4.2";
    return "4.1";
  }
  const originalBasic = [...window.PYTRAIN_BASIC_1, ...window.PYTRAIN_BASIC_2];
  const originalPractical = [...window.PYTRAIN_PRACTICAL_1, ...window.PYTRAIN_PRACTICAL_2];
  const movedToPractical = originalBasic.filter((question) => moveFromBasicCategories.has(question.category));
  if (movedToPractical.length !== 17) throw new Error(`PyTrain scope move failed: basic→practical=${movedToPractical.length}`);
  const basic = originalBasic.filter((question) => !moveFromBasicCategories.has(question.category));
  const practical = [...originalPractical, ...movedToPractical, ...objectInspectionQuestions].map((question) => {
    const chapter = inferChapter(question);
    return {...question, chapter, recipeSection: chapter === "04" ? inferChapter4Section(question) : null};
  });
  if (basic.length !== 183 || practical.length !== 229) throw new Error(`PyTrain question count failed: basic=${basic.length}, practical=${practical.length}`);
  window.PYTRAIN_REBALANCED_DATA = { basic, practical };
  window.PYTRAIN_CHAPTERS = CHAPTERS.map(([value,label]) => ({value,label}));
  document.title = "PyTrain 検定対策412問";
  const description = document.querySelector('meta[name="description"]');
  if (description) description.content = "基礎183問＋実践229問をオフラインで学べるPythonクイズアプリ";
  const badge = document.querySelector(".badge");
  if (badge) badge.textContent = "OFFLINE 412問";
  const menuSummary = document.querySelector("#menu h2 + .muted");
  if (menuSummary) menuSummary.textContent = "基礎183問＋実践229問。端末内だけで動作します。";
  const level = document.getElementById("level");
  if (level) {
    level.querySelector('option[value="basic"]').textContent = "基礎試験クラス（183問）";
    level.querySelector('option[value="practical"]').textContent = "実践試験クラス（229問）";
    level.querySelector('option[value="mixed"]').textContent = "混合（412問）";
  }
  const rankIdMap = {rankSymbol:"RankSymbol",rankTitle:"RankTitle",rankDetail:"RankDetail"};
  Object.entries(rankIdMap).forEach(([currentId, expectedId]) => { const element = document.getElementById(currentId); if (element) element.id = expectedId; });

  document.addEventListener("DOMContentLoaded", () => {
    const category = document.getElementById("category");
    const categoryLabelElement = category?.closest("label");
    const start = document.getElementById("start");
    if (!categoryLabelElement || !start) return;
    const chapterLabelElement = document.createElement("label");
    chapterLabelElement.id = "chapterFilter";
    chapterLabelElement.innerHTML = `Python実践レシピの章<select id="chapter"><option value="all">すべてのChapter</option>${CHAPTERS.map(([value,label]) => `<option value="${value}">${label}</option>`).join("")}</select>`;
    categoryLabelElement.before(chapterLabelElement);
    const chapter = document.getElementById("chapter");
    const progress = document.createElement("div");
    progress.id = "progressTable";
    progress.style.cssText = "margin-top:4px;border:1px solid #334155;border-radius:12px;overflow:hidden";
    progress.innerHTML = '<div style="padding:10px 12px;font-weight:800;background:#0b1220">学習実績</div><div id="progressRows"></div>';
    document.getElementById("record")?.after(progress);

    function bankWithIds(levelValue) {
      const basicBank = window.PYTRAIN_REBALANCED_DATA.basic.map((q,i) => ({...q,id:`b${i}`,level:"基礎"}));
      const practicalBank = window.PYTRAIN_REBALANCED_DATA.practical.map((q,i) => ({...q,id:`p${i}`,level:"実践"}));
      if (levelValue === "basic") return basicBank;
      if (levelValue === "practical") return practicalBank;
      return [...basicBank, ...practicalBank];
    }
    function selectedFilterValue(question) { return chapter.value === "04" ? question.recipeSection : question.category; }
    function exactEligiblePool() {
      let questions = bankWithIds(level.value);
      if (level.value === "practical" && chapter.value !== "all") questions = questions.filter((q) => q.chapter === chapter.value);
      if (category.value !== "all") questions = questions.filter((q) => selectedFilterValue(q) === category.value);
      if (document.getElementById("unansweredOnly").checked) {
        const answeredIds = loadAnswered();
        questions = questions.filter((q) => !answeredIds.has(q.id));
      }
      return [...new Map(questions.map((q) => [q.id, q])).values()];
    }
    function refillCategories() {
      const practicalMode = level.value === "practical";
      chapterLabelElement.classList.toggle("hidden", !practicalMode);
      if (!practicalMode) chapter.value = "all";
      const selectedCategory = category.value;
      let questions = bankWithIds(level.value);
      if (practicalMode && chapter.value !== "all") questions = questions.filter((q) => q.chapter === chapter.value);
      const values = [...new Set(questions.map(selectedFilterValue).filter(Boolean))].sort();
      const isChapter4 = practicalMode && chapter.value === "04";
      categoryLabelElement.childNodes[0].nodeValue = isChapter4 ? "Python実践レシピ Chapter 4 の項目" : "カテゴリ";
      category.innerHTML = '<option value="all">すべて</option>' + values.map((value) => `<option value="${value}">${isChapter4 ? chapter4Label[value] : value}</option>`).join("");
      category.value = values.includes(selectedCategory) ? selectedCategory : "all";
      updateProgress();
    }
    function updateProgress() {
      const answeredIds = loadAnswered();
      const rows = [];
      const basicBank = bankWithIds("basic");
      const basicAnswered = basicBank.filter((q) => answeredIds.has(q.id)).length;
      rows.push(["基礎", basicBank.length, basicAnswered]);
      CHAPTERS.forEach(([value,label]) => {
        const questions = bankWithIds("practical").filter((q) => q.chapter === value);
        const answered = questions.filter((q) => answeredIds.has(q.id)).length;
        rows.push([label.replace("Chapter ","Ch."), questions.length, answered]);
      });
      document.getElementById("progressRows").innerHTML = rows.map(([label,total,answered]) => {
        const remaining = total - answered;
        const rate = total ? Math.round(answered / total * 100) : 0;
        return `<div style="display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;padding:8px 12px;border-top:1px solid #334155;font-size:12px"><span>${label}</span><span>${answered}/${total}（未回答 ${remaining}・${rate}%）</span></div>`;
      }).join("");
      const eligible = exactEligiblePool().length;
      const count = document.getElementById("count");
      const selected = count.value === "all" ? eligible : Math.min(Number(count.value), eligible);
      start.textContent = document.getElementById("unansweredOnly").checked ? `未回答 ${selected}問を開始（残り${eligible}問）` : "問題を開始";
    }
    level.addEventListener("change", () => setTimeout(refillCategories, 0));
    chapter.addEventListener("change", refillCategories);
    category.addEventListener("change", updateProgress);
    document.getElementById("unansweredOnly").addEventListener("change", updateProgress);
    document.getElementById("count").addEventListener("change", updateProgress);
    start.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      const eligible = exactEligiblePool();
      if (!eligible.length) {
        alert(document.getElementById("unansweredOnly").checked ? "指定条件の未回答問題はありません。" : "該当する問題がありません。");
        return;
      }
      const countValue = document.getElementById("count").value;
      const requested = countValue === "all" ? eligible.length : Number(countValue);
      begin(shuffle(eligible).slice(0, Math.min(requested, eligible.length)));
    }, true);
    refillCategories();
  });
})();
