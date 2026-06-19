/* @ds-bundle: {"format":3,"namespace":"DesignSystem_a138b7","components":[{"name":"Mascot","sourcePath":"components/brand/Mascot.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"DimensionBar","sourcePath":"components/data/DimensionBar.jsx"},{"name":"HoldingsTable","sourcePath":"components/data/HoldingsTable.jsx"},{"name":"MetricChip","sourcePath":"components/data/MetricChip.jsx"},{"name":"MetricStrip","sourcePath":"components/data/MetricChip.jsx"},{"name":"RatingCard","sourcePath":"components/data/RatingCard.jsx"},{"name":"ReportCard","sourcePath":"components/data/ReportCard.jsx"},{"name":"RiskCard","sourcePath":"components/data/RiskCard.jsx"},{"name":"ScenarioCard","sourcePath":"components/data/ScenarioCard.jsx"},{"name":"ScoreRing","sourcePath":"components/data/ScoreRing.jsx"},{"name":"SentimentMeter","sourcePath":"components/data/SentimentMeter.jsx"},{"name":"SearchInput","sourcePath":"components/forms/SearchInput.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"}],"sourceHashes":{"components/brand/Mascot.jsx":"5a440e643d61","components/core/Badge.jsx":"d90aff5e0ad3","components/core/Button.jsx":"fd95bd67ceb5","components/data/DimensionBar.jsx":"5c9c7465579d","components/data/HoldingsTable.jsx":"4ba509da7b1a","components/data/MetricChip.jsx":"947dd1ba47eb","components/data/RatingCard.jsx":"a4f4d3256104","components/data/ReportCard.jsx":"c9d2b45318c6","components/data/RiskCard.jsx":"e254566f537b","components/data/ScenarioCard.jsx":"7e25d9f9b2ab","components/data/ScoreRing.jsx":"acd13b5384ee","components/data/SentimentMeter.jsx":"21ab47cf34d6","components/forms/SearchInput.jsx":"56ec24577061","components/navigation/Tabs.jsx":"5a1e98174060","ui_kits/report_index/reports.data.js":"5f69b68766b7"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.DesignSystem_a138b7 = window.DesignSystem_a138b7 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/brand/Mascot.jsx
try { (() => {
function useStyle(id, css) {
  if (typeof document === 'undefined') return;
  if (document.getElementById(id)) return;
  const el = document.createElement('style');
  el.id = id;
  el.textContent = css;
  document.head.appendChild(el);
}
const CSS = `
.ds-mascot{position:relative;display:inline-flex;flex-direction:column;align-items:center;
  font-family:var(--font-body);--orbit-r:62px;}
.ds-mascot__stage{position:relative;display:grid;place-items:center;cursor:pointer;
  filter:drop-shadow(0 10px 22px var(--pink-glow));}
.ds-mascot__float{position:relative;display:block;}
@media (prefers-reduced-motion:no-preference){
  .ds-mascot__float{animation:ds-mascot-idle 3.4s var(--ease) infinite;}
}
.ds-mascot.is-wiggle .ds-mascot__char{animation:ds-wiggle .6s var(--ease);}
.ds-mascot__char{position:relative;border-radius:50%;overflow:hidden;
  background:var(--grad-brand);border:4px solid #fff;
  box-shadow:0 0 0 3px var(--border-pink),inset 0 0 0 1px rgba(255,255,255,.4);}
.ds-mascot__char img{width:100%;height:100%;object-fit:cover;display:block;}
.ds-mascot__char.is-empty{display:grid;place-items:center;}
.ds-mascot__char.is-empty span{font-size:46%;filter:none;}
/* 光泽扫光 */
.ds-mascot__shine{position:absolute;inset:0;border-radius:50%;pointer-events:none;
  background:linear-gradient(120deg,transparent 40%,rgba(255,255,255,.55) 50%,transparent 60%);
  background-size:220% 220%;mix-blend-mode:screen;}
@media (prefers-reduced-motion:no-preference){
  .ds-mascot__shine{animation:ds-shimmer 4.5s linear infinite;}
}
/* 名牌 */
.ds-mascot__tag{margin-top:14px;font-size:var(--fs-xs);font-weight:var(--fw-bold);
  color:#fff;background:var(--grad-brand);padding:4px 14px;border-radius:var(--r-pill);
  box-shadow:var(--shadow-md);letter-spacing:.5px;white-space:nowrap;}
/* 环绕星芒 */
.ds-mascot__orbit{position:absolute;top:50%;left:50%;width:0;height:0;pointer-events:none;}
.ds-mascot__orbit i{position:absolute;font-style:normal;font-size:13px;
  transform-origin:0 0;}
.ds-mascot__orbit i::before{content:'✦';}
@media (prefers-reduced-motion:no-preference){
  .ds-mascot__orbit i{animation:ds-orbit linear infinite;}
}
/* 气泡 */
.ds-mascot__bubble{position:absolute;top:6px;max-width:188px;
  background:#fff;border:2px solid var(--border-pink);border-radius:16px;
  padding:9px 13px;font-size:var(--fs-sm);font-weight:var(--fw-medium);color:var(--text);
  line-height:1.45;box-shadow:var(--shadow-md);z-index:3;}
