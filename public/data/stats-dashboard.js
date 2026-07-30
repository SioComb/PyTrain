(() => {
  const HISTORY_KEY = "pytrain_question_stats_v1";

  function loadStats() {
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || "{}"); }
    catch { return {}; }
  }

  function saveStats(stats) {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(stats));
  }

  function bankWithIds() {
    const data = window.PYTRAIN_REBALANCED_DATA;
    if (!data) return [];
    return [
      ...data.basic.map((q, i) => ({ ...q, id: `b${i}`, level: "基礎" })),
      ...data.practical.map((q, i) => ({ ...q, id: `p${i}`, level: "実践" })),
    ];
  }

  function groupedResults(groupBy) {
    const stats = loadStats();
    const groups = new Map();
    bankWithIds().forEach((q) => {
      const key = groupBy(q);
      if (!key) return;
      if (!groups.has(key)) groups.set(key, { label: key, total: 0, answered: 0, attempts: 0, correct: 0 });
      const row = groups.get(key);
      row.total += 1;
      const item = stats[q.id];
      if (item?.attempts) {
        row.answered += 1;
        row.attempts += item.attempts;
        row.correct += item.correct || 0;
      }
    });
    return [...groups.values()].map((row) => ({
      ...row,
      remaining: row.total - row.answered,
      progress: row.total ? Math.round(row.answered / row.total * 100) : 0,
      accuracy: row.attempts ? Math.round(row.correct / row.attempts * 100) : null,
    }));
  }

  function radarSvg(rows) {
    const usable = rows.filter((r) => r.accuracy !== null).sort((a, b) => a.accuracy - b.accuracy).slice(0, 12);
    if (usable.length < 3) return '<div class="stats-empty">正答率データが3カテゴリ以上たまると、レーダーチャートを表示します。</div>';
    const size = 420, cx = 210, cy = 210, radius = 142;
    const point = (i, value) => {
      const angle = -Math.PI / 2 + i * Math.PI * 2 / usable.length;
      const r = radius * value / 100;
      return [cx + Math.cos(angle) * r, cy + Math.sin(angle) * r];
    };
    const rings = [20, 40, 60, 80, 100].map((value) => {
      const pts = usable.map((_, i) => point(i, value).join(",")).join(" ");
      return `<polygon points="${pts}" fill="none" stroke="#475569" stroke-width="1" opacity=".65"/>`;
    }).join("");
    const axes = usable.map((_, i) => {
      const [x, y] = point(i, 100);
      return `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="#475569" stroke-width="1"/>`;
    }).join("");
    const values = usable.map((r, i) => point(i, r.accuracy).join(",")).join(" ");
    const labels = usable.map((r, i) => {
      const angle = -Math.PI / 2 + i * Math.PI * 2 / usable.length;
      const x = cx + Math.cos(angle) * (radius + 28);
      const y = cy + Math.sin(angle) * (radius + 28);
      const anchor = Math.cos(angle) > .25 ? "start" : Math.cos(angle) < -.25 ? "end" : "middle";
      const label = r.label.length > 10 ? r.label.slice(0, 10) + "…" : r.label;
      return `<text x="${x}" y="${y}" text-anchor="${anchor}" dominant-baseline="middle" fill="#cbd5e1" font-size="11">${label} ${r.accuracy}%</text>`;
    }).join("");
    return `<svg class="stats-radar" viewBox="0 0 ${size} ${size}" role="img" aria-label="カテゴリ別正答率レーダーチャート">${rings}${axes}<polygon points="${values}" fill="rgba(56,189,248,.24)" stroke="#38bdf8" stroke-width="3"/>${labels}</svg>`;
  }

  function renderDashboard() {
    const overlay = document.getElementById("statsDashboard");
    if (!overlay) return;
    const mode = document.getElementById("statsMode").value;
    const rows = mode === "chapter"
      ? groupedResults((q) => q.level === "基礎" ? "基礎" : (window.PYTRAIN_CHAPTERS?.find((c) => c.value === q.chapter)?.label || `Chapter ${q.chapter}`))
      : groupedResults((q) => `${q.level}・${q.category || "未分類"}`);
    rows.sort((a, b) => (a.accuracy ?? 101) - (b.accuracy ?? 101) || a.label.localeCompare(b.label, "ja"));
    document.getElementById("statsRadar").innerHTML = radarSvg(rows);
    document.getElementById("statsRows").innerHTML = rows.map((r) => `
      <tr>
        <td>${r.label}</td>
        <td>${r.answered}/${r.total}</td>
        <td>${r.remaining}</td>
        <td>${r.progress}%</td>
        <td class="${r.accuracy !== null && r.accuracy < 60 ? "stats-weak" : ""}">${r.accuracy === null ? "—" : `${r.accuracy}%`}</td>
      </tr>`).join("");
    const measured = rows.filter((r) => r.accuracy !== null);
    const weak = measured.sort((a, b) => a.accuracy - b.accuracy)[0];
    document.getElementById("statsSummary").textContent = weak
      ? `現在もっとも弱い項目: ${weak.label}（正答率 ${weak.accuracy}%）`
      : "正答率は、この更新後に回答した問題から記録されます。";
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("progressTable")?.remove();
    const record = document.getElementById("record");
    if (!record || document.getElementById("openStats")) return;

    const style = document.createElement("style");
    style.textContent = `
      .stats-overlay{position:fixed;inset:0;z-index:1000;background:#020617;color:#f8fafc;overflow:auto;padding:max(16px,env(safe-area-inset-top)) 14px max(28px,env(safe-area-inset-bottom));}
      .stats-shell{max-width:900px;margin:auto}.stats-head{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:14px}.stats-head h2{margin:0}
      .stats-controls{display:grid;grid-template-columns:1fr auto;gap:10px;margin-bottom:12px}.stats-panel{border:1px solid #334155;border-radius:14px;background:#111827;padding:14px;margin-bottom:14px}
      .stats-radar{display:block;width:100%;max-width:520px;margin:auto}.stats-empty{padding:36px 12px;text-align:center;color:#cbd5e1}
      .stats-table-wrap{overflow-x:auto}.stats-table{width:100%;border-collapse:collapse;font-size:13px}.stats-table th,.stats-table td{padding:10px 8px;border-bottom:1px solid #334155;text-align:right;white-space:nowrap}.stats-table th:first-child,.stats-table td:first-child{text-align:left;white-space:normal;min-width:180px}.stats-table th{color:#cbd5e1}.stats-weak{color:#fca5a5;font-weight:800}
      #openStats{margin-top:10px}.stats-summary{color:#bae6fd;font-weight:700;margin:0 0 12px}
      @media(max-width:520px){.stats-controls{grid-template-columns:1fr}.stats-overlay{padding-left:10px;padding-right:10px}.stats-panel{padding:10px}.stats-radar text{font-size:9px}}
    `;
    document.head.appendChild(style);

    const button = document.createElement("button");
    button.id = "openStats";
    button.className = "secondary";
    button.textContent = "📊 学習実績・弱点分析を開く";
    record.after(button);

    const overlay = document.createElement("section");
    overlay.id = "statsDashboard";
    overlay.className = "stats-overlay hidden";
    overlay.innerHTML = `
      <div class="stats-shell">
        <div class="stats-head"><h2>学習実績・弱点分析</h2><button id="closeStats" class="secondary" style="width:auto">閉じる</button></div>
        <div class="stats-controls"><label>集計単位<select id="statsMode"><option value="category">カテゴリ別</option><option value="chapter">章別</option></select></label></div>
        <p id="statsSummary" class="stats-summary"></p>
        <div id="statsRadar" class="stats-panel"></div>
        <div class="stats-panel stats-table-wrap"><table class="stats-table"><thead><tr><th>項目</th><th>回答済み</th><th>未回答</th><th>進捗</th><th>正答率</th></tr></thead><tbody id="statsRows"></tbody></table></div>
        <p class="muted small">※正答率の履歴はこの更新後の回答から蓄積します。従来の回答済み記録には正誤情報がないため、進捗のみ引き継がれます。</p>
      </div>`;
    document.body.appendChild(overlay);

    button.addEventListener("click", () => { overlay.classList.remove("hidden"); renderDashboard(); });
    document.getElementById("closeStats").addEventListener("click", () => overlay.classList.add("hidden"));
    document.getElementById("statsMode").addEventListener("change", renderDashboard);

    const originalAnswer = window.answer;
    if (typeof originalAnswer === "function") {
      window.answer = function(choice) {
        if (!answered) {
          const q = current[index];
          const isCorrect = choice === displayedAnswer;
          const stats = loadStats();
          const previous = stats[q.id] || { attempts: 0, correct: 0 };
          stats[q.id] = { attempts: previous.attempts + 1, correct: previous.correct + (isCorrect ? 1 : 0) };
          saveStats(stats);
        }
        return originalAnswer(choice);
      };
    }
  });
})();