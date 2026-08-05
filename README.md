# PyTrain

Python実践検定の学習を目的とした、オフライン対応のクイズPWAです。現在は基礎・実践の区分を統合し、**実践問題412問**をChapter別・カテゴリ別に学習できます。

## 主な機能

- Python実践問題412問
- Chapter 1〜19による絞り込み
- カテゴリ別出題
- 未回答問題のみの出題
- 間違えた問題の復習
- 解答履歴、正答率、学習進捗の端末内保存
- グラフ／表形式で切り替えられる学習実績表示
- PWAによるホーム画面起動とオフライン利用

## ローカル起動

Windowsでは `start_server.bat` を実行し、ブラウザで次を開きます。

```text
http://localhost:8000
```

Python以外の追加インストールは不要です。

Node.jsを使用する場合は次でも起動できます。

```bash
npm install
npm run serve
```

## ディレクトリ構成

```text
PyTrain/
├─ public/
│  ├─ index.html
│  ├─ bootstrap.js
│  ├─ app.js
│  ├─ manifest.webmanifest
│  ├─ sw.js
│  ├─ data/
│  │  ├─ basic-1.json
│  │  ├─ basic-2.json
│  │  ├─ practical-1.json
│  │  ├─ practical-2.json
│  │  ├─ scope-fix.js
│  │  ├─ practical-only.js
│  │  ├─ level-scope-audit.js
│  │  ├─ choice-display-fix.js
│  │  └─ stats-dashboard.js
│  └─ icons/
├─ tools/
│  ├─ dev_server.py
│  └─ validate_project.py
├─ .github/workflows/pages.yml
├─ capacitor.config.json
├─ package.json
├─ start_server.bat
├─ validate.bat
└─ LICENSE
```

`basic-1.json` と `basic-2.json` は、旧基礎問題を読み込んで実践バンクへ統合するための内部データとして残しています。画面上の基礎モードは廃止済みです。

## 問題データ

問題は次の形式で管理します。

```json
{
  "q": "問題文",
  "choices": ["選択肢A", "選択肢B", "選択肢C", "選択肢D"],
  "answer": 0,
  "explanation": "解説",
  "category": "カテゴリ名"
}
```

`answer` は0始まりで、A=0、B=1、C=2、D=3です。Chapter情報は統合処理で各問題へ付与されます。

## 検証

変更後は次を実行します。

```bat
validate.bat
```

または、直接Pythonから実行します。

```bash
python tools/validate_project.py
```

## GitHub Pagesへの公開

1. リポジトリの `Settings` → `Pages` を開きます。
2. `Build and deployment` のSourceを **GitHub Actions** に設定します。
3. `main` ブランチへ反映すると、`public` ディレクトリが公開されます。
4. iPhoneではSafariの共有メニューから「ホーム画面に追加」を選択します。

更新が反映されない場合は、アプリを閉じて再起動するか、Safariで再読み込みしてください。Service Workerの更新時は `public/sw.js` の `CACHE_NAME` も更新します。

## データ保存

学習履歴はブラウザの `localStorage` に保存されます。ブラウザのサイトデータ削除やホーム画面アプリの削除により、履歴が消える場合があります。

## App Store版

Capacitor用の設定を含んでいます。iOS版のビルドにはMacとXcodeが必要です。

```bash
npm install
npm run cap:add:ios
npm run cap:sync
npm run cap:open:ios
```

## ライセンス

このプロジェクトは [MIT License](LICENSE) で公開しています。

問題文は公式試験問題の転載ではなく、出題範囲を参考に作成したオリジナル問題です。
