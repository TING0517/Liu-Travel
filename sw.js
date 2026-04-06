const CACHE_NAME = 'travel-v3.0'; // 每次更新程式碼後，請修改此版本號

const ASSETS = [
  './',
  'index.html',
  'wallet.html',
  'ledger.html',
  'weather.html',
  'calculator.html',
  'history.html',
  'history_index.html',
  'history_ledger.html',
  'history_pdf.html',
  'style.css',
  'index.js',
  'wallet.js',
  'weather.js',
  'firebase-config.js',
  'history_index.js',
  'history_ledger.js',
  'manifest.json',
  'icon.png',
  'data/config.js',
  'data/theme-manager.js',
  'force-install.js'
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

// 激活時清理舊的快取資料並立即接管頁面
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
    }).then(() => {
      return self.clients.claim(); // 強制接管所有頁面
    })
  );
});

// 網路優先策略 (Network First)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // 如果抓取成功，將其更新到快取中
        if (response && response.status === 200 && event.request.method === 'GET') {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // 連網失敗時才查找快取
        return caches.match(event.request);
      })
  );
});
