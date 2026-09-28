# LOCAL WEBSITE REVIEW — DOG JOINT V1.3

Use this before any production deployment.

## Goal
Review the local implementation for:
1. comparison-table completeness;
2. research/article rendering;
3. evidence/source separation;
4. contact/trust routes;
5. analytics instrumentation;
6. SEO/search-AI metadata;
7. restricted-data leakage.

## Expected comparison columns
`Product | Ingredients / Form | Product focus | Price tier | Customer popularity | Scientific evidence | Amazon`

## Required authority article
Render:
`/dog-joint/research/popularity-brand-scientific-evidence/`

It must include the brand table, scientific-evidence table, methodology, limitations, internal links, last-reviewed date, approved publisher/reviewer attribution, and correction/contact route.

## 1. Static precheck
From the handoff `deployment` directory:

```powershell
.\REVIEW_LOCAL.ps1 `
  -SitePath "G:\vshdongyduoc-site\vsh-landing-site" `
  -HandoffPath ".."
```

## 2. Build the existing website
Example only:

```powershell
cd G:\vshdongyduoc-site\vsh-landing-site
npm run build
```

Use the repository-defined build command if different.

## 3. Start local preview
Use the repository-defined command, for example:

```powershell
npm run dev
```

or:

```powershell
npm run preview
```

## 4. Browser review routes
Review desktop and mobile:
- `/dog-joint/`
- 3–5 representative product pages
- all dog-joint evidence cluster pages
- `/dog-joint/research/popularity-brand-scientific-evidence/`
- `/scientific-methodology/`
- `/how-we-evaluate-products/`
- `/editorial-policy/`
- `/contact/`
- `/privacy/`
- `/affiliate-disclosure/`

## 5. Comparison-page checks
Confirm:
- rendered row count equals intended public-ready count;
- blocked products do not render as normal rows;
- required cells are non-empty;
- product includes brand;
- ingredient/context-only status is not overstated;
- price ranges match `PRICE_TIER_DEFINITION.json`;
- popularity is not labeled Amazon BSR, quality, efficacy or recommendation;
- scientific evidence is independent from popularity;
- evidence links and Amazon links resolve.

## 6. Authority-article wording checks
The article must NOT say:
- "best brand";
- brand causes popularity;
- popular products work better;
- scientifically supported products sell less;
- scientific evidence proves the exact product works.

It MAY say:
- brand is strongly **associated** with popularity in this captured cohort;
- popularity and scientific evidence did not show a consistent positive relationship;
- analysis is observational;
- family deduplication is analytical rather than verified Amazon parent lineage.

## 7. Restricted-data leakage
Public HTML/JS/JSON must not expose:
- raw `rating_value`;
- raw `review_count`;
- raw `bought_past_month*`;
- internal popularity score/components;
- private analysis files;
- raw review text/quotes.

Example static-output scan:

```powershell
Get-ChildItem -Recurse -File .\dist,.\build,.\out -ErrorAction SilentlyContinue |
  Select-String -Pattern 'rating_value|review_count|bought_past_month|customer_popularity_score'
```

## 8. SEO / search-AI readiness
Confirm:
- unique title/meta;
- canonical;
- one clear H1;
- crawlable body text;
- internal links;
- sitemap inclusion;
- visible citations and limitations;
- last reviewed/updated;
- publisher/reviewer identity;
- methodology/editorial links.

Do not add Product/Offer/AggregateRating schema from incomplete/unlicensed Amazon data.

## 9. Contact / corrections
Confirm:
- `/contact/` loads;
- general inquiry works;
- scientific/editorial correction works;
- newer-study reporting path works;
- no fabricated email/person/address is shown.

## 10. Analytics
Verify hooks:
- `page_view`
- `product_detail_view`
- `evidence_page_view`
- `amazon_click`
- `full_analysis_click`
- `filter_used`
- `contact_submit`

Do not send raw rating/review/recent-sales values as event parameters.

## 11. Mobile/accessibility
Check:
- table/cards usable on mobile;
- evidence brief readable;
- descriptive link/button text;
- keyboard focus;
- table headers;
- image alt text where used.

## PASS criteria
PASS only when dataset count and rendered count align, blocked products are handled, all required fields render, authority article is correct, links work, contact works, analytics hooks are present, metadata/sitemap are correct, and restricted-data leakage scan passes.

**Build success alone is not PASS.**
