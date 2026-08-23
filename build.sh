#!/bin/sh
# 构建主页应用: src/app.jsx --(esbuild)--> app.js
# 改了 src/app.jsx 后跑一次即可; 站点运行时不再依赖浏览器端 Babel。
cd "$(dirname "$0")"
npx --yes esbuild src/app.jsx --loader:.jsx=jsx --target=es2018 --outfile=app.js --log-level=warning
echo "app.js built: $(wc -c < app.js) bytes"
