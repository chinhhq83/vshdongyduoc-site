# SKILL — WEB_READY_HANDOFF V1.3

## Mission
Transform validated Amazon publication data + Affiliate Analysis + independently researched scientific evidence into deterministic public web resources, authority/search-AI assets, analytics requirements and a safe deployment handoff.

Use with `PROJECT_INSTRUCTIONS_WEB_READY_HANDOFF_V1.3.md`.

## 1. Four primary jobs
1. Prepare website presentation resources.
2. Search, verify, synthesize and map scientific evidence.
3. Prepare authoritative/citable source assets for search and AI systems.
4. Prepare contact/trust, analytics and deployment instructions/scripts with hard-gate verification.

## 2. Input audit
Record campaign, source run IDs, schema versions, cohort counts, ASIN uniqueness, cross-source coverage, capture/provenance status, ingredient/form coverage, source-price coverage and popularity-input coverage.

STOP for material run conflicts, missing provenance, unresolved identity, insufficient required display fields or ambiguous source status.

## 3. Field ownership
Amazon owns listing facts and captured raw popularity signals. Affiliate Analysis owns qualification/buyer interpretation. Independent evidence owns scientific support. WEB_READY owns public presentation, price tiers, derived customer-popularity rank, evidence synthesis, authority metadata, SEO/AISO, trust/contact assets, analytics requirements, publication decisions and deployment resources.

Never reconstruct missing Amazon facts from downstream analysis.

## 4. Public comparison model
Target columns:
`Product | Ingredients / Form | Product focus | Price tier | Customer popularity | Scientific evidence | Amazon`

### Product
Verified `product_name` + `brand`.

### Ingredients / Form
Use structured ingredients where available. Context mentions must not be presented as a complete ingredient panel.

### Product focus
Short bounded paraphrase from listing description/bullets. Do not turn seller claims into VSH efficacy claims.

### Price tier
Show label + range, e.g. `Medium ($20–$35)`.

### Customer popularity
Use approved derived rank. The score basis must include rating, review count and recent-purchase/sales signal when available.

### Scientific evidence
Show controlled status + 1–2 sentence synthesis + full-analysis link.

### Amazon
Use approved Amazon destination; no unauthorized affiliate tag before activation.

## 5. Price-tier algorithm
Default:
- select captured source prices for the public cohort;
- calculate campaign-relative tercile/quantile thresholds;
- retain exact machine thresholds;
- optionally round display thresholds;
- document method/version.

Fields:
`price_tier, price_tier_display, price_tier_low_upper, price_tier_medium_upper, price_tier_method, price_tier_version, price_captured_at`.

Do not reuse thresholds across campaigns without approval.

## 6. Customer-popularity algorithm
Required source signals where available:
- `rating_value`;
- `review_count`;
- recent-purchase/sales signal such as `bought_past_month`.

Recommended V1.3 default if the user does not specify otherwise:
`45% recent purchase + 35% review volume + 20% rating`.

Rules:
- transform highly skewed count signals using `log(1+x)` or another documented method;
- normalize components within the selected comparison cohort;
- combine only after documenting weights and transformations;
- produce score, rank and confidence;
- version the formula;
- define missing-data handling explicitly;
- never silently treat missing purchase data as zero.

Fields:
`customer_popularity_score, customer_popularity_rank, customer_popularity_score_version, customer_popularity_basis, customer_popularity_confidence, popularity_captured_at`.

Meaning: relative popularity within this comparison. It is not quality, efficacy, scientific strength, recommendation, superiority or Amazon Best Sellers Rank.

## 7. Restricted customer/demand data
Public outputs must not expose raw rating, raw review counts/text/quotes, raw bought-past-month/recent-sales values, review/demand percentiles, review-derived sentiment/features or raw score components unless separately approved.

Default public exception: approved derived `customer_popularity_rank` plus non-sensitive explanatory metadata.

Scan CSV, JSON, Markdown and rendered HTML/JS for leakage.

## 8. Scientific evidence workflow
Research by ingredient/formula cluster first, then map evidence to ASINs.

For each evidence entity record:
- evidence_id;
- ingredient_or_formula;
- species/population;
- decision context;
- study design;
- evidence status;
- concise findings;
- conflicting/negative findings;
- limitations;
- DOI/PMID/URL;
- verified_at.

Map evidence IDs to ASINs with ingredient/formula match and applicability notes.

Controlled statuses:
`VERIFIED_SUPPORTIVE, MIXED, INSUFFICIENT, VERIFICATION_REQUIRED, NOT_ASSESSED`.

