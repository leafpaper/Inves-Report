const DS = window.DesignSystem_a138b7 || {};
const { Tabs, SearchInput, Button, Mascot } = DS;
const HoldingsTablePro = window.HoldingsTablePro;
(function() {
  var reg = { Tabs, SearchInput, Button, Mascot, HoldingsTablePro };
  var miss = Object.keys(reg).filter(function(k) {
    return typeof reg[k] !== "function";
  });
  if (miss.length) {
    document.getElementById("root").innerHTML = '<div style="max-width:680px;margin:40px auto;padding:24px;font-family:system-ui;color:var(--bear-strong,#b00);border:1px solid var(--border-2,#f99);border-radius:12px"><h2>\u26A0\uFE0F \u7EC4\u4EF6\u52A0\u8F7D\u5931\u8D25</h2><p>\u672A\u80FD\u52A0\u8F7D: <b>' + miss.join(", ") + '</b><br>\u8BF7\u68C0\u67E5\u8FD9\u4E9B JS \u6587\u4EF6\u662F\u5426\u90FD\u6B63\u5E38\u52A0\u8F7D\u3002</p><pre style="white-space:pre-wrap;color:var(--text-3,#666)">' + JSON.stringify(DS.__errors || [], null, 2) + "</pre></div>";
    throw new Error("DesignSystem load failed: " + miss.join(","));
  }
})();
const GH = window.SITE && window.SITE.github || "#";
const MARKETS = {
  us: { short: "\u7F8E\u80A1", en: "US EQUITIES" },
  a: { short: "A\u80A1", en: "CHINA A-SHARES" },
  hk: { short: "\u6E2F\u80A1", en: "HONG KONG" },
  pe: { short: "\u4E00\u7EA7\u5E02\u573A", en: "PRIVATE MARKETS" }
};
const MARKET_ORDER = ["us", "a", "hk", "pe"];
const TONE_TEXT = { bullish: "\u770B\u591A", bearish: "\u770B\u7A7A", neutral: "\u4E2D\u6027" };
const METRIC_MAP = { negative: "neg", positive: "pos", neg: "neg", pos: "pos", neutral: "neutral" };
const V8_CHIP_LABELS = { "\u884C\u52A8\u6863\u4F4D": 1, "\u8D28\u5730": 1, "\u8D35\u4E0D\u8D35": 1 };
function mapReport(r) {
  const sector = r.sector && r.sector !== "\u2013" && r.sector !== "-" ? r.sector : "";
  const gear = r.action_gear || "";
  let metrics = (r.metrics || []).map((m) => ({ label: m.label, value: m.value, tone: METRIC_MAP[m.tone] || "neutral" }));
  if (gear) metrics = metrics.filter((m) => !V8_CHIP_LABELS[m.label]);
  const cands = [r.name_cn, r.name].filter(Boolean);
  const dispName = cands.sort((a, b) => a.length - b.length)[0] || r.slug;
  return {
    slug: r.slug,
    ticker: r.ticker,
    sector,
    name: dispName,
    version: r.version,
    market: r.market,
    date: r.report_date,
    score: typeof r.composite_score === "number" ? r.composite_score : null,
    tone: r.verdict_tone === "bullish" ? "bullish" : r.verdict_tone === "bearish" ? "bearish" : "neutral",
    one: r.one_liner,
    gear,
    quality: r.quality_field || "",
    valuation: r.valuation_tag || "",
    nextDisclosure: r.next_disclosure_date || "",
    reviewHint: r.review_hint || "",
    verdict: r.verdict || "",
    metrics: metrics.slice(0, 3),
    href: `reports/${encodeURIComponent(r.slug)}/\u5206\u6790\u62A5\u544A_dashboard.html`
  };
}
function tickerKey(t) {
  return String(t || "").toUpperCase().replace(/\.(US|HK|SH|SZ|BJ|SG)$/, "");
}
function pickReports(json) {
  if (!json || !Array.isArray(json.reports)) return [];
  const all = json.reports.map(mapReport);
  const groups = {};
  all.forEach((r) => {
    const k = r.market + "|" + tickerKey(r.ticker);
    (groups[k] = groups[k] || []).push(r);
  });
  const out = [];
  Object.keys(groups).forEach((k) => {
    const g = groups[k].sort((a, b) => (b.date || "").localeCompare(a.date || ""));
    const main = g[0];
    main.older = g.slice(1).map((o) => ({ date: o.date, version: o.version, href: o.href }));
    out.push(main);
  });
  return out;
}
const fmtN = (n) => (Number(n) || 0).toLocaleString("zh-CN", { maximumFractionDigits: 0 });
const scrollBehavior = () => window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
const todayISO = () => {
  const d = /* @__PURE__ */ new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};
