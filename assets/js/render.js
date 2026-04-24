// render.js — 从 data/reports.json 渲染卡片
// v4.6 主页动态化

const MARKET_LABELS = {
  us: { label: "📈 美股 · US Equities", id: "us-equities", meme: "meme2.jpg" },
  a:  { label: "🇨🇳 A股 · China A-Shares", id: "a-shares",   meme: null },
  hk: { label: "🇭🇰 港股 · Hong Kong",     id: "hk-shares",   meme: null },
  pe: { label: "🚀 一级市场 · Private Equity / VC", id: "pe-vc", meme: "meme3.jpg" },
};

const TONE_CLASS = {
  bullish: "tone-bullish",
  neutral: "tone-neutral",
  bearish: "tone-bearish",
};

// 全局状态
const state = {
  all: [],
  filtered: [],
  search: "",
  market: "all",
  sort: "date-desc",
  minScore: 0,
};

async function loadReports() {
  try {
    const res = await fetch("./data/reports.json");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    state.all = data.reports || [];
    state.filtered = [...state.all];
    updateStats();
    applyFilters();
  } catch (err) {
    console.error("Failed to load reports.json:", err);
    document.getElementById("reports-container").innerHTML = `
      <div class="empty-state">
        <div class="icon">⚠️</div>
        <div>无法加载报告数据</div>
        <div style="margin-top:8px;font-size:11px;">${err.message}</div>
      </div>`;
  }
}

function updateStats() {
  const total = state.all.length;
  const marketCount = new Set(state.all.map(r => r.market)).size;
  const bullish = state.all.filter(r => r.verdict_tone === "bullish").length;
  const latestDate = state.all
    .map(r => r.report_date)
    .sort()
    .pop() || "–";

  const statsRow = document.getElementById("stats-row");
  if (!statsRow) return;
  statsRow.innerHTML = `
    <div class="stat-cell">
      <div class="stat-num pink">${total}</div>
      <div class="stat-label">分析报告</div>
    </div>
    <div class="stat-cell">
      <div class="stat-num purple">${marketCount}</div>
      <div class="stat-label">覆盖板块</div>
    </div>
    <div class="stat-cell">
      <div class="stat-num green">${bullish}</div>
      <div class="stat-label">看好标的</div>
    </div>
    <div class="stat-cell">
      <div class="stat-num">${latestDate.slice(5).replace("-", "/")}</div>
      <div class="stat-label">最新更新</div>
    </div>`;
}

function renderCard(r) {
  const toneClass = TONE_CLASS[r.verdict_tone] || "tone-neutral";
  const badges = (r.badges || [])
    .map(b => `<span class="badge badge-${b.variant || "ghost"}">${escapeHtml(b.label)}</span>`)
    .join("");
  const dateBadge = `<span class="badge badge-ghost">${escapeHtml(r.report_date)}${r.version ? " " + escapeHtml(r.version) : ""}</span>`;
  const metrics = (r.metrics || [])
    .map(m => `
      <div class="cm">
        <div class="cm-label">${escapeHtml(m.label)}</div>
        <div class="cm-val ${m.tone || "neutral"}">${escapeHtml(m.value)}</div>
      </div>`)
    .join("");

  const versionBadgeHtml = r.version && r.version !== "v1"
    ? `<span class="version-badge ${r.verdict_tone || "neutral"}">${escapeHtml(r.version)}</span>`
    : "";

  return `
    <div class="rpt-card ${toneClass}" data-ticker="${escapeHtml(r.ticker)}">
      <div class="card-body">
        <div class="card-ticker">${escapeHtml(r.ticker)} · ${escapeHtml(r.sector)}</div>
        <div class="card-name">${escapeHtml(r.name_cn || r.name)}${versionBadgeHtml}</div>
        <div class="card-desc">${escapeHtml(r.one_liner)}</div>
        <div class="card-meta">${badges}${dateBadge}</div>
        <div class="card-metrics">${metrics}</div>
      </div>
      <div class="card-foot">
        <a href="reports/${encodeURIComponent(r.slug)}/分析报告_dashboard.html">查看完整分析报告</a>
      </div>
    </div>`;
}

