const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('updater', {
    onUpdateInfo    : (cb) => ipcRenderer.on('update-info',        (_, d) => cb(d)),
    onProgress      : (cb) => ipcRenderer.on('download-progress',  (_, d) => cb(d)),
    downloadUpdate  : (url) => ipcRenderer.invoke('download-update', url),
    openInstaller   : (p)   => ipcRenderer.invoke('open-installer', p),
    closeUpdate     : ()    => ipcRenderer.invoke('close-update')
});