.ds-mascot__bubble.r{left:calc(100% - 6px);}
.ds-mascot__bubble.l{right:calc(100% - 6px);text-align:right;}
.ds-mascot__bubble::after{content:'';position:absolute;top:20px;width:12px;height:12px;
  background:#fff;border-left:2px solid var(--border-pink);border-bottom:2px solid var(--border-pink);}
.ds-mascot__bubble.r::after{left:-7px;transform:rotate(45deg);}
.ds-mascot__bubble.l::after{right:-7px;transform:rotate(-135deg);}
.ds-mascot__bubble.is-new{animation:ds-pop-in .5s var(--ease-spring);}
`;
const DEFAULT_QUOTES = ['慢即是稳,龟速也能爆赚 🐢', '我是叶纸,看 OCF 别只看利润表~', '估值透支了哦,冷静一下', 'DCF 概率加权,稳一点!', '戳我换台词!'];

/**
 * 二次元吉祥物 — 待机浮动 + 扫光 + 环绕星芒 + 循环台词气泡, 点击会摇摆并切换台词。
 * 传 src 指向角色立绘 (圆形裁切); 不传则回退到 🐢 占位。
 */
function Mascot({
  src,
  name = '叶纸',
  quotes = DEFAULT_QUOTES,
  size = 130,
  bubbleSide = 'right',
  showBubble = true,
  sparkles = true,
  bubbleInterval = 4200,
  className = ''
}) {
  useStyle('ds-mascot-css', CSS);
  const list = quotes && quotes.length ? quotes : DEFAULT_QUOTES;
  const [i, setI] = React.useState(0);
  const [wiggle, setWiggle] = React.useState(false);
  const [bump, setBump] = React.useState(0); // forces bubble re-pop

  React.useEffect(() => {
    if (!showBubble || list.length < 2) return;
    const t = setInterval(() => {
      setI(p => (p + 1) % list.length);
      setBump(b => b + 1);
    }, bubbleInterval);
    return () => clearInterval(t);
  }, [showBubble, list.length, bubbleInterval]);
  const poke = () => {
    setWiggle(true);
    setI(p => (p + 1) % list.length);
    setBump(b => b + 1);
    setTimeout(() => setWiggle(false), 620);
  };
  const side = bubbleSide === 'left' ? 'l' : 'r';
  const orbits = [{
    r: size * 0.52,
    d: 7,
    color: 'var(--pink)',
    delay: 0
  }, {
    r: size * 0.62,
    d: 11,
    color: 'var(--purple)',
    delay: -3
  }, {
    r: size * 0.46,
    d: 9,
    color: 'var(--neutral)',
    delay: -6
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: ['ds-mascot', wiggle ? 'is-wiggle' : '', className].filter(Boolean).join(' ')
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-mascot__stage",
    onClick: poke,
    title: "\u6233\u6211!"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-mascot__float"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-mascot__char",
    style: {
      width: size,
      height: size,
      fontSize: size
    }
  }, src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name
  }) : /*#__PURE__*/React.createElement("span", {
    "aria-hidden": true,
    style: {
      fontSize: size * 0.5
    }
  }, "\uD83D\uDC22"), /*#__PURE__*/React.createElement("span", {
    className: "ds-mascot__shine"
  })), sparkles && /*#__PURE__*/React.createElement("div", {
    className: "ds-mascot__orbit",
    "aria-hidden": true
  }, orbits.map((o, k) => /*#__PURE__*/React.createElement("i", {
    key: k,
    style: {
      '--orbit-r': `${o.r}px`,
      animationDuration: `${o.d}s`,
      animationDelay: `${o.delay}s`,
      color: o.color
    }
  }))), showBubble && /*#__PURE__*/React.createElement("div", {
    key: bump,
    className: `ds-mascot__bubble ${side} is-new`
  }, list[i]))), name && /*#__PURE__*/React.createElement("div", {
    className: "ds-mascot__tag"
  }, name));
}
Object.assign(__ds_scope, { Mascot });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Mascot.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function useStyle(id, css) {
  if (typeof document === 'undefined') return;
  if (document.getElementById(id)) return;
  const el = document.createElement('style');
  el.id = id;
  el.textContent = css;
  document.head.appendChild(el);
}
const CSS = `
.ds-badge{
  display:inline-flex;align-items:center;gap:5px;
  font-family:var(--font-body);font-weight:var(--fw-bold);
  font-size:var(--fs-2xs);line-height:1;letter-spacing:.3px;
  padding:5px 11px;border-radius:var(--r-pill);white-space:nowrap;
}
.ds-badge--bull{background:var(--bull-bg);color:var(--bull-strong);}
.ds-badge--bear{background:var(--bear-bg);color:var(--bear-strong);}
.ds-badge--neutral{background:var(--neutral-bg);color:var(--neutral-strong);}
.ds-badge--pink{background:var(--pink-bg);color:var(--pink);}
.ds-badge--purple{background:var(--purple-bg);color:var(--purple-600);}
.ds-badge--ghost{background:transparent;color:var(--text-3);border:1px solid var(--border-2);font-weight:var(--fw-medium);}
/* solid 强调 (verdict version badge) */
.ds-badge--solid-bull{background:var(--bull);color:#fff;}
.ds-badge--solid-bear{background:var(--bear);color:#fff;}
.ds-badge--solid-neutral{background:var(--neutral);color:#3d2b3a;}
.ds-badge__dot{width:6px;height:6px;border-radius:50%;background:currentColor;}
`;
const VARIANTS = new Set(['bull', 'bear', 'neutral', 'pink', 'purple', 'ghost', 'solid-bull', 'solid-bear', 'solid-neutral']);

/**
 * 标签徽章 — verdict 语气 (看多/看空/中性) 与品牌色变体。
 */
function Badge({
  children,
  variant = 'ghost',
  dot = false,
  className = '',
  ...rest
}) {
  useStyle('ds-badge-css', CSS);
  const v = VARIANTS.has(variant) ? variant : 'ghost';
  return /*#__PURE__*/React.createElement("span", _extends({
    className: ['ds-badge', `ds-badge--${v}`, className].filter(Boolean).join(' ')
  }, rest), dot && /*#__PURE__*/React.createElement("span", {
    className: "ds-badge__dot"
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Inject a component's scoped CSS once per document.
function useStyle(id, css) {
  if (typeof document === 'undefined') return;
  if (document.getElementById(id)) return;
  const el = document.createElement('style');
  el.id = id;
  el.textContent = css;
  document.head.appendChild(el);
}
const CSS = `
.ds-btn{
  display:inline-flex;align-items:center;justify-content:center;gap:8px;
  font-family:var(--font-body);font-weight:var(--fw-bold);
  border:2px solid transparent;border-radius:var(--r-md);cursor:pointer;
  white-space:nowrap;text-decoration:none;line-height:1;
  transition:transform var(--t-fast),box-shadow var(--t-fast),background var(--t-fast),color var(--t-fast),border-color var(--t-fast);
}
.ds-btn:active{transform:translateY(1px) scale(.985);}
.ds-btn:focus-visible{outline:none;box-shadow:var(--ring);}
.ds-btn[disabled]{opacity:.45;cursor:not-allowed;pointer-events:none;}

/* sizes */
.ds-btn--sm{font-size:var(--fs-xs);padding:7px 14px;}
.ds-btn--md{font-size:var(--fs-sm);padding:10px 20px;}
.ds-btn--lg{font-size:var(--fs-md);padding:13px 26px;}

/* variants */
.ds-btn--primary{background:var(--grad-brand);color:#fff;box-shadow:var(--shadow-md);}
.ds-btn--primary:hover{transform:translateY(-2px);box-shadow:var(--shadow-lg);}

.ds-btn--secondary{background:var(--pink-bg);color:var(--pink);border-color:transparent;}
.ds-btn--secondary:hover{background:#ffe1ec;color:var(--pink-600);}

.ds-btn--ghost{background:transparent;color:var(--text-2);border-color:var(--border-2);}
.ds-btn--ghost:hover{color:var(--pink);border-color:var(--border-pink);background:var(--pink-bg);}

.ds-btn--bull{background:var(--grad-bull);color:#fff;box-shadow:var(--shadow-bull);}
.ds-btn--bull:hover{transform:translateY(-2px);}

.ds-btn--icon{padding:0;width:38px;height:38px;border-radius:var(--r-md);}
.ds-btn--icon.ds-btn--sm{width:30px;height:30px;}
.ds-btn--block{width:100%;}
`;

/**
 * 叶纸品牌按钮 — primary(粉紫渐变) / secondary(粉底) / ghost / bull(看多绿)
 */
function Button({
  children,
  variant = 'primary',
  size = 'md',
  block = false,
  icon = null,
  iconRight = null,
  as = 'button',
  className = '',
  ...rest
}) {
  useStyle('ds-button-css', CSS);
  const Tag = as;
  const cls = ['ds-btn', `ds-btn--${variant}`, `ds-btn--${size}`, block ? 'ds-btn--block' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: cls
  }, rest), icon, children, iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/data/DimensionBar.jsx
try { (() => {
function useStyle(id, css) {
  if (typeof document === 'undefined') return;
  if (document.getElementById(id)) return;
  const el = document.createElement('style');
  el.id = id;
  el.textContent = css;
  document.head.appendChild(el);
}
const CSS = `
.ds-dim{
  display:grid;grid-template-columns:1fr 42px 3fr 52px;
  align-items:center;gap:12px;margin:11px 0;font-size:var(--fs-sm);
}
.ds-dim__name{color:var(--text-2);}
.ds-dim__score{font-family:var(--font-mono);font-weight:var(--fw-bold);
  text-align:right;color:var(--purple-600);}
.ds-dim__track{height:10px;background:var(--surface-soft);border-radius:var(--r-pill);overflow:hidden;}
.ds-dim__fill{
  height:100%;border-radius:var(--r-pill);transform-origin:left center;
}
@media (prefers-reduced-motion:no-preference){
  .ds-dim__fill{animation:ds-bar-grow .9s var(--ease) both;}
}
.ds-dim__fill.t1{background:linear-gradient(90deg,#a78bfa,var(--purple));}
.ds-dim__fill.t2{background:linear-gradient(90deg,#f4a0bf,var(--pink));}
.ds-dim__fill.t3{background:linear-gradient(90deg,#fcd34d,var(--neutral-strong));}
.ds-dim__weight{text-align:right;color:var(--text-3);font-size:var(--fs-xs);
  font-family:var(--font-mono);}
`;

/**
 * 维度评分条 — 名称 / 分数 / 进度 / 权重四列, 入场动画。
 */
function DimensionBar({
  name,
  score = 0,
  max = 10,
  weight,
  tier,
  className = ''
}) {
  useStyle('ds-dim-css', CSS);
  const pct = Math.max(0, Math.min(1, score / max));
  // auto tier by score band if not given
  const t = tier || (score >= 7 ? 1 : score >= 4 ? 2 : 3);
  return /*#__PURE__*/React.createElement("div", {
    className: ['ds-dim', className].filter(Boolean).join(' ')
  }, /*#__PURE__*/React.createElement("span", {
    className: "ds-dim__name"
  }, name), /*#__PURE__*/React.createElement("span", {
    className: "ds-dim__score"
  }, score), /*#__PURE__*/React.createElement("span", {
    className: "ds-dim__track"
  }, /*#__PURE__*/React.createElement("span", {
    className: `ds-dim__fill t${t}`,
    style: {
      width: `${pct * 100}%`
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "ds-dim__weight"
  }, weight != null ? `${weight}%` : ''));
}
Object.assign(__ds_scope, { DimensionBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/DimensionBar.jsx", error: String((e && e.message) || e) }); }

// components/data/HoldingsTable.jsx
try { (() => {
function useStyle(id, css) {
  if (typeof document === 'undefined') return;
  if (document.getElementById(id)) return;
  const el = document.createElement('style');
  el.id = id;
  el.textContent = css;
  document.head.appendChild(el);
}

// 数字滚动 (count-up)
function useCountUp(target, duration = 1100) {
  const [val, setVal] = React.useState(0);
  React.useEffect(() => {
    if (typeof window === 'undefined') {
      setVal(target);
      return;
    }
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVal(target);
      return;
    }
    let raf, start;
    const from = 0;
    const step = t => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / duration);
      const e = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setVal(from + (target - from) * e);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return val;
}
function loadLS(key, fallback) {
  try {
    const s = window.localStorage.getItem(key);
    return s ? JSON.parse(s) : fallback;
  } catch (e) {
    return fallback;
  }
}
function saveLS(key, val) {
  try {
    window.localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {/* ignore */}
}
const fmt = (n, d = 0) => (Number(n) || 0).toLocaleString('zh-CN', {
  minimumFractionDigits: d,
  maximumFractionDigits: d
});
const pct = n => `${n >= 0 ? '+' : '−'}${Math.abs(n).toFixed(2)}%`;
const sign = n => n >= 0 ? '+' : '−';
const CSS = `
.ds-hold{background:var(--surface);border:1px solid var(--border);border-radius:var(--r-xl);
  box-shadow:var(--shadow-sm);overflow:hidden;font-family:var(--font-body);}
.ds-hold__head{padding:20px 24px;background:linear-gradient(135deg,var(--bg-2),var(--surface));
  border-bottom:2px dashed var(--border);display:flex;align-items:flex-end;gap:24px;flex-wrap:wrap;}
.ds-hold__title{font-size:var(--fs-sm);font-weight:var(--fw-bold);color:var(--text-2);
  display:flex;align-items:center;gap:7px;margin:0 auto 0 0;}
.ds-hold__title .ic{font-size:18px;}
.ds-hold__total .l,.ds-hold__day .l{font-size:var(--fs-2xs);color:var(--text-3);
  text-transform:uppercase;letter-spacing:var(--ls-label);font-weight:var(--fw-bold);margin-bottom:2px;}
.ds-hold__total .v{font-family:var(--font-mono);font-size:30px;font-weight:var(--fw-black);
  color:var(--text);font-variant-numeric:tabular-nums;line-height:1.05;}
.ds-hold__total .v .cur{font-size:16px;color:var(--text-3);margin-right:3px;}
.ds-hold__day .v{font-family:var(--font-mono);font-size:22px;font-weight:var(--fw-black);
  font-variant-numeric:tabular-nums;display:flex;align-items:baseline;gap:8px;}
.ds-hold__day .amt{font-size:13px;font-weight:var(--fw-bold);opacity:.85;}
.pos{color:var(--bull-strong);} .neg{color:var(--bear-strong);}

.ds-hold__table{width:100%;border-collapse:collapse;font-size:var(--fs-sm);}
.ds-hold__table th{text-align:right;font-size:var(--fs-2xs);color:var(--text-3);
  text-transform:uppercase;letter-spacing:.5px;font-weight:var(--fw-bold);
  padding:11px 16px;border-bottom:1px solid var(--border);background:var(--surface-soft);}
.ds-hold__table th:first-child,.ds-hold__table td:first-child{text-align:left;}
.ds-hold__table td{padding:13px 16px;text-align:right;border-bottom:1px solid var(--border);
  font-variant-numeric:tabular-nums;vertical-align:middle;}
.ds-hold__table tr:last-child td{border-bottom:none;}
.ds-hold__table tbody tr{transition:background var(--t-fast);}
.ds-hold__table tbody tr:hover{background:var(--pink-bg);}
@media (prefers-reduced-motion:no-preference){
  .ds-hold__table tbody tr.anim{animation:ds-slide-in .5s var(--ease) both;}
}
.ds-hold__nm{font-weight:var(--fw-bold);color:var(--text);}
.ds-hold__tk{font-family:var(--font-mono);font-size:var(--fs-2xs);color:var(--text-3);
  letter-spacing:.4px;margin-top:2px;}
.ds-hold__num{font-family:var(--font-mono);font-weight:var(--fw-bold);color:var(--text);}
.ds-hold__chip{display:inline-block;font-family:var(--font-mono);font-weight:var(--fw-bold);
  font-size:var(--fs-xs);padding:3px 9px;border-radius:var(--r-pill);}
.ds-hold__chip.pos{background:var(--bull-bg);}
.ds-hold__chip.neg{background:var(--bear-bg);}
.ds-hold__foot{padding:11px 24px;font-size:var(--fs-2xs);color:var(--text-3);
  background:var(--surface-soft);border-top:1px solid var(--border);}

/* ---- 编辑模式 ---- */
.ds-hold__btn{font-family:var(--font-body);font-weight:var(--fw-bold);font-size:12px;cursor:pointer;
  border-radius:var(--r-pill);padding:7px 15px;border:1.5px solid var(--border-2);
  background:var(--surface);color:var(--text-2);transition:all var(--t-fast);white-space:nowrap;}
.ds-hold__btn:hover{border-color:var(--border-pink);color:var(--pink);background:var(--pink-bg);}
.ds-hold__btn.primary{background:var(--grad-brand);color:#fff;border-color:transparent;box-shadow:var(--shadow-md);}
.ds-hold__btn.primary:hover{transform:translateY(-1px);}
.ds-hold__editbar{display:flex;align-items:center;gap:12px;flex-wrap:wrap;
  padding:12px 24px;background:var(--purple-bg);border-bottom:1px solid var(--border);font-size:var(--fs-sm);}
.ds-hold__editbar .cashlab{font-weight:var(--fw-bold);color:var(--purple-600);display:flex;align-items:center;gap:6px;}
.ds-hold__in{font-family:var(--font-mono);font-size:13px;width:100%;text-align:right;font-weight:var(--fw-bold);
  border:1.5px solid var(--border);border-radius:8px;padding:6px 8px;background:var(--surface);color:var(--text);}
.ds-hold__in:focus{outline:none;border-color:var(--pink);box-shadow:0 0 0 2px var(--pink-glow);}
.ds-hold__in.txt{text-align:left;}
.ds-hold__in.sm{font-size:11px;margin-top:5px;font-weight:var(--fw-medium);}
.ds-hold__cashin{font-family:var(--font-mono);width:110px;text-align:right;font-weight:var(--fw-bold);
  border:1.5px solid var(--border);border-radius:8px;padding:6px 9px;background:var(--surface);color:var(--text);}
.ds-hold__cashin:focus{outline:none;border-color:var(--purple);box-shadow:0 0 0 2px var(--purple-glow);}
.ds-hold__del{border:none;background:var(--bear-bg);color:var(--bear-strong);width:30px;height:30px;
  border-radius:8px;cursor:pointer;font-size:14px;transition:all var(--t-fast);}
.ds-hold__del:hover{background:var(--bear);color:#fff;}
.ds-hold__addrow td{text-align:center;padding:12px;}
`;
const BLANK = {
  name: '新标的',
  ticker: 'CODE',
  shares: 0,
  cost: 0,
  price: 0,
  prevClose: 0
};

/**
 * 持仓表 — 顶部汇总 (当前总金额 + 今日涨跌, count-up 滚动) + 逐行明细。
 * 传 editable 显示「编辑」按钮, 可改 / 增 / 删持仓与现金; 传 storageKey 则本地保存 (刷新不丢)。
 */
function HoldingsTable({
  holdings = [],
  cash = 0,
  owner = '叶纸',
  currency = '¥',
  icon = '🐢',
  editable = false,
  storageKey,
  note = '示例持仓 · 可点「编辑」修改 · 不构成投资建议',
  className = ''
}) {
  useStyle('ds-hold-css', CSS);
  const seed = React.useMemo(() => ({
    holdings,
    cash
  }), []); // eslint-disable-line
  const [data, setData] = React.useState(() => {
    if (storageKey && typeof window !== 'undefined') return loadLS(storageKey, seed);
    return seed;
  });
  const [editing, setEditing] = React.useState(false);
  const commit = next => {
    setData(next);
    if (storageKey && typeof window !== 'undefined') saveLS(storageKey, next);
  };
  const setStr = (i, field, value) => commit({
    ...data,
    holdings: data.holdings.map((r, k) => k === i ? {
      ...r,
      [field]: value
    } : r)
  });
  const setNum = (i, field, value) => setStr(i, field, value === '' ? 0 : parseFloat(value) || 0);
  const addRow = () => commit({
    ...data,
    holdings: [...data.holdings, {
      ...BLANK
    }]
  });
  const delRow = i => commit({
    ...data,
    holdings: data.holdings.filter((_, k) => k !== i)
  });
  const setCash = v => commit({
    ...data,
    cash: v === '' ? 0 : parseFloat(v) || 0
  });
  const reset = () => commit(seed);
  const rows = data.holdings.map(h => {
    const mv = h.shares * h.price;
    const dayAmt = h.shares * (h.price - h.prevClose);
    const dayPct = h.prevClose ? (h.price - h.prevClose) / h.prevClose * 100 : 0;
    const plPct = h.cost ? (h.price - h.cost) / h.cost * 100 : 0;
    return {
      ...h,
      mv,
      dayAmt,
      dayPct,
      plPct
    };
  });
  const total = rows.reduce((s, r) => s + r.mv, 0) + (data.cash || 0);
  const prevTotal = rows.reduce((s, r) => s + r.shares * r.prevClose, 0) + (data.cash || 0);
  const dayAmt = total - prevTotal;
  const dayPct = prevTotal ? dayAmt / prevTotal * 100 : 0;
  const totalAnim = useCountUp(total);
  const dayPctAnim = useCountUp(dayPct, 1000);
  const showTotal = editing ? total : totalAnim;
  const showDayPct = editing ? dayPct : dayPctAnim;
  const dayCls = dayAmt >= 0 ? 'pos' : 'neg';
  return /*#__PURE__*/React.createElement("div", {
    className: ['ds-hold', className].filter(Boolean).join(' ')
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-hold__head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-hold__title"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, icon), owner, "\u7684\u5F53\u524D\u6301\u4ED3"), /*#__PURE__*/React.createElement("div", {
    className: "ds-hold__total"
  }, /*#__PURE__*/React.createElement("div", {
    className: "l"
  }, "\u5F53\u524D\u603B\u91D1\u989D"), /*#__PURE__*/React.createElement("div", {
    className: "v"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cur"
  }, currency), fmt(showTotal))), /*#__PURE__*/React.createElement("div", {
    className: "ds-hold__day"
  }, /*#__PURE__*/React.createElement("div", {
    className: "l"
  }, "\u4ECA\u65E5\u6DA8\u8DCC"), /*#__PURE__*/React.createElement("div", {
    className: `v ${dayCls}`
  }, /*#__PURE__*/React.createElement("span", null, pct(showDayPct)), /*#__PURE__*/React.createElement("span", {
    className: "amt"
  }, sign(dayAmt), currency, fmt(Math.abs(dayAmt))))), editable && /*#__PURE__*/React.createElement("button", {
    className: `ds-hold__btn ${editing ? 'primary' : ''}`,
    onClick: () => setEditing(e => !e)
  }, editing ? '✓ 完成' : '✎ 编辑持仓')), editable && editing && /*#__PURE__*/React.createElement("div", {
    className: "ds-hold__editbar"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cashlab"
  }, "\uD83D\uDCB0 \u73B0\u91D1 ", currency, /*#__PURE__*/React.createElement("input", {
    className: "ds-hold__cashin",
    type: "number",
    value: data.cash,
    onChange: e => setCash(e.target.value)
  })), /*#__PURE__*/React.createElement("button", {
    className: "ds-hold__btn primary",
    onClick: addRow
  }, "\uFF0B \u6DFB\u52A0\u6301\u4ED3"), /*#__PURE__*/React.createElement("button", {
    className: "ds-hold__btn",
    onClick: reset
  }, "\u21BA \u91CD\u7F6E\u4E3A\u9ED8\u8BA4"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: 'var(--text-3)',
      marginLeft: 'auto'
    }
  }, "\u6539\u52A8\u4F1A\u81EA\u52A8\u4FDD\u5B58\u5230\u672C\u5730")), /*#__PURE__*/React.createElement("table", {
    className: "ds-hold__table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "\u6807\u7684"), /*#__PURE__*/React.createElement("th", null, "\u6301\u4ED3 / \u6210\u672C"), /*#__PURE__*/React.createElement("th", null, "\u73B0\u4EF7 / \u6628\u6536"), /*#__PURE__*/React.createElement("th", null, "\u5E02\u503C"), /*#__PURE__*/React.createElement("th", null, "\u4ECA\u65E5"), /*#__PURE__*/React.createElement("th", null, "\u7D2F\u8BA1\u76C8\u4E8F"), editable && editing && /*#__PURE__*/React.createElement("th", null))), /*#__PURE__*/React.createElement("tbody", null, rows.map((r, i) => editing ? /*#__PURE__*/React.createElement("tr", {
    key: i
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("input", {
    className: "ds-hold__in txt",
    value: r.name,
    onChange: e => setStr(i, 'name', e.target.value)
  }), /*#__PURE__*/React.createElement("input", {
    className: "ds-hold__in txt sm",
    value: r.ticker,
    onChange: e => setStr(i, 'ticker', e.target.value)
  })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("input", {
    className: "ds-hold__in",
    type: "number",
    value: r.shares,
    onChange: e => setNum(i, 'shares', e.target.value)
  }), /*#__PURE__*/React.createElement("input", {
    className: "ds-hold__in sm",
    type: "number",
    value: r.cost,
    onChange: e => setNum(i, 'cost', e.target.value)
  })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("input", {
    className: "ds-hold__in",
    type: "number",
    value: r.price,
    onChange: e => setNum(i, 'price', e.target.value)
  }), /*#__PURE__*/React.createElement("input", {
    className: "ds-hold__in sm",
    type: "number",
    value: r.prevClose,
    onChange: e => setNum(i, 'prevClose', e.target.value)
  })), /*#__PURE__*/React.createElement("td", {
    className: "ds-hold__num"
  }, currency, fmt(r.mv)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: `ds-hold__chip ${r.dayPct >= 0 ? 'pos' : 'neg'}`
  }, pct(r.dayPct))), /*#__PURE__*/React.createElement("td", {
    className: `ds-hold__num ${r.plPct >= 0 ? 'pos' : 'neg'}`
  }, pct(r.plPct)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("button", {
    className: "ds-hold__del",
    onClick: () => delRow(i),
    title: "\u5220\u9664"
  }, "\u2715"))) : /*#__PURE__*/React.createElement("tr", {
    key: i,
    className: "anim",
    style: {
      animationDelay: `${i * 0.06}s`
    }
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
    className: "ds-hold__nm"
  }, r.name), /*#__PURE__*/React.createElement("div", {
    className: "ds-hold__tk"
  }, r.ticker)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
    className: "ds-hold__num"
  }, fmt(r.shares)), /*#__PURE__*/React.createElement("div", {
    className: "ds-hold__tk"
  }, "\u6210\u672C ", fmt(r.cost, 2))), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
    className: "ds-hold__num"
  }, fmt(r.price, 2)), /*#__PURE__*/React.createElement("div", {
    className: "ds-hold__tk"
  }, "\u6628\u6536 ", fmt(r.prevClose, 2))), /*#__PURE__*/React.createElement("td", {
    className: "ds-hold__num"
  }, currency, fmt(r.mv)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: `ds-hold__chip ${r.dayPct >= 0 ? 'pos' : 'neg'}`
  }, pct(r.dayPct))), /*#__PURE__*/React.createElement("td", {
    className: `ds-hold__num ${r.plPct >= 0 ? 'pos' : 'neg'}`
  }, pct(r.plPct)))), editable && editing && /*#__PURE__*/React.createElement("tr", {
    className: "ds-hold__addrow"
  }, /*#__PURE__*/React.createElement("td", {
    colSpan: 7
  }, /*#__PURE__*/React.createElement("button", {
    className: "ds-hold__btn",
    onClick: addRow
  }, "\uFF0B \u518D\u52A0\u4E00\u53EA"))))), note && /*#__PURE__*/React.createElement("div", {
    className: "ds-hold__foot"
  }, note));
}
Object.assign(__ds_scope, { HoldingsTable });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/HoldingsTable.jsx", error: String((e && e.message) || e) }); }

// components/data/MetricChip.jsx
try { (() => {
function useStyle(id, css) {
  if (typeof document === 'undefined') return;
  if (document.getElementById(id)) return;
  const el = document.createElement('style');
  el.id = id;
  el.textContent = css;
  document.head.appendChild(el);
}
const CSS = `
.ds-chip{
  padding:12px 14px;text-align:center;
}
.ds-chip__label{
  font-size:var(--fs-2xs);color:var(--text-3);text-transform:uppercase;
  letter-spacing:var(--ls-label);font-weight:var(--fw-bold);margin-bottom:6px;
}
.ds-chip__value{
  font-family:var(--font-mono);font-size:18px;font-weight:var(--fw-black);
  color:var(--text);font-variant-numeric:tabular-nums;line-height:1.1;
}
.ds-chip__value.pos{color:var(--bull-strong);}
.ds-chip__value.neg{color:var(--bear-strong);}
.ds-chip__value.risk{color:var(--neutral-strong);}
.ds-chip__value.crit{color:var(--bear-strong);font-weight:900;}

.ds-strip{
  display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));
  gap:2px;background:var(--surface);border:1px solid var(--border);
  border-radius:var(--r-xl);padding:8px;box-shadow:var(--shadow-sm);
}
.ds-strip .ds-chip{border-right:1px dashed var(--border);}
.ds-strip .ds-chip:last-child{border-right:none;}
`;

/**
 * 单个关键指标格 (PE / PB / ROE / 市值 ...)。
 */
function MetricChip({
  label,
  value,
  tone,
  className = ''
}) {
  useStyle('ds-chip-css', CSS);
  const t = tone ? ` ${tone}` : '';
  return /*#__PURE__*/React.createElement("div", {
    className: ['ds-chip', className].filter(Boolean).join(' ')
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-chip__label"
  }, label), /*#__PURE__*/React.createElement("div", {
    className: `ds-chip__value${t}`
  }, value));
}

/**
 * 关键指标横排面板 — 包裹多个 MetricChip。
 */
function MetricStrip({
  metrics = [],
  children,
  className = ''
}) {
  useStyle('ds-chip-css', CSS);
  return /*#__PURE__*/React.createElement("div", {
    className: ['ds-strip', className].filter(Boolean).join(' ')
  }, metrics.map((m, i) => /*#__PURE__*/React.createElement(MetricChip, {
    key: i,
    label: m.label,
    value: m.value,
    tone: m.tone
  })), children);
}
Object.assign(__ds_scope, { MetricChip, MetricStrip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/MetricChip.jsx", error: String((e && e.message) || e) }); }

// components/data/RatingCard.jsx
try { (() => {
function useStyle(id, css) {
  if (typeof document === 'undefined') return;
  if (document.getElementById(id)) return;
  const el = document.createElement('style');
  el.id = id;
  el.textContent = css;
  document.head.appendChild(el);
}
const CSS = `
.ds-rating{
  position:relative;background:var(--surface);
  border:1px solid var(--border);border-top:4px solid var(--pink);
  border-radius:var(--r-xl);padding:20px 24px;
  box-shadow:var(--shadow-sm);overflow:hidden;
  transition:transform var(--t-base),box-shadow var(--t-base);
}
.ds-rating:hover{transform:translateY(-3px);box-shadow:var(--shadow-md);}
.ds-rating--score{border-top-color:var(--purple);}
.ds-rating--anchor{border-top-color:var(--pink);}
.ds-rating--return-pos{border-top-color:var(--bull);}
.ds-rating--return-neg{border-top-color:var(--bear);}
.ds-rating__label{
  font-size:var(--fs-2xs);color:var(--text-3);text-transform:uppercase;
  letter-spacing:var(--ls-label);font-weight:var(--fw-bold);margin-bottom:8px;
}
.ds-rating__value{
  font-family:var(--font-mono);font-size:var(--fs-stat);font-weight:var(--fw-black);
  color:var(--text);line-height:1.15;margin-bottom:6px;
}
.ds-rating__value .unit{font-size:16px;color:var(--text-3);font-weight:var(--fw-medium);}
.ds-rating__value.pos{color:var(--bull-strong);}
.ds-rating__value.neg{color:var(--bear-strong);}
.ds-rating__sub{font-size:var(--fs-xs);color:var(--text-2);}
`;
const ACCENT = {
  score: 'ds-rating--score',
  anchor: 'ds-rating--anchor',
  return: 'ds-rating--return-pos'
};

/**
 * 前置评级卡 (Goldman 三件套之一) — 综合评分 / 估值锚 / 期望收益。
 */
function RatingCard({
  label,
  value,
  unit,
  sub,
  accent = 'score',
  valueTone,
  className = ''
}) {
  useStyle('ds-rating-css', CSS);
  let accentCls = ACCENT[accent] || ACCENT.score;
  if (accent === 'return') accentCls = valueTone === 'neg' ? 'ds-rating--return-neg' : 'ds-rating--return-pos';
  const valTone = valueTone === 'pos' ? ' pos' : valueTone === 'neg' ? ' neg' : '';
  return /*#__PURE__*/React.createElement("div", {
    className: ['ds-rating', accentCls, className].filter(Boolean).join(' ')
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-rating__label"
  }, label), /*#__PURE__*/React.createElement("div", {
    className: `ds-rating__value${valTone}`
  }, value, unit && /*#__PURE__*/React.createElement("span", {
    className: "unit"
  }, " ", unit)), sub && /*#__PURE__*/React.createElement("div", {
    className: "ds-rating__sub"
  }, sub));
}
Object.assign(__ds_scope, { RatingCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/RatingCard.jsx", error: String((e && e.message) || e) }); }

// components/data/ReportCard.jsx
try { (() => {
function useStyle(id, css) {
  if (typeof document === 'undefined') return;
  if (document.getElementById(id)) return;
  const el = document.createElement('style');
  el.id = id;
  el.textContent = css;
  document.head.appendChild(el);
}
const CSS = `
.ds-rcard{
  position:relative;background:var(--surface);border:2px solid var(--border);
  border-radius:var(--r-xl);overflow:hidden;
  transition:transform var(--t-base),box-shadow var(--t-base),border-color var(--t-base);
}
.ds-rcard::before{
  content:'';position:absolute;top:0;left:0;right:0;height:4px;
  background:var(--grad-tri);opacity:0;transition:opacity var(--t-base);
}
.ds-rcard:hover{transform:translateY(-4px);border-color:var(--border-pink);box-shadow:var(--shadow-lg);}
.ds-rcard:hover::before{opacity:1;}
.ds-rcard--bull{border-left:5px solid var(--bull);}
.ds-rcard--neutral{border-left:5px solid var(--neutral);}
.ds-rcard--bear{border-left:5px solid var(--bear);}

.ds-rcard__body{padding:22px 24px 18px;}
.ds-rcard__ticker{
  font-family:var(--font-mono);font-size:var(--fs-2xs);color:var(--text-3);
  letter-spacing:.6px;text-transform:uppercase;font-weight:var(--fw-medium);margin-bottom:8px;
}
.ds-rcard__name{font-size:var(--fs-lg);font-weight:var(--fw-black);color:var(--text);
  margin-bottom:6px;display:flex;align-items:center;gap:7px;}
.ds-rcard__ver{font-family:var(--font-mono);font-size:var(--fs-2xs);font-weight:var(--fw-bold);
  padding:1px 7px;border-radius:var(--r-sm);}
.ds-rcard__ver.bull{background:var(--bull);color:#fff;}
.ds-rcard__ver.neutral{background:var(--neutral);color:#3d2b3a;}
.ds-rcard__ver.bear{background:var(--bear);color:#fff;}
.ds-rcard__desc{font-size:var(--fs-sm);color:var(--text-2);line-height:var(--lh-snug);
  margin-bottom:14px;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;}
.ds-rcard__meta{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px;}
.ds-rcard__badge{display:inline-flex;align-items:center;font-size:var(--fs-2xs);
  font-weight:var(--fw-bold);padding:4px 10px;border-radius:var(--r-pill);}
.ds-rcard__badge.bull{background:var(--bull-bg);color:var(--bull-strong);}
.ds-rcard__badge.neutral{background:var(--neutral-bg);color:var(--neutral-strong);}
.ds-rcard__badge.bear{background:var(--bear-bg);color:var(--bear-strong);}
.ds-rcard__badge.ghost{background:transparent;color:var(--text-3);border:1px solid var(--border-2);font-weight:var(--fw-medium);}
.ds-rcard__metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;}
.ds-rcard__m{background:var(--surface-soft);border:1px solid var(--border);
  border-radius:var(--r-md);padding:10px 8px;text-align:center;}
.ds-rcard__m-l{font-size:9px;color:var(--text-3);text-transform:uppercase;
  letter-spacing:.4px;font-weight:var(--fw-bold);margin-bottom:4px;}
.ds-rcard__m-v{font-family:var(--font-mono);font-size:14px;font-weight:var(--fw-black);}
.ds-rcard__m-v.pos{color:var(--bull-strong);}
.ds-rcard__m-v.neg{color:var(--bear-strong);}
.ds-rcard__m-v.neutral{color:var(--text);}
.ds-rcard__foot{border-top:2px dashed var(--border);}
.ds-rcard__foot a{display:block;padding:14px 16px;text-align:center;
  font-size:var(--fs-sm);font-weight:var(--fw-bold);color:var(--pink);
  text-decoration:none;transition:background var(--t-fast);}
.ds-rcard__foot a:hover{background:var(--pink-bg);}
.ds-rcard__foot a::after{content:' ✦';}
`;
const TONE = {
  bullish: 'bull',
  neutral: 'neutral',
  bearish: 'bear'
};

/**
 * 报告卡 — 主页标的卡片 (ticker / 名称 / verdict / 指标 / 链接)。
 */
function ReportCard({
  ticker,
  sector,
  name,
  version,
  tone = 'neutral',
  oneLiner,
  badges = [],
  metrics = [],
  href = '#',
  ctaLabel = '查看完整分析报告',
  className = ''
}) {
  useStyle('ds-rcard-css', CSS);
  const t = TONE[tone] || 'neutral';
  return /*#__PURE__*/React.createElement("div", {
    className: ['ds-rcard', `ds-rcard--${t}`, className].filter(Boolean).join(' ')
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-rcard__body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-rcard__ticker"
  }, ticker, sector ? ` · ${sector}` : ''), /*#__PURE__*/React.createElement("div", {
    className: "ds-rcard__name"
  }, name, version && version !== 'v1' && /*#__PURE__*/React.createElement("span", {
    className: `ds-rcard__ver ${t}`
  }, version)), oneLiner && /*#__PURE__*/React.createElement("div", {
    className: "ds-rcard__desc"
  }, oneLiner), badges.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "ds-rcard__meta"
  }, badges.map((b, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    className: `ds-rcard__badge ${b.variant || 'ghost'}`
  }, b.label))), metrics.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "ds-rcard__metrics"
  }, metrics.map((m, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "ds-rcard__m"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-rcard__m-l"
  }, m.label), /*#__PURE__*/React.createElement("div", {
    className: `ds-rcard__m-v ${m.tone || 'neutral'}`
  }, m.value))))), /*#__PURE__*/React.createElement("div", {
    className: "ds-rcard__foot"
  }, /*#__PURE__*/React.createElement("a", {
    href: href
  }, ctaLabel)));
}
Object.assign(__ds_scope, { ReportCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/ReportCard.jsx", error: String((e && e.message) || e) }); }

// components/data/RiskCard.jsx
try { (() => {
function useStyle(id, css) {
  if (typeof document === 'undefined') return;
  if (document.getElementById(id)) return;
  const el = document.createElement('style');
  el.id = id;
  el.textContent = css;
  document.head.appendChild(el);
}
const CSS = `
.ds-risk{
  display:grid;grid-template-columns:4px 1fr auto;gap:14px;align-items:center;
  background:var(--surface);border:1px solid var(--border);border-radius:var(--r-lg);
  padding:14px 16px 14px 0;margin:8px 0;overflow:hidden;
  transition:background var(--t-fast),transform var(--t-fast);
}
.ds-risk:hover{transform:translateX(2px);}
.ds-risk__bar{align-self:stretch;width:4px;border-radius:0 2px 2px 0;}
.ds-risk__title{font-weight:var(--fw-bold);color:var(--text);margin-bottom:3px;}
.ds-risk__body{font-size:var(--fs-sm);color:var(--text-2);line-height:var(--lh-snug);}
.ds-risk__sev{
  font-size:var(--fs-2xs);font-weight:var(--fw-bold);padding:4px 11px;
  border-radius:var(--r-pill);white-space:nowrap;letter-spacing:.4px;margin-right:16px;
}
.ds-risk--critical{background:linear-gradient(to right,var(--bear-bg) 0%,var(--surface) 7%);}
.ds-risk--critical .ds-risk__bar{background:var(--bear);}
.ds-risk--critical .ds-risk__sev{background:var(--bear);color:#fff;}
.ds-risk--high{background:linear-gradient(to right,#fff3e8 0%,var(--surface) 7%);}
.ds-risk--high .ds-risk__bar{background:#e8893a;}
.ds-risk--high .ds-risk__sev{background:#e8893a;color:#fff;}
.ds-risk--medium{background:linear-gradient(to right,var(--neutral-bg) 0%,var(--surface) 7%);}
.ds-risk--medium .ds-risk__bar{background:var(--neutral);}
.ds-risk--medium .ds-risk__sev{background:var(--neutral);color:#3d2b3a;}
.ds-risk--low{background:linear-gradient(to right,var(--bull-bg) 0%,var(--surface) 7%);}
.ds-risk--low .ds-risk__bar{background:var(--bull);}
.ds-risk--low .ds-risk__sev{background:var(--bull);color:#fff;}
`;
const SEV_LABEL = {
  critical: '🔴 致命',
  high: '🟠 高级',
  medium: '🟡 中级',
  low: '🟢 轻微'
};

/**
 * 风险卡 — Bloomberg 风格等级色条, severity: critical/high/medium/low。
 */
function RiskCard({
  severity = 'medium',
  title,
  children,
  sevLabel,
  className = ''
}) {
  useStyle('ds-risk-css', CSS);
  return /*#__PURE__*/React.createElement("div", {
    className: ['ds-risk', `ds-risk--${severity}`, className].filter(Boolean).join(' ')
  }, /*#__PURE__*/React.createElement("span", {
    className: "ds-risk__bar"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "ds-risk__title"
  }, title), children && /*#__PURE__*/React.createElement("div", {
    className: "ds-risk__body"
  }, children)), /*#__PURE__*/React.createElement("span", {
    className: "ds-risk__sev"
  }, sevLabel || SEV_LABEL[severity]));
}
Object.assign(__ds_scope, { RiskCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/RiskCard.jsx", error: String((e && e.message) || e) }); }

// components/data/ScenarioCard.jsx
try { (() => {
function useStyle(id, css) {
  if (typeof document === 'undefined') return;
  if (document.getElementById(id)) return;
  const el = document.createElement('style');
  el.id = id;
  el.textContent = css;
  document.head.appendChild(el);
}
const CSS = `
.ds-scen{
  padding:16px 18px;border-radius:var(--r-lg);border-left:5px solid;
  transition:transform var(--t-fast);
}
.ds-scen:hover{transform:translateY(-2px);}
.ds-scen__label{font-size:var(--fs-xs);text-transform:uppercase;
  letter-spacing:var(--ls-label);font-weight:var(--fw-bold);opacity:.8;}
.ds-scen__num{font-family:var(--font-mono);font-size:26px;font-weight:var(--fw-black);
  margin:4px 0 8px;line-height:1;}
.ds-scen__detail{font-size:var(--fs-sm);line-height:var(--lh-snug);}
.ds-scen--bull{background:var(--bull-bg);border-left-color:var(--bull);}
.ds-scen--bull .ds-scen__num{color:var(--bull-strong);}
.ds-scen--base{background:var(--neutral-bg);border-left-color:var(--neutral);}
.ds-scen--base .ds-scen__num{color:var(--neutral-strong);}
.ds-scen--bear{background:var(--bear-bg);border-left-color:var(--bear);}
.ds-scen--bear .ds-scen__num{color:var(--bear-strong);}
.ds-scen--tail{background:#2a2433;border-left-color:#000;color:#fff;}
.ds-scen--tail .ds-scen__num{color:#fff;}
.ds-scen--tail .ds-scen__detail{color:#d9cfe0;}
.ds-scen--tail .ds-scen__label{color:#c4b1fb;opacity:1;}
`;

/**
 * 情景卡 — DCF 四情景 (牛 / 基准 / 熊 / 尾部) 之一。
 */
function ScenarioCard({
  kind = 'base',
  label,
  value,
  detail,
  prob,
  className = ''
}) {
  useStyle('ds-scen-css', CSS);
  return /*#__PURE__*/React.createElement("div", {
    className: ['ds-scen', `ds-scen--${kind}`, className].filter(Boolean).join(' ')
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-scen__label"
  }, label, prob != null && ` · ${prob}`), /*#__PURE__*/React.createElement("div", {
    className: "ds-scen__num"
  }, value), detail && /*#__PURE__*/React.createElement("div", {
    className: "ds-scen__detail"
  }, detail));
}
Object.assign(__ds_scope, { ScenarioCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/ScenarioCard.jsx", error: String((e && e.message) || e) }); }

// components/data/ScoreRing.jsx
try { (() => {
function useStyle(id, css) {
  if (typeof document === 'undefined') return;
  if (document.getElementById(id)) return;
  const el = document.createElement('style');
  el.id = id;
  el.textContent = css;
  document.head.appendChild(el);
}
const CSS = `
.ds-ring{display:inline-flex;flex-direction:column;align-items:center;gap:6px;}
.ds-ring__wrap{position:relative;display:inline-block;}
.ds-ring__svg{display:block;transform:rotate(-90deg);}
.ds-ring__track{fill:none;stroke:var(--surface-soft);}
.ds-ring__fill{
  fill:none;stroke-linecap:round;
  transition:stroke-dashoffset 1s var(--ease);
}
@media (prefers-reduced-motion:no-preference){
  .ds-ring__fill{animation:ds-ring-fill 1.1s var(--ease) both;}
}
.ds-ring__text{
  position:absolute;inset:0;display:flex;flex-direction:column;
  align-items:center;justify-content:center;line-height:1;
}
.ds-ring__num{font-family:var(--font-mono);font-weight:var(--fw-black);}
.ds-ring__den{font-family:var(--font-mono);font-weight:var(--fw-medium);color:var(--text-3);}
.ds-ring__cap{font-size:var(--fs-2xs);font-weight:var(--fw-bold);letter-spacing:var(--ls-label);
  text-transform:uppercase;color:var(--text-3);}
`;
function toneColor(score, tone) {
  if (tone === 'bull') return 'var(--bull)';
  if (tone === 'bear') return 'var(--bear)';
  if (tone === 'neutral') return 'var(--neutral)';
  // auto by score (/10)
  if (score >= 7) return 'var(--bull)';
  if (score >= 5) return 'var(--purple)';
  if (score >= 4) return 'var(--neutral)';
  return 'var(--bear)';
}

/**
 * 评分环形仪表 — SVG 圆环, 按分数/语气着色, 入场动画填充。
 */
function ScoreRing({
  score = 0,
  max = 10,
  size = 120,
  stroke = 11,
  tone = 'auto',
  label = '综合评分',
  decimals = 1,
  className = ''
}) {
  useStyle('ds-ring-css', CSS);
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, score / max));
  const offset = circ * (1 - pct);
  const color = toneColor(score, tone);
  const numSize = Math.round(size * 0.27);
  return /*#__PURE__*/React.createElement("div", {
    className: ['ds-ring', className].filter(Boolean).join(' ')
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-ring__wrap",
    style: {
      width: size,
      height: size
    }
  }, /*#__PURE__*/React.createElement("svg", {
    className: "ds-ring__svg",
    width: size,
    height: size
  }, /*#__PURE__*/React.createElement("circle", {
    className: "ds-ring__track",
    cx: size / 2,
    cy: size / 2,
    r: r,
    strokeWidth: stroke
  }), /*#__PURE__*/React.createElement("circle", {
    className: "ds-ring__fill",
    cx: size / 2,
    cy: size / 2,
    r: r,
    strokeWidth: stroke,
    stroke: color,
    strokeDasharray: circ,
    strokeDashoffset: offset,
    style: {
      '--ring-circ': circ
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "ds-ring__text"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ds-ring__num",
    style: {
      fontSize: numSize,
      color
    }
  }, score.toFixed(decimals)), /*#__PURE__*/React.createElement("span", {
    className: "ds-ring__den",
    style: {
      fontSize: Math.round(numSize * 0.4)
    }
  }, "/ ", max))), label && /*#__PURE__*/React.createElement("span", {
    className: "ds-ring__cap"
  }, label));
}
Object.assign(__ds_scope, { ScoreRing });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/ScoreRing.jsx", error: String((e && e.message) || e) }); }

// components/data/SentimentMeter.jsx
try { (() => {
function useStyle(id, css) {
  if (typeof document === 'undefined') return;
  if (document.getElementById(id)) return;
  const el = document.createElement('style');
  el.id = id;
  el.textContent = css;
  document.head.appendChild(el);
}
const CSS = `
.ds-sent{margin:18px 0 34px;}
.ds-sent__bar{
  position:relative;height:12px;border-radius:var(--r-pill);
  background:linear-gradient(to right,var(--bear) 0%,var(--neutral) 50%,var(--bull) 100%);
}
.ds-sent__ptr{
  position:absolute;top:-7px;width:4px;height:26px;border-radius:2px;
  background:var(--text);transform:translateX(-50%);
  transition:left .9s var(--ease);
}
.ds-sent__ptr::after{
  content:attr(data-label);position:absolute;top:30px;left:50%;
  transform:translateX(-50%);white-space:nowrap;font-size:var(--fs-2xs);
  font-weight:var(--fw-bold);background:var(--text);color:#fff;
  padding:3px 9px;border-radius:var(--r-sm);
}
.ds-sent__scale{
  display:flex;justify-content:space-between;margin-top:6px;
  font-size:var(--fs-2xs);color:var(--text-3);font-weight:var(--fw-bold);
  text-transform:uppercase;letter-spacing:var(--ls-label);
}
`;

/**
 * 情绪量表 — 红(看空)→琥珀(中性)→绿(看多)渐变条 + 指针。
 * value: 0..100 (0 极度看空, 100 极度看多)。
 */
function SentimentMeter({
  value = 50,
  label,
  low = '极度看空',
  mid = '中性',
  high = '极度看多',
  className = ''
}) {
  useStyle('ds-sent-css', CSS);
  const v = Math.max(0, Math.min(100, value));
  return /*#__PURE__*/React.createElement("div", {
    className: ['ds-sent', className].filter(Boolean).join(' ')
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-sent__bar"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ds-sent__ptr",
    "data-label": label || `${v}`,
    style: {
      left: `${v}%`
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "ds-sent__scale"
  }, /*#__PURE__*/React.createElement("span", null, low), /*#__PURE__*/React.createElement("span", null, mid), /*#__PURE__*/React.createElement("span", null, high)));
}
Object.assign(__ds_scope, { SentimentMeter });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/SentimentMeter.jsx", error: String((e && e.message) || e) }); }

// components/forms/SearchInput.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function useStyle(id, css) {
  if (typeof document === 'undefined') return;
  if (document.getElementById(id)) return;
  const el = document.createElement('style');
  el.id = id;
  el.textContent = css;
  document.head.appendChild(el);
}
const CSS = `
.ds-search{position:relative;display:inline-flex;width:100%;}
.ds-search__icon{
  position:absolute;left:14px;top:50%;transform:translateY(-50%);
  font-size:14px;opacity:.5;pointer-events:none;
}
.ds-search input{
  width:100%;font-family:var(--font-body);font-size:var(--fs-sm);
  color:var(--text);background:var(--surface);
  border:2px solid var(--border);border-radius:var(--r-lg);
  padding:11px 16px 11px 40px;
  transition:border-color var(--t-fast),box-shadow var(--t-fast);
}
.ds-search input::placeholder{color:var(--text-3);}
.ds-search input:focus{outline:none;border-color:var(--pink);box-shadow:var(--ring);}
`;

/**
 * 搜索输入框 — 内置放大镜图标, 粉色聚焦环。
 */
function SearchInput({
  placeholder = '搜索...',
  value,
  onChange,
  icon = '🔍',
  className = '',
  ...rest
}) {
  useStyle('ds-search-css', CSS);
  return /*#__PURE__*/React.createElement("div", {
    className: ['ds-search', className].filter(Boolean).join(' ')
  }, /*#__PURE__*/React.createElement("span", {
    className: "ds-search__icon",
    "aria-hidden": true
  }, icon), /*#__PURE__*/React.createElement("input", _extends({
    type: "text",
    placeholder: placeholder,
    value: value,
    onChange: onChange,
    autoComplete: "off"
  }, rest)));
}
Object.assign(__ds_scope, { SearchInput });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/SearchInput.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
const {
  useState
} = React;
function useStyle(id, css) {
  if (typeof document === 'undefined') return;
  if (document.getElementById(id)) return;
  const el = document.createElement('style');
  el.id = id;
  el.textContent = css;
  document.head.appendChild(el);
}
const CSS = `
.ds-tabs{
  display:inline-flex;gap:6px;background:var(--surface);
  padding:4px;border-radius:var(--r-lg);border:1px solid var(--border);
}
.ds-tab{
  display:inline-flex;align-items:center;gap:6px;
  padding:7px 15px;font-size:var(--fs-sm);font-weight:var(--fw-bold);
  font-family:var(--font-body);border:none;background:transparent;
  color:var(--text-3);border-radius:var(--r-md);cursor:pointer;
  transition:color var(--t-fast),background var(--t-fast);
}
.ds-tab:hover{color:var(--pink);}
.ds-tab[aria-selected="true"]{background:var(--pink-bg);color:var(--pink);}
.ds-tab__count{
  font-family:var(--font-mono);font-size:var(--fs-2xs);font-weight:var(--fw-bold);
  background:rgba(232,69,122,.12);color:var(--pink);
  padding:1px 7px;border-radius:var(--r-pill);
}
.ds-tab[aria-selected="false"] .ds-tab__count{background:var(--surface-soft);color:var(--text-3);}
`;

/**
 * 市场筛选 tab 组 — 受控或非受控。items: [{value,label,count?}]
 */
function Tabs({
  items = [],
  value,
  defaultValue,
  onChange,
  className = ''
}) {
  useStyle('ds-tabs-css', CSS);
  const [internal, setInternal] = useState(defaultValue != null ? defaultValue : (items[0] && items[0].value));
  const active = value !== undefined ? value : internal;
  const pick = v => {
    if (value === undefined) setInternal(v);
    onChange && onChange(v);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: ['ds-tabs', className].filter(Boolean).join(' '),
    role: "tablist"
  }, items.map(it => /*#__PURE__*/React.createElement("button", {
    key: it.value,
    role: "tab",
    "aria-selected": active === it.value,
    className: "ds-tab",
    onClick: () => pick(it.value)
  }, it.label, it.count != null && /*#__PURE__*/React.createElement("span", {
    className: "ds-tab__count"
  }, it.count))));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// ui_kits/report_index/reports.data.js
try { (() => {
// Sample report dataset (subset of the real data/reports.json), bundled for the UI kit demo.
window.REPORTS = [{
  slug: 'Starway',
  ticker: '程星通信',
  sector: '微波/卫星互联网',
  name: '程星通信',
  market: 'pe',
  date: '2026-04-17',
  version: 'v1',
  score: 8.0,
  tone: 'bullish',
  one: '微波毫米波核心前端技术 + 卫星互联网新基建核心供应商。行业唯一全链路覆盖民企,独揽 5 项国家重大专项。',
  badges: [{
    label: '强烈看好 8.0/10',
    variant: 'bull'
  }, {
    label: '国家战略级卡位',
    variant: 'bull'
  }],
  metrics: [{
    label: '融资阶段',
    value: 'E+轮'
  }, {
    label: '期望回报',
    value: '2.8x',
    tone: 'pos'
  }, {
    label: '营收增速',
    value: '+66%',
    tone: 'pos'
  }]
}, {
  slug: 'Adobe',
  ticker: 'ADBE',
  sector: '美股 NASDAQ',
  name: 'Adobe',
  market: 'us',
  date: '2026-04-19',
  version: 'v3',
  score: 7.8,
  tone: 'bullish',
  one: '创意软件龙头,58% 市占率,8.5 亿 MAU。股价 12 月跌 43% 至十年最低 PE 10x,AI 颠覆恐惧 vs $10B FCF 基本面。',
  badges: [{
    label: '有条件看好 7.8/10',
    variant: 'neutral'
  }, {
    label: '估值:显著低估',
    variant: 'bull'
  }],
  metrics: [{
    label: '前瞻 PE',
    value: '10.3x',
    tone: 'pos'
  }, {
    label: '期望收益',
    value: '+19%',
    tone: 'pos'
  }, {
    label: 'FCF 收益率',
    value: '~9%',
    tone: 'pos'
  }]
}, {
  slug: 'Circle',
  ticker: 'CRCL',
  sector: '稳定币/加密金融',
  name: 'Circle',
  market: 'us',
  date: '2026-04-19',
  version: 'v1',
  score: 7.3,
  tone: 'bullish',
  one: 'USDC 稳定币发行方,$790 亿数字美元流通。收入 +64% 但 96% 依赖利率。三角色严重分歧。',
  badges: [{
    label: '有条件看好 7.3/10',
    variant: 'neutral'
  }, {
    label: '估值:偏高',
    variant: 'neutral'
  }],
  metrics: [{
    label: '收入增速',
    value: '+64%',
    tone: 'pos'
  }, {
    label: '期望收益',
    value: '+10%'
  }, {
    label: 'DCF 估值',
    value: '$88/股'
  }]
}, {
  slug: 'NewRadio',
  ticker: '纽瑞芯',
  sector: 'UWB 芯片设计',
  name: '纽瑞芯',
  market: 'pe',
  date: '2026-04-16',
  version: 'v1',
  score: 6.7,
  tone: 'bullish',
  one: '国产 UWB 超宽带芯片领导者,全正向自研 IP,覆盖手机 / 汽车 / 电视 / IoT 四大场景。华为、吉利、海信量产出货。',
  badges: [{
    label: '有条件看好 6.7/10',
    variant: 'neutral'
  }, {
    label: '技术护城河:强',
    variant: 'bull'
  }],
  metrics: [{
    label: '融资阶段',
    value: 'B→C轮'
  }, {
    label: '期望回报',
    value: '2.1x',
    tone: 'pos'
  }, {
    label: '营收增速',
    value: '~200%',
    tone: 'pos'
  }]
}, {
  slug: 'Shengmei',
  ticker: '688082.SH',
  sector: '半导体设备',
  name: '盛美上海',
  market: 'a',
  date: '2026-04-28',
  version: 'v1',
  score: 6.3,
  tone: 'bearish',
  one: '国内单晶圆清洗设备 #2 + 全球 #4 龙头,受益国产替代,但 OCF/NI 0.171 + 应收激增 +48.2%,估值严重透支。',
  badges: [{
    label: '中性偏空 6.3/10',
    variant: 'neutral'
  }, {
    label: '估值锚 129.4 元',
    variant: 'ghost'
  }],
  metrics: [{
    label: '综合评分',
    value: '6.3/10'
  }, {
    label: '期望收益',
    value: '−22.0%',
    tone: 'neg'
  }, {
    label: '估值锚',
    value: '129.4'
  }]
}, {
  slug: 'Huada',
  ticker: '688114.SH',
  sector: '基因测序仪 IDM',
  name: '华大智造',
  market: 'a',
  date: '2026-04-25',
  version: 'v1',
  score: 5.4,
  tone: 'neutral',
  one: '全球基因测序仪国产龙头,2025 实亏 -2.22 亿(亏损 YoY 收窄 63%),时空组学 +161% 是真实增量,但反转预期已较饱满。',
  badges: [{
    label: '中性-分歧偏多 5.4/10',
    variant: 'neutral'
  }, {
    label: '估值锚 42.0 元',
    variant: 'ghost'
  }],
  metrics: [{
    label: '综合评分',
    value: '5.4/10'
  }, {
    label: '期望收益',
    value: '+18.5%',
    tone: 'pos'
  }, {
    label: '估值锚',
    value: '42.0'
  }]
}, {
  slug: 'Huakai',
  ticker: '300592.SZ',
  sector: '跨境出口电商',
  name: '华凯易佰',
  market: 'a',
  date: '2026-04-27',
  version: 'v1',
  score: 5.0,
  tone: 'neutral',
  one: '国内跨境电商泛品龙头,2025 OCF +239% YoY 大幅 V 反转,SOTP 显示基本面低估 25-40%,但商誉 8.28 亿需整合验证。',
  badges: [{
    label: '中性偏多 5.0/10',
    variant: 'neutral'
  }, {
    label: '估值锚 19.3 元',
    variant: 'ghost'
  }],
  metrics: [{
    label: '综合评分',
    value: '5.0/10'
  }, {
    label: '期望收益',
    value: '+38.5%',
    tone: 'pos'
  }, {
    label: '估值锚',
    value: '19.3'
  }]
}, {
  slug: 'Daan',
  ticker: '002030.SZ',
  sector: '体外诊断 IVD',
  name: '达安基因',
  market: 'a',
  date: '2026-05-11',
  version: 'v1',
  score: 3.89,
  tone: 'bearish',
  one: '2025 归母净利 -7.44 亿(续亏第二年),PB 已在近 1 年 99% 分位,基本面恶化与估值透支同时发生,公允价值 1.09 元 vs 当前 6.64 元。',
  badges: [{
    label: '看空方向 3.89/10',
    variant: 'bear'
  }, {
    label: '估值锚 1.09 元',
    variant: 'ghost'
  }],
  metrics: [{
    label: '综合评分',
    value: '3.89/10'
  }, {
    label: '期望收益',
    value: '−83.6%',
    tone: 'neg'
  }, {
    label: '估值锚',
    value: '1.09'
  }]
}, {
  slug: 'Tongtaiyi',
  ticker: '同泰怡',
  sector: '服务器制造 (AI+信创)',
  name: '深圳同泰怡',
  market: 'pe',
  date: '2026-04-20',
  version: 'v1',
  score: 6.3,
  tone: 'bullish',
  one: '国内唯一华为鲲鹏/昇腾双钻石 + NVIDIA OEM 双生态服务器商。3 年营收 10x。21 项 DD 风险含 5 项 IPO 致命障碍。',
  badges: [{
    label: '有条件投资 6.3/10',
    variant: 'neutral'
  }, {
    label: '双生态稀缺卡位',
    variant: 'bull'
  }],
  metrics: [{
    label: '融资阶段',
    value: 'B 轮'
  }, {
    label: '合理估值',
    value: '15-22 亿',
    tone: 'pos'
  }, {
    label: '营收 CAGR',
    value: '+117%',
    tone: 'pos'
  }]
}];

// 叶纸本人持仓 (示例数据 · 仅供展示)
window.HOLDINGS = {
  owner: '叶纸',
  cash: 48000,
  positions: [{
    name: '华大智造',
    ticker: '688114.SH',
    shares: 3000,
    cost: 38.5,
    price: 42.10,
    prevClose: 40.90
  }, {
    name: 'Adobe',
    ticker: 'ADBE',
    shares: 40,
    cost: 402,
    price: 466,
    prevClose: 471
  }, {
    name: '华凯易佰',
    ticker: '300592.SZ',
    shares: 8000,
    cost: 12.60,
    price: 13.93,
    prevClose: 13.55
  }, {
    name: 'Circle',
    ticker: 'CRCL',
    shares: 120,
    cost: 74,
    price: 81,
    prevClose: 79.40
  }, {
    name: '盛美上海',
    ticker: '688082.SH',
    shares: 500,
    cost: 148,
    price: 166,
    prevClose: 170
  }]
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/report_index/reports.data.js", error: String((e && e.message) || e) }); }

__ds_ns.Mascot = __ds_scope.Mascot;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.DimensionBar = __ds_scope.DimensionBar;

__ds_ns.HoldingsTable = __ds_scope.HoldingsTable;

__ds_ns.MetricChip = __ds_scope.MetricChip;

__ds_ns.MetricStrip = __ds_scope.MetricStrip;

__ds_ns.RatingCard = __ds_scope.RatingCard;

__ds_ns.ReportCard = __ds_scope.ReportCard;

__ds_ns.RiskCard = __ds_scope.RiskCard;

__ds_ns.ScenarioCard = __ds_scope.ScenarioCard;

__ds_ns.ScoreRing = __ds_scope.ScoreRing;

__ds_ns.SentimentMeter = __ds_scope.SentimentMeter;

__ds_ns.SearchInput = __ds_scope.SearchInput;

__ds_ns.Tabs = __ds_scope.Tabs;

})();