Ingredient evidence ≠ proof exact product works. Human evidence ≠ dog evidence. Mechanistic evidence ≠ clinical outcome evidence.

## 9. Scientific public presentation
Comparison cell:
- status;
- 1–2 sentence evidence brief;
- `Full analysis` link.

Evidence/formula page:
- answer-first synthesis;
- ingredient/formula context;
- supportive findings;
- conflicting/negative findings;
- limitations;
- applicability to products;
- traceable citations;
- mapped products;
- author/reviewer/publisher identity;
- last reviewed/updated date;
- correction/new-study contact route.

## 10. Search/AI source-readiness architecture
Goal: make VSH pages high-quality, authoritative, citable source candidates. Never claim or guarantee AI recommendation, citation or ranking.

For each indexable page verify where applicable:
- clear answer-first summary;
- one clear page intent/entity;
- semantic headings and crawlable text;
- source-separated statements: Amazon listing vs VSH analysis vs scientific evidence;
- visible citations supporting scientific claims;
- explicit evidence limitations;
- author/reviewer/publisher attribution;
- last reviewed/updated date;
- canonical URL;
- internal links;
- sitemap inclusion;
- methodology/editorial-policy linkage;
- structured data only if accurate, licensed where required, and consistent with visible content.

Avoid thin pages whose only value is rephrased Amazon copy. Evidence synthesis, source separation, decision structure and transparent methodology are the unique-value layer.

## 11. Trust and authority pages
Prepare a plan/content requirements for:
- About VSH;
- Scientific Methodology;
- Editorial Policy;
- How We Evaluate Products;
- Authors/reviewer identity where applicable;
- Contact;
- Privacy;
- Affiliate Disclosure;
- relevant disclaimer/terms.

Do not invent legal entity names, addresses, emails, people or credentials. Use user-supplied/site-verified identity only.

## 12. Contact and correction flow
Contact route is a hard requirement for production readiness.

Support where appropriate:
- general inquiry;
- scientific/editorial correction;
- report newer evidence;
- product/listing correction;
- affiliate/business inquiry.

Evidence pages should link to the correction path.

## 13. Analytics and visitor tracking
Analytics is primarily for internal measurement; a public visitor counter is not required unless explicitly requested.

Minimum events where applicable:
- `page_view`;
- `product_detail_view`;
- `evidence_page_view`;
- `amazon_click`;
- `full_analysis_click`;
- `filter_used`;
- `contact_submit`.

Recommended KPIs:
- users/sessions/page views;
- landing pages;
- product-detail views;
- evidence-page views;
- Amazon outbound clicks and CTR;
- comparison → Amazon CTR;
- comparison → evidence CTR;
- search impressions/clicks;
- indexation/coverage;
- AI/search-source visibility where the selected search platform exposes such reporting.

Do not expose personal data. Analytics implementation must respect applicable consent/privacy requirements.

## 14. Public schema
Minimum `WEB_READY_PRODUCTS.csv/json`:
`asin, product_name, product_name_status, brand, slug, target_url, ingredient_display, form_display, product_focus, price_tier, price_tier_display, customer_popularity_rank, customer_popularity_confidence, scientific_evidence_status, scientific_evidence_brief, scientific_evidence_url, amazon_url, affiliate_url, affiliate_enabled, seo_title, meta_description, page_summary, source_run_id, source_status, content_status`.

Authority, trust and analytics configuration should normally live in separate assets instead of being repeated on every product row.

## 15. Product detail page
Recommended sections:
1. Quick take;
2. Product identity/form;
3. Listed ingredients;
4. Product focus / listing-derived positioning;
5. Price position and range definition;
6. Popularity context/disclaimer;
7. Scientific evidence brief;
8. Link to full evidence analysis;
9. What evidence does not establish;
10. Directions/warnings where captured;
11. Amazon destination;
12. correction/contact link;
13. back to comparison.

Do not fabricate missing sections.

## 16. SEO/AISO
Create unique slug, target URL, SEO title, meta description, page summary, canonical and internal links for each indexable page. Use crawlable answer-first text and clear publisher identity.

Do not create Product/Offer/AggregateRating schema unless licensing, accuracy, freshness and display policy are explicitly approved.

## 17. Source authority gate
A scientific/evidence page is not publication-ready if required citation traceability, limitations, author/reviewer/publisher attribution, last-reviewed/updated metadata, methodology linkage or correction route is missing.

This gate is about source quality/readiness; it does not guarantee citation by Google or any AI system.

