/* ============================================================
   主页应用 (源码) —— 经 build.sh / build.cmd 用 esbuild 预编译成 app.js
   依赖全局: React / ReactDOM / DesignSystem_a138b7 / HoldingsTablePro
   ============================================================ */
const DS = window.DesignSystem_a138b7 || {};
const { Tabs, SearchInput, Button, Mascot } = DS;
const HoldingsTablePro = window.HoldingsTablePro;
(function(){
  var reg = { Tabs:Tabs, SearchInput:SearchInput, Button:Button, Mascot:Mascot, HoldingsTablePro:HoldingsTablePro };
  var miss = Object.keys(reg).filter(function(k){ return typeof reg[k] !== 'function'; });
  if (miss.length){
    document.getElementById('root').innerHTML = '<div style="max-width:680px;margin:40px auto;padding:24px;font-family:system-ui;color:var(--bear-strong,#b00);border:1px solid var(--border-2,#f99);border-radius:12px"><h2>⚠️ 组件加载失败</h2><p>未能加载: <b>'+miss.join(', ')+'</b><br>请检查这些 JS 文件是否都正常加载。</p><pre style="white-space:pre-wrap;color:var(--text-3,#666)">'+JSON.stringify(DS.__errors||[],null,2)+'</pre></div>';
    throw new Error('DesignSystem load failed: '+miss.join(','));
  }
})();
const GH = (window.SITE && window.SITE.github) || '#';

/* ---- 市场元数据 (结构化, 不再 slice 字符串 —— 国旗 emoji 会被切碎) ---- */
const MARKETS = {
  us: { short: '美股',     en: 'US EQUITIES' },
  a:  { short: 'A股',      en: 'CHINA A-SHARES' },
  hk: { short: '港股',     en: 'HONG KONG' },
  pe: { short: '一级市场', en: 'PRIVATE MARKETS' },
};
const MARKET_ORDER = ['us', 'a', 'hk', 'pe'];
const TONE_TEXT = { bullish: '看多', bearish: '看空', neutral: '中性' };

/* ---- reports.json 原始字段 → 卡片 props (纯展示层映射, 不动数据契约) ---- */
const METRIC_MAP = { negative:'neg', positive:'pos', neg:'neg', pos:'pos', neutral:'neutral' };
/* v8 卡上 行动档位/质地/贵不贵 已有专属 chip, metrics 里的同名项不再重复渲染 */
const V8_CHIP_LABELS = { '行动档位':1, '质地':1, '贵不贵':1 };

function mapReport(r){
  const sector = (r.sector && r.sector !== '–' && r.sector !== '-') ? r.sector : '';
  const gear = r.action_gear || '';
  let metrics = (r.metrics||[]).map(m=>({ label:m.label, value:m.value, tone: METRIC_MAP[m.tone] || 'neutral' }));
  if (gear) metrics = metrics.filter(m => !V8_CHIP_LABELS[m.label]);
  // 显示名: name / name_cn 里取更短的 (旧数据里另一个字段常是 'Tibet Mining' 或 'Adobe v3·5阶段分析' 这类长标题)
  const cands = [r.name_cn, r.name].filter(Boolean);
  const dispName = cands.sort((a,b)=>a.length-b.length)[0] || r.slug;
  return {
    slug: r.slug, ticker: r.ticker, sector: sector, name: dispName,
    version: r.version, market: r.market, date: r.report_date,
    score: (typeof r.composite_score === 'number') ? r.composite_score : null,
    tone: r.verdict_tone === 'bullish' ? 'bullish' : r.verdict_tone === 'bearish' ? 'bearish' : 'neutral',
    one: r.one_liner,
    gear: gear,
    quality: r.quality_field || '',
    valuation: r.valuation_tag || '',
    nextDisclosure: r.next_disclosure_date || '',
    reviewHint: r.review_hint || '',
    verdict: r.verdict || '',
    metrics: metrics.slice(0,3),
    href: `reports/${encodeURIComponent(r.slug)}/分析报告_dashboard.html`,
  };
}

/* ---- compare.json 原始字段 → 对比卡 props (票10 --compare; 同样是纯展示层映射)
   卡上不产生新结论: verdict 直接引「组内裁决」那一句, 每家的档位引各家自己的报告 ---- */
