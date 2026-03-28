const CACHE_NAME = 'busan-travel-v1.3'; // 每次更新程式碼後，請修改此版本號

const ASSETS = [
  './',
  'index.html',
  'guide.html',
  'wallet.html',
  'weather.html',
  'style.css',
  'script.js',
  'icon.png'
];

// 安裝時立即接管
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('正在快取資源...');
      return cache.addAll(ASSETS);
    })
  );
});

// 激活時清理舊的快取資料
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('正在清理舊快取:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
