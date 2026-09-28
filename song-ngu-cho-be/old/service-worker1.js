// Định nghĩa cache names ở đầu file
const CACHE_NAME = 'english-vocabulary-v1';
const STATIC_CACHE_NAME = 'english-vocabulary-static-v1';

self.addEventListener('install', event => {
  console.log('[SW] Installing...');
  event.waitUntil(
    (async () => {
      // Cache static assets first
      const staticCache = await caches.open(STATIC_CACHE_NAME);
      await staticCache.addAll([
        '/song-ngu-cho-be/',
        '/song-ngu-cho-be/index.html',
        '/song-ngu-cho-be/app-stt.js',
        '/song-ngu-cho-be/words.json',
        '/song-ngu-cho-be/images/icon-512.png',
        '/song-ngu-cho-be/sounds/success.mp3',
        '/song-ngu-cho-be/sounds/well_done.mp3',
        '/song-ngu-cho-be/sounds/please_try_again.mp3'
      ]);

      // Then cache images from words.json
      await cacheImagesFromWordsJSON();
    })()
  );
});

async function cacheImagesFromWordsJSON() {
  try {
    const response = await fetch('/song-ngu-cho-be/words.json');
    const data = await response.json();
    
    let allWords = [];
    
    // Xử lý cả 2 cấu trúc dữ liệu
    if (data.learning_modes) {
      // Cấu trúc mới
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
      // Cấu trúc cũ
      data.topics.forEach(topic => {
        if (topic.words) allWords = allWords.concat(topic.words);
      });
    }
    
    console.log('[SW] Found words for caching:', allWords.length);
    
    const imageUrls = allWords.map(word => word.image).filter(url => url);
    const uniqueUrls = [...new Set(imageUrls)]; // Remove duplicates
    
    console.log('[SW] Caching images:', uniqueUrls);
    
    const cache = await caches.open(CACHE_NAME);
    
    // Thay vì dùng addAll (sẽ fail nếu có bất kỳ lỗi nào), dùng Promise.all với catch riêng
    const cachePromises = uniqueUrls.map(async (url) => {
      try {
        const response = await fetch(url);
        if (response.ok) {
          await cache.put(url, response);
          console.log('[SW] Successfully cached:', url);
        } else {
          console.warn('[SW] Failed to cache (non-200 response):', url, response.status);
        }
      } catch (error) {
        console.warn('[SW] Failed to cache (network error):', url, error.message);
      }
    });
    
    await Promise.all(cachePromises);
    
    console.log('[SW] Completed image caching process');
  } catch (error) {
    console.error('[SW] Failed to cache images from words.json', error);
  }
}