@echo off
echo Starting HSE Management System Desktop Application...
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    echo.
)

REM Run the desktop application
echo Starting Electron application...
npm run electron:dev

pause