# CODEX HANDOFF — DOG JOINT V1

## GOAL
Integrate the approved WEB_READY dog-joint comparison package into the existing VSH website.

## READ
- WEB_READY_PRODUCTS.csv / JSON
- articles/*.md
- SCIENTIFIC_EVIDENCE_MATRIX.csv
- WEB_READY_QA.md
- WEB_READY_MANIFEST.json
- BLOCKED_PRODUCTS_DO_NOT_DEPLOY.csv

## MODIFY
Only the existing dog-joint comparison/detail routes, sitemap, and related internal links needed for this integration.

## DO NOT TOUCH
Do not re-analyze products, research Amazon data, alter scientific conclusions, restore blocked ASINs, add review/rating/demand data, or redesign unrelated site areas.

## EXPECTED PUBLIC COUNT
Render exactly **64** comparison rows.

## RENDER QA
For every row verify non-empty:
Product name; Brand/ASIN context; Formula; Form; Primary customer need; VSH assessment; Price tier; Scientific evidence status; Details link; Amazon destination.

Verify every details route resolves and each detail page renders its supplied sections.

## STOP CONDITIONS
Stop before inventing missing facts, changing cohort membership, adding dependencies, changing scientific meaning, or publishing anything from `BLOCKED_PRODUCTS_DO_NOT_DEPLOY.csv`.

## REPORT
CHANGED FILES → WHAT CHANGED → TESTS RUN → RESULTS → REMAINING ISSUES.
