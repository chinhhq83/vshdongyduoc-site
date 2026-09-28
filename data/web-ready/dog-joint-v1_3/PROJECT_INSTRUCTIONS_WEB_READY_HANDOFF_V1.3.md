# PROJECT INSTRUCTIONS — WEB_READY_HANDOFF V1.3

## Purpose
Convert approved Amazon/Affiliate data into public-safe, consumer-readable, evidence-bounded, search/AI-ready web resources plus deployment/analytics handoff for the VSH website.

V1.3 has 4 jobs: (1) web presentation resources; (2) independent scientific evidence; (3) authoritative/citable search-AI source readiness; (4) contact, analytics, QA and deployment guidance/scripts.

Pipeline: `Amazon Scraper → Affiliate Analysis → WEB_READY Evidence → Publication/Authority Assets → Codex/PowerShell → Website → Monitoring`.

## Source ownership
Amazon publication source owns listing truth, provenance/completeness and captured popularity inputs. Affiliate Analysis owns qualification/buyer interpretation. Scientific evidence is independent from listing/reviews. WEB_READY owns public presentation, price tiers, popularity rank, evidence synthesis, SEO/AISO, authority/trust, analytics requirements, publication decision and deployment resources.

STOP if lineage, provenance, capture status, identity, display completeness or evidence traceability cannot be established.

## Comparison model
Use:
`Product | Ingredients / Form | Product focus | Price tier | Customer popularity | Scientific evidence | Amazon`

- Product = verified product name + brand.
- Ingredients/Form = key listed ingredients + form; never infer missing ingredients.
- Product focus = concise bounded paraphrase of Amazon listing description/bullets.
- Price tier = Low/Medium/High + explicit campaign range.
- Customer popularity = approved derived rank from rating + review count + recent-purchase/sales signal.
- Scientific evidence = controlled status + 1–2 sentence synthesis + full-analysis link.
- Amazon = approved product destination.

## Customer popularity
Score reproducibly from `rating_value`, `review_count`, and recent-purchase/sales signal. Log/normalize skewed counts. Default: `45% recent purchase + 35% review volume + 20% rating`.

Create score, rank, version, basis, confidence and captured-at fields.

Meaning: relative popularity within this comparison only; NOT quality, efficacy, scientific strength, VSH recommendation or Amazon BSR. Raw inputs stay private by default; approved derived rank may be public.

## Price tiers
Define per campaign from captured cohort prices. Default: quantile/tercile thresholds → preserve exact thresholds → optionally round display thresholds → document method/version. UI must show ranges, e.g. `Low (<$20)`, `Medium ($20–$35)`, `High (>$35)`. Do not reuse thresholds across campaigns without approval.

## Scientific evidence
Research ingredient/formula clusters first, then map to ASINs. Prefer species-relevant clinical evidence. Statuses: `VERIFIED_SUPPORTIVE | MIXED | INSUFFICIENT | VERIFICATION_REQUIRED | NOT_ASSESSED`.

Every scientific claim needs traceable citations and limitations. Ingredient/formula evidence ≠ proof the exact product works; human evidence ≠ dog evidence; mechanistic evidence ≠ clinical outcome evidence.

## Search/AI source readiness
Goal: make VSH an authoritative, citable source candidate for search/AI systems; never promise ranking, citation or recommendation.

Each indexable page should include where applicable: answer-first summary; clear entity/intent; citations; source-separated claims; limitations; author/reviewer/publisher; last reviewed/updated; methodology/editorial links; canonical; crawlable semantic text; internal links; sitemap; supported structured data only.

Maintain trust pages where applicable: About, Scientific Methodology, Editorial Policy, How We Evaluate Products, Authors/reviewer identity, Contact, Privacy, Affiliate Disclosure, and relevant disclaimer/terms.

## Contact and corrections
A working Contact route is required: contact method/form, general inquiry, scientific/editorial correction path and affiliate/business inquiry as appropriate. Evidence pages should link to correction/new-study reporting.

Do not fabricate organization details, addresses, emails or people. Use supplied site identity/contact data or parameterize/stop.

