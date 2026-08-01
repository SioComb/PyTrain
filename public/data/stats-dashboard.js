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
    bankWithIds().forEach((q, sourceIndex) => {
      const key = groupBy(q);
      if (!key) return;
      if (!groups.has(key)) groups.set(key, { label: key, order: sourceIndex, total: 0, answered: 0, attempts: 0, correct: 0 });
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
      accuracy: row.attempts ? Math.round(row.correct / row.attempts * 100) : 0,
      measured: row.attempts > 0,
    }));
  }

  function horizontalBars(rows) {
    if (!rows.length) return '<div class="stats-empty">表示できる項目がありません。</div>';
    const maxAttempts = Math.max(1, ...rows.map((row) => row.attempts));
    const items = rows.map((row) => {
      const attemptsWidth = row.attempts / maxAttempts * 100;
      const correctWidth = row.correct / maxAttempts * 100;
      return `
        <div class="stats-bar-item">
          <div class="stats-bar-head">
            <span class="stats-bar-label">${row.label}</span>
            <span class="stats-bar-rate">正答率 ${row.accuracy}%</span>
          </div>
          <div class="stats-bar-line">
            <span class="stats-bar-name">解答数</span>
            <div class="stats-bar-track"><span class="stats-bar-fill stats-bar-attempts" style="width:${attemptsWidth}%"></span></div>
            <strong class="stats-bar-value">${row.attempts}</strong>
          </div>
          <div class="stats-bar-line">
            <span class="stats-bar-name">正解数</span>
            <div class="stats-bar-track"><span class="stats-bar-fill stats-bar-correct" style="width:${correctWidth}%"></span></div>
            <strong class="stats-bar-value">${row.correct}</strong>
          </div>
        </div>`;
    }).join("");
    return `
      <div class="stats-bar-legend" aria-hidden="true">
        <span><i class="stats-legend-attempts"></i>解答数</span>
        <span><i class="stats-legend-correct"></i>正解数</span>
      </div>
      <div class="stats-bars" role="img" aria-label="項目別の解答数と正解数を比較する横棒グラフ">${items}</div>`;
  }

  function setView(view) {
    const graphPanel = document.getElementById("statsGraphView");
    const tablePanel = document.getElementById("statsTableView");
    const graphButton = document.getElementById("showStatsGraph");
    const tableButton = document.getElementById("showStatsTable");
    const showGraph = view === "graph";
    graphPanel?.classList.toggle("hidden", !showGraph);
    tablePanel?.classList.toggle("hidden", showGraph);
    graphButton?.classList.toggle("active", showGraph);
    tableButton?.classList.toggle("active", !showGraph);
    graphButton?.setAttribute("aria-pressed", String(showGraph));
    tableButton?.setAttribute("aria-pressed", String(!showGraph));
  }

  function renderDashboard() {
    const overlay = document.getElementById("statsDashboard");
    if (!overlay) return;
    const mode = document.getElementById("statsMode").value;
    const rows = mode === "chapter"
      ? groupedResults((q) => q.level === "基礎" ? "基礎" : (window.PYTRAIN_CHAPTERS?.find((c) => c.value === q.chapter)?.label || `Chapter ${q.chapter}`))
      : groupedResults((q) => `${q.level}・${q.category || "未分類"}`);
    rows.sort((a, b) => a.order - b.order);
    document.getElementById("statsBars").innerHTML = horizontalBars(rows);
    document.getElementById("statsRows").innerHTML = rows.map((r) => `
      <tr>
        <td>${r.label}</td>
        <td>${r.answered}/${r.total}</td>
        <td>${r.remaining}</td>
        <td>${r.progress}%</td>
        <td class="${r.measured ? (r.accuracy < 60 ? "stats-weak" : "") : "stats-unmeasured"}">${r.accuracy}%</td>
      </tr>`).join("");
    const measured = rows.filter((r) => r.measured);
    const weak = [...measured].sort((a, b) => a.accuracy - b.accuracy || a.order - b.order)[0];
    document.getElementById("statsSummary").textContent = weak
      ? `現在もっとも弱い項目: ${weak.label}（正答率 ${weak.accuracy}%）`
      : "まだ回答履歴がないため、弱点は未判定です。";
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("progressTable")?.remove();
    const record = document.getElementById("record");
    if (!record || document.getElementById("openStats")) return;

    const style = document.createElement("style");
    style.textContent = `
      .stats-overlay{position:fixed;inset:0;z-index:1000;background:#020617;color:#f8fafc;overflow:auto;padding:max(16px,env(safe-area-inset-top)) 14px max(28px,env(safe-area-inset-bottom));}
      .stats-shell{max-width:900px;margin:auto}.stats-head{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:14px}.stats-head h2{margin:0}
      .stats-controls{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px;align-items:end;margin-bottom:12px}.stats-view-switch{display:flex;border:1px solid #334155;border-radius:10px;overflow:hidden}.stats-view-switch button{width:auto;min-width:72px;margin:0;border:0;border-radius:0;background:#111827;color:#cbd5e1}.stats-view-switch button+button{border-left:1px solid #334155}.stats-view-switch button.active{background:#0ea5e9;color:#fff;font-weight:700}.stats-panel{border:1px solid #334155;border-radius:14px;background:#111827;padding:14px;margin-bottom:14px}
      .stats-empty{padding:36px 12px;text-align:center;color:#cbd5e1}.stats-bar-legend{display:flex;justify-content:flex-end;gap:16px;margin-bottom:14px;color:#cbd5e1;font-size:12px}.stats-bar-legend span{display:flex;align-items:center;gap:6px}.stats-bar-legend i{display:inline-block;width:18px;height:8px;border-radius:999px}.stats-legend-attempts,.stats-bar-attempts{background:#64748b}.stats-legend-correct,.stats-bar-correct{background:#38bdf8}
      .stats-bars{display:grid;gap:16px}.stats-bar-item{border-bottom:1px solid #273449;padding-bottom:15px}.stats-bar-item:last-child{border-bottom:0;padding-bottom:0}.stats-bar-head{display:flex;justify-content:space-between;align-items:flex-start;gap:10px;margin-bottom:8px}.stats-bar-label{font-weight:700;overflow-wrap:anywhere}.stats-bar-rate{flex:none;color:#cbd5e1;font-size:12px}.stats-bar-line{display:grid;grid-template-columns:48px minmax(0,1fr) 30px;align-items:center;gap:8px;margin-top:6px}.stats-bar-name{color:#cbd5e1;font-size:12px}.stats-bar-track{height:10px;border-radius:999px;background:#1e293b;overflow:hidden}.stats-bar-fill{display:block;height:100%;min-width:0;border-radius:999px}.stats-bar-value{text-align:right;font-size:12px}
      .stats-table-wrap{overflow-x:auto}.stats-table{width:100%;border-collapse:collapse;font-size:13px}.stats-table th,.stats-table td{padding:10px 8px;border-bottom:1px solid #334155;text-align:right;white-space:nowrap}.stats-table th:first-child,.stats-table td:first-child{text-align:left;white-space:normal;min-width:180px}.stats-table th{color:#cbd5e1}.stats-weak{color:#fca5a5;font-weight:800}.stats-unmeasured{color:#94a3b8}
      #openStats{margin-top:10px}.stats-summary{color:#bae6fd;font-weight:700;margin:0 0 12px}
      @media(max-width:520px){.stats-controls{grid-template-columns:1fr}.stats-view-switch{width:100%}.stats-view-switch button{flex:1}.stats-overlay{padding-left:10px;padding-right:10px}.stats-panel{padding:10px}.stats-bar-head{display:block}.stats-bar-rate{display:block;margin-top:3px}.stats-bar-line{grid-template-columns:44px minmax(0,1fr) 26px;gap:6px}}
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
        <div class="stats-controls">
          <label>集計単位<select id="statsMode"><option value="category">カテゴリ別</option><option value="chapter">章別</option></select></label>
          <div class="stats-view-switch" role="group" aria-label="実績の表示形式">
            <button id="showStatsGraph" type="button" class="active" aria-pressed="true">グラフ</button>
            <button id="showStatsTable" type="button" aria-pressed="false">表形式</button>
          </div>
        </div>
        <p id="statsSummary" class="stats-summary"></p>
        <div id="statsGraphView"><div id="statsBars" class="stats-panel"></div></div>
        <div id="statsTableView" class="hidden"><div class="stats-panel stats-table-wrap"><table class="stats-table"><thead><tr><th>項目</th><th>回答済み</th><th>未回答</th><th>進捗</th><th>正答率</th></tr></thead><tbody id="statsRows"></tbody></table></div></div>
        <p class="muted small">※表示順は問題データのチャプター順です。横棒グラフの解答数・正解数は、再挑戦を含む累計回数です。未回答の項目は正答率0%として表示しますが、「もっとも弱い項目」の判定からは除外します。</p>
      </div>`;
    document.body.appendChild(overlay);

    button.addEventListener("click", () => { overlay.classList.remove("hidden"); renderDashboard(); });
    document.getElementById("closeStats").addEventListener("click", () => overlay.classList.add("hidden"));
    document.getElementById("statsMode").addEventListener("change", renderDashboard);
    document.getElementById("showStatsGraph").addEventListener("click", () => setView("graph"));
    document.getElementById("showStatsTable").addEventListener("click", () => setView("table"));

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