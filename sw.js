/**
 * Service Worker — 爱哲安民未来学校 PWA
 * 支持离线缓存，使 Chrome/Safari 可以"安装到主屏幕"
 */

const CACHE_NAME = 'aizhe-school-v2';

// 首次安装时预缓存的核心资源
const PRECACHE_URLS = [
    './',
    './login.html',
    './main-menu.html',
    './index.html',
    './manifest.json',
    './css/style.css',
    './css/campus-mobile.css',
    './images/icon-192.png',
    './images/icon-512.png'
];

// ── install：预缓存核心资源 ──────────────────────────────────────────────────
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(PRECACHE_URLS).catch(() => {
                // 部分资源可能不存在，忽略错误继续安装
            });
        }).then(() => self.skipWaiting())
    );
});

// ── activate：清理旧缓存 ────────────────────────────────────────────────────
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            )
        ).then(() => self.clients.claim())
    );
});

// ── fetch：网络优先，降级到缓存 ─────────────────────────────────────────────
self.addEventListener('fetch', event => {
    // 只处理 GET 请求，跳过 API 请求
    if (event.request.method !== 'GET') return;
    const url = new URL(event.request.url);
    // 跳过跨域请求（API 服务器）
    if (url.origin !== self.location.origin) return;

    event.respondWith(
        fetch(event.request)
            .then(response => {
                // 成功时同步更新缓存
                if (response && response.status === 200) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
                }
                return response;
            })
            .catch(() => caches.match(event.request))
    );
});
