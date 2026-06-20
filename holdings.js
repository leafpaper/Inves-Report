/* ============================================================
   叶纸投资报告 · 增强版持仓表 (HoldingsTablePro)
   挂到 window.HoldingsTablePro, 供 index.html 使用。

   相比原 HoldingsTable 的增强:
   - 顶部汇总: 总资产 / 今日涨跌(¥+%) / 累计盈亏(¥+%) / 现金 / 仓位占比
   - 每行: 自动算 市值·占比条·今日·累计盈亏(¥+%)
   - 手动快速编辑: 边打边算 (实时), 可清空, 新行自动聚焦, 删除二次确认
   - 导出 / 导入 JSON 备份 (localStorage 被清也能恢复)
   - 自动本地保存 + 记录最后编辑时间
   纯前端、零依赖、国内可用、不构成投资建议。
   ============================================================ */
(function () {
  const React = window.React;
  const { useState, useEffect, useRef, useMemo } = React;
  const h = React.createElement;

  function useStyle(id, css) {
    if (document.getElementById(id)) return;
    const el = document.createElement('style');
    el.id = id; el.textContent = css; document.head.appendChild(el);
  }

  function loadLS(key, fallback) {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : fallback; }
    catch (e) { return fallback; }
  }
  function saveLS(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* ignore */ }
  }

  const fmt = (n, d = 0) => (Number(n) || 0).toLocaleString('zh-CN', { minimumFractionDigits: d, maximumFractionDigits: d });
  const pct = (n) => `${n >= 0 ? '+' : '−'}${Math.abs(n).toFixed(2)}%`;
  const money = (cur, n) => `${n >= 0 ? '+' : '−'}${cur}${fmt(Math.abs(n))}`;

  // 币种 -> 符号 (多市场持仓: A股¥ / 美股$ / 港股HK$ ...)
  const CUR_SYM = { CNY: '¥', USD: '$', HKD: 'HK$', SGD: 'S$', JPY: '¥', GBP: '£', EUR: '€' };
  const symOf = (ccy) => CUR_SYM[ccy] || (ccy ? ccy + ' ' : '¥');

  // 数字滚动 (尊重 prefers-reduced-motion)
  function useCountUp(target, duration = 1000) {
    const [val, setVal] = useState(target);
    const prev = useRef(target);
    useEffect(() => {
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setVal(target); prev.current = target; return; }
      let raf, start; const from = prev.current;
      const step = (t) => {
        if (!start) start = t;
        const p = Math.min(1, (t - start) / duration);
        const e = 1 - Math.pow(1 - p, 3);
        setVal(from + (target - from) * e);
        if (p < 1) raf = requestAnimationFrame(step); else prev.current = target;
      };
      raf = requestAnimationFrame(step);
      return () => cancelAnimationFrame(raf);
    }, [target, duration]);
    return val;
  }

  const CSS = `
  .hp{background:var(--surface);border:1px solid var(--border);border-radius:var(--r-xl);
    box-shadow:var(--shadow-sm);overflow:hidden;font-family:var(--font-body);}

  /* ---- 顶部汇总 ---- */
  .hp__top{padding:20px 24px;background:linear-gradient(135deg,var(--bg-2),var(--surface));
    border-bottom:2px dashed var(--border);}
  .hp__topbar{display:flex;align-items:center;gap:12px;margin-bottom:14px;}
  .hp__title{font-size:var(--fs-sm);font-weight:var(--fw-bold);color:var(--text-2);
    display:flex;align-items:center;gap:7px;margin-right:auto;}
  .hp__title .ic{font-size:18px;}
  .hp__grid{display:grid;grid-template-columns:repeat(5,auto);gap:14px 30px;align-items:end;}
  .hp__cell .l{font-size:var(--fs-2xs);color:var(--text-3);text-transform:uppercase;
    letter-spacing:var(--ls-label);font-weight:var(--fw-bold);margin-bottom:3px;}
  .hp__cell .v{font-family:var(--font-mono);font-variant-numeric:tabular-nums;font-weight:var(--fw-black);
    color:var(--text);line-height:1.05;}
  .hp__cell.big .v{font-size:30px;}
  .hp__cell.big .v .cur{font-size:16px;color:var(--text-3);margin-right:3px;}
  .hp__cell .v.mid{font-size:20px;}
  .hp__sub{font-size:11px;font-weight:var(--fw-bold);margin-top:2px;font-family:var(--font-mono);}
  .pos{color:var(--bull-strong);} .neg{color:var(--bear-strong);}

  /* ---- 工具条 ---- */
  .hp__btn{font-family:var(--font-body);font-weight:var(--fw-bold);font-size:12px;cursor:pointer;
    border-radius:var(--r-pill);padding:7px 15px;border:1.5px solid var(--border-2);
    background:var(--surface);color:var(--text-2);transition:all var(--t-fast);white-space:nowrap;}
  .hp__btn:hover{border-color:var(--border-pink);color:var(--pink);background:var(--pink-bg);}
  .hp__btn.primary{background:var(--grad-brand);color:#fff;border-color:transparent;box-shadow:var(--shadow-md);}
  .hp__btn.primary:hover{transform:translateY(-1px);}
  .hp__editbar{display:flex;align-items:center;gap:10px;flex-wrap:wrap;
    padding:12px 24px;background:var(--purple-bg);border-bottom:1px solid var(--border);font-size:var(--fs-sm);}
  .hp__cashlab{font-weight:var(--fw-bold);color:var(--purple-600);display:flex;align-items:center;gap:6px;}
  .hp__cashin{font-family:var(--font-mono);width:120px;text-align:right;font-weight:var(--fw-bold);
    border:1.5px solid var(--border);border-radius:8px;padding:6px 9px;background:var(--surface);color:var(--text);}
  .hp__cashin:focus{outline:none;border-color:var(--purple);box-shadow:0 0 0 2px var(--purple-glow);}
  .hp__spacer{margin-left:auto;}

  /* ---- 表格 ---- */
  .hp__scroll{overflow-x:auto;}
  .hp__table{width:100%;border-collapse:collapse;font-size:var(--fs-sm);min-width:680px;}
  .hp__table th{text-align:right;font-size:var(--fs-2xs);color:var(--text-3);
    text-transform:uppercase;letter-spacing:.5px;font-weight:var(--fw-bold);
    padding:11px 16px;border-bottom:1px solid var(--border);background:var(--surface-soft);white-space:nowrap;}
  .hp__table th:first-child,.hp__table td:first-child{text-align:left;}
  .hp__table td{padding:13px 16px;text-align:right;border-bottom:1px solid var(--border);
    font-variant-numeric:tabular-nums;vertical-align:middle;}
  .hp__table tr:last-child td{border-bottom:none;}
  .hp__table tbody tr.row{transition:background var(--t-fast);}
  .hp__table tbody tr.row:hover{background:var(--pink-bg);}
  @media (prefers-reduced-motion:no-preference){
    .hp__table tbody tr.anim{animation:ds-slide-in .5s var(--ease) both;}
  }
  .hp__nm{font-weight:var(--fw-bold);color:var(--text);}
  .hp__tk{font-family:var(--font-mono);font-size:var(--fs-2xs);color:var(--text-3);letter-spacing:.4px;margin-top:2px;}
  .hp__num{font-family:var(--font-mono);font-weight:var(--fw-bold);color:var(--text);}
  .hp__sub2{font-family:var(--font-mono);font-size:var(--fs-2xs);color:var(--text-3);margin-top:2px;}
  .hp__chip{display:inline-block;font-family:var(--font-mono);font-weight:var(--fw-bold);
    font-size:var(--fs-xs);padding:3px 9px;border-radius:var(--r-pill);}
  .hp__chip.pos{background:var(--bull-bg);} .hp__chip.neg{background:var(--bear-bg);}

  /* 占比条 */
  .hp__w{min-width:96px;}
  .hp__wbar{height:7px;border-radius:999px;background:var(--surface-soft);overflow:hidden;margin-top:4px;}
  .hp__wbar i{display:block;height:100%;border-radius:999px;background:var(--grad-brand);
    transition:width var(--t-base);}
  .hp__wpct{font-family:var(--font-mono);font-size:var(--fs-2xs);font-weight:var(--fw-bold);color:var(--purple-600);}

  /* 编辑输入 */
  .hp__in{font-family:var(--font-mono);font-size:13px;width:100%;min-width:74px;text-align:right;font-weight:var(--fw-bold);
    border:1.5px solid var(--border);border-radius:8px;padding:6px 8px;background:var(--surface);color:var(--text);}
  .hp__in:focus{outline:none;border-color:var(--pink);box-shadow:0 0 0 2px var(--pink-glow);}
  .hp__in.txt{text-align:left;}
  .hp__in.sm{font-size:11px;margin-top:5px;font-weight:var(--fw-medium);}
  .hp__in.cash{width:120px;min-width:0;}
  .hp__del{border:none;background:var(--bear-bg);color:var(--bear-strong);width:30px;height:30px;
    border-radius:8px;cursor:pointer;font-size:14px;transition:all var(--t-fast);}
  .hp__del:hover{background:var(--bear);color:#fff;}
  .hp__del.confirm{background:var(--bear);color:#fff;width:auto;padding:0 10px;font-size:11px;font-weight:var(--fw-bold);}

  .hp__empty{text-align:center;padding:40px 20px;color:var(--text-3);}
  .hp__empty .ic{font-size:34px;opacity:.5;margin-bottom:8px;}
  .hp__addrow td{text-align:center;padding:12px;}
  .hp__foot{padding:11px 24px;font-size:var(--fs-2xs);color:var(--text-3);
    background:var(--surface-soft);border-top:1px solid var(--border);display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;}
  @media (max-width:560px){ .hp__grid{grid-template-columns:repeat(2,auto);} }
  `;

  // 受控数字输入: 保留原始字符串以便流畅输入 (可清空 / 输入小数点), 即时回传解析值
  function NumCell({ value, onCommit, className = '', autoFocus }) {
    const [raw, setRaw] = useState(() => (value === 0 ? '' : String(value)));
    const ref = useRef(null);
    useEffect(() => { if (autoFocus && ref.current) { ref.current.focus(); ref.current.select(); } }, [autoFocus]);
    return h('input', {
      ref, className: `hp__in ${className}`, type: 'text', inputMode: 'decimal', value: raw,
      placeholder: '0',
      onFocus: (e) => e.target.select(),
      onChange: (e) => {
        const s = e.target.value;
        if (s !== '' && !/^-?\d*\.?\d*$/.test(s)) return; // 仅允许数字
        setRaw(s);
        onCommit(s === '' || s === '-' || s === '.' ? 0 : parseFloat(s) || 0);
      },
      onBlur: () => setRaw(value === 0 ? '' : String(value)),
    });
  }

  function TxtCell({ value, onCommit, className = '', placeholder, autoFocus }) {
    const ref = useRef(null);
    useEffect(() => { if (autoFocus && ref.current) { ref.current.focus(); ref.current.select(); } }, [autoFocus]);
    return h('input', {
      ref, className: `hp__in txt ${className}`, type: 'text', value, placeholder,
      onChange: (e) => onCommit(e.target.value),
    });
  }

  const BLANK = { name: '新标的', ticker: 'CODE', shares: 0, cost: 0, price: 0, prevClose: 0 };
  const todayStr = () => { const d = new Date(); const p = (n) => String(n).padStart(2, '0'); return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`; };

  function HoldingsTablePro(props) {
    const {
      positions = [], cash = 0, owner = '叶纸', currency = '¥', icon = '🐢',
      fx = { CNY: 1 }, readOnly = false, updatedLabel = '',
      storageKey = 'leafpaper_holdings_v2',
      note = '手动维护 · 改动自动保存到本机浏览器 · 不构成投资建议',
    } = props;

    useStyle('hp-css', CSS);
    const seed = useMemo(() => ({ positions, cash, updatedAt: '' }), []); // eslint-disable-line
    const [data, setData] = useState(() => readOnly ? seed : loadLS(storageKey, seed));
    const [editing, setEditing] = useState(false);
    const [seedKey, setSeedKey] = useState(0); // 改变以重挂载输入 (reset/import 后)
    const [focusIdx, setFocusIdx] = useState(-1);
    const [confirmDel, setConfirmDel] = useState(-1);
    const fileRef = useRef(null);

    const commit = (next) => {
      const stamped = { ...next, updatedAt: todayStr() };
      setData(stamped); saveLS(storageKey, stamped);
    };
    const setPos = (i, field, value) => commit({ ...data, positions: data.positions.map((r, k) => k === i ? { ...r, [field]: value } : r) });
    const addRow = () => { commit({ ...data, positions: [...data.positions, { ...BLANK }] }); setFocusIdx(data.positions.length); };
    const delRow = (i) => { commit({ ...data, positions: data.positions.filter((_, k) => k !== i) }); setConfirmDel(-1); };
    const setCash = (v) => commit({ ...data, cash: v });
    const reset = () => { commit(seed); setSeedKey((k) => k + 1); };

    const exportJSON = () => {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `持仓备份_${todayStr()}.json`; a.click();
      URL.revokeObjectURL(url);
    };
    const importJSON = (e) => {
      const file = e.target.files && e.target.files[0]; if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const obj = JSON.parse(reader.result);
          if (!obj || !Array.isArray(obj.positions)) throw new Error('格式不对');
          commit({ positions: obj.positions, cash: Number(obj.cash) || 0, updatedAt: '' });
          setSeedKey((k) => k + 1);
        } catch (err) { alert('导入失败: ' + err.message); }
      };
      reader.readAsText(file);
      e.target.value = '';
    };

    // 汇率折算: 每只按本币计算, 再按 fx 折算成人民币(¥)汇总。汇率未知(null)的不计入¥总额。
    const rateOf = (ccy) => { const r = fx[ccy || 'CNY']; return (r === null || r === undefined) ? null : Number(r); };
    const rows = data.positions.map((p) => {
      const ccy = p.currency || 'CNY';
      const rate = rateOf(ccy);
      const k = rate == null ? 0 : rate;
      const m = p.multiplier || 1;          // 期权合约乘数(通常 100); 普通股 = 1
      const mv = p.shares * p.price * m;
      const dayAmt = p.shares * (p.price - p.prevClose) * m;
      const dayPct = p.prevClose ? (p.price - p.prevClose) / p.prevClose * 100 : 0;
      const plAmt = p.shares * (p.price - p.cost) * m;
      const plPct = p.cost ? (p.price - p.cost) / p.cost * 100 : 0;
      return { ...p, ccy, rate, mv, dayAmt, dayPct, plAmt, plPct,
        mvCNY: mv * k, dayAmtCNY: dayAmt * k, costCNY: p.shares * p.cost * m * k };
    });
    const mvTotal = rows.reduce((s, r) => s + r.mvCNY, 0);        // 持仓市值(¥)
    const cashAmt = Number(data.cash) || 0;                       // 现金(已折算¥)
    const total = mvTotal + cashAmt;                              // 总资产(¥)
    const dayAmt = rows.reduce((s, r) => s + r.dayAmtCNY, 0);     // 今日涨跌(¥)
    const prevTotal = (mvTotal - dayAmt) + cashAmt;
    const dayPct = prevTotal ? dayAmt / prevTotal * 100 : 0;
    const costTotal = rows.reduce((s, r) => s + r.costCNY, 0);    // 总成本(¥)
    const plAmt = mvTotal - costTotal;                            // 累计盈亏(¥)
    const plPct = costTotal ? plAmt / costTotal * 100 : 0;
    const posWeight = total ? mvTotal / total * 100 : 0;

    const animTotal = useCountUp(total);
    const showTotal = editing ? total : animTotal;
    const dayCls = dayAmt >= 0 ? 'pos' : 'neg';
    const plCls = plAmt >= 0 ? 'pos' : 'neg';

    const headCells = [
      h('th', { key: 'a' }, '标的'),
      h('th', { key: 'b' }, '持仓 / 成本'),
      h('th', { key: 'c' }, '现价 / 昨收'),
      h('th', { key: 'd' }, '市值'),
      h('th', { key: 'e' }, '占比'),
      h('th', { key: 'f' }, '今日'),
      h('th', { key: 'g' }, '累计盈亏'),
    ];
    if (editing) headCells.push(h('th', { key: 'x' }, ''));

    const body = rows.length === 0
      ? [h('tr', { key: 'empty' }, h('td', { colSpan: editing ? 8 : 7 },
          h('div', { className: 'hp__empty' }, h('div', { className: 'ic' }, '🐢'), '还没有持仓 —— 点「✎ 编辑持仓」添加第一只')))]
      : rows.map((r, i) => editing
        ? h('tr', { key: i, className: 'row' },
            h('td', null,
              h(TxtCell, { value: r.name, placeholder: '名称', autoFocus: focusIdx === i, onCommit: (v) => setPos(i, 'name', v) }),
              h(TxtCell, { value: r.ticker, className: 'sm', placeholder: '代码', onCommit: (v) => setPos(i, 'ticker', v) })),
            h('td', null,
              h(NumCell, { value: r.shares, onCommit: (v) => setPos(i, 'shares', v) }),
              h(NumCell, { value: r.cost, className: 'sm', onCommit: (v) => setPos(i, 'cost', v) })),
            h('td', null,
              h(NumCell, { value: r.price, onCommit: (v) => setPos(i, 'price', v) }),
              h(NumCell, { value: r.prevClose, className: 'sm', onCommit: (v) => setPos(i, 'prevClose', v) })),
            h('td', { className: 'hp__num' }, currency + fmt(r.mv)),
            h('td', { className: 'hp__w' },
              h('div', { className: 'hp__wpct' }, total ? (r.mv / total * 100).toFixed(1) + '%' : '—')),
            h('td', null, h('span', { className: `hp__chip ${r.dayPct >= 0 ? 'pos' : 'neg'}` }, pct(r.dayPct))),
            h('td', { className: `hp__num ${r.plAmt >= 0 ? 'pos' : 'neg'}` }, pct(r.plPct)),
            h('td', null, confirmDel === i
              ? h('button', { className: 'hp__del confirm', onClick: () => delRow(i), title: '确认删除' }, '确认?')
              : h('button', { className: 'hp__del', onClick: () => setConfirmDel(i), title: '删除' }, '✕')))
        : h('tr', { key: i, className: 'row anim', style: { animationDelay: `${i * 0.06}s` } },
            h('td', null, h('div', { className: 'hp__nm' }, r.name), h('div', { className: 'hp__tk' }, r.ticker)),
            h('td', null, h('div', { className: 'hp__num' }, fmt(r.shares)), h('div', { className: 'hp__sub2' }, '成本 ' + fmt(r.cost, 2))),
            h('td', null, h('div', { className: 'hp__num' }, fmt(r.price, 2)), h('div', { className: 'hp__sub2' }, '昨收 ' + fmt(r.prevClose, 2))),
            h('td', { className: 'hp__num' }, symOf(r.ccy) + fmt(r.mv)),
            h('td', { className: 'hp__w' },
              h('div', { className: 'hp__wpct' }, total ? (r.mvCNY / total * 100).toFixed(1) + '%' : '—'),
              h('div', { className: 'hp__wbar' }, h('i', { style: { width: (total ? Math.min(100, r.mvCNY / total * 100) : 0) + '%' } }))),
            h('td', null, h('span', { className: `hp__chip ${r.dayPct >= 0 ? 'pos' : 'neg'}` }, pct(r.dayPct))),
            h('td', { className: `hp__num ${r.plAmt >= 0 ? 'pos' : 'neg'}` },
              h('div', null, money(symOf(r.ccy), r.plAmt)),
              h('div', { className: 'hp__sub2 ' + (r.plAmt >= 0 ? 'pos' : 'neg') }, pct(r.plPct)))));

    if (editing && rows.length > 0) {
      body.push(h('tr', { key: 'add', className: 'hp__addrow' },
        h('td', { colSpan: 8 }, h('button', { className: 'hp__btn', onClick: addRow }, '＋ 再加一只'))));
    }

    return h('div', { className: 'hp', key: seedKey },
      // 顶部汇总
      h('div', { className: 'hp__top' },
        h('div', { className: 'hp__topbar' },
          h('div', { className: 'hp__title' }, h('span', { className: 'ic' }, icon), owner + '的当前持仓'),
          (!readOnly) && h('button', { className: `hp__btn ${editing ? 'primary' : ''}`, onClick: () => { setEditing((e) => !e); setConfirmDel(-1); } },
            editing ? '✓ 完成' : '✎ 编辑持仓')),
        h('div', { className: 'hp__grid' },
          h('div', { className: 'hp__cell big' },
            h('div', { className: 'l' }, '总资产'),
            h('div', { className: 'v' }, h('span', { className: 'cur' }, currency), fmt(showTotal))),
          h('div', { className: 'hp__cell' },
            h('div', { className: 'l' }, '今日涨跌'),
            h('div', { className: `v mid ${dayCls}` }, pct(dayPct)),
            h('div', { className: `hp__sub ${dayCls}` }, money(currency, dayAmt))),
          h('div', { className: 'hp__cell' },
            h('div', { className: 'l' }, '累计盈亏'),
            h('div', { className: `v mid ${plCls}` }, pct(plPct)),
            h('div', { className: `hp__sub ${plCls}` }, money(currency, plAmt))),
          h('div', { className: 'hp__cell' },
            h('div', { className: 'l' }, '现金/融资'),
            h('div', { className: 'v mid' }, money(currency, Number(data.cash) || 0))),
          h('div', { className: 'hp__cell' },
            h('div', { className: 'l' }, '仓位'),
            h('div', { className: 'v mid' }, posWeight.toFixed(0) + '%')))),

      // 编辑工具条
      editing && h('div', { className: 'hp__editbar' },
        h('span', { className: 'hp__cashlab' }, '💰 现金 ' + currency,
          h(NumCell, { value: Number(data.cash) || 0, className: 'cash', onCommit: setCash })),
        h('button', { className: 'hp__btn primary', onClick: addRow }, '＋ 添加持仓'),
        h('button', { className: 'hp__btn', onClick: exportJSON }, '⬇ 导出备份'),
        h('button', { className: 'hp__btn', onClick: () => fileRef.current && fileRef.current.click() }, '⬆ 导入'),
        h('input', { ref: fileRef, type: 'file', accept: '.json,application/json', style: { display: 'none' }, onChange: importJSON }),
        h('button', { className: 'hp__btn hp__spacer', onClick: reset }, '↺ 重置为默认')),

      // 表格
      h('div', { className: 'hp__scroll' },
        h('table', { className: 'hp__table' },
          h('thead', null, h('tr', null, headCells)),
          h('tbody', null, body))),

      // 页脚
      h('div', { className: 'hp__foot' },
        h('span', null, note),
        h('span', null, updatedLabel || (data.updatedAt ? '最后编辑 ' + data.updatedAt : '示例数据'))));
  }

  window.HoldingsTablePro = HoldingsTablePro;
})();
