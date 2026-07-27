# PyTrain iPhone PWA 開発環境

**Python検定対策400問（基礎200問＋実践200問）** を、iPhoneのホーム画面から起動できるPWAとして提供する開発環境です。

## まずPCで起動

1. ZIPを展開します。
2. `start_server.bat` をダブルクリックします。
3. ブラウザで `http://localhost:8000` を開きます。
4. 終了するときは黒い画面で `Ctrl + C` を押します。

Python以外の追加インストールは不要です。

## フォルダ構成

```text
PyTrain-iPhone-PWA/
├─ public/
│  ├─ index.html                アプリ本体
│  ├─ data/
│  │  ├─ basic-1.js             基礎問題 1〜100
│  │  ├─ basic-2.js             基礎問題 101〜200
│  │  ├─ practical-1.js         実践問題 1〜100
│  │  └─ practical-2.js         実践問題 101〜200
│  ├─ manifest.webmanifest      PWA設定
│  ├─ sw.js                     オフラインキャッシュ
│  └─ icons/                    iPhone/PWAアイコン
├─ tools/
│  ├─ dev_server.py             開発用サーバー
│  └─ validate_project.py       問題数・構造・PWA構成の検証
├─ .github/workflows/pages.yml  GitHub Pages自動公開
├─ capacitor.config.json        App Store版へ進む際の設定
├─ package.json                 Node/Capacitor用（任意）
├─ start_server.bat
└─ validate.bat
```

## 主な変更点

- 基礎試験クラスを100問から200問へ拡張
- 実践試験クラスを100問から200問へ拡張
- `pip`、仮想環境、`pyproject.toml`、`uv`、Ruff、Black、Flake8、型検査などの問題を追加
- 問題データを4ファイルへ分離し、今後追加しやすい構造へ変更
- 「メニューへ戻る」を押したとき、解答中の記録が保存されない旨を確認するダイアログを追加
- 各レベルで正答位置A〜Dを50問ずつに均等化
- 問題文の重複、選択肢重複、問題数、PWAキャッシュ対象を検証スクリプトで確認

## iPhoneへ入れる推奨手順

ローカルのHTMLファイルを直接開くのではなく、GitHub Pagesなどの **HTTPS** 環境へ公開します。

### GitHub Pagesで公開

1. リポジトリの `Settings` → `Pages` を開きます。
2. `Build and deployment` のSourceを **GitHub Actions** にします。
3. `main` ブランチへ反映すると、同梱のWorkflowが `public` フォルダを公開します。
4. 公開URLをiPhoneのSafariで開きます。
5. Safariの共有ボタン → **ホーム画面に追加** を選びます。
6. 一度起動した後は、キャッシュ済みの内容をオフラインで利用できます。

更新後に古い画面が残る場合は、Safariで再読み込みしてください。今回はService Workerのキャッシュ名を `pytrain-pwa-v2` へ更新しています。

## 問題を編集する場所

問題データは `public/data/*.js` に分割しています。各ファイルは100問です。

各問題は以下の形式です。

```javascript
{
  "q": "問題文",
  "choices": ["選択肢A", "選択肢B", "選択肢C", "選択肢D"],
  "answer": 0,
  "explanation": "解説",
  "category": "カテゴリ名"
}
```

`answer` は0始まりです。A=0、B=1、C=2、D=3です。

編集後は `validate.bat` を実行してください。以下を確認します。

- 基礎200問・実践200問
- 各データファイル100問
- 必須項目と選択肢数
- 問題文・選択肢の重複
- 正答位置の均等性
- 離脱確認ダイアログ
- PWA必須ファイルとオフラインキャッシュ

## App Store版へ進む場合（Mac必須）

この構成はCapacitorへ入れられるようにしてあります。Node.jsを導入後、プロジェクト直下で次を実行します。

```bash
npm install
npm run cap:add:ios
npm run cap:sync
npm run cap:open:ios
```

`cap:open:ios`以降はMacのXcodeでビルド・署名・実機テストを行います。WindowsではPWA版の開発とGitHub Pages公開まで可能です。

## データ保存

正答履歴・最高正答率・前回の間違いはブラウザの`localStorage`へ保存されます。クイズの途中で「メニューへ戻る」を選んだ場合、その回の途中経過は保存されません。
