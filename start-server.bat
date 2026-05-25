@echo off
title Smart Base Frontend Server
echo ==================================================
echo Starting Smart Base Frontend Server...
echo ==================================================
echo.
echo Opening http://localhost:3000 in your browser...
start "" "http://localhost:3000"
echo.
node server.js
pause
