@echo off
chcp 65001 > nul 2>&1
cd /d "%~dp0"

echo.
echo ========================================
echo  Upload to GitHub Pages
echo ========================================
echo.

git --version > nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Git not found!
    echo Please install Git first:
    echo   https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
)

echo [OK] Git found
echo.

echo [1/3] Adding all files...
git add .
echo [OK] Files staged
echo.

echo [2/3] Committing...
git diff --cached --quiet
if %errorlevel% equ 0 (
    echo [INFO] Nothing new to commit, already up to date.
) else (
    git commit -m "update: 2D/3D map select + 3D exit button"
    echo [OK] Committed
)
echo.

echo [3/3] Pushing to GitHub...
git push origin main
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Push failed. Try:
    echo   1. Check your internet connection
    echo   2. Run: git push origin main
    echo      in a CMD window at this folder
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo  SUCCESS! Site will update in ~2 min:
echo  https://yuchenfu701.github.io/campus-simulator/
echo ========================================
echo.
pause
