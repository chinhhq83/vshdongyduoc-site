import json
import html
from pathlib import Path

ROOT = Path(r"G:\vshdongyduoc-site\vsh-landing-site")
DATA = ROOT / "data" / "dog-joint" / "products.json"
OUT = ROOT / "dog-joint" / "products"

rows = json.loads(DATA.read_text(encoding="utf-8-sig"))

OUT.mkdir(parents=True, exist_ok=True)

def esc(v):
    return html.escape("" if v is None else str(v))

created = 0

for x in rows:
    asin = x["asin"]
    slug = x["slug"]

    route_dir = OUT / slug
    route_dir.mkdir(parents=True, exist_ok=True)

    canonical = f"https://www.vshdongyduoc.org{x['target_url']}"

    title = x.get("seo_title") or f"{x.get('product_name','')} | VSH Product Compare"
    meta = x.get("meta_description") or x.get("page_summary") or ""

    evidence_url = x.get("scientific_evidence_url") or ""
    amazon_url = x.get("amazon_url") or ""

    evidence_link = ""
    if evidence_url:
        evidence_link = f'''
        <p>
          <a class="btn evidence-link"
             href="{esc(evidence_url)}">
             Read full scientific analysis
          </a>
        </p>
        '''

    amazon_link = ""
    if amazon_url:
        amazon_link = f'''
        <p>
          <a class="btn amazon-link"
             href="{esc(amazon_url)}"
             target="_blank"
             rel="nofollow noopener noreferrer">
             View on Amazon
          </a>
        </p>
        '''

    body = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">

<title>{esc(title)}</title>
<meta name="description" content="{esc(meta)}">

<link rel="canonical" href="{esc(canonical)}">
<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1">

<link rel="stylesheet" href="/assets/css/dog-joint.css">
<script defer src="/analytics.js"></script>

<style>
.product-page {{
  max-width:900px;
  margin:0 auto;
  padding:42px 22px 70px;
}}
.product-grid {{
  display:grid;
  grid-template-columns:1fr;
  gap:18px;
}}
.product-field {{
  padding:16px;
  border:1px solid #ddd;
  border-radius:8px;
}}
.product-field h2 {{
  margin-top:0;
  font-size:1.05rem;
}}
.product-page p {{
  line-height:1.7;
}}
.product-actions {{
  margin-top:28px;
}}
</style>
</head>

<body>

<header class="site-header">
<div class="wrap header-row">

<a class="brand" href="/">
VSH <small>Product Compare</small>
</a>

<nav aria-label="Primary">
<a href="/pet/dog-joint/">Dog Joint</a>
<a href="/methodology">Methodology</a>
<a href="/about">About VSH</a>
<a href="/contact">Contact</a>
<a href="/privacy">Privacy</a>
<a href="/terms">Terms</a>
</nav>

</div>
</header>

<main class="product-page">

<p>
<a href="/pet/dog-joint/">&larr; Back to comparison</a>
</p>

<h1>{esc(x.get("product_name"))}</h1>

<p>
<strong>Brand:</strong> {esc(x.get("brand"))}<br>
<strong>ASIN:</strong> {esc(asin)}
</p>

<div class="product-grid">

<section class="product-field">
<h2>Ingredients / Form</h2>
<p>{esc(x.get("ingredient_display"))}</p>
<p><strong>Form:</strong> {esc(x.get("form_display"))}</p>
</section>

<section class="product-field">
<h2>Product focus</h2>
<p>{esc(x.get("product_focus"))}</p>
</section>

<section class="product-field">
<h2>Price tier</h2>
<p>{esc(x.get("price_tier_display"))}</p>
</section>

<section class="product-field">
<h2>Customer popularity</h2>
<p>{esc(x.get("customer_popularity_display"))}</p>
<p>
Relative popularity within this comparison only.
It is not a measure of quality, clinical effectiveness,
scientific strength or Amazon Best Sellers Rank.
</p>
</section>

<section class="product-field">
<h2>Scientific evidence</h2>
<p>
<strong>Status:</strong>
{esc(x.get("scientific_evidence_status"))}
</p>
<p>{esc(x.get("scientific_evidence_brief"))}</p>
{evidence_link}
</section>

</div>

<div class="product-actions">
{amazon_link}
</div>

<section class="product-field">
<h2>Evidence boundary</h2>
<p>
Scientific evidence summarized here applies to relevant ingredients
or formula categories. It does not establish that this specific
commercial product or ASIN was clinically tested or will produce
the same results.
</p>
</section>

</main>

<footer>
<div class="wrap">

<strong>Viện Sinh Hóa Đông Y Dược</strong>
·
<a href="mailto:vs.hd@vshdongyduoc.org">
vs.hd@vshdongyduoc.org
</a>
·
<a href="tel:+84938575161">
+84 938 575 161
</a>

<br>

<a href="/methodology">Methodology</a>
·
<a href="/about">About VSH</a>
·
<a href="/contact">Contact</a>
·
<a href="/privacy">Privacy Policy</a>
·
<a href="/terms">Terms / Disclaimer</a>

</div>
</footer>

<script>
document.addEventListener('DOMContentLoaded', function () {{

  if (window.VSHAnalytics) {{
    window.VSHAnalytics.track('product_detail_view', {{
      asin: {json.dumps(asin)}
    }});
  }}

  document.addEventListener('click', function (event) {{

    const amazon = event.target.closest('.amazon-link');

    if (amazon && window.VSHAnalytics) {{
      window.VSHAnalytics.track('amazon_click', {{
        asin: {json.dumps(asin)}
      }});
    }}

    const evidence = event.target.closest('.evidence-link');

    if (evidence && window.VSHAnalytics) {{
      window.VSHAnalytics.track('full_analysis_click', {{
        asin: {json.dumps(asin)}
      }});
    }}

  }});

}});
</script>

</body>
</html>
"""

    (route_dir / "index.html").write_text(body, encoding="utf-8")
    created += 1

print("CREATED =", created)
print("EXPECTED =", len(rows))
