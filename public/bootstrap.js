const QUESTION_FILES = {
  PYTRAIN_BASIC_1: "./data/basic-1.json",
  PYTRAIN_BASIC_2: "./data/basic-2.json",
  PYTRAIN_PRACTICAL_1: "./data/practical-1.json",
  PYTRAIN_PRACTICAL_2: "./data/practical-2.json",
};

const DATA_SCRIPTS = [
  "./data/practical-only.js",
  "./data/level-scope-audit.js",
  "./data/choice-display-fix.js",
  "./data/stats-dashboard.js",
  "./data/stats-bar-progress-fix.js",
  "./data/stats-default-chapter.js",
  "./data/stats-accuracy-fix.js",
  "./data/stats-correct-count.js",
  "./data/stats-mode-order-fix.js",
];

async function loadJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url}: ${response.status}`);
  const data = await response.json();
  if (!Array.isArray(data)) throw new Error(`${url}: 問題データが配列ではありません`);
  return data;
}

function loadScript(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = url;
    script.async = false;
    script.addEventListener("load", resolve, { once: true });
    script.addEventListener("error", () => reject(new Error(`${url}: 読み込み失敗`)), { once: true });
    document.head.appendChild(script);
  });
}

try {
  const entries = Object.entries(QUESTION_FILES);
  const banks = await Promise.all(entries.map(([, url]) => loadJson(url)));
  entries.forEach(([globalName], index) => {
    window[globalName] = banks[index];
  });

  // 追加問題の読み込み後も、既存スクリプトが保持するデータ参照を維持する。
  await loadScript("./data/scope-fix.js");
  const stableData = window.PYTRAIN_REBALANCED_DATA;
  await loadScript("./data/issues-6-7.js");
  const expandedData = window.PYTRAIN_REBALANCED_DATA;
  if (stableData && expandedData && stableData !== expandedData) {
    stableData.basic = expandedData.basic;
    stableData.practical = expandedData.practical;
    window.PYTRAIN_REBALANCED_DATA = stableData;
  }
  window.__pytrainIssues67Loaded = true;

  for (const url of DATA_SCRIPTS) await loadScript(url);
  await loadScript("./data/start-button-sync.js");
  await loadScript("./app.js");
} catch (error) {
  console.error("PyTrain initialization failed:", error);
  const menu = document.getElementById("menu");
  if (menu) {
    const message = document.createElement("div");
    message.className = "explain";
    message.textContent = "問題データを読み込めませんでした。通信状態を確認して再読み込みしてください。";
    menu.prepend(message);
  }
}
