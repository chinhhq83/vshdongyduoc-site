# WEB_READY_HANDOFF — DOG JOINT — V1.3

This package applies WEB_READY_HANDOFF V1.3 to **208 dog-joint source products**.

## Main outputs
- Public comparison/product dataset with product+brand, ingredients/form, product focus, price tier/range, customer popularity rank, scientific evidence brief/link and Amazon destination.
- Campaign-specific price-tier definition.
- Reproducible popularity ranking from rating + review volume + recent-purchase signal.
- Ingredient/formula-first scientific evidence matrix, evidence pages and citations.
- Search/AI source-authority requirements and trust-page plan.
- Analytics event/KPI plan.
- Parameterized PowerShell verification/deployment handoff.

## Current status
**NOT_READY_FOR_CODEX / production deploy blocked.**

The data/evidence transformation is prepared, but production requires approved contact/publisher identity, target-site analytics configuration, and rendered HTML/JS QA. See `WEB_READY_QA.md`.

## Public safety
Do not deploy `private_internal/`. Raw rating, review count and bought-past-month inputs are intentionally excluded from `WEB_READY_PRODUCTS.csv/json`.


## Authority research addition — 2026-09-14
Added:
- `authority/articles/DOG_JOINT_POPULARITY_BRAND_SCIENCE.md`
- `authority/research/` V2/V3 analytical artifacts
- `deployment/LOCAL_WEB_REVIEW.md`
- `deployment/REVIEW_LOCAL.ps1`

The research article explains the observed association between brand and customer popularity and the lack of a consistent positive relationship between popularity and scientific-evidence strength. It is educational decision support, not a "best brand" recommendation.
