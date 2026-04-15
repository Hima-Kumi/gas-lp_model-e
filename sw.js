// sw.js - Service Worker

const CACHE_NAME = 'mild-pwa-v1';
const ASSETS_TO_CACHE = [
  './',
  './index-1.html',
  './manifest.json',
  './js/pwa-install.js',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png'
  // 必要に応じてCSSや画像フォルダを追加してください
  // './css/style.css',
  // './images/logo.png'
];

// インストール時の処理：キャッシュの保存
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching all: app shell and content');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// アクティブ時の処理：古いキャッシュの削除
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activate');
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('[Service Worker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

// フェッチ時の処理：キャッシュがあればそれを返す（オフライン対応）
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // キャッシュにあればそれを返す
      if (response) {
        return response;
      }
      // なければネットワークに取りに行く
      return fetch(event.request);
    })
  );
});