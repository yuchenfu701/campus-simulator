const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('path');
const fs   = require('fs');

const iconPath = path.join(__dirname, 'build', 'icon.ico');
const iconExists = fs.existsSync(iconPath);

// 单实例锁（防止重复开启多个窗口）
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
    app.quit();
}

let mainWindow = null;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        minWidth: 900,
        minHeight: 600,
        title: '爱哲安民未来学校',
        ...(iconExists ? { icon: iconPath } : {}),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            // 允许同源 iframe（office 页面在 iframe 里加载）
            webviewTag: false
        },
        show: false,  // 等加载完再显示，避免白屏闪烁
        backgroundColor: '#667eea'
    });

    mainWindow.loadFile('login.html');

    // 加载完成后再显示窗口
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    // 外部链接在系统浏览器打开
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith('http') || url.startsWith('https')) {
            shell.openExternal(url);
            return { action: 'deny' };
        }
        return { action: 'allow' };
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// 第二个实例启动时，聚焦已有窗口
app.on('second-instance', () => {
    if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.focus();
    }
});

// 移除默认菜单栏（游戏不需要 File/Edit 菜单）
app.on('ready', () => {
    Menu.setApplicationMenu(null);
    createWindow();
});

app.on('window-all-closed', () => {
    app.quit();
});

app.on('activate', () => {
    if (mainWindow === null) createWindow();
});