## 18. QA hard gates
Verify:
- cohort/count/ASIN uniqueness;
- source lineage/provenance/capture status;
- identity verification;
- ingredient/form integrity;
- product_focus fidelity;
- reproducible price-tier ranges/method/version;
- reproducible popularity formula/version/coverage;
- popularity uses rating + review count + recent-purchase/sales signal where available, with documented missing-data policy;
- no restricted raw popularity inputs publicly exposed;
- popularity not described as quality/efficacy/recommendation;
- scientific claims traceable and bounded;
- Amazon URL present;
- SEO/canonical/slugs/internal links valid;
- authority/trust-page requirements complete;
- contact requirements complete;
- analytics plan/events complete.

Strict comparison display fields:
- product name + brand;
- ingredients/form;
- product focus;
- price tier + defined range;
- customer popularity rank or explicit allowed unavailable state;
- scientific status + brief + full-analysis link;
- Amazon destination.

Validate datasets and rendered HTML/JS. Build success alone is insufficient.

## 19. Render/post-deploy QA
Verify:
- expected product/page counts;
- non-empty required cells;
- details/evidence/Amazon links;
- canonical/meta/sitemap;
- trust/contact routes;
- correction route where required;
- analytics `page_view` event;
- analytics `amazon_click` event;
- no restricted-data leakage.

Deployment is blocked if required render/observability checks fail.

## 20. Deployment package
Generate:
- `deployment/CODEX_HANDOFF.md`;
- `deployment/DEPLOY.ps1`;
- `deployment/VERIFY_WEB.ps1`;
- `deployment/DEPLOYMENT_README.md`.

Generate or plan:
- `authority/SOURCE_AUTHORITY_REQUIREMENTS.md`;
- `authority/TRUST_PAGES_PLAN.md`;
- `authority/SEARCH_AI_READINESS.json`;
- `analytics/ANALYTICS_PLAN.md`;
- `analytics/ANALYTICS_EVENTS.json`;
- `analytics/POST_DEPLOY_MONITORING.md`.

Scripts must be parameterized when site path/environment is unknown.

Default flow:
`precheck → integrate → build → targeted tests → render QA → contact/analytics checks → stop on failure → deploy → post-deploy verification`.

## 21. Package layout
`WEB_READY_HANDOFF_<CAMPAIGN>_V1_3/`
- `web_data/WEB_READY_PRODUCTS.csv`
- `web_data/WEB_READY_PRODUCTS.json`
- `web_data/PRICE_TIER_DEFINITION.json`
- `web_data/POPULARITY_RANKING.json`
- `evidence/SCIENTIFIC_EVIDENCE_MATRIX.csv`
- `evidence/evidence_pages/`
- `evidence/citations.json`
- `authority/SOURCE_AUTHORITY_REQUIREMENTS.md`
- `authority/TRUST_PAGES_PLAN.md`
- `authority/SEARCH_AI_READINESS.json`
- `analytics/ANALYTICS_PLAN.md`
- `analytics/ANALYTICS_EVENTS.json`
- `analytics/POST_DEPLOY_MONITORING.md`
- `articles/<ASIN>.md`
- `deployment/CODEX_HANDOFF.md`
- `deployment/DEPLOY.ps1`
- `deployment/VERIFY_WEB.ps1`
- `deployment/DEPLOYMENT_README.md`
- `WEB_READY_MANIFEST.json`
- `WEB_READY_QA.md`
- `README.md`

## 22. Codex boundary
Codex must not redo analysis, select/promote products, research Amazon data, infer missing facts, create scientific claims, redefine price/popularity formulas, expose restricted raw data or change approved editorial meaning.

Codex may integrate/render approved assets, implement supplied contact/trust/analytics requirements, preserve routes, update sitemap/internal links, test and deploy.

## 23. Stop conditions
STOP rather than guess when source lineage/provenance is unclear; required identity/ingredient/form is unresolved; price tiers or popularity ranks cannot be reproduced; scientific evidence cannot be verified; source-authority requirements are materially incomplete; required contact identity is unavailable; restricted data would leak; render completeness fails; analytics/contact verification fails; or deployment target/acceptance criteria conflict.

## 24. Completion report
Report source runs, selected cohort/count, public-ready count, identity status, price-tier ranges/method, popularity method/version/coverage, scientific-evidence coverage, source-authority readiness, trust/contact readiness, analytics plan/readiness, sanitizer result, page counts, QA status, render/post-deploy QA status, deployment-resource status, package status and ZIP path.
