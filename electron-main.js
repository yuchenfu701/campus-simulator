const { app, BrowserWindow, Menu, shell, ipcMain, dialog } = require('electron');
const path = require('path');
const fs   = require('fs');
const https = require('https');
const os    = require('os');

const iconPath   = path.join(__dirname, 'build', 'icon.ico');
const iconExists = fs.existsSync(iconPath);

// 当前版本（与 package.json 同步）
const CURRENT_VERSION = '2.0.0';
const GITHUB_REPO     = 'yuchenfu701/campus-simulator';

// 单实例锁
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) { app.quit(); }

let mainWindow   = null;
let updateWindow = null;

// ── 窗口创建 ─────────────────────────────────────────────────
function createWindow() {
    mainWindow = new BrowserWindow({
        width : 1280,
        height: 800,
        minWidth : 900,
        minHeight: 600,
        title: '爱哲安民未来学校',
        ...(iconExists ? { icon: iconPath } : {}),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            webviewTag: false
        },
        show: false,
        backgroundColor: '#0f172a'
    });

    mainWindow.loadFile('login.html');
    mainWindow.once('ready-to-show', () => mainWindow.show());

    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith('http') || url.startsWith('https')) {
            shell.openExternal(url);
            return { action: 'deny' };
        }
        return { action: 'allow' };
    });

    mainWindow.on('closed', () => { mainWindow = null; });
}

// ── 更新窗口 ─────────────────────────────────────────────────
function createUpdateWindow(releaseInfo) {
    updateWindow = new BrowserWindow({
        width : 520,
        height: 400,
        resizable: false,
        frame: false,
        transparent: true,
        ...(iconExists ? { icon: iconPath } : {}),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'update-preload.js')
        },
        show: false,
        parent: mainWindow,
        modal: false
    });

    updateWindow.loadFile('update.html');
    updateWindow.once('ready-to-show', () => {
        updateWindow.show();
        // 传递版本信息给更新窗口
        updateWindow.webContents.send('update-info', {
            currentVersion: CURRENT_VERSION,
            newVersion    : releaseInfo.tag_name.replace('v', ''),
            releaseNotes  : releaseInfo.body || '修复问题，提升性能',
            downloadUrl   : getInstallerUrl(releaseInfo)
        });
    });

    updateWindow.on('closed', () => { updateWindow = null; });
}

function getInstallerUrl(release) {
    const asset = (release.assets || []).find(a =>
        a.name.includes('Setup') && a.name.endsWith('.exe')
    );
    return asset ? asset.browser_download_url : release.html_url;
}

// ── GitHub 版本检测 ──────────────────────────────────────────
function checkForUpdates() {
    const options = {
        hostname: 'api.github.com',
        path    : `/repos/${GITHUB_REPO}/releases/latest`,
        method  : 'GET',
        headers : { 'User-Agent': 'campus-simulator-updater' }
    };

    const req = https.request(options, (res) => {
        let data = '';
        res.on('data', chunk => { data += chunk; });
        res.on('end', () => {
            try {
                const release = JSON.parse(data);
                const latest  = (release.tag_name || '').replace('v', '');
                if (latest && isNewer(latest, CURRENT_VERSION)) {
                    console.log(`🆕 发现新版本: ${latest}`);
                    createUpdateWindow(release);
                } else {
                    console.log('✅ 已是最新版本');
                }
            } catch (e) {
                console.warn('检查更新失败:', e.message);
            }
        });
    });
    req.on('error', (e) => console.warn('更新检查网络错误:', e.message));
    req.end();
}

function isNewer(latest, current) {
    const p = s => s.split('.').map(Number);
    const [la, lb, lc] = p(latest);
    const [ca, cb, cc] = p(current);
    if (la !== ca) return la > ca;
    if (lb !== cb) return lb > cb;
    return lc > cc;
}

// ── IPC：下载更新 ────────────────────────────────────────────
ipcMain.handle('download-update', async (event, downloadUrl) => {
    // 如果是 GitHub release 页面链接（非直接下载），在浏览器打开
    if (!downloadUrl.endsWith('.exe')) {
        shell.openExternal(downloadUrl);
        return { opened: true };
    }

    const fileName = downloadUrl.split('/').pop() || '爱哲安民未来学校-新版.exe';

    // 弹出"选择保存位置"对话框
    const { canceled, filePath: chosenPath } = await dialog.showSaveDialog(mainWindow, {
        title: '选择下载位置',
        defaultPath: path.join(app.getPath('downloads'), fileName),
        buttonLabel: '保存到此处',
        filters: [{ name: 'Windows 安装程序', extensions: ['exe'] }]
    });

    if (canceled || !chosenPath) {
        return { canceled: true };
    }

    const savePath = chosenPath;

    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(savePath);
        let downloaded = 0;
        let totalSize  = 0;

        function doDownload(url, redirectCount = 0) {
            if (redirectCount > 5) { reject(new Error('重定向次数过多')); return; }
            const proto = url.startsWith('https') ? https : require('http');
            proto.get(url, { headers: { 'User-Agent': 'campus-simulator-updater' } }, (res) => {
                if (res.statusCode === 301 || res.statusCode === 302) {
                    doDownload(res.headers.location, redirectCount + 1);
                    return;
                }
                totalSize = parseInt(res.headers['content-length'] || '0');
                res.on('data', chunk => {
                    downloaded += chunk.length;
                    file.write(chunk);
                    if (totalSize > 0 && updateWindow) {
                        updateWindow.webContents.send('download-progress', {
                            percent: Math.round(downloaded / totalSize * 100),
                            downloaded,
                            total: totalSize
                        });
                    }
                });
                res.on('end', () => {
                    file.end();
                    resolve({ savePath, done: true });
                });
                res.on('error', reject);
            }).on('error', reject);
        }

        doDownload(downloadUrl);
    });
});


ipcMain.handle('open-installer', (event, savePath) => {
    shell.openPath(savePath);
    setTimeout(() => app.quit(), 1000);
});

ipcMain.handle('close-update', () => {
    if (updateWindow) updateWindow.close();
});

// ── 应用事件 ─────────────────────────────────────────────────
app.on('second-instance', () => {
    if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.focus();
    }
});

app.on('ready', () => {
    Menu.setApplicationMenu(null);
    createWindow();
    // 启动 5 秒后检查更新（避免影响启动速度）
    setTimeout(checkForUpdates, 5000);
});

app.on('window-all-closed', () => app.quit());
app.on('activate', () => { if (mainWindow === null) createWindow(); });
