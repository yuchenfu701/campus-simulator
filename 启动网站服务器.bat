@echo off
chcp 65001 >nul
echo ========================================
echo   爱哲安民未来学校校园模拟器 - 网站服务器
echo ========================================
echo.

:: 检查Python是否安装
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到Python，正在尝试使用Node.js...
    goto :nodejs
)

echo [信息] 检测到Python，使用Python启动HTTP服务器...
echo [信息] 服务器将在 http://localhost:8080 启动
echo [信息] 按 Ctrl+C 停止服务器
echo.
echo ========================================
echo.

python -m http.server 8080
goto :end

:nodejs
:: 检查Node.js是否安装
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到Node.js
    echo [提示] 请安装Python或Node.js后重试
    echo.
    echo Python下载: https://www.python.org/downloads/
    echo Node.js下载: https://nodejs.org/
    pause
    exit /b 1
)

echo [信息] 检测到Node.js，使用Node.js启动HTTP服务器...
echo [信息] 服务器将在 http://localhost:8080 启动
echo [信息] 按 Ctrl+C 停止服务器
echo.
echo ========================================
echo.

:: 使用npx http-server（如果已安装）或创建临时服务器
npx --yes http-server -p 8080 -c-1
goto :end

:end
pause

