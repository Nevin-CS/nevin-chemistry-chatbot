\
@echo off
title Nevin Chemistry Chatbot - Easy Setup
cd /d "%~dp0"
echo.
echo ==========================================
echo       NEVIN CHEMISTRY CHATBOT
echo ==========================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed yet.
  echo Opening the official Node.js download page...
  start "" "https://nodejs.org/en/download"
  echo.
  echo Download the LTS version, install it, then restart your computer.
  echo After that, double-click START-NEVIN.bat again.
  pause
  exit /b 1
)

if not exist ".env" (
  copy ".env.example" ".env" >nul
  echo A settings file named .env has been created.
  echo.
  echo Opening it in Notepad. Paste your OpenAI API key after OPENAI_API_KEY=
  echo Save the file and close Notepad to continue.
  notepad ".env"
  echo.
)

echo Installing the project packages (first run only)...
call npm install
if errorlevel 1 (
  echo.
  echo Setup could not finish. Check your internet connection and try again.
  pause
  exit /b 1
)

echo.
echo Starting Nevin...
echo When the server starts, open http://localhost:3000 in your browser.
echo Keep this black window open while using Nevin.
echo To stop Nevin, return here and press CTRL+C.
echo.
start "" "http://localhost:3000"
call npm start
pause