function mapCompare(g){
  const members = (g.members||[]).map(m=>({
    company: m.company, ticker: m.ticker||'', market: m.market||'',
    gear: m.action_gear||'', quality: m.quality_field||'',
    date: m.report_date||'', stale: !!m.stale,
    href: m.href || '',
  }));
  return {
    slug: g.slug, name: g.name || g.slug, anchor: g.anchor || '',
    chainNote: g.chain_note || '',
    href: g.href || ('compare/' + encodeURIComponent(g.slug) + '/index.html'),
    date: g.generated || '',
    verdict: g.verdict || '', winner: g.winner || '',
    markets: Array.isArray(g.markets) ? g.markets : [],
    missing: g.missing_count || 0,
    staleCount: g.stale_count || 0,
    members: members,
  };
}
function pickCompare(json){
  if(!json || !Array.isArray(json.groups)) return [];
  return json.groups.map(mapCompare).sort((a,b)=>(b.date||'').localeCompare(a.date||''));
}

/* 同一标的的新旧报告合并: 只展示最新一份, 旧版收进卡片脚注链接。
   只剥离市场后缀 (ADBE.US→ADBE), 不能砍掉一切点号后缀 —— BRK.A/BRK.B 是不同证券 */
function tickerKey(t){ return String(t||'').toUpperCase().replace(/\.(US|HK|SH|SZ|BJ|SG)$/,''); }
function pickReports(json){
  if (!json || !Array.isArray(json.reports)) return [];
  const all = json.reports.map(mapReport);
  const groups = {};
  all.forEach(r => { const k = r.market + '|' + tickerKey(r.ticker); (groups[k] = groups[k] || []).push(r); });
  const out = [];
  Object.keys(groups).forEach(k => {
    const g = groups[k].sort((a,b)=>(b.date||'').localeCompare(a.date||''));
    const main = g[0];
    main.older = g.slice(1).map(o=>({ date:o.date, version:o.version, href:o.href }));
    out.push(main);
  });
  return out;
}

