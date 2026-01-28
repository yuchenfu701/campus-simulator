@echo off
chcp 65001 >nul
echo ========================================
echo   启动HTTP服务器（用于打开HTML页面）
echo ========================================
echo.

echo 正在检查Python是否已安装...
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Python已安装
    echo.
    echo 正在启动HTTP服务器...
    echo 服务器地址：http://localhost:8000
    echo.
    echo 请在浏览器中访问：
    echo   http://localhost:8000/main-menu.html
    echo.
    echo 按 Ctrl+C 停止服务器
    echo.
    python -m http.server 8000
) else (
    echo ❌ 未检测到Python
    echo.
    echo 请选择其他方法：
    echo 1. 安装Python: https://www.python.org/downloads/
    echo 2. 或使用VS Code的Live Server插件
    echo 3. 或安装Node.js的http-server: npm install -g http-server
    echo.
    pause
)

