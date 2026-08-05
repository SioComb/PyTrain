from __future__ import annotations

import json
import sys
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
DATA_DIR = PUBLIC / "data"
ERRORS: list[str] = []


def check(condition: bool, message: str) -> None:
    if not condition:
        ERRORS.append(message)


def load_json_array(path: Path) -> list[dict]:
    if not path.exists():
        ERRORS.append(f"不足ファイル: {path.relative_to(ROOT)}")
        return []

    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        ERRORS.append(f"JSON形式が不正です: {path.relative_to(ROOT)} ({exc})")
        return []
    if not isinstance(data, list):
        ERRORS.append(f"問題データが配列ではありません: {path.relative_to(ROOT)}")
        return []
    return data


required = [
    PUBLIC / "index.html",
    PUBLIC / "bootstrap.js",
    PUBLIC / "app.js",
    PUBLIC / "manifest.webmanifest",
    PUBLIC / "sw.js",
    PUBLIC / "icons" / "icon-192.png",
    PUBLIC / "icons" / "icon-512.png",
    PUBLIC / "icons" / "icon-maskable-512.png",
    PUBLIC / "icons" / "apple-touch-icon.png",
]
for path in required:
    check(path.exists(), f"不足ファイル: {path.relative_to(ROOT)}")

parts = {
    "basic-1": load_json_array(DATA_DIR / "basic-1.json"),
    "basic-2": load_json_array(DATA_DIR / "basic-2.json"),
    "practical-1": load_json_array(DATA_DIR / "practical-1.json"),
    "practical-2": load_json_array(DATA_DIR / "practical-2.json"),
}

for part_name, questions in parts.items():
    check(len(questions) == 100, f"{part_name}の問題数が100ではありません: {len(questions)}")

banks = {
    "basic": parts["basic-1"] + parts["basic-2"],
    "practical": parts["practical-1"] + parts["practical-2"],
}

all_question_texts: list[str] = []
for bank_name, questions in banks.items():
    check(len(questions) == 200, f"{bank_name}問題数が200ではありません: {len(questions)}")
    answers = Counter()

    for i, q in enumerate(questions, 1):
        check(
            all(k in q for k in ("q", "choices", "answer", "explanation", "category")),
            f"{bank_name} {i}問目の項目不足",
        )
        check(isinstance(q.get("q"), str) and bool(q.get("q", "").strip()), f"{bank_name} {i}問目の問題文が空です")
        check(len(q.get("choices", [])) == 4, f"{bank_name} {i}問目の選択肢が4件ではありません")
        check(len(set(q.get("choices", []))) == 4, f"{bank_name} {i}問目の選択肢が重複しています")
        check(q.get("answer") in range(4), f"{bank_name} {i}問目のanswerが不正です")
        check(bool(q.get("explanation", "").strip()), f"{bank_name} {i}問目の解説が空です")
        check(bool(q.get("category", "").strip()), f"{bank_name} {i}問目のカテゴリが空です")
        if q.get("answer") in range(4):
            answers[q["answer"]] += 1
        all_question_texts.append(q.get("q", ""))

    check(len({q["q"] for q in questions}) == len(questions), f"{bank_name}内に重複問題があります")
    check(answers == Counter({0: 50, 1: 50, 2: 50, 3: 50}), f"{bank_name}の正答位置が均等ではありません: {dict(answers)}")

check(len(set(all_question_texts)) == len(all_question_texts), "基礎・実践をまたぐ重複問題があります")

html = (PUBLIC / "index.html").read_text(encoding="utf-8")
check("./bootstrap.js" in html, "index.htmlにbootstrap.jsの参照がありません")

bootstrap = (PUBLIC / "bootstrap.js").read_text(encoding="utf-8")
app = (PUBLIC / "app.js").read_text(encoding="utf-8")
for filename in ("basic-1.json", "basic-2.json", "practical-1.json", "practical-2.json"):
    check(f"./data/{filename}" in bootstrap, f"bootstrap.jsに{filename}の参照がありません")

check("window.confirm" in app, "解答中にメニューへ戻る確認処理がありません")
check("現在の解答状況は保存されません" in app, "確認メッセージの文言がありません")
check("serviceWorker.register" in html, "Service Worker登録処理がありません")
check("manifest.webmanifest" in html, "manifestリンクがありません")
check("OFFLINE 400問" in html, "400問表示へ更新されていません")

manifest = json.loads((PUBLIC / "manifest.webmanifest").read_text(encoding="utf-8"))
check(manifest.get("display") == "standalone", "manifestのdisplayがstandaloneではありません")
for icon in manifest.get("icons", []):
    path = PUBLIC / icon["src"].removeprefix("./")
    check(path.exists(), f"manifest参照アイコンがありません: {icon['src']}")

sw = (PUBLIC / "sw.js").read_text(encoding="utf-8")
for filename in ("basic-1.json", "basic-2.json", "practical-1.json", "practical-2.json"):
    check(f"./data/{filename}" in sw, f"Service Workerのキャッシュ対象に{filename}がありません")

if ERRORS:
    print("検証NG")
    for error in ERRORS:
        print(f"- {error}")
    sys.exit(1)

print("検証OK")
print("- 基礎問題: 200問")
print("- 実践問題: 200問")
print("- 合計問題: 400問")
print("- 各データファイル: 100問")
print("- 正答位置: 各50問で均等")
print("- 重複問題: なし")
print("- 離脱確認ダイアログ: OK")
print("- PWA必須ファイル: OK")