const fmtN = (n)=> (Number(n)||0).toLocaleString('zh-CN',{maximumFractionDigits:0});
const scrollBehavior = () => (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) ? 'auto' : 'smooth';
const todayISO = ()=>{ const d=new Date(); const p=n=>String(n).padStart(2,'0'); return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}`; };

/* ---- 披露日生命周期: 未来→倒计时 / ≤7天→临近 / 已过→待重评 ---- */
function disclosureInfo(dateStr){
  if(!dateStr) return null;
  const today = todayISO();
  if(dateStr >= today){
    const days = Math.round((new Date(dateStr) - new Date(today)) / 86400000);
    return { state: days <= 7 ? 'soon' : 'future', label: `披露 ${dateStr.slice(5)}` + (days <= 7 ? ` · ${days === 0 ? '今天' : days + ' 天后'}` : '') };
  }
  return { state: 'past', label: `披露日 ${dateStr.slice(5)} 已过 · 待复查` };
}

/* ---- 超龄陈旧警示 (v8 --review): 披露日信息优先; 没有披露日但基准日 >90 天(约一个披露季)→ 陈旧 ---- */
function stalenessInfo(nextDisclosure, reportDate){
  const dd = disclosureInfo(nextDisclosure);
  if(dd) return dd;
  if(!reportDate) return null;
  const days = Math.round((new Date(todayISO()) - new Date(reportDate)) / 86400000);
  if(days > 90) return { state: 'past', label: `基准日 ${days} 天前 · 陈旧,建议复查` };
  return null;
}

/* ---- 带超时和 r.ok 检查的 fetch ---- */
function fetchJSON(url, ms){
  const ctrl = ('AbortController' in window) ? new AbortController() : null;
  const t = ctrl ? setTimeout(()=>ctrl.abort(), ms || 8000) : null;
  return fetch(url, ctrl ? { signal: ctrl.signal } : undefined)
    .then(r => { if(!r.ok) throw new Error('HTTP '+r.status); return r.json(); })
    .finally(()=>{ if(t) clearTimeout(t); });
}

/* ---- URL 状态同步 (可分享的筛选视图, 参数白名单校验) ---- */
const VALID_MARKETS = ['all','us','a','hk','pe'];
const VALID_SORTS = ['score-desc','score-asc','date-desc','date-asc','disclosure'];
function readURLState(){
  try {
    const p = new URLSearchParams(location.search);
    const m = p.get('m'), s = p.get('sort');
    return {
      market: VALID_MARKETS.includes(m) ? m : 'all',
      q: p.get('q') || '',
      sort: VALID_SORTS.includes(s) ? s : 'score-desc',
    };
  } catch(e){ return { market:'all', q:'', sort:'score-desc' }; }
}
function writeURLState(s){
  try {
    const p = new URLSearchParams();
    if(s.market !== 'all') p.set('m', s.market);
    if(s.q.trim()) p.set('q', s.q.trim());
    if(s.sort !== 'score-desc') p.set('sort', s.sort);
    const qs = p.toString();
    history.replaceState(null, '', qs ? '?'+qs : location.pathname);
  } catch(e){}
}

/* ---- 明暗主题切换 (存储键 ca-theme, 与报告详情页共享) ---- */
function syncThemeColorMeta(theme){
  document.querySelectorAll('meta[name="theme-color"]').forEach(m=>{
    m.setAttribute('content', theme === 'dark' ? '#131118' : '#fbfafc');
  });
}
function ThemeToggle(){
  const effective = () => document.documentElement.dataset.theme
    || ((window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light');
  const [eff, setEff] = React.useState(effective);
  React.useEffect(()=>{
    // 页面开着时系统切换明暗: 无显式选择则跟随, 图标同步
    if (!window.matchMedia) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => { if(!document.documentElement.dataset.theme) setEff(effective()); };
    mq.addEventListener ? mq.addEventListener('change', onChange) : mq.addListener(onChange);
    return () => { mq.removeEventListener ? mq.removeEventListener('change', onChange) : mq.removeListener(onChange); };
  },[]);
  const flip = () => {
    const next = effective() === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('ca-theme', next); } catch(e){}
    syncThemeColorMeta(next);
    setEff(next);
  };
  return (
    <button className="theme-btn" onClick={flip} title="切换明暗主题"
      aria-label={eff === 'dark' ? '切换为亮色主题' : '切换为暗色主题'}>
      {eff === 'dark' ? '☀' : '☾'}
    </button>
  );
}

/* ---- 报告卡 (v2: 决断行 + 开放式 metrics + 披露日脚注) ---- */
function ReportCardV2({ r }){
  const t = r.tone === 'bullish' ? 'bull' : r.tone === 'bearish' ? 'bear' : 'neutral';
  const dd = stalenessInfo(r.nextDisclosure, r.date);
  return (
    <article className={'rcard'}>
      <div className="rcard-body">
        <div className="rcard-head mono">
          <span>{r.ticker}{r.sector ? ` · ${r.sector}` : ''}</span>
          <span className="rcard-date">{r.date}</span>
        </div>
        <h3 className="rcard-name">
          <a className="rcard-link" href={r.href}>{r.name}{r.verdict && <span className="sr-only">,{r.verdict}</span>}</a>
          {r.version && r.version !== 'v1' && <span className="rcard-ver mono">{r.version}</span>}
        </h3>
        <div className="rcard-verdict">
          {r.gear
            ? <span className={`gear-chip ${t}`}>{r.gear}</span>
            : <span className={`gear-chip outline ${t}`}>{TONE_TEXT[r.tone]}{r.score != null ? ` ${r.score.toFixed(1)}` : ''}</span>}
          {r.quality && <span className="ghost-chip">质地 · {r.quality}</span>}
          {r.valuation && <span className="ghost-chip">{r.valuation}</span>}
        </div>
        {r.one && <p className="rcard-one">{r.one}</p>}
      </div>
      {r.metrics.length > 0 && (
        <div className="rcard-metrics">
          {r.metrics.map((m,i)=>(
            <div className="rm" key={i}>
              <div className="rm-l">{m.label}</div>
              <div className={`rm-v mono ${m.tone === 'pos' ? 'pos' : m.tone === 'neg' ? 'neg' : ''}`}>{m.value}</div>
            </div>
          ))}
        </div>
      )}
      <div className="rcard-foot">
        <span className="rcard-foot-meta">
          {dd && <span className={`disc mono ${dd.state}`}>{dd.label}</span>}
          {r.reviewHint && <span className="disc mono past">{r.reviewHint}</span>}
          {r.older && r.older.length > 0 && r.older.map((o,i)=>(
            <a key={i} className="old-ver mono" href={o.href}>旧版 {o.version} · {o.date}</a>
          ))}
        </span>
        <span className="rcard-cta" aria-hidden="true">查看报告 →</span>
      </div>
    </article>
  );
}

/* ---- 产业链对比卡 (票10): 与报告卡同一套 class, 成员格子各自点回自己的报告 ---- */
function CompareCard({ g }){
  return (
    <article className="rcard">
      <div className="rcard-body">
        <div className="rcard-head mono">
          <span>产业链对比 · {g.members.length} 家{g.missing ? ` · 缺 ${g.missing} 家` : ''}</span>
          <span className="rcard-date">{g.date}</span>
        </div>
        <h3 className="rcard-name">
          <a className="rcard-link" href={g.href}>{g.name}</a>
        </h3>
        <div className="rcard-verdict">
          {g.winner
            ? <span className="gear-chip neutral">钱先放 · {g.winner}</span>
            : <span className="gear-chip outline neutral">裁决待产出</span>}
          {g.anchor && <span className="ghost-chip">锚 · {g.anchor}</span>}
          {g.staleCount > 0 && <span className="ghost-chip">{g.staleCount} 家陈旧 · 建议先复查</span>}
        </div>
        {(g.verdict || g.chainNote) && <p className="rcard-one">{g.verdict || g.chainNote}</p>}
      </div>
      {g.members.length > 0 && (
        <div className="rcard-metrics members">
          {g.members.map((m,i)=>(
            <a className="rm rml" key={i} href={m.href}
               title={`${m.company} ${m.ticker} · 基准日 ${m.date}${m.stale ? ' · 陈旧' : ''}`}>
              <div className="rm-l">{m.company}</div>
              <div className="rm-v mono">{m.gear || '—'}{m.stale ? ' ·陈旧' : ''}</div>
            </a>
          ))}
        </div>
      )}
      <div className="rcard-foot">
        <span className="rcard-foot-meta">
          {g.missing > 0 && <span className="disc mono past">{g.missing} 家缺完整报告 · 未进对比</span>}
        </span>
        <span className="rcard-cta" aria-hidden="true">查看对比页 →</span>
      </div>
    </article>
  );
}

/* ---- 账户净值卡 (网格线 + 本金基准线 + 首末日期) ---- */
function PnlJourney({ performance, totals, history }){
  const p = performance || {};
  const t = totals || {};
  const openPos = (Number(t.pnlCNY)||0) >= 0;
  const openCol = openPos ? 'var(--bull-ink)' : 'var(--bear-ink)';
  const netDeposit = Number(p.netDepositCNY)||0;
  const netAssets = Number(t.netAssetsCNY)||0;
  const netGain = netAssets - netDeposit;
  const netGainPct = netDeposit ? netGain/netDeposit*100 : 0;
  const gainPos = netGain >= 0;
  const gainCol = gainPos ? 'var(--bull-ink)' : 'var(--bear-ink)';

  const pts = (history||[]).filter(h=>h && typeof h.acctAssetCNY==='number');
  let chart = null;
  if(pts.length >= 2){
    const W=640, H=160, pad=10;
    const vals = pts.map(h=>h.acctAssetCNY);
    let mn=Math.min.apply(null,vals), mx=Math.max.apply(null,vals);
    if(netDeposit > 0){ mn = Math.min(mn, netDeposit); mx = Math.max(mx, netDeposit); }
    const span=(mx-mn)||1;
    const up = pts[pts.length-1].acctAssetCNY >= pts[0].acctAssetCNY;
    const lc = up ? 'var(--bull-strong)' : 'var(--bear-strong)';
    const X = (i)=> pad + i*(W-2*pad)/(pts.length-1);
    const Y = (v)=> pad + (mx-v)/span*(H-2*pad);
    const line = pts.map((h,i)=>`${X(i).toFixed(1)},${Y(h.acctAssetCNY).toFixed(1)}`).join(' ');
    const area = `${pad},${H-pad} ` + line + ` ${(W-pad).toFixed(1)},${H-pad}`;
    const last = pts[pts.length-1];
    const baseY = netDeposit > 0 ? Y(netDeposit) : null;
    chart = (
      <div className="nav-chart">
        <div className="nav-chart-y mono"><span>¥{fmtN(mx)}</span><span>¥{fmtN(mn)}</span></div>
        {baseY != null && <span className="nav-base-tag mono" style={{top:`${baseY.toFixed(0)}px`}}>本金</span>}
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="160" preserveAspectRatio="none"
          role="img" aria-label={`净值走势图, 自 ${pts[0].date} 的 ${fmtN(pts[0].acctAssetCNY)} 元到 ${last.date} 的 ${fmtN(last.acctAssetCNY)} 元`}>
          <defs>
            <linearGradient id="navfill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={up ? 'var(--bull)' : 'var(--bear)'} stopOpacity="0.14"/>
              <stop offset="100%" stopColor={up ? 'var(--bull)' : 'var(--bear)'} stopOpacity="0"/>
            </linearGradient>
          </defs>
          {[mn, (mn+mx)/2, mx].map((v,i)=>(
            <line key={i} x1={pad} x2={W-pad} y1={Y(v)} y2={Y(v)} stroke="var(--border)" strokeWidth="1"/>
          ))}
          {netDeposit > 0 && (
            <line x1={pad} x2={W-pad} y1={Y(netDeposit)} y2={Y(netDeposit)}
              stroke="var(--text-3)" strokeWidth="1" strokeDasharray="4 4"/>
          )}
          <polygon points={area} fill="url(#navfill)"/>
          <polyline points={line} fill="none" stroke={lc} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke"/>
          <circle cx={X(pts.length-1)} cy={Y(last.acctAssetCNY)} r="3.5" fill="var(--surface)" stroke={lc} strokeWidth="2"/>
        </svg>
        <div className="nav-chart-x mono"><span>{pts[0].date}</span><span>{last.date} · {pts.length} 个记录点</span></div>
      </div>
    );
  }

  // 回撤指标 (从净值序列计算)
  let high=0, highDate='', maxDD=0, peakRun=(pts.length?pts[0].acctAssetCNY:0);
  pts.forEach(function(h){ if(h.acctAssetCNY>peakRun) peakRun=h.acctAssetCNY; var dd=peakRun?(peakRun-h.acctAssetCNY)/peakRun:0; if(dd>maxDD){maxDD=dd;} if(h.acctAssetCNY>high){high=h.acctAssetCNY;highDate=h.date;} });
  const curV = pts.length?pts[pts.length-1].acctAssetCNY:0;
  const ddHigh = high?(high-curV)/high:0;

  return (
    <section className="panel pnl" aria-label="账户净值总览">
      <div className="panel-kicker">
        <span>PORTFOLIO · 账户净值</span>
        {p.since && <span className="mono">自 {p.since} · 时间加权 {(Number(p.timeWeightedPct)||0)>=0?'+':''}{p.timeWeightedPct}% · 累计交易 {p.tradedCount} 只</span>}
      </div>
      <div className="pnl-main">
        <span className="pnl-value mono">¥{fmtN(netAssets)}</span>
        <span className="pnl-delta mono" style={{color:gainCol}}>{gainPos?'+':'−'}¥{fmtN(Math.abs(netGain))} ({gainPos?'+':'−'}{Math.abs(netGainPct).toFixed(1)}%)</span>
      </div>
      <div className="pnl-sub mono">投入本金(净入金) ¥{fmtN(netDeposit)} · 长桥口径累计收益 {(Number(p.totalPnLPct)||0)>=0?'+':''}{p.totalPnLPct}%</div>
      {chart}
      {pts.length>=2 && (
        <div className="pnl-stats mono">
          <span><span className="dim">历史最高 </span>¥{fmtN(high)} <span className="dim">{highDate}</span></span>
          <span><span className="dim">距高点 </span><span className="neg-t">−{(ddHigh*100).toFixed(1)}%</span></span>
          <span><span className="dim">最大回撤 </span><span className="neg-t">−{(maxDD*100).toFixed(1)}%</span></span>
        </div>
      )}
      <div className="pnl-open">
        当前持仓浮动盈亏 <span className="mono" style={{fontWeight:700,color:openCol}}>{openPos?'+':'−'}¥{fmtN(Math.abs(Number(t.pnlCNY)||0))} ({openPos?'+':'−'}{Math.abs(Number(t.pnlPct)||0).toFixed(2)}%)</span> · 总成本 ¥{fmtN(t.costCNY)} → 现值 ¥{fmtN(t.grossMvCNY!=null?t.grossMvCNY:t.valueCNY)}
      </div>
    </section>
  );
}

function App(){
  const init = readURLState();
  const [reports,setReports] = React.useState(()=> window.REPORTS_RAW ? pickReports(window.REPORTS_RAW) : []);
  const [groups,setGroups] = React.useState(()=> window.COMPARE_RAW ? pickCompare(window.COMPARE_RAW) : []);
  const [loading,setLoading] = React.useState(true);
  const [live,setLive] = React.useState(false);          // data/reports.json 实时拉取是否成功
  const [holdings,setHoldings] = React.useState(null);   // 真实持仓 (data/holdings.json)
  const [history,setHistory] = React.useState(null);     // 净值历史 (data/holdings_history.json)
  const [q,setQ] = React.useState(init.q);
  const [market,setMarket] = React.useState(init.market);
  const [sort,setSort] = React.useState(init.sort);

  React.useEffect(()=>{
    fetchJSON('data/reports.json').then(j=>{ setReports(pickReports(j)); setLive(true); setLoading(false); })
      .catch(()=>{ setLoading(false); });
    // positions 为空视为数据异常 (曾因上游 token 过期连发空组合), 宁可显示离线占位
    // 对比组 (票10): 还没有任何组时文件可能不存在, 拉不到就当空, 整节不渲染
    fetchJSON('data/compare.json').then(j=>{ setGroups(pickCompare(j)); }).catch(()=>{});
    fetchJSON('data/holdings.json').then(j=>{ if(j && Array.isArray(j.positions) && j.positions.length > 0) setHoldings(j); }).catch(()=>{});
    fetchJSON('data/holdings_history.json').then(j=>{ if(Array.isArray(j)) setHistory(j); }).catch(()=>{});
  },[]);

  React.useEffect(()=>{ writeURLState({ market, q, sort }); },[market,q,sort]);

  const counts = React.useMemo(()=>{ const c={}; reports.forEach(r=>c[r.market]=(c[r.market]||0)+1); return c; },[reports]);

  let list = reports.filter(r=>{
    if(market!=='all' && r.market!==market) return false;
    if(q.trim()){ const hay=[r.ticker,r.name,r.sector,r.one,r.gear].join(' ').toLowerCase(); if(!hay.includes(q.trim().toLowerCase())) return false; }
    return true;
  });
  // 对比组跟着同一套搜索/市场筛选走(组覆盖多个市场时, 任一命中即显示)
  const groupList = groups.filter(g=>{
    if(market!=='all' && !(g.markets||[]).includes(market)) return false;
    if(q.trim()){
      const hay = [g.name,g.anchor,g.verdict,g.chainNote]
        .concat(g.members.map(m=>m.company+' '+m.ticker)).join(' ').toLowerCase();
      if(!hay.includes(q.trim().toLowerCase())) return false;
    }
    return true;
  });

  const sc = r => (r.score == null ? -Infinity : r.score);
  const today = todayISO();
  list = [...list].sort((a,b)=>{
    if(sort==='score-desc') return sc(b)-sc(a) || (b.date||'').localeCompare(a.date||'');
    if(sort==='score-asc'){
      if(sc(a)===-Infinity && sc(b)===-Infinity) return (b.date||'').localeCompare(a.date||'');
      if(sc(a)===-Infinity) return 1; if(sc(b)===-Infinity) return -1;
      return sc(a)-sc(b);
    }
    if(sort==='disclosure'){
      // 三档: 未来披露日(升序) < 披露日已过·待重评(近→远) < 无披露信息(报告日期新→旧)
      const cat = r => r.nextDisclosure ? (r.nextDisclosure >= today ? 0 : 1) : 2;
      const ca = cat(a), cb = cat(b);
      if(ca !== cb) return ca - cb;
      if(ca === 0) return a.nextDisclosure.localeCompare(b.nextDisclosure);
      if(ca === 1) return b.nextDisclosure.localeCompare(a.nextDisclosure);
      return (b.date||'').localeCompare(a.date||'');
    }
    if(sort==='date-desc') return (b.date||'').localeCompare(a.date||'');
    return (a.date||'').localeCompare(b.date||'');
  });

  const byMarket={}; list.forEach(r=>(byMarket[r.market]=byMarket[r.market]||[]).push(r));
  const total=reports.length;                                       // 去重后的标的数
  const totalDocs=reports.reduce((s,r)=>s+1+((r.older&&r.older.length)||0),0);  // 含旧版的报告篇数
  const bullish=reports.filter(r=>r.tone==='bullish').length;
  const latest=reports.reduce((m,r)=>(r.date>m?r.date:m),'');
  const twRaw = holdings && holdings.performance ? Number(holdings.performance.timeWeightedPct) : NaN;
  const twPct = Number.isFinite(twRaw) ? twRaw : null;
  const pendingReview = reports.filter(r=>r.nextDisclosure && r.nextDisclosure < today).length;

  const tabItems=[{value:'all',label:'全部'}];
  MARKET_ORDER.forEach(m=>{ if(counts[m]) tabItems.push({value:m,label:MARKETS[m].short,count:counts[m]}); });

  return (
    <React.Fragment>
      <nav className="nav" aria-label="站点导航">
        <button className="nav-logo" onClick={()=>{setMarket('all');setQ('');window.scrollTo({top:0,behavior:scrollBehavior()});}}>
          <span className="turtle" aria-hidden="true">🐢</span> 叶纸的投资报告
        </button>
        <div className="nav-links">
          {MARKET_ORDER.map(m=> counts[m] ? (
            <button key={m} className="nl" onClick={()=>{setMarket(m);var el=document.getElementById('reports');if(el)el.scrollIntoView({behavior:scrollBehavior()});}}>{MARKETS[m].short}</button>
          ) : null)}
          <a className="nl nl-gh" href={GH} target="_blank" rel="noopener">GitHub</a>
          <ThemeToggle/>
        </div>
      </nav>

      <div className="wrap">
        <header className="hero">
          <div className="hero-text">
            <span className="hero-badge">AI 投研 · v8 判断链</span>
            <h1>叶纸的投资分析报告</h1>
            <span className="hero-rule" aria-hidden="true"></span>
            <p>判断链五节点——质地 / 状态 / 赔率 / 路径 / 怎么办——给每家公司一个可检验的结论。覆盖美股、A 股、港股与一级市场，报告由 company-analysis skill 自动生成。</p>
            <div className="hero-dateline mono">{totalDocs} 篇报告 · {Object.keys(counts).length} 个市场 · 最新 {latest || '—'}</div>
          </div>
          <div className="hero-mascot">
            <Mascot src="assets/mascot-192.jpg" name="叶纸" bubbleSide="left" size={96} sparkles={false} bubbleInterval={0}
              quotes={['我是叶纸,慢即是稳 🐢','看 OCF,别只看利润表~','估值透支了哦,冷静一下','先问质地,再谈价格','戳我换台词!']} />
          </div>
        </header>

        <div className="statebar" role="list">
          <div className="st" role="listitem"><div className="st-l">覆盖标的</div><div className="st-v mono">{total}</div></div>
          <div className="st" role="listitem"><div className="st-l">待重评</div><div className={'st-v mono '+(pendingReview>0?'warn-t':'')}>{pendingReview}</div></div>
          <div className="st" role="listitem"><div className="st-l">看好标的</div><div className="st-v mono bull-t">{bullish}</div></div>
          <div className="st" role="listitem"><div className="st-l">最新更新</div><div className="st-v mono">{latest ? latest.slice(5).replace('-','/') : '—'}</div></div>
          <div className="st" role="listitem"><div className="st-l">时间加权收益</div><div className={'st-v mono '+(twPct==null?'':twPct>=0?'bull-t':'bear-t')}>{twPct==null?'—':(twPct>=0?'+':'')+twPct+'%'}</div></div>
        </div>

        <section id="holdings" aria-label="实盘持仓">
          {holdings ? (
            <HoldingsTablePro key="hold-real" owner={holdings.owner||'叶纸'} cash={holdings.cashCNY||0}
              positions={holdings.positions} fx={holdings.fx||{CNY:1}} readOnly
              updatedLabel={holdings.last_updated ? ('更新于 '+String(holdings.last_updated).replace('T',' ').replace('Z',' UTC')+' · 来自长桥') : '来自长桥'}
              note="实时持仓 · 来自长桥 · 总资产=净资产(已扣融资), 仓位>100%即融资杠杆 · 金额按当日汇率折算¥ · 不构成投资建议" />
          ) : (
            <div className="panel hold-offline">
              <div className="panel-kicker"><span>HOLDINGS · 实盘持仓</span></div>
              <p>{loading ? '正在读取持仓数据…' : '持仓数据来自长桥、每日自动同步;当前处于离线预览或数据加载失败,暂不展示。'}</p>
            </div>
          )}
        </section>

        {holdings && <PnlJourney performance={holdings.performance} totals={holdings.totals} history={history} />}

        <div id="reports" className="toolbar">
          <div className="grow"><SearchInput placeholder="搜索 ticker / 公司名 / 业务描述…" value={q} onChange={e=>setQ(e.target.value)} aria-label="搜索报告" /></div>
          <Tabs value={market} onChange={setMarket} items={tabItems}/>
          <select className="sortsel" value={sort} onChange={e=>setSort(e.target.value)} aria-label="排序方式">
            <option value="score-desc">评分 高→低</option>
            <option value="score-asc">评分 低→高</option>
            <option value="date-desc">最新披露</option>
            <option value="date-asc">最早披露</option>
            <option value="disclosure">披露临近</option>
          </select>
        </div>
        <div className="results" role="status">
          {loading && total===0 ? '加载中…'
            : (list.length===total?`共 ${total} 个标的`:`当前显示 ${list.length} / ${total} 个标的`)}
          {!loading && !live && window.REPORTS_RAW && <span className="stale mono"> · 离线快照 {window.REPORTS_RAW.last_updated || ''}</span>}
        </div>

        {groupList.length > 0 && (
          <section aria-label="产业链对比">
            <h2 className="section-head">
              <span className="zh">产业链对比</span>
              <span className="en mono">PEER COMPARISONS</span>
              <span className="ct mono">{groupList.length}</span>
              <span className="rule" aria-hidden="true"></span>
            </h2>
            <div className="cards">
              {groupList.map(g=>(<CompareCard key={g.slug} g={g}/>))}
            </div>
          </section>
        )}

        {total===0 ? (
          <div className="empty"><div className="ic" aria-hidden="true">🐢</div><div>{loading?'正在读取报告数据…':'暂无报告数据 (请确认 data/reports.json 可访问)'}</div></div>
        ) : list.length===0 ? (
          <div className="empty"><div className="ic" aria-hidden="true">🔍</div><div>没有匹配的报告</div></div>
        ) : MARKET_ORDER.filter(m=>byMarket[m]&&byMarket[m].length).map(m=>(
          <section key={m} aria-label={MARKETS[m].short}>
            <h2 className="section-head">
              <span className="zh">{MARKETS[m].short}</span>
              <span className="en mono">{MARKETS[m].en}</span>
              <span className="ct mono">{byMarket[m].length}</span>
              <span className="rule" aria-hidden="true"></span>
            </h2>
            <div className="cards">
              {byMarket[m].map(r=>(<ReportCardV2 key={r.slug} r={r}/>))}
            </div>
          </section>
        ))}

        <footer className="footer">
          <div className="f-links">
            <a href={GH} target="_blank" rel="noopener">GitHub</a>
            <a href="https://github.com/leafpaper/claude-company-analysis" target="_blank" rel="noopener">分析 Skill</a>
          </div>
          <div className="f-legal">报告由 AI 自动生成，不构成投资建议 · 数据更新 <span className="mono">{latest || '—'}</span></div>
        </footer>
      </div>
    </React.Fragment>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
