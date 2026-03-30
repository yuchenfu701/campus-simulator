@echo off
cd /d "%~dp0"

echo.
echo ========================================
echo  Upload to GitHub Pages
echo ========================================
echo.

:: Try git directly first (already in PATH)
git --version > nul 2>&1
if %errorlevel% equ 0 goto :GIT_OK

:: Search for git.exe on all drives
echo Searching for git.exe ...
for /f "delims=" %%G in ('dir /s /b "C:\git.exe" "D:\git.exe" 2^>nul') do (
    set "GITEXE=%%G"
    goto :FOUND
)

:: Registry lookup
for /f "tokens=2*" %%A in ('reg query "HKLM\SOFTWARE\GitForWindows" /v InstallPath 2^>nul') do (
    set "GITDIR=%%B"
    set "PATH=%%B\cmd;%%B\bin;%PATH%"
    goto :GIT_OK
)

:: Fallback: search D drive cmd folder
for /f "delims=" %%G in ('dir /s /b "D:\*\cmd\git.exe" 2^>nul') do (
    for %%H in ("%%~dpG..") do set "PATH=%%~fH\cmd;%%~fH\bin;%PATH%"
    goto :GIT_OK
)

echo [ERROR] Cannot find git.exe on this computer.
echo Please make sure Git is installed.
pause
exit /b 1

:FOUND
for %%H in ("%GITEXE%") do set "PATH=%%~dpH;%PATH%"

:GIT_OK
git --version > nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Git still not found.
    pause
    exit /b 1
)

for /f "tokens=*" %%v in ('git --version') do echo [OK] %%v
echo.

echo [1/3] Adding all files...
git add .
echo [OK] Done
echo.

echo [2/3] Committing...
git diff --cached --quiet
if %errorlevel% equ 0 (
    echo [INFO] Nothing new to commit.
) else (
    git commit -m "update: 2D/3D map select + 3D exit button + fix parkour 404"
    echo [OK] Committed
)
echo.

echo [3/3] Pushing to GitHub...
git push origin main
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Push failed! Possible reasons:
    echo   1. Need to login GitHub (enter username+token)
    echo   2. No internet connection
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo  SUCCESS! Wait ~2 min then visit:
echo  https://yuchenfu701.github.io/campus-simulator/
echo ========================================
echo.
pause
