// service-worker.js
const APP_VERSION = '1.0.2';
const CACHE_NAME = `english-learning-cache-v${APP_VERSION}`;
const OFFLINE_URL = '/song-ngu-cho-be/offline.html';

// 🟢 Tài nguyên tĩnh cần cache ngay
const STATIC_ASSETS = [
  '/song-ngu-cho-be/',
  '/song-ngu-cho-be/index.html',
  '/song-ngu-cho-be/app-stt.js',
  '/song-ngu-cho-be/words.json',
  '/song-ngu-cho-be/manifest.json',
  
  
  // Icon và hình ảnh
  '/song-ngu-cho-be/images/icon-192.png',
  '/song-ngu-cho-be/images/icon-512.png',
  
  // Âm thanh cơ bản
  '/song-ngu-cho-be/sounds/success.mp3',
  '/song-ngu-cho-be/sounds/well_done.mp3',
  '/song-ngu-cho-be/sounds/please_try_again.mp3'
];

// 🟢 Hàm cài đặt service worker
self.addEventListener('install', (event) => {
  console.log(`[SW ${APP_VERSION}] Installing service worker...`);
  
  // Bỏ qua việc chờ đợi để kích hoạt ngay
  self.skipWaiting();
  
  event.waitUntil(
    (async () => {
      try {
        // Mở cache
        const cache = await caches.open(CACHE_NAME);
        console.log(`[SW ${APP_VERSION}] Cache ${CACHE_NAME} opened`);
        
        // Cache các tài nguyên tĩnh
        console.log(`[SW ${APP_VERSION}] Caching ${STATIC_ASSETS.length} static assets`);
       for (const asset of STATIC_ASSETS) {
            try {
          await cache.add(asset);
          } catch (err) {
         console.warn('[SW] Failed to cache:', asset);
      }
    }

        
        console.log(`[SW ${APP_VERSION}] Static assets cached successfully`);
        
        // Cache offline page
        const offlineResponse = await fetch(OFFLINE_URL);
        if (offlineResponse.ok) {
          await cache.put(OFFLINE_URL, offlineResponse.clone());
          console.log(`[SW ${APP_VERSION}] Offline page cached`);
        }
        
      } catch (error) {
        console.error(`[SW ${APP_VERSION}] Installation failed:`, error);
      }
    })()
  );
});

// 🟢 Hàm kích hoạt service worker
self.addEventListener('activate', (event) => {
  console.log(`[SW ${APP_VERSION}] Activating service worker...`);
  
  event.waitUntil(
    (async () => {
      try {
        // Xóa cache cũ
        const cacheKeys = await caches.keys();
        const deletePromises = cacheKeys.map(cacheKey => {
          if (cacheKey !== CACHE_NAME) {
            console.log(`[SW ${APP_VERSION}] Deleting old cache: ${cacheKey}`);
            return caches.delete(cacheKey);
          }
        });
        
        await Promise.all(deletePromises);
        console.log(`[SW ${APP_VERSION}] Old caches cleaned up`);
        
        // Claim clients ngay lập tức
        await self.clients.claim();
        console.log(`[SW ${APP_VERSION}] Now controlling all clients`);
        
        // Gửi thông báo đến tất cả clients
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
          client.postMessage({
            type: 'SW_ACTIVATED',
            version: APP_VERSION
          });
        });
        
      } catch (error) {
        console.error(`[SW ${APP_VERSION}] Activation failed:`, error);
      }
    })()
  );
});

// 🟢 Hàm xử lý fetch requests
self.addEventListener('fetch', (event) => {
  // Bỏ qua các request không phải HTTP(S)
  if (!event.request.url.startsWith('http')) return;
  
  // Bỏ qua các request POST
  if (event.request.method !== 'GET') return;
  
  const requestUrl = new URL(event.request.url);
  
  // Đối với các file JSON và JS, luôn thử network trước
  if (requestUrl.pathname.endsWith('.js')) {
  event.respondWith(cacheFirstThenNetwork(event.request));
  return;
}

if (requestUrl.pathname.endsWith('.json')) {
  event.respondWith(networkFirstThenCache(event.request));
  return;
}

  
  // Đối với hình ảnh và âm thanh, cache first
  if (requestUrl.pathname.match(/\.(png|jpg|jpeg|gif|mp3|wav|ogg)$/)) {
    event.respondWith(
      cacheFirstThenNetwork(event.request)
    );
    return;
  }
  
  // Mặc định: network first
  event.respondWith(
    networkFirstThenCache(event.request)
  );
});

