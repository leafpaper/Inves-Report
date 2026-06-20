#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
同步长桥(Longbridge / LongPort)真实持仓 -> data/holdings.json

由 GitHub Action 在云端运行。安全约定:
  - 凭据只从环境变量读取 (GitHub Secrets 注入), 绝不写进输出、绝不 print。
  - 输出文件只含持仓字段 (名称/代码/股数/成本/现价/昨收/币种) + 汇率 + 现金, 不含任何凭据。

需要的环境变量 (在 GitHub 仓库 Settings -> Secrets and variables -> Actions 配置):
  LONGPORT_APP_KEY
  LONGPORT_APP_SECRET
  LONGPORT_ACCESS_TOKEN

可选环境变量:
  HOLDINGS_OWNER   显示用昵称 (默认 "叶纸")

依赖: pip install longport
"""
import os
import sys
import json
import datetime
import urllib.request

try:
    from longport.openapi import Config, QuoteContext, TradeContext
except Exception as e:  # pragma: no cover
    sys.stderr.write("无法导入 longport SDK, 请确认已 `pip install longport`\n")
    raise

OUT_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "holdings.json")
OWNER = os.environ.get("HOLDINGS_OWNER", "叶纸")


def fnum(x):
    """把 Decimal / None 安全转成 float。"""
    try:
        return float(x) if x is not None else 0.0
    except (TypeError, ValueError):
        return 0.0


def fx_to_cny(currencies):
    """用免费汇率源 frankfurter.app 把各币种换算成人民币 (CNY)。
    返回 { 'CNY': 1.0, 'USD': 7.x, 'HKD': 0.9x, ... }; 取不到的币种值为 None。"""
    fx = {"CNY": 1.0}
    for ccy in currencies:
        if not ccy or ccy in fx:
            continue
        try:
            url = "https://api.frankfurter.app/latest?from=%s&to=CNY" % ccy
            with urllib.request.urlopen(url, timeout=15) as r:
                data = json.loads(r.read().decode("utf-8"))
            fx[ccy] = float(data["rates"]["CNY"])
        except Exception:
            fx[ccy] = None  # 换算不到时, 前端按原币种展示、总额里跳过
    return fx


def main():
    # 1) 仅从环境变量构造配置 (凭据不落地)
    try:
        config = Config(
            app_key=os.environ["LONGPORT_APP_KEY"],
            app_secret=os.environ["LONGPORT_APP_SECRET"],
            access_token=os.environ["LONGPORT_ACCESS_TOKEN"],
        )
    except KeyError as e:
        sys.stderr.write("缺少必要的环境变量: %s (请在 GitHub Secrets 配置)\n" % e)
        sys.exit(1)

    trade = TradeContext(config)
    quote = QuoteContext(config)

    # 2) 取持仓
    raw_positions = []  # [(symbol, name, qty, cost, currency)]
    resp = trade.stock_positions()
    for channel in getattr(resp, "channels", []) or []:
        for p in getattr(channel, "positions", []) or []:
            raw_positions.append((
                p.symbol,
                getattr(p, "symbol_name", "") or p.symbol,
                fnum(getattr(p, "quantity", 0)),
                fnum(getattr(p, "cost_price", 0)),
                getattr(p, "currency", "") or "",
            ))

    # 3) 取行情 (现价 last_done + 昨收 prev_close); 没有行情权限时降级为成本价
    symbols = [s for (s, *_rest) in raw_positions]
    quotes = {}
    if symbols:
        try:
            for q in quote.quote(symbols):
                quotes[q.symbol] = (fnum(q.last_done), fnum(q.prev_close))
        except Exception as e:
            sys.stderr.write("行情获取失败(可能未开通行情权限), 现价将降级为成本价: %s\n" % e)

    # 4) 组装持仓 (只含展示字段)
    positions = []
    for (sym, name, qty, cost, ccy) in raw_positions:
        last_done, prev_close = quotes.get(sym, (0.0, 0.0))
        price = last_done if last_done > 0 else cost
        prev = prev_close if prev_close > 0 else price
        positions.append({
            "name": name,
            "ticker": sym,
            "shares": qty,
            "cost": cost,
            "price": price,
            "prevClose": prev,
            "currency": ccy or "CNY",
        })

    # 5) 现金 (按币种), 折算成 CNY 汇总
    cash_detail = []  # [{currency, amount}]
    try:
        for bal in trade.account_balance():
            cash_detail.append({
                "currency": getattr(bal, "currency", "") or "",
                "amount": fnum(getattr(bal, "total_cash", 0)),
            })
    except Exception as e:
        sys.stderr.write("账户资金获取失败: %s\n" % e)

    # 6) 汇率
    currencies = set(p["currency"] for p in positions) | set(c["currency"] for c in cash_detail)
    fx = fx_to_cny(currencies)

    cash_cny = 0.0
    for c in cash_detail:
        rate = fx.get(c["currency"])
        if rate:
            cash_cny += c["amount"] * rate

    out = {
        "schema_version": "v1",
        "last_updated": datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
        "base_currency": "CNY",
        "owner": OWNER,
        "fx": fx,
        "cashCNY": round(cash_cny, 2),
        "cash_detail": cash_detail,
        "positions": positions,
    }

    os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
    with open(OUT_PATH, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=2)

    # 只打印条数与时间, 不打印任何敏感信息
    sys.stdout.write("已写入 %d 条持仓 -> data/holdings.json (%s)\n" % (len(positions), out["last_updated"]))


if __name__ == "__main__":
    main()
