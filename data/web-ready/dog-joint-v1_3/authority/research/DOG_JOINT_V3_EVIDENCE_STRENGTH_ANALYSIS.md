# DOG_JOINT — Evidence Strength Model V3

## Why V3
V3 separates **evidence certainty** from **net support**. High certainty means the evidence base is comparatively mature and interpretable; it does not automatically mean that the ingredient is effective.

## V3 scoring
Each evidence record receives up to 100 points:
- study design: 30
- canine/species relevance: 20
- directness to the ingredient/formula: 20
- clinical/objective outcomes: 15
- sample breadth: 15

Cluster certainty combines:
- 60% quality of the highest-quality evidence records
- 25% replication breadth
- 15% directional consistency

`net_support_index` is a quality-weighted direction score from -100 to +100.

### Directness safeguard
Certainty is capped when:
- only one evidence record exists;
- evidence is experimental canine evidence only;
- fewer than two direct clinical records exist and there is no cluster-level review;
- multi-ingredient/indirect evidence dominates.

This prevents an RCT of a combination product from being misrepresented as strong evidence for every ingredient in that combination.

## Evidence-cluster results

| Cluster | Certainty | Net support | V3 interpretation |
|---|---:|---:|---|
| omega3 | 89.0/100 | 100.0 | HIGH_CERTAINTY_SUPPORTIVE |
| glucosamine_chondroitin | 87.6/100 | -63.2 | HIGH_CERTAINTY_LOW_OR_INCONSISTENT_SUPPORT |
| green_lipped_mussel | 82.0/100 | 82.4 | HIGH_CERTAINTY_SUPPORTIVE |
| ucii | 80.1/100 | 81.8 | HIGH_CERTAINTY_SUPPORTIVE |
| boswellia_turmeric_curcumin | 55.0/100 | 30.4 | MODERATE_CERTAINTY_SUPPORTIVE |
| eggshell_membrane | 55.0/100 | 74.1 | MODERATE_CERTAINTY_SUPPORTIVE |
| msm_hyaluronic_acid | 45.0/100 | 50.0 | LIMITED_SUPPORT |
| asu | 39.5/100 | 50.0 | LIMITED_SUPPORT |

## Interpretation by cluster

- **Omega-3/fish oil:** high-certainty supportive canine evidence, supported by controlled trials and systematic/review-level evidence.
- **Glucosamine/chondroitin:** high-certainty but low/inconsistent support. The evidence base is substantial enough that uncertainty should not be described merely as “not studied”; positive older findings conflict with placebo-controlled trials and reviews that fail to show reliable analgesic benefit.
- **Green-lipped mussel:** comparatively strong supportive signal, but dose/preparation heterogeneity remains important.
- **UC-II:** supportive evidence with a reasonably developed canine literature, but dose/formulation and objective-outcome limitations remain.
- **Eggshell membrane:** supportive signal remains limited because one key newer study is a multi-ingredient formula; certainty is capped by directness.
- **Boswellia/turmeric/curcumin:** mixed-to-limited direct evidence; objective outcomes and combination-formula attribution limit certainty.
- **MSM/oral hyaluronic acid:** limited because evidence located here is principally from multi-ingredient products rather than isolated ingredient trials.
- **ASU:** limited canine clinical certainty because the mapped dog evidence is experimental rather than a client-owned clinical outcome trial.

## Popularity relationship after V3 scoring

- `evidence_certainty_max` vs popularity: Spearman ρ=0.051, p=0.516.
- `evidence_certainty_mean` vs popularity: Spearman ρ=0.077, p=0.320.
- `net_support_max` vs popularity: Spearman ρ=-0.019, p=0.811.
- `net_support_mean` vs popularity: Spearman ρ=-0.122, p=0.117.
- `certainty_weighted_net_support` vs popularity: Spearman ρ=-0.113, p=0.147.

Adjusted for brand, form and price:
- Certainty adjusted — `evidence_certainty_max`: β=-0.108, 95% CI -1.933 to 1.717, p=0.908, R²=0.319.
- Net support adjusted — `certainty_weighted_net_support`: β=-0.060, 95% CI -0.133 to 0.014, p=0.114, R²=0.329.
- Certainty + net support adjusted — `evidence_certainty_max`: β=-0.080, 95% CI -3.832 to 3.672, p=0.967, R²=0.329.
- Certainty + net support adjusted — `certainty_weighted_net_support`: β=-0.059, 95% CI -0.148 to 0.029, p=0.191, R²=0.329.

## Main conclusion
The V3 model still does **not** show a meaningful positive relationship between Amazon popularity and scientific evidence strength/support at the product-family level. After adjustment for brand, form and price, evidence certainty is essentially unrelated to popularity; net scientific support shows at most a weak inverse association that is not statistically conclusive.

This supports keeping:
`Customer popularity` and `Scientific evidence`
as separate website dimensions.

## Public-safe interpretation
A suitable statement is:

> In this captured dog-joint cohort, products with stronger or more supportive ingredient-level scientific evidence were not consistently more popular on Amazon. Popularity appears to reflect different market forces, including brand and product presentation, and should not be interpreted as evidence of effectiveness.

## Product applicability limitation
V3 does **not** score exact product efficacy. Current source data do not establish that each commercial product matches the studied dose, formulation, purity, bioavailability, or co-ingredient architecture. Exact dose/formula applicability should become a separate future score only when those facts are captured and traceable.

## Status
This is a transparent exploratory VSH evidence-strength model, not a formally validated veterinary evidence-grading system. It should be versioned and accompanied by methodology and limitations when published.
