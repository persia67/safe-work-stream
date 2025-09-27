# HSE Management System Desktop Launcher
# PowerShell script to run the desktop application

Write-Host "HSE Management System Desktop Application" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Yellow
} catch {
    Write-Host "Node.js is not installed. Please install Node.js first." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if dependencies are installed
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to install dependencies." -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}

# Run the application
Write-Host "Starting HSE Management System..." -ForegroundColor Green
Write-Host "Close this window to stop the application." -ForegroundColor Yellow
Write-Host ""

try {
    npm run electron:dev
} catch {
    Write-Host "Error starting the application." -ForegroundColor Red
    Read-Host "Press Enter to exit"
}