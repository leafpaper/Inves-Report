@echo off
rem 构建主页应用: src/app.jsx --(esbuild)--> app.js
cd /d "%~dp0"
call npx --yes esbuild src/app.jsx --loader:.jsx=jsx --target=es2018 --outfile=app.js --log-level=warning
echo app.js built.
