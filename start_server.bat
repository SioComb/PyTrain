@echo off
chcp 65001 > nul
cd /d "%~dp0"
where py > nul 2>&1
if %errorlevel%==0 (
  py -3 tools\dev_server.py
) else (
  python tools\dev_server.py
)
pause
