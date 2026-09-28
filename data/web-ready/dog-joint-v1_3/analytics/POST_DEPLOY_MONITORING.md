# POST-DEPLOY MONITORING

Verify after each production release:
1. rendered product row/page count;
2. required comparison cells are non-empty;
3. product, evidence and Amazon links resolve;
4. canonical/meta/sitemap entries exist;
5. contact and correction routes work;
6. `page_view` fires;
7. `amazon_click` fires once per click and does not leak restricted source data;
8. no raw rating/review/recent-sales values appear in public CSV/JSON/HTML/JS;
9. search indexing and impressions are monitored;
10. evidence pages are reviewed when important new studies appear.