## Analytics / visitor tracking
Production should support privacy-aware analytics. Minimum events where applicable: `page_view, product_detail_view, evidence_page_view, amazon_click, full_analysis_click, filter_used, contact_submit`; track traffic, landing pages, Amazon/evidence CTR and search impressions/clicks.

Visitor tracking is primarily internal; no public counter unless requested. Do not expose personal data; respect applicable consent/privacy requirements.

## Public schema
Minimum `WEB_READY_PRODUCTS.csv/json`:
`asin, product_name, product_name_status, brand, slug, target_url, ingredient_display, form_display, product_focus, price_tier, price_tier_display, customer_popularity_rank, customer_popularity_confidence, scientific_evidence_status, scientific_evidence_brief, scientific_evidence_url, amazon_url, affiliate_url, affiliate_enabled, seo_title, meta_description, page_summary, source_run_id, source_status, content_status`.

## Public safety
Do not expose raw rating values, review counts/text/quotes, raw recent-sales/bought-past-month values, review/demand percentiles, review-derived metrics or internal score components unless separately approved. Scan public CSV/JSON/Markdown and rendered HTML/JS. No Product/Offer/AggregateRating schema from incomplete/unlicensed Amazon data.

## Package
Create `WEB_READY_HANDOFF_<CAMPAIGN>_V1_3/` with:
- `web_data/WEB_READY_PRODUCTS.csv/json`, `PRICE_TIER_DEFINITION.json`, `POPULARITY_RANKING.json`
- `evidence/SCIENTIFIC_EVIDENCE_MATRIX.csv`, `evidence_pages/`, `citations.json`
- `authority/SOURCE_AUTHORITY_REQUIREMENTS.md`, `TRUST_PAGES_PLAN.md`, `SEARCH_AI_READINESS.json`
- `analytics/ANALYTICS_PLAN.md`, `ANALYTICS_EVENTS.json`, `POST_DEPLOY_MONITORING.md`
- `articles/<ASIN>.md`
- `deployment/CODEX_HANDOFF.md`, `DEPLOY.ps1`, `VERIFY_WEB.ps1`, `DEPLOYMENT_README.md`
- `WEB_READY_MANIFEST.json`, `WEB_READY_QA.md`, `README.md`

## QA hard gates
Before `READY_FOR_CODEX`, verify: cohort/count/ASIN uniqueness; lineage/provenance/capture; identity and ingredient/form; product_focus fidelity; reproducible price tiers; reproducible popularity formula/version/coverage using rating+reviews+recent-purchase signal or documented missing-data policy; no restricted raw public inputs; traceable science; valid Amazon links; title/meta/canonical/slugs/internal links; authority/trust plan; contact requirements; analytics config.

Strict comparison fields: Product+brand; Ingredients/Form; Product focus; Price tier+range; Customer popularity rank or explicit unavailable state; Scientific status+brief+full-analysis link; Amazon destination.

Validate datasets and rendered HTML/JS; build success alone is not PASS. Post-deploy verify rows/pages/links, contact, analytics `page_view` + `amazon_click`, sitemap/canonical/meta and leakage. Hard-gate failure → `NOT_READY_FOR_CODEX` or deploy blocked.

## Deployment boundary
Prepare reviewable scripts: `precheck → integrate → build → targeted tests → render QA → analytics/contact checks → stop on failure → deploy → post-deploy verification`. Unknown target/environment → parameterize.

Codex must not redo analysis, select products, research Amazon data, infer missing facts, create claims, redefine formulas, expose restricted raw data or change approved meaning. Codex may integrate/render approved assets, update sitemap/internal links, test and deploy.

## Stop conditions
STOP rather than guess when source lineage is unclear; required provenance/identity/ingredient/form is missing; popularity or price tiers cannot be reproduced; scientific evidence cannot be verified; authority/citation metadata is materially incomplete; required contact identity is unavailable; restricted data would leak; render completeness fails; analytics/contact verification fails; or deployment acceptance criteria conflict.
