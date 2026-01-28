@echo off
chcp 65001 >nul
echo ========================================
echo 上传 server 文件夹到 GitHub
echo ========================================
echo.

cd server

echo [1/4] 检查 Git 是否已安装...
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 未检测到 Git，请先安装 Git
    echo 下载地址：https://git-scm.com/download/win
    pause
    exit /b 1
)
echo ✅ Git 已安装
echo.

echo [2/4] 初始化 Git 仓库...
if not exist .git (
    git init
    echo ✅ Git 仓库已初始化
) else (
    echo ✅ Git 仓库已存在
)
echo.

echo [3/4] 添加文件到 Git...
git add .
echo ✅ 文件已添加
echo.

echo [4/4] 提交更改...
git commit -m "Initial commit - server files"
echo ✅ 更改已提交
echo.

echo ========================================
echo 下一步操作：
echo ========================================
echo 1. 在 GitHub 网页上，复制仓库地址
echo 2. 运行以下命令连接远程仓库：
echo    git remote add origin https://github.com/yuchenfu701/campus-simulator-server.git
echo 3. 推送代码：
echo    git push -u origin main
echo.
echo 或者，如果 main 分支不存在，使用：
echo    git push -u origin master
echo ========================================
echo.
pause



