from pathlib import Path
import re
import markdown

root = Path(r"G:\vshdongyduoc-site\vsh-landing-site")
source_dir = root / "data" / "web-ready" / "dog-joint-v1_3" / "evidence" / "evidence_pages"
out_root = root / "dog-joint" / "evidence"

out_root.mkdir(parents=True, exist_ok=True)

for md_file in source_dir.glob("*.md"):
    slug = md_file.stem
    text = md_file.read_text(encoding="utf-8")

    m = re.search(r"^#\s+(.+)$", text, re.MULTILINE)
    title = m.group(1).strip() if m else slug.replace("-", " ").title()

    body_html = markdown.markdown(
        text,
        extensions=["tables", "fenced_code", "sane_lists"]
    )

    route_dir = out_root / slug
    route_dir.mkdir(parents=True, exist_ok=True)

    canonical = f"https://www.vshdongyduoc.org/dog-joint/evidence/{slug}/"

    html = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">

<title>{title} | VSH Scientific Evidence</title>

<meta name="description"
content="VSH review of independent canine scientific evidence relevant to {title}.">

<link rel="canonical" href="{canonical}">

<meta name="robots"
content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">

<link rel="icon" href="/images/favicon.png" type="image/png">
<link rel="stylesheet" href="/assets/css/dog-joint.css">

<style>
.evidence-page {{
  max-width:900px;
  margin:0 auto;
  padding:42px 22px 70px;
}}
.evidence-page h1 {{
  line-height:1.15;
  margin-bottom:22px;
}}
.evidence-page h2 {{
  margin-top:34px;
}}
.evidence-page h3 {{
  margin-top:26px;
}}
.evidence-page p,
.evidence-page li {{
  line-height:1.7;
}}
.evidence-page table {{
  width:100%;
  border-collapse:collapse;
  margin:24px 0;
}}
.evidence-page th,
.evidence-page td {{
  border:1px solid #ddd;
  padding:10px;
  text-align:left;
  vertical-align:top;
}}
.evidence-page blockquote {{
  margin:20px 0;
  padding:12px 18px;
  border-left:4px solid #999;
}}
.evidence-nav {{
  margin-bottom:24px;
}}
.evidence-disclaimer {{
  margin-top:36px;
  padding:18px;
  border:1px solid #ddd;
  border-radius:8px;
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
<a href="/dog-skin-coat/">Dog Skin &amp; Coat</a>
<a href="/methodology">Methodology</a>
<a href="/about">About VSH</a>
<a href="/contact">Contact</a>
<a href="/privacy">Privacy</a>
<a href="/terms">Terms</a>
</nav>

</div>
</header>

<main class="evidence-page">

<div class="evidence-nav">
<a href="/pet/dog-joint/">&larr; Back to dog joint comparison</a>
</div>

{body_html}

<div class="evidence-disclaimer">

<strong>Evidence boundary</strong>

<p>
This evidence review concerns relevant ingredients or formula categories.
It does not establish that any specific commercial product or ASIN has been
clinically tested or will produce the same results.
</p>

<p>
Study dose, formulation, purity, bioavailability and co-ingredients may differ
from commercially available supplements.
</p>

<p>
<a href="/methodology">Read VSH scientific methodology</a>

<a href="/contact">Report a correction or newer study</a>
</p>

</div>

</main>

<footer>
<div class="wrap">

<strong>Viện Sinh Hóa Đông Y Dược</strong>
 VSH Product Compare
 <a href="mailto:vs.hd@vshdongyduoc.org">vs.hd@vshdongyduoc.org</a>
 <a href="tel:+84938575161">+84 938 575 161</a>

<br>

<a href="/methodology">Methodology</a>

<a href="/about">About VSH</a>

<a href="/contact">Contact</a>

<a href="/privacy">Privacy Policy</a>

<a href="/terms">Terms / Disclaimer</a>

<br>
Scientific decision support, not individualized veterinary advice.

</div>
</footer>

</body>
</html>
"""

    (route_dir / "index.html").write_text(html, encoding="utf-8")
    print(f"CREATED  /dog-joint/evidence/{slug}/")
