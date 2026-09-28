(function () {
  const campaign = 'dog_skin_coat';

  function track(name, data) {
    if (window.VSHAnalytics) window.VSHAnalytics.track(name, data);
  }

  document.addEventListener('DOMContentLoaded', function () {
    const rows = Array.from(document.querySelectorAll('[data-product-row]'));
    const search = document.getElementById('q');
    const filters = Array.from(document.querySelectorAll('[data-filter]'));
    const count = document.getElementById('count');

    function render() {
      const query = search.value.toLowerCase().trim();
      let visible = 0;
      rows.forEach(function (row) {
        const matchesSearch = !query || row.dataset.search.includes(query);
        const matchesFilters = filters.every(function (filter) {
          return !filter.value || row.dataset[filter.dataset.filter] === filter.value;
        });
        row.hidden = !(matchesSearch && matchesFilters);
        if (!row.hidden) visible += 1;
      });
      count.textContent = `Showing ${visible} of ${rows.length} products`;
    }

    track('page_view', { campaign: campaign });
    search.addEventListener('input', render);
    filters.forEach(function (filter) {
      filter.addEventListener('change', function () {
        render();
        track('filter_used', { campaign: campaign, filter: filter.dataset.filter });
      });
    });
    document.querySelectorAll('[data-analytics-event]').forEach(function (link) {
      link.addEventListener('click', function () {
        track(link.dataset.analyticsEvent, { campaign: campaign, asin: link.dataset.asin });
      });
    });
  });
})();