// 🟢 Chiến lược: Network First, rồi Cache
async function networkFirstThenCache(request) {
  try {
    // Thử network trước
    const networkResponse = await fetch(request);
    
    // Nếu thành công, cache response
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, networkResponse.clone());
      console.log(`[SW] Cached from network: ${request.url}`);
    }
    
    return networkResponse;
    
  } catch (networkError) {
    console.log(`[SW] Network failed, trying cache: ${request.url}`, networkError);
    
    // Thử cache
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      console.log(`[SW] Serving from cache: ${request.url}`);
      return cachedResponse;
    }
    
    // Nếu là HTML request và không có trong cache, trả về offline page
    if (request.headers.get('Accept')?.includes('text/html')) {
      const offlinePage = await caches.match(OFFLINE_URL);
      if (offlinePage) {
        console.log(`[SW] Serving offline page for: ${request.url}`);
        return offlinePage;
      }
    }
    
    // Nếu không có gì, trả về lỗi
    return new Response('Network error and no cache available', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: new Headers({
        'Content-Type': 'text/plain'
      })
    });
  }
}

// 🟢 Chiến lược: Cache First, rồi Network
async function cacheFirstThenNetwork(request) {
  // Thử cache trước
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    console.log(`[SW] Cache hit: ${request.url}`);
    
    // Trả về từ cache nhưng vẫn fetch để cập nhật cache
    fetchAndCache(request).catch(() => {});
    
    return cachedResponse;
  }
  
  // Nếu không có trong cache, thử network
  try {
    const networkResponse = await fetch(request);
    
    // Nếu thành công, cache nó
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, networkResponse.clone());
      console.log(`[SW] Cached after network: ${request.url}`);
    }
    
    return networkResponse;
    
  } catch (networkError) {
    console.log(`[SW] Network failed for cache-first: ${request.url}`, networkError);
    
    // Trả về placeholder image hoặc fallback
    if (request.url.match(/\.(png|jpg|jpeg|gif)$/)) {
      return caches.match('/song-ngu-cho-be/images/icon-512.png');
    }
    
    if (request.url.match(/\.(mp3|wav|ogg)$/)) {
      return new Response(null, { status: 404 });
    }
    
    throw networkError;
  }
}

// 🟢 Hàm fetch và cache (background)
async function fetchAndCache(request) {
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, response.clone());
      console.log(`[SW] Background cache updated: ${request.url}`);
    }
  } catch (error) {
    console.log(`[SW] Background fetch failed: ${request.url}`, error);
  }
}

// 🟢 Hàm cache hình ảnh từ words.json
self.addEventListener('message', async (event) => {
  if (event.data && event.data.type === 'CACHE_IMAGES') {
    console.log('[SW] Received message to cache images');
    
    try {
      const response = await fetch('/song-ngu-cho-be/words.json');
      const data = await response.json();
      
      let allWords = [];
      
      // Xử lý cấu trúc dữ liệu
      if (data.learning_modes) {
        if (data.learning_modes.by_topics) {
          data.learning_modes.by_topics.forEach(topic => {
            if (topic.words) allWords = allWords.concat(topic.words);
          });
        }
        if (data.learning_modes.by_letters) {
          data.learning_modes.by_letters.forEach(letterGroup => {
            if (letterGroup.words) allWords = allWords.concat(letterGroup.words);
          });
        }
      } else if (Array.isArray(data.topics)) {
        data.topics.forEach(topic => {
          if (topic.words) allWords = allWords.concat(topic.words);
        });
      }
      
      console.log(`[SW] Found ${allWords.length} words for image caching`);
      
      const imageUrls = allWords
        .map(word => word.image)
        .filter(url => url && url.startsWith('http'));
      
      const uniqueUrls = [...new Set(imageUrls)];
      console.log(`[SW] Caching ${uniqueUrls.length} unique images`);
      
      const cache = await caches.open(CACHE_NAME);
      const cachePromises = uniqueUrls.map(async (url) => {
        try {
          const response = await fetch(url);
          if (response.ok) {
            await cache.put(url, response);
            console.log(`[SW] Cached image: ${url}`);
          }
        } catch (error) {
          console.warn(`[SW] Failed to cache image: ${url}`, error);
        }
      });
      
      await Promise.all(cachePromises);
      console.log(`[SW] Image caching completed`);
      
      // Báo cáo hoàn thành
      event.ports[0]?.postMessage({
        type: 'IMAGES_CACHED',
        count: uniqueUrls.length
      });
      
    } catch (error) {
      console.error('[SW] Failed to cache images:', error);
      event.ports[0]?.postMessage({
        type: 'CACHE_ERROR',
        error: error.message
      });
    }
  }
});

// 🟢 Hàm xử lý push notifications (tùy chọn)
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
  const options = {
    body: event.data?.text() || 'Học tiếng Anh mới nào!',
    icon: '/song-ngu-cho-be/images/icon-192.png',
    badge: '/song-ngu-cho-be/images/icon-192.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '1'
    }
  };
  
  event.waitUntil(
    self.registration.showNotification('Song Ngữ Cho Bé', options)
  );
});

// 🟢 Hàm xử lý click vào notification
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked');
  
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        if (clientList.length > 0) {
          const client = clientList[0];
          client.focus();
        } else {
          clients.openWindow('/song-ngu-cho-be/');
        }
      })
  );
});