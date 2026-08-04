(() => {
  const typeHintQuestions = [
    {q:"次の変数アノテーションの意味として正しいものはどれ？\n\n```python\ncount: int = 10\n```",choices:["countには整数しか代入できず、違反すると必ず実行時例外になる","countの型としてintを型チェッカーへ伝え、初期値10を代入する","countを定数として宣言する","countをintへ自動変換する"],answer:1,explanation:"型ヒントは主に静的解析用の情報です。`count: int = 10` はint型を想定しつつ、実際に10を代入しています。",category:"タイプヒント",chapter:"05"},
    {q:"次の関数定義で、引数と戻り値の型ヒントの組み合わせはどれ？\n\n```python\ndef greet(name: str) -> str:\n    return f\"Hello, {name}\"\n```",choices:["引数はstr、戻り値もstr","引数はstr、戻り値はNone","引数は任意、戻り値はstr","引数も戻り値も実行時に強制変換される"],answer:0,explanation:"`name: str` が引数、`-> str` が戻り値の型ヒントです。実行時の型変換を自動で行う機能ではありません。",category:"タイプヒント",chapter:"05"},
    {q:"整数だけを要素に持つリストの型ヒントとして適切なのはどれ？",choices:["list(int)","List<int>","list[int]","[int]"],answer:2,explanation:"Python 3.9以降では組み込みジェネリック型として `list[int]` を使用できます。",category:"タイプヒント",chapter:"05"},
    {q:"キーが文字列、値が整数の辞書を表す型ヒントはどれ？",choices:["dict[str, int]","dict(str, int)","{str: int}","Dict<str, int>"],answer:0,explanation:"`dict[str, int]` はキー型がstr、値型がintの辞書を表します。",category:"タイプヒント",chapter:"05"},
    {q:"次の戻り値型ヒントとして最も適切なのはどれ？\n\n```python\ndef notify(message: str):\n    print(message)\n```",choices:["-> str","-> bool","-> None","-> NoReturn"],answer:2,explanation:"明示的な値を返さない通常の関数は `-> None` と注釈します。`NoReturn` は正常終了しない関数向けです。",category:"タイプヒント",chapter:"05"},
    {q:"`str | None` が表すものはどれ？",choices:["文字列とNoneを同時に保持するタプル","strまたはNoneのどちらか","strをNoneへ変換する演算","Noneを許可しないstr"],answer:1,explanation:"PEP 604のUnion表記で、値がstrまたはNoneであることを表します。",category:"タイプヒント",chapter:"05"},
    {q:"次の型ヒントが表す関数はどれ？\n\n```python\nCallable[[int, int], str]\n```",choices:["intを2個受け取りstrを返す呼び出し可能オブジェクト","strを2個受け取りintを返す関数","引数なしでstrを返す関数","intまたはstrを返す任意の関数"],answer:0,explanation:"`Callable[[引数型...], 戻り値型]` の順で記述します。",category:"タイプヒント",chapter:"05"},
    {q:"`Iterable[int]` と `Iterator[int]` の違いとして正しいものはどれ？",choices:["Iterableは必ず`__next__()`を持ち、Iteratorは持たない","両者は完全に同じ","Iteratorは`__next__()`を持ち、Iterableは反復子を返せればよい","Iterableは整数専用、Iteratorは文字列専用"],answer:2,explanation:"Iterableは反復可能な対象、Iteratorは次の要素を返す`__next__()`を持つ反復子です。",category:"タイプヒント",chapter:"05"},
    {q:"次のジェネレータ型の3つの型引数の順序はどれ？\n\n```python\nGenerator[int, str, bool]\n```",choices:["return, yield, send","yield, send, return","send, return, yield","yield, return, send"],answer:1,explanation:"`Generator[YieldType, SendType, ReturnType]` の順です。",category:"タイプヒント",chapter:"05"},
    {q:"`typing.cast(int, value)` の実行時動作として正しいものはどれ？",choices:["valueを必ずintへ変換する","valueがintでなければTypeErrorを送出する","値は変換せず、そのまま返して型チェッカーへ情報を与える","int型の新しいラッパーを作る"],answer:2,explanation:"`cast` は実行時変換を行いません。静的型チェッカーに型情報を伝えるための関数です。",category:"タイプヒント",chapter:"05"}
  ];

  const classQuestions = [
    {q:"次のコードの実行結果はどれ？\n\n```python\nclass Sample:\n    def __new__(cls):\n        print(\"new\")\n        return super().__new__(cls)\n\n    def __init__(self):\n        print(\"init\")\n\nSample()\n```",choices:["init → new","new → init","newのみ","エラー"],answer:1,explanation:"インスタンス生成では最初に`__new__()`が呼ばれ、生成されたインスタンスを`__init__()`が初期化します。",category:"クラス",chapter:"04",recipeSection:"4.1"},
    {q:"次のコードの実行結果はどれ？\n\n```python\nclass Sample:\n    def __new__(cls):\n        print(\"new\")\n        return None\n\n    def __init__(self):\n        print(\"init\")\n\nobj = Sample()\nprint(obj)\n```",choices:["new / init / None","new / None","init / None","エラー"],answer:1,explanation:"`__new__()`が対象クラスのインスタンスを返さない場合、`__init__()`は呼ばれません。",category:"クラス",chapter:"04",recipeSection:"4.1"},
    {q:"クラス定義とインスタンス生成として正しい組み合わせはどれ？",choices:["`class User(): ...` と `u = User()`","`def User: ...` と `u = new User()`","`class User = ...` と `u = User.new()`","`object User: ...` と `u = object(User)`"],answer:0,explanation:"Pythonでは`class`文でクラスを定義し、クラスを呼び出してインスタンスを生成します。",category:"クラス",chapter:"04",recipeSection:"4.1"},
    {q:"次のコードの出力はどれ？\n\n```python\nclass Item:\n    value = 10\n\na = Item()\nb = Item()\na.value = 20\nprint(a.value, b.value, Item.value)\n```",choices:["20 20 20","20 10 10","10 10 10","20 20 10"],answer:1,explanation:"`a.value = 20`でaだけにインスタンス属性が作られ、クラス属性をシャドーイングします。",category:"クラス",chapter:"04",recipeSection:"4.2"},
    {q:"次のコードの出力はどれ？\n\n```python\nclass Score:\n    value = 5\n\ns = Score()\ns.value += 5\nprint(s.value, Score.value)\n```",choices:["10 5","10 10","5 5","エラー"],answer:0,explanation:"読み取り時はクラス属性5を参照し、`+=`の代入でsにインスタンス属性10が作られます。",category:"クラス",chapter:"04",recipeSection:"4.2"},
    {q:"インスタンスメソッドの第1引数`self`について正しいものはどれ？",choices:["クラスそのものを受け取る","呼び出し対象のインスタンスを受け取る","必ず文字列である","省略しても同じ動作になる"],answer:1,explanation:"インスタンスメソッドを`obj.method()`で呼ぶと、objが第1引数selfへ渡されます。",category:"クラス",chapter:"04",recipeSection:"4.2"},
    {q:"次の2つの呼び出しの関係として正しいものはどれ？\n\n```python\nobj.method()\nClass.method(obj)\n```",choices:["一般に同じインスタンスメソッド呼び出しを表す","後者だけclassmethodになる","前者だけselfを渡さない","常に結果が異なる"],answer:0,explanation:"通常のインスタンスメソッドでは、`obj.method()`は`Class.method(obj)`に対応します。",category:"クラス",chapter:"04",recipeSection:"4.2"},
    {q:"`@classmethod`で第1引数`cls`に渡されるものはどれ？",choices:["呼び出し元のインスタンス","クラス","親クラスだけ","メソッド名"],answer:1,explanation:"クラスメソッドはクラスを第1引数clsとして受け取ります。",category:"クラス",chapter:"04",recipeSection:"4.2"},
    {q:"代替コンストラクタとしてclassmethodを使う主な理由はどれ？",choices:["インスタンス生成を禁止するため","異なる入力形式から`cls(...)`でインスタンスを作れるため","selfを2つ受け取るため","継承を無効化するため"],answer:1,explanation:"classmethodで`return cls(...)`とすれば、サブクラスから呼んだ場合もそのサブクラスを生成できます。",category:"クラス",chapter:"04",recipeSection:"4.2"},
    {q:"`@staticmethod`について正しいものはどれ？",choices:["第1引数にselfが自動で渡る","第1引数にclsが自動で渡る","selfやclsは自動では渡らない","クラス外から呼べない"],answer:2,explanation:"staticmethodは名前空間としてクラスに属しますが、selfやclsの自動注入はありません。",category:"クラス",chapter:"04",recipeSection:"4.2"},
    {q:"`print(obj)`が優先して利用する特殊メソッドはどれ？",choices:["`__repr__()`のみ","`__str__()`","`__len__()`","`__eq__()`"],answer:1,explanation:"`print()`や`str()`はまず`__str__()`を利用します。未定義なら`__repr__()`へフォールバックします。",category:"クラス",chapter:"04",recipeSection:"4.2"},
    {q:"`repr(obj)`の主な目的として最も適切なのはどれ？",choices:["ユーザー向けの必ず短い表示","開発者向けの曖昧さが少ない表現","オブジェクトの長さ","等価比較"],answer:1,explanation:"`__repr__()`はデバッグなどで役立つ、できるだけ明確な表現を返すために使われます。",category:"クラス",chapter:"04",recipeSection:"4.2"},
    {q:"`a == b`に対応する特殊メソッドはどれ？",choices:["`__len__`","`__eq__`","`__same__`","`__compare__`"],answer:1,explanation:"等価比較`==`は主に`__eq__()`でカスタマイズします。",category:"クラス",chapter:"04",recipeSection:"4.2"},
    {q:"`len(obj)`に対応する特殊メソッドはどれ？",choices:["`__size__`","`__count__`","`__len__`","`length`"],answer:2,explanation:"`len(obj)`は`obj.__len__()`を呼び出します。",category:"クラス",chapter:"04",recipeSection:"4.2"},
    {q:"子クラスで`__init__()`を定義した場合、親クラスの`__init__()`はどうなる？",choices:["必ず自動実行される","自動では実行されないため、必要なら明示的に呼ぶ","Pythonがランダムに選ぶ","親クラスを継承できなくなる"],answer:1,explanation:"子クラス独自の`__init__()`を定義すると、親の初期化が必要な場合は`super().__init__()`などで明示的に呼びます。",category:"クラス",chapter:"04",recipeSection:"4.3"},
    {q:"`super().__init__()`の主な用途はどれ？",choices:["親クラス側の初期化処理を呼ぶ","現在のクラスを削除する","MROを逆順にする","新しい静的メソッドを作る"],answer:0,explanation:"継承時に親側の初期化処理を協調的に呼び出すために使います。",category:"クラス",chapter:"04",recipeSection:"4.3"},
    {q:"子クラスで親と同名のメソッドを定義することを何という？",choices:["オーバーライド","オーバーロードのみ","シャローコピー","デコレーション"],answer:0,explanation:"親クラスの実装を子クラス側で置き換えることをオーバーライドと呼びます。",category:"クラス",chapter:"04",recipeSection:"4.3"},
    {q:"オーバーライドしたメソッド内で親側の同名メソッドを呼ぶ一般的な書き方はどれ？",choices:["`parent.method()`","`super().method()`","`base::method()`","`self.parent.method()`"],answer:1,explanation:"`super().method()`はMROに従って次のクラスの実装を呼び出します。",category:"クラス",chapter:"04",recipeSection:"4.3"},
    {q:"多重継承におけるMROとは何を表す？",choices:["インスタンスのメモリ使用量","メソッドや属性を探索するクラス順序","例外の優先順位","クラス属性の個数"],answer:1,explanation:"MROはMethod Resolution Orderの略で、属性・メソッド探索の順序です。",category:"クラス",chapter:"04",recipeSection:"4.3"},
    {q:"`super(B, self)`の探索開始位置として正しいものはどれ？",choices:["常にobjectから開始する","MRO上でBの次から探索する","MRO上でB自身から探索する","親クラスをすべて飛ばす"],answer:1,explanation:"`super(B, self)`はselfのMROにおいてBの次にあるクラスから探索します。",category:"クラス",chapter:"04",recipeSection:"4.3"}
  ];

  const original = window.PYTRAIN_REBALANCED_DATA;
  if (!original) throw new Error("PyTrain rebalance data is not initialized");
  const added = [...typeHintQuestions, ...classQuestions];
  window.PYTRAIN_REBALANCED_DATA = {
    basic: original.basic,
    practical: [...original.practical, ...added]
  };

  const basicCount = window.PYTRAIN_REBALANCED_DATA.basic.length;
  const practicalCount = window.PYTRAIN_REBALANCED_DATA.practical.length;
  const totalCount = basicCount + practicalCount;

  document.title = `PyTrain 検定対策${totalCount}問`;
  const description = document.querySelector('meta[name="description"]');
  if (description) description.content = `基礎${basicCount}問＋実践${practicalCount}問をオフラインで学べるPythonクイズアプリ`;
  const badge = document.querySelector(".badge");
  if (badge) badge.textContent = `OFFLINE ${totalCount}問`;
  const menuSummary = document.querySelector("#menu h2 + .muted");
  if (menuSummary) menuSummary.textContent = `基礎${basicCount}問＋実践${practicalCount}問。端末内だけで動作します。`;
  const level = document.getElementById("level");
  if (level) {
    level.querySelector('option[value="basic"]').textContent = `基礎試験クラス（${basicCount}問）`;
    level.querySelector('option[value="practical"]').textContent = `実践試験クラス（${practicalCount}問）`;
    level.querySelector('option[value="mixed"]').textContent = `混合（${totalCount}問）`;
  }
})();
