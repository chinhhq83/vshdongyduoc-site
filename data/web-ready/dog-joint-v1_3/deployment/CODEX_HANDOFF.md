# CODEX HANDOFF — DOG JOINT V1.3

## GOAL
Integrate only approved WEB_READY assets into the existing VSH site, implement the comparison/product/evidence routes, trust/contact/analytics requirements, run target-specific render QA, and deploy only after all hard gates pass.

## READ
- `web_data/WEB_READY_PRODUCTS.json`
- `web_data/PRICE_TIER_DEFINITION.json`
- `web_data/POPULARITY_RANKING.json`
- `evidence/SCIENTIFIC_EVIDENCE_MATRIX.csv`
- `evidence/evidence_pages/`
- `authority/`
- `analytics/`
- `WEB_READY_QA.md`

## COMPARISON UI
`Product | Ingredients / Form | Product focus | Price tier | Customer popularity | Scientific evidence | Amazon`

Customer popularity must show only approved derived rank/display state; do not expose raw rating, review count, bought-past-month or score components.

## MODIFY
Integrate public-ready rows only; add internal product/evidence routes, canonical/meta/sitemap/internal links, contact/correction route and analytics events.

## DO NOT TOUCH
Do not redo product selection, Amazon research, scientific research, price tiers, popularity formula/ranks, or editorial meaning. Do not infer missing ingredients or expose `private_internal/`.

## TEST / VERIFY
Dataset + rendered row/page counts; required cells; product/evidence/Amazon links; contact/correction routes; `page_view` + `amazon_click`; canonical/meta/sitemap; restricted-data leakage.

## ACCEPTANCE
All WEB_READY hard gates pass and site-specific render/post-deploy verification is complete.

## STOP
Stop before deploy if contact identity is not approved, analytics is unconfigured, blocked rows are rendered, build/render QA fails, or restricted data is exposed.


## AUTHORITY / RESEARCH ARTICLE
Integrate `authority/articles/DOG_JOINT_POPULARITY_BRAND_SCIENCE.md` as an indexable research/explainer page.
Preserve the supplied analytical meaning. Do not rename it as a "best brands" article or convert association into causation.
Link it from the dog-joint comparison page and relevant methodology/evidence/product content.

## LOCAL REVIEW
Before production deploy, run `deployment/REVIEW_LOCAL.ps1` and follow `deployment/LOCAL_WEB_REVIEW.md`.
Build success alone is not PASS.
