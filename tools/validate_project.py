from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
ERRORS: list[str] = []


def check(condition: bool, message: str) -> None:
    if not condition:
        ERRORS.append(message)


required = [
    PUBLIC / "index.html",
    PUBLIC / "manifest.webmanifest",
    PUBLIC / "sw.js",
    PUBLIC / "icons" / "icon-192.png",
    PUBLIC / "icons" / "icon-512.png",
    PUBLIC / "icons" / "icon-maskable-512.png",
    PUBLIC / "icons" / "apple-touch-icon.png",
]
for path in required:
    check(path.exists(), f"不足ファイル: {path.relative_to(ROOT)}")

html = (PUBLIC / "index.html").read_text(encoding="utf-8")
match = re.search(r"const DATA = (\{.*?\});\s*const \$", html, flags=re.S)
check(match is not None, "index.htmlから問題データを抽出できません")
if match:
    data = json.loads(match.group(1))
    basic = len(data.get("basic", []))
    practical = len(data.get("practical", []))
    check(basic == 100, f"基礎問題数が100ではありません: {basic}")
    check(practical == 100, f"実践問題数が100ではありません: {practical}")
    for bank_name, questions in data.items():
        for i, q in enumerate(questions, 1):
            check(all(k in q for k in ("q", "choices", "answer", "explanation", "category")), f"{bank_name} {i}問目の項目不足")
            check(len(q.get("choices", [])) == 4, f"{bank_name} {i}問目の選択肢が4件ではありません")
            check(q.get("answer") in range(4), f"{bank_name} {i}問目のanswerが不正です")

manifest = json.loads((PUBLIC / "manifest.webmanifest").read_text(encoding="utf-8"))
check(manifest.get("display") == "standalone", "manifestのdisplayがstandaloneではありません")
for icon in manifest.get("icons", []):
    path = PUBLIC / icon["src"].removeprefix("./")
    check(path.exists(), f"manifest参照アイコンがありません: {icon['src']}")

check("serviceWorker.register" in html, "Service Worker登録処理がありません")
check("manifest.webmanifest" in html, "manifestリンクがありません")

if ERRORS:
    print("検証NG")
    for error in ERRORS:
        print(f"- {error}")
    sys.exit(1)

print("検証OK")
print("- 基礎問題: 100問")
print("- 実践問題: 100問")
print("- PWA必須ファイル: OK")
