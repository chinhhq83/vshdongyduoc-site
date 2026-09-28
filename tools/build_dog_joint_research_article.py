from pathlib import Path
import re
import markdown

root = Path(r"G:\vshdongyduoc-site\vsh-landing-site")

source = (
    root
    / "data"
    / "web-ready"
    / "dog-joint-v1_3"
    / "authority"
    / "articles"
    / "DOG_JOINT_POPULARITY_BRAND_SCIENCE.md"
)

out_dir = (
    root
    / "dog-joint"
    / "research"
    / "popularity-brand-scientific-evidence"
)

out_dir.mkdir(parents=True, exist_ok=True)

text = source.read_text(encoding="utf-8")

# Remove YAML front matter if present
text = re.sub(
    r"\A---\s*\n.*?\n---\s*\n",
    "",
    text,
    flags=re.DOTALL
)

m = re.search(r"^#\s+(.+)$", text, re.MULTILINE)
title = (
    m.group(1).strip()
    if m
    else "Dog Joint Supplements: Brand Popularity and Scientific Evidence"
)

body_html = markdown.markdown(
    text,
    extensions=["tables", "fenced_code", "sane_lists"]
)

canonical = (
    "https://www.vshdongyduoc.org/"
    "dog-joint/research/popularity-brand-scientific-evidence/"
)

html = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">

<title>{title} | VSH Research</title>

<meta name="description"
content="VSH analysis of brand popularity, customer popularity and scientific evidence across dog joint supplements.">

<link rel="canonical" href="{canonical}">

<meta name="robots"
content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">

<link rel="icon" href="/images/favicon.png" type="image/png">
<link rel="stylesheet" href="/assets/css/dog-joint.css">

<style>
.research-page {{
  max-width:980px;
  margin:0 auto;
  padding:42px 22px 70px;
}}

.research-page h1 {{
  line-height:1.15;
  margin-bottom:24px;
}}

.research-page h2 {{
  margin-top:38px;
}}

.research-page h3 {{
  margin-top:28px;
}}

.research-page p,
.research-page li {{
  line-height:1.72;
}}

.research-page table {{
  width:100%;
  border-collapse:collapse;
  margin:26px 0;
}}

.research-page th,
.research-page td {{
  border:1px solid #ddd;
  padding:10px;
  text-align:left;
  vertical-align:top;
}}

.research-page blockquote {{
  margin:24px 0;
  padding:14px 20px;
  border-left:4px solid #888;
}}

.research-nav {{
  margin-bottom:24px;
}}

.research-note {{
  margin:30px 0;
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

<main class="research-page">

<div class="research-nav">
<a href="/pet/dog-joint/">
&larr; Back to dog joint comparison
</a>
</div>

{body_html}

<div class="research-note">

<strong>Important distinction</strong>

<p>
Customer popularity and scientific evidence are separate dimensions.
Popularity should not be interpreted as proof of quality, safety,
clinical effectiveness or scientific strength.
</p>

<p>
<a href="/pet/dog-joint/">
Compare all dog joint supplements
</a>

<a href="/methodology">
Read methodology
</a>

<a href="/contact">
Report a correction or newer study
</a>
</p>

</div>

</main>

<footer>
<div class="wrap">

<strong>Viện Sinh Hóa Đông Y Dược</strong>
 VSH Product Compare
 <a href="mailto:vs.hd@vshdongyduoc.org">
vs.hd@vshdongyduoc.org
</a>
 <a href="tel:+84938575161">
+84 938 575 161
</a>

<br>

<a href="/methodology">Methodology</a>

<a href="/about">About VSH</a>

<a href="/contact">Contact</a>

<a href="/privacy">Privacy Policy</a>

<a href="/terms">Terms / Disclaimer</a>

</div>
</footer>

</body>
</html>
"""

(out_dir / "index.html").write_text(
    html,
    encoding="utf-8"
)

print(
    "CREATED /dog-joint/research/"
    "popularity-brand-scientific-evidence/"
)
