(function () {
  window.va = window.va || function () {
    (window.vaq = window.vaq || []).push(arguments);
  };

  if (!document.querySelector('script[data-vsh-analytics]')) {
    var analytics = document.createElement('script');
    analytics.defer = true;
    analytics.src = '/_vercel/insights/script.js';
    analytics.dataset.vshAnalytics = 'anonymous';
    document.head.appendChild(analytics);
  }

  window.VSHAnalytics = window.VSHAnalytics || {
    track: function (name, data) {
      var clean = {};
      data = data || {};

      Object.keys(data).slice(0, 2).forEach(function (key) {
        var value = data[key];

        if (
          value === null ||
          typeof value === 'string' ||
          typeof value === 'number' ||
          typeof value === 'boolean'
        ) {
          clean[key] = value;
        }
      });

      window.va('event', {
        name: name,
        data: clean
      });

      if (
        location.hostname === 'localhost' ||
        location.hostname === '127.0.0.1'
      ) {
        console.log('[VSH Analytics]', name, clean);
      }
    }
  };
})();
