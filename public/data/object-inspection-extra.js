window.PYTRAIN_OBJECT_INSPECTION_EXTRA = [
  {
    "q": "`id(obj)` の戻り値について正しいものはどれ？",
    "choices": ["オブジェクトの識別値を表す整数", "オブジェクトの型名を表す文字列", "参照カウント", "メモリアドレスを表す文字列"],
    "answer": 0,
    "explanation": "`id(obj)` は、そのオブジェクトの識別値を整数で返します。同じ生存期間中の同一オブジェクトでは同じ値です。",
    "category": "オブジェクト"
  },
  {
    "q": "次のコードで `id(a) == id(b)` の結果はどれ？\n\n```python\na = []\nb = a\n```",
    "choices": ["False", "True", "実行ごとに変わる", "TypeError"],
    "answer": 1,
    "explanation": "`b = a` は同じリストオブジェクトへの参照を代入します。そのため `id(a)` と `id(b)` は等しくなります。",
    "category": "オブジェクト"
  },
  {
    "q": "次の説明として正しいものはどれ？\n\n```python\na = [1, 2]\nb = [1, 2]\n```",
    "choices": ["`a == b` も `id(a) == id(b)` も常にFalse", "`a == b` がTrueなら必ず同一オブジェクト", "値は等しいが、別オブジェクトなので識別値が異なる", "リストでは `id()` を使用できない"],
    "answer": 2,
    "explanation": "2つのリストは値としては等しいため `a == b` はTrueですが、別々に生成されたオブジェクトなので通常は `id(a) != id(b)` です。",
    "category": "オブジェクト"
  },
  {
    "q": "`type(obj)` が返すものはどれ？",
    "choices": ["継承元クラスの一覧", "真偽値", "型名の文字列", "オブジェクトの型オブジェクト"],
    "answer": 3,
    "explanation": "`type(obj)` は、`obj` の型を表す型オブジェクトを返します。たとえば `type(1)` は `int` です。",
    "category": "組み込み関数"
  },
  {
    "q": "次のコードの結果はどれ？\n\n```python\nclass Parent:\n    pass\n\nclass Child(Parent):\n    pass\n\nobj = Child()\n\nprint(type(obj) is Parent)\nprint(isinstance(obj, Parent))\n```",
    "choices": ["False と True", "True と True", "False と False", "True と False"],
    "answer": 0,
    "explanation": "`type(obj) is Parent` は型の完全一致を見るためFalseです。`isinstance(obj, Parent)` は継承関係も考慮するためTrueです。",
    "category": "クラス"
  },
  {
    "q": "`type(obj) is Class` と `isinstance(obj, Class)` の違いとして正しいものはどれ？",
    "choices": ["どちらも常に同じ結果", "前者は型の完全一致、後者はサブクラスも含めて判定", "前者だけ継承関係を考慮", "後者は型名の文字列を比較"],
    "answer": 1,
    "explanation": "`type(obj) is Class` は実際の型がClassそのものかを判定します。`isinstance()` はClassまたはそのサブクラスのインスタンスもTrueになります。",
    "category": "クラス"
  },
  {
    "q": "次のコードの結果はどれ？\n\n```python\nvalue = 3.14\nisinstance(value, (int, float, complex))\n```",
    "choices": ["False", "TypeError", "True", "`float`"],
    "answer": 2,
    "explanation": "`isinstance()` の第2引数には型のタプルを渡せます。いずれかの型に該当すればTrueです。",
    "category": "組み込み関数"
  },
  {
    "q": "`issubclass(Child, Parent)` が判定するものはどれ？",
    "choices": ["Childのインスタンス数", "ChildとParentの値の等価性", "ParentがChildのインスタンスか", "ChildがParentのサブクラスか"],
    "answer": 3,
    "explanation": "`issubclass(Child, Parent)` は、第1引数のクラスが第2引数のクラスのサブクラスであるかを判定します。",
    "category": "クラス"
  },
  {
    "q": "次の4つの式の評価結果として正しい組み合わせはどれ？\n\n```python\ntype(True) is bool\ntype(True) is int\nisinstance(True, int)\nissubclass(bool, int)\n```",
    "choices": ["True, False, True, True", "True, True, True, True", "False, False, True, True", "True, False, False, False"],
    "answer": 0,
    "explanation": "`True` の実際の型は `bool` なので前2つはTrue、Falseです。`bool` は `int` のサブクラスなので、後2つはTrueになります。",
    "category": "クラス"
  },
  {
    "q": "`help(obj)` の主な用途はどれ？",
    "choices": ["オブジェクトを削除する", "オブジェクトや型に関するヘルプを表示する", "属性を追加する", "識別値を変更する"],
    "answer": 1,
    "explanation": "`help(obj)` は、対象のドキュメントや利用方法などのヘルプ情報を表示します。",
    "category": "組み込み関数"
  },
  {
    "q": "`dir(obj)` が返す内容として最も適切なものはどれ？",
    "choices": ["オブジェクトの識別値", "オブジェクトの継承段数", "属性名やメソッド名の一覧", "ヘルプ文書そのもの"],
    "answer": 2,
    "explanation": "`dir(obj)` は、そのオブジェクトから参照できる属性名やメソッド名などを一覧として返します。",
    "category": "オブジェクト"
  },
  {
    "q": "`dir(obj)` の戻り値の型はどれ？",
    "choices": ["tuple", "set", "dict", "list"],
    "answer": 3,
    "explanation": "`dir(obj)` の戻り値は、属性名を文字列要素として持つリストです。",
    "category": "組み込み関数"
  }
];
