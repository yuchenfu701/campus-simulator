@echo off
chcp 65001 >nul
echo ========================================
echo   校园模拟器后端服务器启动脚本
echo ========================================
echo.

cd /d "%~dp0server"

echo [1/3] 检查Node.js安装...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 未检测到Node.js，请先安装Node.js
    echo 💡 下载地址: https://nodejs.org/
    pause
    exit /b 1
)
echo ✅ Node.js已安装

echo.
echo [2/3] 检查依赖包...
if not exist "node_modules" (
    echo 📦 正在安装依赖包...
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ 依赖安装失败
        pause
        exit /b 1
    )
)
echo ✅ 依赖包已就绪

echo.
echo [3/3] 启动服务器...
echo.
echo 💡 提示：
echo    - 确保MongoDB Compass已启动
echo    - 服务器将在 http://localhost:3000 启动
echo    - 按 Ctrl+C 停止服务器
echo.
echo ========================================
echo.

call npm start

pause



