@echo off
echo SmartSeason Field Monitoring System - Setup Script
echo ===================================================

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: Node.js is not installed. Please install Node.js first.
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✓ Node.js found: %NODE_VERSION%
echo.

REM Setup Backend
echo Setting up Backend...
cd backend
if exist ".env" (
    echo   .env already exists
) else (
    echo   Creating .env from example...
    copy .env.example .env >nul
)

echo   Installing dependencies...
call npm install >nul 2>&1

if %ERRORLEVEL% EQU 0 (
    echo ✓ Backend setup complete
) else (
    echo ✗ Backend setup failed
    exit /b 1
)

cd ..
echo.

REM Setup Frontend
echo Setting up Frontend...
cd frontend
echo   Installing dependencies...
call npm install >nul 2>&1

if %ERRORLEVEL% EQU 0 (
    echo ✓ Frontend setup complete
) else (
    echo ✗ Frontend setup failed
    exit /b 1
)

cd ..
echo.

echo ===================================================
echo ✓ Setup Complete!
echo.
echo To start the application:
echo.
echo Terminal 1 (Backend):
echo   cd backend
echo   npm start
echo.
echo Terminal 2 (Frontend):
echo   cd frontend
echo   npm start
echo.
echo Then visit http://localhost:3000 in your browser
echo.
echo Demo Credentials:
echo   Admin:  admin@smartseason.com / admin123
echo   Agent:  agent@smartseason.com / agent123
echo.
