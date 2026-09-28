# DOG_JOINT — Popularity vs Scientific Evidence Multivariable Analysis V2

## Objective
Test whether scientific-evidence support is associated with Amazon popularity after accounting for major observable market factors: price, product form and brand.

## Analytical unit
The analysis starts from 208 ASINs, 191 with complete popularity inputs. A conservative product-family deduplication groups only records with the same brand, the same positive review-count signal, and normalized-title Jaccard similarity ≥0.70.

- All source ASINs: **208**
- Ranked ASINs: **191**
- Conservative product families: **188**
- Ranked families used in regression: **171**

This family reconstruction is analytical, not an upstream verified Amazon parent-child mapping.

## Outcome
Popularity score V1.3:
- 45% recent-purchase signal
- 35% review-volume signal
- 20% star rating

Higher score = more popular within this captured cohort.

## Main evidence predictor
`supportive_any = TRUE` when the family contains at least one mapped ingredient/formula cluster currently classified as `VERIFIED_SUPPORTIVE`:
- omega-3 / fish oil
- green-lipped mussel
- UC-II / undenatured type II collagen

This is an exploratory family-level evidence indicator, not a formal evidence grade for the commercial product.

## Main result: brand explains much of the apparent evidence association

### Model 1 — evidence + price + form
Supportive-evidence coefficient:
- **-5.86 popularity-score points**
- p = **0.031**
- R² = **0.128**

Before controlling for brand, supportive-ingredient families appear somewhat less popular.

### Model 2 — evidence + price + form + brand
Supportive-evidence coefficient:
- **-3.94 points**
- 95% CI: **-8.79 to 0.90**
- p = **0.111**
- R² = **0.323**

After brand adjustment, the evidence association becomes smaller and is not statistically conclusive.

**Interpretation:** the data do not support an independent popularity advantage for products containing supportive-evidence ingredient clusters. Brand composition explains a substantial part of the observed popularity differences.

## Brand effect
Family-level median popularity scores:

- **Nutramax Laboratories**: n=12, median=78.7
- **Zesty Paws**: n=7, median=67.5
- **STRELLALAB**: n=9, median=58.7
- **Wuffes**: n=9, median=54.7
- **Other**: n=134, median=53.7

The adjusted model uses Nutramax Laboratories as the reference brand category. Compared with Nutramax, the pooled `Other` brands have a substantially lower adjusted popularity score in this dataset. This is an association, not proof that brand itself causes purchases.

## Product form
Family-level median popularity scores:

- **TABLET**: n=18, median=62.9
- **CHEW**: n=126, median=56.0
- **Other**: n=8, median=54.8
- **LIQUID**: n=7, median=49.9
- **POWDER**: n=12, median=44.2

In the full cluster model, TABLET format is associated with about **7.1** higher score points versus CHEW after adjustment (p=0.032). Other form contrasts are not conclusive.

## Price
Log price is not materially associated with popularity after adjustment:
- coefficient = **1.52**
- p = **0.494**

Within this cohort, price alone does not explain much of the popularity variation once brand/form are included.

## Ingredient-cluster model
A model including individual ingredient clusters plus price, form and brand has R² = **0.399**.

Notable adjusted associations:
- **Omega-3 / fish oil**: coefficient 1.85, p=0.406
- **Green-lipped mussel**: coefficient -4.09, p=0.091
- **UC-II**: coefficient -4.23, p=0.406
- **Glucosamine/chondroitin**: coefficient 4.11, p=0.427
- **Boswellia/turmeric/curcumin**: coefficient -5.89, p=0.025
- **MSM/hyaluronic acid**: coefficient -6.49, p=0.098
- **ASU**: coefficient -6.94, p=0.498

The Boswellia/turmeric/curcumin indicator is negatively associated with popularity in this particular adjusted model, but this should be treated as exploratory because ingredient clusters overlap, some clusters are small, and product formulas are not randomized.

## What this analysis supports
1. Popularity and scientific evidence should remain separate website dimensions.
2. Brand is a major observed correlate of popularity in this dog-joint cohort.
3. The apparent popularity disadvantage for supportive-evidence ingredients weakens after brand adjustment.
4. Price is not a strong independent popularity predictor in the current family-level model.
5. Product form may matter, especially tablet versus chew, but this requires replication.

## What it does NOT support
- It does not prove brand causes popularity.
- It does not prove supportive ingredients reduce sales.
- It does not rank commercial products by clinical effectiveness.
- It does not establish causal effects of price, form or formula.
- It does not replace verified Amazon parent/variation relationships.

## Publication recommendation
A defensible public conclusion is:

> In this captured dog-joint comparison, customer popularity and scientific evidence did not move together in a consistent way. Brand and product presentation appeared more strongly related to popularity than whether a formula contained an ingredient cluster with supportive canine evidence.

Use this only with a visible methodology/limitations section.

## Next step
For V3, improve causal interpretability by adding:
- verified Amazon `product_family_id` / parent ASIN;
- product age / first-available date;
- sponsorship/advertising visibility if available;
- serving cost rather than package price;
- formula dose/applicability;
- a formal evidence-strength score based on study design, species relevance, directness and consistency.