function renderSections(reports) {
  const container = document.getElementById("reports-container");
  if (!container) return;

  if (reports.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="icon">🔍</div>
        <div>没有匹配的报告</div>
        <div style="margin-top:8px;font-size:11px;">尝试修改搜索词或切换市场 tab</div>
      </div>`;
    return;
  }

  // 按 market 分组
  const byMarket = {};
  for (const r of reports) {
    (byMarket[r.market] = byMarket[r.market] || []).push(r);
  }

  const sections = Object.keys(MARKET_LABELS)
    .filter(m => byMarket[m] && byMarket[m].length)
    .map(m => {
      const info = MARKET_LABELS[m];
      const list = byMarket[m];
      const cards = list.map(renderCard).join("");
      const memeHtml = info.meme
        ? `<div class="section-meme"><img src="assets/${info.meme}" alt="meme"></div>`
        : "";
      return `
        <div class="section-header" id="${info.id}">
          <div class="section-header-text">
            <div class="section-label">
              <span class="section-icon">${info.label.slice(0, 2)}</span>
              ${escapeHtml(info.label.slice(2).trim())}
              <span class="section-count">${list.length}</span>
            </div>
          </div>
          ${memeHtml}
        </div>
        <div class="cards">${cards}</div>`;
    })
    .join("");

  container.innerHTML = sections;

  const info = document.getElementById("results-info");
  if (info) {
    info.textContent = reports.length === state.all.length
      ? `共 ${reports.length} 份分析报告`
      : `当前显示 ${reports.length} / ${state.all.length} 份报告`;
  }
}

function applyFilters() {
  let list = [...state.all];

  // 市场筛选
  if (state.market !== "all") {
    list = list.filter(r => r.market === state.market);
  }

  // 评分筛选
  if (state.minScore > 0) {
    list = list.filter(r => (r.composite_score || 0) >= state.minScore);
  }

  // 搜索(全文)
  if (state.search.trim()) {
    const q = state.search.trim().toLowerCase();
    list = list.filter(r => {
      const hay = [r.ticker, r.name, r.name_cn, r.sector, r.one_liner, r.verdict]
        .join(" ").toLowerCase();
      return hay.includes(q);
    });
  }

  // 排序
  list.sort((a, b) => {
    switch (state.sort) {
      case "date-desc":
        return (b.report_date || "").localeCompare(a.report_date || "");
      case "date-asc":
        return (a.report_date || "").localeCompare(b.report_date || "");
      case "score-desc":
        return (b.composite_score || 0) - (a.composite_score || 0);
      case "score-asc":
        return (a.composite_score || 0) - (b.composite_score || 0);
      default:
        return 0;
    }
  });

  state.filtered = list;
  renderSections(list);
}

function escapeHtml(s) {
  if (s == null) return "";
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// Hook up controls
function initControls() {
  const searchEl = document.getElementById("search-input");
  if (searchEl) {
    searchEl.addEventListener("input", e => {
      state.search = e.target.value;
      applyFilters();
    });
  }

  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.market = btn.dataset.market;
      applyFilters();
    });
  });

  const sortEl = document.getElementById("sort-select");
  if (sortEl) {
    sortEl.addEventListener("change", e => {
      state.sort = e.target.value;
      applyFilters();
    });
  }

  const scoreEl = document.getElementById("min-score");
  if (scoreEl) {
    scoreEl.addEventListener("change", e => {
      state.minScore = parseFloat(e.target.value) || 0;
      applyFilters();
    });
  }
}

// Boot
document.addEventListener("DOMContentLoaded", () => {
  initControls();
  loadReports();
});
