#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
同步长桥(Longbridge)真实持仓 -> data/holdings.json + data/holdings_history.json

通过 Longbridge MCP 服务 (https://mcp.longbridge.com) 拉取数据, 只用 Python 标准库,
无需安装任何 SDK。由 GitHub Action 在云端运行。

安全约定:
  - 凭据(MCP access token)只从环境变量 LONGBRIDGE_MCP_TOKEN 读取(GitHub Secrets 注入),
    绝不打印、绝不写入输出文件。
  - 输出文件只含持仓字段 + 汇率 + 盈亏汇总, 不含任何凭据。

环境变量:
  LONGBRIDGE_MCP_TOKEN   必填, 在 https://open.longbridge.com/connect 生成授权码后换取的 access token
  HOLDINGS_OWNER         可选, 显示昵称 (默认 "叶纸")

注意: MCP token 有有效期(约2周), 过期后需重新生成并更新该 Secret。
"""
import os
import re
import sys
import json
import datetime
import urllib.request

MCP = "https://mcp.longbridge.com"
HERE = os.path.dirname(__file__)
OUT = os.path.join(HERE, "..", "data", "holdings.json")
HIST = os.path.join(HERE, "..", "data", "holdings_history.json")
OWNER = os.environ.get("HOLDINGS_OWNER", "叶纸")
OPT_RE = re.compile(r"\d{6}[PC]\d{6,}\.")  # OCC 式期权代码


def mcp_call(token, method, params, _id=1):
    body = json.dumps({"jsonrpc": "2.0", "id": _id, "method": method, "params": params}).encode("utf-8")
    req = urllib.request.Request(MCP, data=body, method="POST")
    req.add_header("Content-Type", "application/json")
    req.add_header("Accept", "application/json, text/event-stream")
    req.add_header("Authorization", "Bearer " + token)
    with urllib.request.urlopen(req, timeout=40) as r:
        raw = r.read().decode("utf-8")
    # 兼容 SSE: 取 data: 行
    for line in raw.splitlines():
        if line.startswith("data:"):
            return json.loads(line[5:].strip())
    return json.loads(raw)


def tool(token, name, args):
    resp = mcp_call(token, "tools/call", {"name": name, "arguments": args}, _id=7)
    res = resp.get("result", {})
    parts = [c.get("text", "") for c in res.get("content", []) if c.get("type") == "text"]
    text = "\n".join(parts)
    return json.loads(text) if text.strip() else None


def fnum(x):
    try:
        return float(x)
    except (TypeError, ValueError):
        return 0.0


def fx_cny(ccy):
    if ccy == "CNY":
        return 1.0
    try:
        with urllib.request.urlopen("https://api.frankfurter.app/latest?from=%s&to=CNY" % ccy, timeout=15) as r:
            return float(json.loads(r.read().decode("utf-8"))["rates"]["CNY"])
    except Exception:
        return {"USD": 7.18, "HKD": 0.92}.get(ccy, 1.0)


def main():
    token = os.environ.get("LONGBRIDGE_MCP_TOKEN", "").strip()
    if not token:
        sys.stderr.write("缺少环境变量 LONGBRIDGE_MCP_TOKEN (请在 GitHub Secrets 配置)\n")
        sys.exit(1)

    mcp_call(token, "initialize", {"protocolVersion": "2025-06-18", "capabilities": {},
                                   "clientInfo": {"name": "sync", "version": "1.0"}}, _id=1)

    posResp = tool(token, "stock_positions", {}) or {"list": []}
    raw = []
    for grp in posResp.get("list", []):
        for s in grp.get("stock_info", []):
            raw.append(s)

    opt_syms = [s["symbol"] for s in raw if OPT_RE.search(s["symbol"])]
    stk_syms = [s["symbol"] for s in raw if not OPT_RE.search(s["symbol"])]
    oq = {}
    if opt_syms:
        for q in (tool(token, "option_quote", {"symbols": opt_syms}) or []):
            oq[q["symbol"]] = q
    sq = {}
    if stk_syms:
        for q in (tool(token, "quote", {"symbols": stk_syms}) or []):
            sq[q["symbol"]] = q

    usdcny = fx_cny("USD")

    positions = []
    valC = costC = dayC = 0.0
    for r in raw:
        sym = r["symbol"]
        is_opt = sym in oq
        q = oq.get(sym) if is_opt else sq.get(sym)
        mult = int(float(q.get("contract_multiplier", 100))) if is_opt else 1
        shares = fnum(r.get("quantity"))
        cost = fnum(r.get("cost_price"))
        price = fnum(q.get("last_done")) if q else cost
        prev = fnum(q.get("prev_close")) if q else price
        ccy = r.get("currency") or "USD"
        p = {"name": r.get("symbol_name") or sym, "ticker": sym, "shares": shares,
             "cost": cost, "price": price, "prevClose": prev, "currency": ccy,
             "type": "option" if is_opt else "stock", "multiplier": mult}
        if is_opt:
            p.update({"direction": q.get("direction"), "strike": fnum(q.get("strike_price")),
                      "expiry": q.get("expiry_date"), "underlying": q.get("underlying_symbol")})
        positions.append(p)
        rate = usdcny if ccy == "USD" else 1.0
        valC += shares * price * mult * rate
        costC += shares * cost * mult * rate
        dayC += shares * (price - prev) * mult * rate

    pnlC = valC - costC
    pnlPct = round(pnlC / costC * 100, 2) if costC else 0.0

    # 账户净资产(权威): 总资产 = 净资产(已扣融资), 避免被融资额度虚增
    net_hkd = 0.0
    try:
        bal = tool(token, "account_balance", {}) or []
        if bal:
            net_hkd = fnum(bal[0].get("net_assets"))
    except Exception as e:
        sys.stderr.write("account_balance 获取失败: %s\n" % e)
    hkdcny = fx_cny("HKD")
    net_cny = net_hkd * hkdcny
    cashCNY = round(net_cny - valC, 2) if net_hkd else 0   # 使 总资产 = 持仓市值 + 现金/融资 = 净资产

    now = datetime.datetime.utcnow()
    today = now.strftime("%Y-%m-%d")

    # 账户历史业绩(含已平仓): 自开户以来的累计盈亏
    perf = {}
    try:
        pa = tool(token, "profit_analysis", {"start": "2025-01-13", "end": today}) or {}
        if pa:
            perf = {
                "since": pa.get("start_date") or "2025-01-13",
                "totalPnLCNY": round(fnum(pa.get("sum_profit")) * usdcny, 2),
                "totalPnLPct": round(fnum(pa.get("sum_profit_rate")) * 100, 2),
                "timeWeightedPct": round(fnum(pa.get("total_time_earning_yield")) * 100, 2),
                "currentAssetCNY": round(fnum(pa.get("current_total_asset")) * usdcny, 2),
                "investAmountCNY": round(fnum(pa.get("invest_amount")) * usdcny, 2),
                "tradedCount": int(fnum(pa.get("trade_stock_num"))),
            }
    except Exception as e:
        sys.stderr.write("profit_analysis 获取失败: %s\n" % e)

    out = {
        "schema_version": "v3",
        "last_updated": now.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "base_currency": "CNY",
        "owner": OWNER,
        "source": "Longbridge",
        "fx": {"CNY": 1.0, "USD": round(usdcny, 4), "HKD": round(hkdcny, 4)},
        "cashCNY": cashCNY,
        "performance": perf,
        "totals": {"netAssetsCNY": round(net_cny, 2), "grossMvCNY": round(valC, 2),
                   "marginCNY": cashCNY, "costCNY": round(costC, 2),
                   "pnlCNY": round(pnlC, 2), "pnlPct": pnlPct, "dayCNY": round(dayC, 2)},
        "positions": positions,
    }
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=2)

    # 盈亏路程历史: 每天一个点(同日覆盖)
    hist = []
    if os.path.exists(HIST):
        try:
            with open(HIST, encoding="utf-8") as f:
                hist = json.load(f) or []
        except Exception:
            hist = []
    hist = [h for h in hist if h.get("date") != today]
    hist.append({"date": today, "acctPnLPct": perf.get("totalPnLPct"), "acctPnLCNY": perf.get("totalPnLCNY"),
                 "acctAssetCNY": perf.get("currentAssetCNY"), "openPnLPct": pnlPct, "netAssetsCNY": round(net_cny, 2)})
    hist.sort(key=lambda h: h.get("date", ""))
    hist.sort(key=lambda h: h.get("date", ""))
    with open(HIST, "w", encoding="utf-8") as f:
        json.dump(hist, f, ensure_ascii=False, indent=2)

    sys.stdout.write("已同步 %d 条持仓; 累计盈亏 %.2f%% (data/holdings.json + history)\n" % (len(positions), pnlPct))


if __name__ == "__main__":
    main()
