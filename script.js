// VSH – tiện ích chung
document.addEventListener('DOMContentLoaded', function () {
  // Cuộn mượt cho anchor nội trang
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
  // Đăng ký service worker (PWA)
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(function () {});
  }
  // Năm hiện tại trong footer
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
});

// Vercel Web Analytics: đo lường ẩn danh, không đặt cookie và không lập hồ sơ cá nhân.
(function () {
  if (document.querySelector('script[data-vsh-analytics]')) return;
  var analytics = document.createElement('script');
  analytics.defer = true;
  analytics.src = '/_vercel/insights/script.js';
  analytics.dataset.vshAnalytics = 'anonymous';
  document.head.appendChild(analytics);
})();
