const { app, BrowserWindow, Menu, shell, ipcMain, dialog, session } = require('electron');
const path = require('path');
const fs   = require('fs');
const https = require('https');
const os    = require('os');
// 真·增量更新：electron-updater 走 NSIS 差分（.blockmap），只下载改动的字节块
let autoUpdater = null;
try { autoUpdater = require('electron-updater').autoUpdater; } catch (e) { console.warn('electron-updater 未安装，自动更新降级为手动检查'); }

// 修复 GPU 缓存路径含中文导致的黑屏问题
app.disableHardwareAcceleration();
// 将用户数据目录指向可写的英文路径
app.setPath('userData', path.join(os.homedir(), 'AppData', 'Local', 'CampusSimulator'));

const iconPath   = path.join(__dirname, 'build', 'icon.ico');
const iconExists = fs.existsSync(iconPath);

// 当前版本（electron-updater 自动从 package.json/app 读取，这里仅用于显示）
const CURRENT_VERSION = (() => { try { return app.getVersion(); } catch(e) { return '2.0.0'; } })();
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
            newVersion    : (releaseInfo.tag_name || 'v?').replace('v', ''),
            releaseNotes  : releaseInfo.body || '修复问题，提升性能',
            downloadUrl   : releaseInfo._legacyUrl || 'updater'   // electron-updater 路径忽略此值
        });
    });

    updateWindow.on('closed', () => { updateWindow = null; });
}

// ── electron-updater 增量更新（NSIS 差分，只下载改动块）──────────
let _updateDownloaded = false;
function setupAutoUpdater() {
    if (!autoUpdater) { checkForUpdatesLegacy(); return; } // 无 electron-updater 时降级
    autoUpdater.autoDownload = false;             // 等用户点"立即更新"再下
    autoUpdater.autoInstallOnAppQuit = true;
    autoUpdater.on('update-available', (info) => {
        console.log('🆕 发现新版本:', info.version);
        _updateDownloaded = false;
        createUpdateWindow({
            tag_name: 'v' + info.version,
            body: (info.releaseNotes && typeof info.releaseNotes === 'string')
                  ? info.releaseNotes.replace(/<[^>]+>/g, '') : '修复问题，提升性能（增量更新，仅下载改动部分）'
        });
    });
    autoUpdater.on('update-not-available', () => console.log('✅ 已是最新版本'));
    autoUpdater.on('error', (err) => console.warn('更新检查失败:', err == null ? 'unknown' : (err.message || err)));
    autoUpdater.on('download-progress', (p) => {
        if (updateWindow) updateWindow.webContents.send('download-progress', {
            percent   : Math.round(p.percent || 0),
            downloaded: p.transferred || 0,
            total     : p.total || 0
        });
    });
    autoUpdater.on('update-downloaded', () => {
        _updateDownloaded = true;
        // 进度推到100%，让更新窗口显示"立即安装"
        if (updateWindow) updateWindow.webContents.send('download-progress', { percent: 100, downloaded: 1, total: 1 });
    });

    try { autoUpdater.checkForUpdates(); }
    catch (e) { console.warn('checkForUpdates 异常:', e.message); }
}

// 降级：electron-updater 不可用时，仍用 GitHub API 检测并引导到下载页
function checkForUpdatesLegacy() {
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
                    release._legacyUrl = release.html_url;
                    createUpdateWindow(release);
                }
            } catch (e) { console.warn('检查更新失败:', e.message); }
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

// ── IPC：开始下载更新（electron-updater 增量下载）──────────────
ipcMain.handle('download-update', async (event, legacyUrl) => {
    if (autoUpdater) {
        try {
            await autoUpdater.downloadUpdate();   // 自动差分下载，进度通过 download-progress 事件回传
            return { done: true };
        } catch (e) {
            // 差分失败时降级：打开 GitHub 发布页
            shell.openExternal(`https://github.com/${GITHUB_REPO}/releases/latest`);
            return { opened: true };
        }
    }
    // 无 electron-updater：打开发布页手动下载
    shell.openExternal(legacyUrl || `https://github.com/${GITHUB_REPO}/releases/latest`);
    return { opened: true };
});

ipcMain.handle('open-installer', () => {
    if (autoUpdater && _updateDownloaded) {
        // 退出并安装增量更新（账号数据在 userData 目录，安装不影响）
        autoUpdater.quitAndInstall();
    } else {
        app.quit();
    }
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
    // 清除 Service Worker 缓存，防止 SW 拦截 Electron 文件请求导致页面全黑
    session.defaultSession.clearStorageData({
        storages: ['serviceworkers', 'cachestorage']
    }).catch(() => {});
    createWindow();
    // 启动 5 秒后检查更新（避免影响启动速度）；仅打包后生效，开发环境跳过
    if (app.isPackaged) setTimeout(setupAutoUpdater, 5000);
    else console.log('🔧 开发环境，跳过自动更新检查');
});

app.on('window-all-closed', () => app.quit());
app.on('activate', () => { if (mainWindow === null) createWindow(); });
