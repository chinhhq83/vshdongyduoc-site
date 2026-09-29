// VSH – tiện ích chung
document.addEventListener('DOMContentLoaded', function () {
  // Năm hiện tại trong footer
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
  // Gỡ service worker cũ và bộ đệm của nó
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function (regs) {
      regs.forEach(function (r) { r.unregister(); });
    }).catch(function () {});
  }
  if (window.caches) {
    caches.keys().then(function (keys) { keys.forEach(function (k) { caches.delete(k); }); }).catch(function () {});
  }
});
