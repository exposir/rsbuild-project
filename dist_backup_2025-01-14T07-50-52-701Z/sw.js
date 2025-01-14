// sw.js
self.addEventListener("install", (event) => {
  console.log("Service Worker 安装成功");
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker 激活成功");
});

self.addEventListener("fetch", (event) => {
  console.log("拦截到请求：", event.request.url);
});
