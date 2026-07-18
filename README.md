# PyTrain iPhone PWA 開発環境

前回作成した **Python検定対策200問（基礎100問＋実践100問）** を、iPhoneのホーム画面から起動できるPWAへ変換した開発環境です。

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
│  ├─ index.html                アプリ本体・200問入り
│  ├─ manifest.webmanifest      PWA設定
│  ├─ sw.js                     オフラインキャッシュ
│  └─ icons/                    iPhone/PWAアイコン
├─ tools/
│  ├─ dev_server.py             開発用サーバー
│  └─ validate_project.py       問題数・PWA構成の検証
├─ .github/workflows/pages.yml  GitHub Pages自動公開
├─ capacitor.config.json        App Store版へ進む際の設定
├─ package.json                 Node/Capacitor用（任意）
├─ start_server.bat
└─ validate.bat
```

## iPhoneへ入れる推奨手順

ローカルのHTMLファイルを直接開くのではなく、GitHub Pagesなどの **HTTPS** 環境へ公開します。

### GitHub Pagesで公開

1. GitHubで空のリポジトリを作成します。
2. このフォルダの中身をリポジトリへアップロードします。
3. リポジトリの `Settings` → `Pages` を開きます。
4. `Build and deployment` のSourceを **GitHub Actions** にします。
5. `main` ブランチへ反映すると、同梱のWorkflowが `public` フォルダを公開します。
6. 公開URLをiPhoneのSafariで開きます。
7. Safariの共有ボタン → **ホーム画面に追加** を選びます。
8. 一度起動して問題画面を表示した後は、キャッシュ済みの内容をオフラインで利用できます。

更新後に古い画面が残る場合は、Safariで再読み込みするか、ホーム画面のアイコンを削除して再追加してください。Service Workerを更新した場合は `public/sw.js` の `CACHE_NAME` を変更すると確実です。

## 問題を編集する場所

`public/index.html` 内の次の部分に全問題が入っています。

```javascript
const DATA = {
  "basic": [...],
  "practical": [...]
};
```

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

編集後は `validate.bat` を実行してください。基礎100問・実践100問、選択肢数、PWAファイルを確認します。

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

正答履歴・最高正答率・前回の間違いはブラウザの`localStorage`へ保存されます。SafariのWebサイトデータを削除した場合やホーム画面アプリを削除した場合、履歴が消えることがあります。
