@echo off
title Atlas GRC
cd /d "%~dp0"
echo.
echo   Atlas GRC - estudio de la ISO 27001 (no sale nada a internet)
echo   Se abrira el navegador en http://127.0.0.1:8643. Deja esta ventana abierta.
echo.
python serve.py 8643
if errorlevel 1 (
  echo.
  echo   No encuentro Python. Instalalo desde https://www.python.org
  pause
)
