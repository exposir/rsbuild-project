// sw.js

// 定义缓存名称
const CACHE_NAME = "my-site-cache-v1";

// 需要缓存的资源列表
const urlsToCache = [
  "/", // 根路径，通常对应 index.html
  "/index.html", // 显式列出 index.html（以防根路径不默认到 index.html）
];

// 安装事件：预缓存资源
self.addEventListener("install", (event) => {
  console.log("Service Worker 安装中...");
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("缓存打开");
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log("Service Worker 安装成功");
      })
  );
});

// 激活事件：清理旧缓存
self.addEventListener("activate", (event) => {
  console.log("Service Worker 激活中...");
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log("Service Worker: 清理旧缓存 " + cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log("Service Worker 激活成功");
      })
  );
});

// 拦截请求并从缓存中响应
self.addEventListener("fetch", (event) => {
  // 检查请求 URL 是否包含 "static"
  if (event.request.url.includes("static")) {
    console.log("拦截到静态资源请求：", event.request.url);
    event.respondWith(
      caches.match(event.request).then((response) => {
        // 如果在缓存中找到响应，则返回缓存的版本
        if (response) {
          console.log("从缓存中返回：", event.request.url);
          return response;
        }
        // 如果缓存中没有，则从网络获取
        console.log("从网络获取：", event.request.url);
        return fetch(event.request).then((response) => {
          // 检查是否是有效的响应
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }

          // 克隆响应，因为响应是流，只能使用一次
          var responseToCache = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        });
      })
    );
  } else {
    // 对于非静态资源的请求，直接从网络获取
    console.log("非静态资源请求，直接从网络获取：", event.request.url);
    return fetch(event.request);
  }
});
