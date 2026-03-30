@echo off
chcp 65001 >nul
echo ========================================
echo   部署到GitHub Pages - 快速指南
echo ========================================
echo.
echo 本脚本将帮助你快速部署游戏到GitHub Pages
echo 让所有人可以通过网址访问你的游戏！
echo.
echo ========================================
echo.

:: 检查Git是否安装
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到Git
    echo.
    echo [提示] 请先安装Git：
    echo 1. 访问 https://git-scm.com/download/win
    echo 2. 下载并安装Git
    echo 3. 重新运行此脚本
    echo.
    echo 或者使用GitHub Desktop（更简单）：
    echo 1. 访问 https://desktop.github.com/
    echo 2. 下载并安装GitHub Desktop
    echo 3. 按照提示操作
    echo.
    pause
    exit /b 1
)

echo [信息] 检测到Git，开始部署流程...
echo.

:: 检查是否已初始化Git仓库
if not exist ".git" (
    echo [步骤1] 初始化Git仓库...
    git init
    echo [完成] Git仓库已初始化
    echo.
) else (
    echo [信息] Git仓库已存在
    echo.
)

:: 添加所有文件
echo [步骤2] 添加文件到Git...
git add .
echo [完成] 文件已添加
echo.

:: 提交更改
echo [步骤3] 提交更改...
git commit -m "Deploy to GitHub Pages - 校园模拟器"
if %errorlevel% neq 0 (
    echo [警告] 提交失败，可能是没有更改或已提交
    echo.
)

echo.
echo ========================================
echo   下一步操作指南
echo ========================================
echo.
echo [重要] 请按照以下步骤完成部署：
echo.
echo 1. 在GitHub创建新仓库：
echo    - 访问 https://github.com/new
echo    - 仓库名：campus-simulator（或你喜欢的名字）
echo    - 选择 Public（公开）
echo    - 不要勾选 "Initialize with README"
echo    - 点击 "Create repository"
echo.
echo 2. 连接远程仓库并推送：
echo    运行以下命令（将用户名和仓库名替换为你的）：
echo.
echo    git branch -M main
echo    git remote add origin https://github.com/你的用户名/campus-simulator.git
echo    git push -u origin main
echo.
echo 3. 启用GitHub Pages：
echo    - 在GitHub仓库页面，点击 "Settings"
echo    - 找到 "Pages" 选项
echo    - Source: 选择 "Deploy from a branch"
echo    - Branch: 选择 "main"
echo    - Folder: 选择 "/ (root)"
echo    - 点击 "Save"
echo.
echo 4. 等待几分钟，访问你的网站：
echo    https://你的用户名.github.io/campus-simulator
echo.
echo ========================================
echo   详细说明
echo ========================================
echo.
echo 查看完整部署指南：公网部署指南.md
echo.
echo ========================================
echo.

pause




