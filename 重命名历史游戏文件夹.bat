@echo off
chcp 65001 >nul
echo 正在重命名历史小游戏文件夹...
echo.

if exist "新建文件夹 (5)" (
    if not exist "history-game" (
        ren "新建文件夹 (5)" "history-game"
        echo ✅ 文件夹已成功重命名为: history-game
        echo.
        echo 请刷新浏览器页面后再次尝试打开游戏
    ) else (
        echo ⚠️ 文件夹 history-game 已存在，跳过重命名
    )
) else (
    echo ❌ 找不到文件夹 "新建文件夹 (5)"
    echo 请确认文件夹名称是否正确
)

echo.
pause