function disclosureInfo(dateStr) {
  if (!dateStr) return null;
  const today = todayISO();
  if (dateStr >= today) {
    const days = Math.round((new Date(dateStr) - new Date(today)) / 864e5);
    return { state: days <= 7 ? "soon" : "future", label: `\u62AB\u9732 ${dateStr.slice(5)}` + (days <= 7 ? ` \xB7 ${days === 0 ? "\u4ECA\u5929" : days + " \u5929\u540E"}` : "") };
  }
  return { state: "past", label: `\u62AB\u9732\u65E5 ${dateStr.slice(5)} \u5DF2\u8FC7 \xB7 \u5F85\u590D\u67E5` };
}
function stalenessInfo(nextDisclosure, reportDate) {
  const dd = disclosureInfo(nextDisclosure);
  if (dd) return dd;
  if (!reportDate) return null;
  const days = Math.round((new Date(todayISO()) - new Date(reportDate)) / 864e5);
  if (days > 90) return { state: "past", label: `\u57FA\u51C6\u65E5 ${days} \u5929\u524D \xB7 \u9648\u65E7,\u5EFA\u8BAE\u590D\u67E5` };
  return null;
}
function fetchJSON(url, ms) {
  const ctrl = "AbortController" in window ? new AbortController() : null;
  const t = ctrl ? setTimeout(() => ctrl.abort(), ms || 8e3) : null;
  return fetch(url, ctrl ? { signal: ctrl.signal } : void 0).then((r) => {
    if (!r.ok) throw new Error("HTTP " + r.status);
    return r.json();
  }).finally(() => {
    if (t) clearTimeout(t);
  });
}
const VALID_MARKETS = ["all", "us", "a", "hk", "pe"];
const VALID_SORTS = ["score-desc", "score-asc", "date-desc", "date-asc", "disclosure"];
function readURLState() {
  try {
    const p = new URLSearchParams(location.search);
    const m = p.get("m"), s = p.get("sort");
    return {
      market: VALID_MARKETS.includes(m) ? m : "all",
      q: p.get("q") || "",
      sort: VALID_SORTS.includes(s) ? s : "score-desc"
    };
  } catch (e) {
    return { market: "all", q: "", sort: "score-desc" };
  }
}
function writeURLState(s) {
  try {
    const p = new URLSearchParams();
    if (s.market !== "all") p.set("m", s.market);
    if (s.q.trim()) p.set("q", s.q.trim());
    if (s.sort !== "score-desc") p.set("sort", s.sort);
    const qs = p.toString();
    history.replaceState(null, "", qs ? "?" + qs : location.pathname);
  } catch (e) {
  }
}
function syncThemeColorMeta(theme) {
  document.querySelectorAll('meta[name="theme-color"]').forEach((m) => {
    m.setAttribute("content", theme === "dark" ? "#131118" : "#fbfafc");
  });
}
function ThemeToggle() {
  const effective = () => document.documentElement.dataset.theme || (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  const [eff, setEff] = React.useState(effective);
  React.useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (!document.documentElement.dataset.theme) setEff(effective());
    };
    mq.addEventListener ? mq.addEventListener("change", onChange) : mq.addListener(onChange);
    return () => {
      mq.removeEventListener ? mq.removeEventListener("change", onChange) : mq.removeListener(onChange);
    };
  }, []);
  const flip = () => {
    const next = effective() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("ca-theme", next);
    } catch (e) {
    }
    syncThemeColorMeta(next);
    setEff(next);
  };
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      className: "theme-btn",
      onClick: flip,
      title: "\u5207\u6362\u660E\u6697\u4E3B\u9898",
      "aria-label": eff === "dark" ? "\u5207\u6362\u4E3A\u4EAE\u8272\u4E3B\u9898" : "\u5207\u6362\u4E3A\u6697\u8272\u4E3B\u9898"
    },
    eff === "dark" ? "\u2600" : "\u263E"
  );
}
function ReportCardV2({ r }) {
  const t = r.tone === "bullish" ? "bull" : r.tone === "bearish" ? "bear" : "neutral";
  const dd = stalenessInfo(r.nextDisclosure, r.date);
  return /* @__PURE__ */ React.createElement("article", { className: "rcard" }, /* @__PURE__ */ React.createElement("div", { className: "rcard-body" }, /* @__PURE__ */ React.createElement("div", { className: "rcard-head mono" }, /* @__PURE__ */ React.createElement("span", null, r.ticker, r.sector ? ` \xB7 ${r.sector}` : ""), /* @__PURE__ */ React.createElement("span", { className: "rcard-date" }, r.date)), /* @__PURE__ */ React.createElement("h3", { className: "rcard-name" }, /* @__PURE__ */ React.createElement("a", { className: "rcard-link", href: r.href }, r.name, r.verdict && /* @__PURE__ */ React.createElement("span", { className: "sr-only" }, ",", r.verdict)), r.version && r.version !== "v1" && /* @__PURE__ */ React.createElement("span", { className: "rcard-ver mono" }, r.version)), /* @__PURE__ */ React.createElement("div", { className: "rcard-verdict" }, r.gear ? /* @__PURE__ */ React.createElement("span", { className: `gear-chip ${t}` }, r.gear) : /* @__PURE__ */ React.createElement("span", { className: `gear-chip outline ${t}` }, TONE_TEXT[r.tone], r.score != null ? ` ${r.score.toFixed(1)}` : ""), r.quality && /* @__PURE__ */ React.createElement("span", { className: "ghost-chip" }, "\u8D28\u5730 \xB7 ", r.quality), r.valuation && /* @__PURE__ */ React.createElement("span", { className: "ghost-chip" }, r.valuation)), r.one && /* @__PURE__ */ React.createElement("p", { className: "rcard-one" }, r.one)), r.metrics.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "rcard-metrics" }, r.metrics.map((m, i) => /* @__PURE__ */ React.createElement("div", { className: "rm", key: i }, /* @__PURE__ */ React.createElement("div", { className: "rm-l" }, m.label), /* @__PURE__ */ React.createElement("div", { className: `rm-v mono ${m.tone === "pos" ? "pos" : m.tone === "neg" ? "neg" : ""}` }, m.value)))), /* @__PURE__ */ React.createElement("div", { className: "rcard-foot" }, /* @__PURE__ */ React.createElement("span", { className: "rcard-foot-meta" }, dd && /* @__PURE__ */ React.createElement("span", { className: `disc mono ${dd.state}` }, dd.label), r.reviewHint && /* @__PURE__ */ React.createElement("span", { className: "disc mono past" }, r.reviewHint), r.older && r.older.length > 0 && r.older.map((o, i) => /* @__PURE__ */ React.createElement("a", { key: i, className: "old-ver mono", href: o.href }, "\u65E7\u7248 ", o.version, " \xB7 ", o.date))), /* @__PURE__ */ React.createElement("span", { className: "rcard-cta", "aria-hidden": "true" }, "\u67E5\u770B\u62A5\u544A \u2192")));
}
function PnlJourney({ performance, totals, history: history2 }) {
  const p = performance || {};
  const t = totals || {};
  const openPos = (Number(t.pnlCNY) || 0) >= 0;
  const openCol = openPos ? "var(--bull-ink)" : "var(--bear-ink)";
  const netDeposit = Number(p.netDepositCNY) || 0;
  const netAssets = Number(t.netAssetsCNY) || 0;
  const netGain = netAssets - netDeposit;
  const netGainPct = netDeposit ? netGain / netDeposit * 100 : 0;
  const gainPos = netGain >= 0;
  const gainCol = gainPos ? "var(--bull-ink)" : "var(--bear-ink)";
  const pts = (history2 || []).filter((h) => h && typeof h.acctAssetCNY === "number");
  let chart = null;
  if (pts.length >= 2) {
    const W = 640, H = 160, pad = 10;
    const vals = pts.map((h) => h.acctAssetCNY);
    let mn = Math.min.apply(null, vals), mx = Math.max.apply(null, vals);
    if (netDeposit > 0) {
      mn = Math.min(mn, netDeposit);
      mx = Math.max(mx, netDeposit);
    }
    const span = mx - mn || 1;
    const up = pts[pts.length - 1].acctAssetCNY >= pts[0].acctAssetCNY;
    const lc = up ? "var(--bull-strong)" : "var(--bear-strong)";
    const X = (i) => pad + i * (W - 2 * pad) / (pts.length - 1);
    const Y = (v) => pad + (mx - v) / span * (H - 2 * pad);
    const line = pts.map((h, i) => `${X(i).toFixed(1)},${Y(h.acctAssetCNY).toFixed(1)}`).join(" ");
    const area = `${pad},${H - pad} ` + line + ` ${(W - pad).toFixed(1)},${H - pad}`;
    const last = pts[pts.length - 1];
    const baseY = netDeposit > 0 ? Y(netDeposit) : null;
    chart = /* @__PURE__ */ React.createElement("div", { className: "nav-chart" }, /* @__PURE__ */ React.createElement("div", { className: "nav-chart-y mono" }, /* @__PURE__ */ React.createElement("span", null, "\xA5", fmtN(mx)), /* @__PURE__ */ React.createElement("span", null, "\xA5", fmtN(mn))), baseY != null && /* @__PURE__ */ React.createElement("span", { className: "nav-base-tag mono", style: { top: `${baseY.toFixed(0)}px` } }, "\u672C\u91D1"), /* @__PURE__ */ React.createElement(
      "svg",
      {
        viewBox: `0 0 ${W} ${H}`,
        width: "100%",
        height: "160",
        preserveAspectRatio: "none",
        role: "img",
        "aria-label": `\u51C0\u503C\u8D70\u52BF\u56FE, \u81EA ${pts[0].date} \u7684 ${fmtN(pts[0].acctAssetCNY)} \u5143\u5230 ${last.date} \u7684 ${fmtN(last.acctAssetCNY)} \u5143`
      },
      /* @__PURE__ */ React.createElement("defs", null, /* @__PURE__ */ React.createElement("linearGradient", { id: "navfill", x1: "0", y1: "0", x2: "0", y2: "1" }, /* @__PURE__ */ React.createElement("stop", { offset: "0%", stopColor: up ? "var(--bull)" : "var(--bear)", stopOpacity: "0.14" }), /* @__PURE__ */ React.createElement("stop", { offset: "100%", stopColor: up ? "var(--bull)" : "var(--bear)", stopOpacity: "0" }))),
      [mn, (mn + mx) / 2, mx].map((v, i) => /* @__PURE__ */ React.createElement("line", { key: i, x1: pad, x2: W - pad, y1: Y(v), y2: Y(v), stroke: "var(--border)", strokeWidth: "1" })),
      netDeposit > 0 && /* @__PURE__ */ React.createElement(
        "line",
        {
          x1: pad,
          x2: W - pad,
          y1: Y(netDeposit),
          y2: Y(netDeposit),
          stroke: "var(--text-3)",
          strokeWidth: "1",
          strokeDasharray: "4 4"
        }
      ),
      /* @__PURE__ */ React.createElement("polygon", { points: area, fill: "url(#navfill)" }),
      /* @__PURE__ */ React.createElement("polyline", { points: line, fill: "none", stroke: lc, strokeWidth: "2", strokeLinejoin: "round", strokeLinecap: "round", vectorEffect: "non-scaling-stroke" }),
      /* @__PURE__ */ React.createElement("circle", { cx: X(pts.length - 1), cy: Y(last.acctAssetCNY), r: "3.5", fill: "var(--surface)", stroke: lc, strokeWidth: "2" })
    ), /* @__PURE__ */ React.createElement("div", { className: "nav-chart-x mono" }, /* @__PURE__ */ React.createElement("span", null, pts[0].date), /* @__PURE__ */ React.createElement("span", null, last.date, " \xB7 ", pts.length, " \u4E2A\u8BB0\u5F55\u70B9")));
  }
  let high = 0, highDate = "", maxDD = 0, peakRun = pts.length ? pts[0].acctAssetCNY : 0;
  pts.forEach(function(h) {
    if (h.acctAssetCNY > peakRun) peakRun = h.acctAssetCNY;
    var dd = peakRun ? (peakRun - h.acctAssetCNY) / peakRun : 0;
    if (dd > maxDD) {
      maxDD = dd;
    }
    if (h.acctAssetCNY > high) {
      high = h.acctAssetCNY;
      highDate = h.date;
    }
  });
  const curV = pts.length ? pts[pts.length - 1].acctAssetCNY : 0;
  const ddHigh = high ? (high - curV) / high : 0;
  return /* @__PURE__ */ React.createElement("section", { className: "panel pnl", "aria-label": "\u8D26\u6237\u51C0\u503C\u603B\u89C8" }, /* @__PURE__ */ React.createElement("div", { className: "panel-kicker" }, /* @__PURE__ */ React.createElement("span", null, "PORTFOLIO \xB7 \u8D26\u6237\u51C0\u503C"), p.since && /* @__PURE__ */ React.createElement("span", { className: "mono" }, "\u81EA ", p.since, " \xB7 \u65F6\u95F4\u52A0\u6743 ", (Number(p.timeWeightedPct) || 0) >= 0 ? "+" : "", p.timeWeightedPct, "% \xB7 \u7D2F\u8BA1\u4EA4\u6613 ", p.tradedCount, " \u53EA")), /* @__PURE__ */ React.createElement("div", { className: "pnl-main" }, /* @__PURE__ */ React.createElement("span", { className: "pnl-value mono" }, "\xA5", fmtN(netAssets)), /* @__PURE__ */ React.createElement("span", { className: "pnl-delta mono", style: { color: gainCol } }, gainPos ? "+" : "\u2212", "\xA5", fmtN(Math.abs(netGain)), " (", gainPos ? "+" : "\u2212", Math.abs(netGainPct).toFixed(1), "%)")), /* @__PURE__ */ React.createElement("div", { className: "pnl-sub mono" }, "\u6295\u5165\u672C\u91D1(\u51C0\u5165\u91D1) \xA5", fmtN(netDeposit), " \xB7 \u957F\u6865\u53E3\u5F84\u7D2F\u8BA1\u6536\u76CA ", (Number(p.totalPnLPct) || 0) >= 0 ? "+" : "", p.totalPnLPct, "%"), chart, pts.length >= 2 && /* @__PURE__ */ React.createElement("div", { className: "pnl-stats mono" }, /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("span", { className: "dim" }, "\u5386\u53F2\u6700\u9AD8 "), "\xA5", fmtN(high), " ", /* @__PURE__ */ React.createElement("span", { className: "dim" }, highDate)), /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("span", { className: "dim" }, "\u8DDD\u9AD8\u70B9 "), /* @__PURE__ */ React.createElement("span", { className: "neg-t" }, "\u2212", (ddHigh * 100).toFixed(1), "%")), /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("span", { className: "dim" }, "\u6700\u5927\u56DE\u64A4 "), /* @__PURE__ */ React.createElement("span", { className: "neg-t" }, "\u2212", (maxDD * 100).toFixed(1), "%"))), /* @__PURE__ */ React.createElement("div", { className: "pnl-open" }, "\u5F53\u524D\u6301\u4ED3\u6D6E\u52A8\u76C8\u4E8F ", /* @__PURE__ */ React.createElement("span", { className: "mono", style: { fontWeight: 700, color: openCol } }, openPos ? "+" : "\u2212", "\xA5", fmtN(Math.abs(Number(t.pnlCNY) || 0)), " (", openPos ? "+" : "\u2212", Math.abs(Number(t.pnlPct) || 0).toFixed(2), "%)"), " \xB7 \u603B\u6210\u672C \xA5", fmtN(t.costCNY), " \u2192 \u73B0\u503C \xA5", fmtN(t.grossMvCNY != null ? t.grossMvCNY : t.valueCNY)));
}
function App() {
  const init = readURLState();
  const [reports, setReports] = React.useState(() => window.REPORTS_RAW ? pickReports(window.REPORTS_RAW) : []);
  const [loading, setLoading] = React.useState(true);
  const [live, setLive] = React.useState(false);
  const [holdings, setHoldings] = React.useState(null);
  const [history2, setHistory] = React.useState(null);
  const [q, setQ] = React.useState(init.q);
  const [market, setMarket] = React.useState(init.market);
  const [sort, setSort] = React.useState(init.sort);
  React.useEffect(() => {
    fetchJSON("data/reports.json").then((j) => {
      setReports(pickReports(j));
      setLive(true);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
    fetchJSON("data/holdings.json").then((j) => {
      if (j && Array.isArray(j.positions) && j.positions.length > 0) setHoldings(j);
    }).catch(() => {
    });
    fetchJSON("data/holdings_history.json").then((j) => {
      if (Array.isArray(j)) setHistory(j);
    }).catch(() => {
    });
  }, []);
  React.useEffect(() => {
    writeURLState({ market, q, sort });
  }, [market, q, sort]);
  const counts = React.useMemo(() => {
    const c = {};
    reports.forEach((r) => c[r.market] = (c[r.market] || 0) + 1);
    return c;
  }, [reports]);
  let list = reports.filter((r) => {
    if (market !== "all" && r.market !== market) return false;
    if (q.trim()) {
      const hay = [r.ticker, r.name, r.sector, r.one, r.gear].join(" ").toLowerCase();
      if (!hay.includes(q.trim().toLowerCase())) return false;
    }
    return true;
  });
  const sc = (r) => r.score == null ? -Infinity : r.score;
  const today = todayISO();
  list = [...list].sort((a, b) => {
    if (sort === "score-desc") return sc(b) - sc(a) || (b.date || "").localeCompare(a.date || "");
    if (sort === "score-asc") {
      if (sc(a) === -Infinity && sc(b) === -Infinity) return (b.date || "").localeCompare(a.date || "");
      if (sc(a) === -Infinity) return 1;
      if (sc(b) === -Infinity) return -1;
      return sc(a) - sc(b);
    }
    if (sort === "disclosure") {
      const cat = (r) => r.nextDisclosure ? r.nextDisclosure >= today ? 0 : 1 : 2;
      const ca = cat(a), cb = cat(b);
      if (ca !== cb) return ca - cb;
      if (ca === 0) return a.nextDisclosure.localeCompare(b.nextDisclosure);
      if (ca === 1) return b.nextDisclosure.localeCompare(a.nextDisclosure);
      return (b.date || "").localeCompare(a.date || "");
    }
    if (sort === "date-desc") return (b.date || "").localeCompare(a.date || "");
    return (a.date || "").localeCompare(b.date || "");
  });
  const byMarket = {};
  list.forEach((r) => (byMarket[r.market] = byMarket[r.market] || []).push(r));
  const total = reports.length;
  const totalDocs = reports.reduce((s, r) => s + 1 + (r.older && r.older.length || 0), 0);
  const bullish = reports.filter((r) => r.tone === "bullish").length;
  const latest = reports.reduce((m, r) => r.date > m ? r.date : m, "");
  const twRaw = holdings && holdings.performance ? Number(holdings.performance.timeWeightedPct) : NaN;
  const twPct = Number.isFinite(twRaw) ? twRaw : null;
  const pendingReview = reports.filter((r) => r.nextDisclosure && r.nextDisclosure < today).length;
  const tabItems = [{ value: "all", label: "\u5168\u90E8" }];
  MARKET_ORDER.forEach((m) => {
    if (counts[m]) tabItems.push({ value: m, label: MARKETS[m].short, count: counts[m] });
  });
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("nav", { className: "nav", "aria-label": "\u7AD9\u70B9\u5BFC\u822A" }, /* @__PURE__ */ React.createElement("button", { className: "nav-logo", onClick: () => {
    setMarket("all");
    setQ("");
    window.scrollTo({ top: 0, behavior: scrollBehavior() });
  } }, /* @__PURE__ */ React.createElement("span", { className: "turtle", "aria-hidden": "true" }, "\u{1F422}"), " \u53F6\u7EB8\u7684\u6295\u8D44\u62A5\u544A"), /* @__PURE__ */ React.createElement("div", { className: "nav-links" }, MARKET_ORDER.map((m) => counts[m] ? /* @__PURE__ */ React.createElement("button", { key: m, className: "nl", onClick: () => {
    setMarket(m);
    var el = document.getElementById("reports");
    if (el) el.scrollIntoView({ behavior: scrollBehavior() });
  } }, MARKETS[m].short) : null), /* @__PURE__ */ React.createElement("a", { className: "nl nl-gh", href: GH, target: "_blank", rel: "noopener" }, "GitHub"), /* @__PURE__ */ React.createElement(ThemeToggle, null))), /* @__PURE__ */ React.createElement("div", { className: "wrap" }, /* @__PURE__ */ React.createElement("header", { className: "hero" }, /* @__PURE__ */ React.createElement("div", { className: "hero-text" }, /* @__PURE__ */ React.createElement("span", { className: "hero-badge" }, "AI \u6295\u7814 \xB7 v8 \u5224\u65AD\u94FE"), /* @__PURE__ */ React.createElement("h1", null, "\u53F6\u7EB8\u7684\u6295\u8D44\u5206\u6790\u62A5\u544A"), /* @__PURE__ */ React.createElement("span", { className: "hero-rule", "aria-hidden": "true" }), /* @__PURE__ */ React.createElement("p", null, "\u5224\u65AD\u94FE\u4E94\u8282\u70B9\u2014\u2014\u8D28\u5730 / \u72B6\u6001 / \u8D54\u7387 / \u8DEF\u5F84 / \u600E\u4E48\u529E\u2014\u2014\u7ED9\u6BCF\u5BB6\u516C\u53F8\u4E00\u4E2A\u53EF\u68C0\u9A8C\u7684\u7ED3\u8BBA\u3002\u8986\u76D6\u7F8E\u80A1\u3001A \u80A1\u3001\u6E2F\u80A1\u4E0E\u4E00\u7EA7\u5E02\u573A\uFF0C\u62A5\u544A\u7531 company-analysis skill \u81EA\u52A8\u751F\u6210\u3002"), /* @__PURE__ */ React.createElement("div", { className: "hero-dateline mono" }, totalDocs, " \u7BC7\u62A5\u544A \xB7 ", Object.keys(counts).length, " \u4E2A\u5E02\u573A \xB7 \u6700\u65B0 ", latest || "\u2014")), /* @__PURE__ */ React.createElement("div", { className: "hero-mascot" }, /* @__PURE__ */ React.createElement(
    Mascot,
    {
      src: "assets/mascot-192.jpg",
      name: "\u53F6\u7EB8",
      bubbleSide: "left",
      size: 96,
      sparkles: false,
      bubbleInterval: 0,
      quotes: ["\u6211\u662F\u53F6\u7EB8,\u6162\u5373\u662F\u7A33 \u{1F422}", "\u770B OCF,\u522B\u53EA\u770B\u5229\u6DA6\u8868~", "\u4F30\u503C\u900F\u652F\u4E86\u54E6,\u51B7\u9759\u4E00\u4E0B", "\u5148\u95EE\u8D28\u5730,\u518D\u8C08\u4EF7\u683C", "\u6233\u6211\u6362\u53F0\u8BCD!"]
    }
  ))), /* @__PURE__ */ React.createElement("div", { className: "statebar", role: "list" }, /* @__PURE__ */ React.createElement("div", { className: "st", role: "listitem" }, /* @__PURE__ */ React.createElement("div", { className: "st-l" }, "\u8986\u76D6\u6807\u7684"), /* @__PURE__ */ React.createElement("div", { className: "st-v mono" }, total)), /* @__PURE__ */ React.createElement("div", { className: "st", role: "listitem" }, /* @__PURE__ */ React.createElement("div", { className: "st-l" }, "\u5F85\u91CD\u8BC4"), /* @__PURE__ */ React.createElement("div", { className: "st-v mono " + (pendingReview > 0 ? "warn-t" : "") }, pendingReview)), /* @__PURE__ */ React.createElement("div", { className: "st", role: "listitem" }, /* @__PURE__ */ React.createElement("div", { className: "st-l" }, "\u770B\u597D\u6807\u7684"), /* @__PURE__ */ React.createElement("div", { className: "st-v mono bull-t" }, bullish)), /* @__PURE__ */ React.createElement("div", { className: "st", role: "listitem" }, /* @__PURE__ */ React.createElement("div", { className: "st-l" }, "\u6700\u65B0\u66F4\u65B0"), /* @__PURE__ */ React.createElement("div", { className: "st-v mono" }, latest ? latest.slice(5).replace("-", "/") : "\u2014")), /* @__PURE__ */ React.createElement("div", { className: "st", role: "listitem" }, /* @__PURE__ */ React.createElement("div", { className: "st-l" }, "\u65F6\u95F4\u52A0\u6743\u6536\u76CA"), /* @__PURE__ */ React.createElement("div", { className: "st-v mono " + (twPct == null ? "" : twPct >= 0 ? "bull-t" : "bear-t") }, twPct == null ? "\u2014" : (twPct >= 0 ? "+" : "") + twPct + "%"))), /* @__PURE__ */ React.createElement("section", { id: "holdings", "aria-label": "\u5B9E\u76D8\u6301\u4ED3" }, holdings ? /* @__PURE__ */ React.createElement(
    HoldingsTablePro,
    {
      key: "hold-real",
      owner: holdings.owner || "\u53F6\u7EB8",
      cash: holdings.cashCNY || 0,
      positions: holdings.positions,
      fx: holdings.fx || { CNY: 1 },
      readOnly: true,
      updatedLabel: holdings.last_updated ? "\u66F4\u65B0\u4E8E " + String(holdings.last_updated).replace("T", " ").replace("Z", " UTC") + " \xB7 \u6765\u81EA\u957F\u6865" : "\u6765\u81EA\u957F\u6865",
      note: "\u5B9E\u65F6\u6301\u4ED3 \xB7 \u6765\u81EA\u957F\u6865 \xB7 \u603B\u8D44\u4EA7=\u51C0\u8D44\u4EA7(\u5DF2\u6263\u878D\u8D44), \u4ED3\u4F4D>100%\u5373\u878D\u8D44\u6760\u6746 \xB7 \u91D1\u989D\u6309\u5F53\u65E5\u6C47\u7387\u6298\u7B97\xA5 \xB7 \u4E0D\u6784\u6210\u6295\u8D44\u5EFA\u8BAE"
    }
  ) : /* @__PURE__ */ React.createElement("div", { className: "panel hold-offline" }, /* @__PURE__ */ React.createElement("div", { className: "panel-kicker" }, /* @__PURE__ */ React.createElement("span", null, "HOLDINGS \xB7 \u5B9E\u76D8\u6301\u4ED3")), /* @__PURE__ */ React.createElement("p", null, loading ? "\u6B63\u5728\u8BFB\u53D6\u6301\u4ED3\u6570\u636E\u2026" : "\u6301\u4ED3\u6570\u636E\u6765\u81EA\u957F\u6865\u3001\u6BCF\u65E5\u81EA\u52A8\u540C\u6B65;\u5F53\u524D\u5904\u4E8E\u79BB\u7EBF\u9884\u89C8\u6216\u6570\u636E\u52A0\u8F7D\u5931\u8D25,\u6682\u4E0D\u5C55\u793A\u3002"))), holdings && /* @__PURE__ */ React.createElement(PnlJourney, { performance: holdings.performance, totals: holdings.totals, history: history2 }), /* @__PURE__ */ React.createElement("div", { id: "reports", className: "toolbar" }, /* @__PURE__ */ React.createElement("div", { className: "grow" }, /* @__PURE__ */ React.createElement(SearchInput, { placeholder: "\u641C\u7D22 ticker / \u516C\u53F8\u540D / \u4E1A\u52A1\u63CF\u8FF0\u2026", value: q, onChange: (e) => setQ(e.target.value), "aria-label": "\u641C\u7D22\u62A5\u544A" })), /* @__PURE__ */ React.createElement(Tabs, { value: market, onChange: setMarket, items: tabItems }), /* @__PURE__ */ React.createElement("select", { className: "sortsel", value: sort, onChange: (e) => setSort(e.target.value), "aria-label": "\u6392\u5E8F\u65B9\u5F0F" }, /* @__PURE__ */ React.createElement("option", { value: "score-desc" }, "\u8BC4\u5206 \u9AD8\u2192\u4F4E"), /* @__PURE__ */ React.createElement("option", { value: "score-asc" }, "\u8BC4\u5206 \u4F4E\u2192\u9AD8"), /* @__PURE__ */ React.createElement("option", { value: "date-desc" }, "\u6700\u65B0\u62AB\u9732"), /* @__PURE__ */ React.createElement("option", { value: "date-asc" }, "\u6700\u65E9\u62AB\u9732"), /* @__PURE__ */ React.createElement("option", { value: "disclosure" }, "\u62AB\u9732\u4E34\u8FD1"))), /* @__PURE__ */ React.createElement("div", { className: "results", role: "status" }, loading && total === 0 ? "\u52A0\u8F7D\u4E2D\u2026" : list.length === total ? `\u5171 ${total} \u4E2A\u6807\u7684` : `\u5F53\u524D\u663E\u793A ${list.length} / ${total} \u4E2A\u6807\u7684`, !loading && !live && window.REPORTS_RAW && /* @__PURE__ */ React.createElement("span", { className: "stale mono" }, " \xB7 \u79BB\u7EBF\u5FEB\u7167 ", window.REPORTS_RAW.last_updated || "")), total === 0 ? /* @__PURE__ */ React.createElement("div", { className: "empty" }, /* @__PURE__ */ React.createElement("div", { className: "ic", "aria-hidden": "true" }, "\u{1F422}"), /* @__PURE__ */ React.createElement("div", null, loading ? "\u6B63\u5728\u8BFB\u53D6\u62A5\u544A\u6570\u636E\u2026" : "\u6682\u65E0\u62A5\u544A\u6570\u636E (\u8BF7\u786E\u8BA4 data/reports.json \u53EF\u8BBF\u95EE)")) : list.length === 0 ? /* @__PURE__ */ React.createElement("div", { className: "empty" }, /* @__PURE__ */ React.createElement("div", { className: "ic", "aria-hidden": "true" }, "\u{1F50D}"), /* @__PURE__ */ React.createElement("div", null, "\u6CA1\u6709\u5339\u914D\u7684\u62A5\u544A")) : MARKET_ORDER.filter((m) => byMarket[m] && byMarket[m].length).map((m) => /* @__PURE__ */ React.createElement("section", { key: m, "aria-label": MARKETS[m].short }, /* @__PURE__ */ React.createElement("h2", { className: "section-head" }, /* @__PURE__ */ React.createElement("span", { className: "zh" }, MARKETS[m].short), /* @__PURE__ */ React.createElement("span", { className: "en mono" }, MARKETS[m].en), /* @__PURE__ */ React.createElement("span", { className: "ct mono" }, byMarket[m].length), /* @__PURE__ */ React.createElement("span", { className: "rule", "aria-hidden": "true" })), /* @__PURE__ */ React.createElement("div", { className: "cards" }, byMarket[m].map((r) => /* @__PURE__ */ React.createElement(ReportCardV2, { key: r.slug, r }))))), /* @__PURE__ */ React.createElement("footer", { className: "footer" }, /* @__PURE__ */ React.createElement("div", { className: "f-links" }, /* @__PURE__ */ React.createElement("a", { href: GH, target: "_blank", rel: "noopener" }, "GitHub"), /* @__PURE__ */ React.createElement("a", { href: "https://github.com/leafpaper/claude-company-analysis", target: "_blank", rel: "noopener" }, "\u5206\u6790 Skill")), /* @__PURE__ */ React.createElement("div", { className: "f-legal" }, "\u62A5\u544A\u7531 AI \u81EA\u52A8\u751F\u6210\uFF0C\u4E0D\u6784\u6210\u6295\u8D44\u5EFA\u8BAE \xB7 \u6570\u636E\u66F4\u65B0 ", /* @__PURE__ */ React.createElement("span", { className: "mono" }, latest || "\u2014")))));
}
ReactDOM.createRoot(document.getElementById("root")).render(/* @__PURE__ */ React.createElement(App, null));
