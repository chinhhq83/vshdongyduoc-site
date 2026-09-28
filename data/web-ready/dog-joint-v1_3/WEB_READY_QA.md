# WEB_READY QA — DOG JOINT V1.3

## Source audit
- Input rows: **208**
- Unique ASINs: **208**
- Product name / brand / form / description / price / rating / review count / Amazon URL: **208/208**
- Recent-purchase signal: **191/208**
- Ingredient source: structured **159**, context-only **47**, not found **2**
- Source run IDs: stage2_2026-09-12T03-26-58-612Z_i4yb41

## Price tier
- Version: `PRICE_TIER_V1_3`
- Method: campaign terciles
- Exact thresholds: P33=$23.09; P67=$35.99
- Public ranges: Low ≤$23.09; Medium $23.10–$35.99; High ≥$36.00
- Reproducible: **PASS**

## Customer popularity
- Version: `POPULARITY_V1_3`
- Formula: 45% recent purchase + 35% review volume + 20% rating
- Log/min-max normalization for purchase/review volume; absolute 1–5 normalization for rating
- Full-input ranks: **191/208**
- Explicit unavailable state: **17/208**
- Raw scoring inputs isolated under `private_internal/DO_NOT_DEPLOY`: **PASS**
- Public raw rating/review/sales exposure: **PROHIBITED**

## Scientific evidence
- Evidence entities reviewed: **8**
- Products mapped to one or more reviewed ingredient/formula entities: **203/208**
- Not assessed: **3**
- Medication-specific verification required: **2**
- Citations: PubMed/DOI traceability included
- Limitation that ingredient evidence ≠ product proof: **PASS**

## Display completeness
- Data-ready product rows: **205**
- Blocked rows: **3**
- B0009YS9RS — BLOCKED_NON_NUTRACEUTICAL_MEDICATION_REVIEW_REQUIRED — Nutri-Vet Dog Aspirin, Aspirin Tablets for Large Dogs, 300mg, 75 Count
- B0BHBNLNM1 — BLOCKED_INGREDIENT_NOT_FOUND — Advanced Soft Chews Hip and Joint Support Supplement for Small Dogs - 60 Count by Virbac
- B0BHC99KGY — BLOCKED_INGREDIENT_NOT_FOUND — Advanced Soft Chews Hip and Joint Support Supplement for Medium Dogs - 60 Count by Virbac

Context-only ingredient rows are explicitly labeled as listing mentions and are not represented as a complete ingredient panel.

## Search/AI authority
- Evidence pages include answer-first synthesis, citations, limitations and methodology/correction links: **PASS**
- Verified publisher/reviewer identity: **BLOCKED / NOT SUPPLIED**
- Working contact/correction route: **BLOCKED / NOT SUPPLIED**

## Analytics
- Event specification prepared: **PASS**
- Provider/property/consent configuration: **PENDING TARGET-SITE CONFIGURATION**
- Production `page_view` + `amazon_click` verification: **NOT RUN**

## Render/deployment
- Dataset QA: **PASS WITH BLOCKERS**
- Rendered HTML/JS QA: **NOT RUN**
- Production deployment: **BLOCKED**

# PACKAGE STATUS: NOT_READY_FOR_CODEX

Hard blockers:
1. Verified VSH publisher/reviewer/contact identity and working correction/contact route were not supplied.
2. Blocked source rows must not render as normal comparison products.
3. Target-site analytics configuration and rendered HTML/JS QA have not been performed.
4. Deployment target/build/deploy commands remain target-specific and parameterized.


## Authority research article update — 2026-09-14
- Brand-popularity table included at product-family level: **PASS**
- Scientific evidence V3 table included: **PASS**
- Popularity and scientific evidence kept separate: **PASS**
- Association wording does not claim causation: **PASS**
- "Most popular" remains cohort-bounded, not "best brand": **PASS**
- Methodology and limitations included: **PASS**
- Production publisher/reviewer identity and working correction route: **STILL BLOCKED**
- Local browser/render review: **NOT RUN**
