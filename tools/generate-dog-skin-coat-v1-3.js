const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const defaultSourceRoot = 'E:\\ChatGPT\\amazon\\amazon-scraper\\dog_skin_coat\\runs\\stage2_2026-09-12T08-07-54-595Z_pxl73f\\WEB_READY_HANDOFF_DOG_SKIN_COAT_V1_3';
const sourceRoot = path.resolve(process.argv[2] || defaultSourceRoot);
const productsPath = path.join(sourceRoot, 'web_data', 'WEB_READY_PRODUCTS.json');
const evidencePath = path.join(sourceRoot, 'evidence', 'EVIDENCE_PAGE_INPUT_V1.json');
const outputRoot = path.join(repoRoot, 'pet', 'dog-skin-coat');
const canonicalOrigin = 'https://www.vshdongyduoc.org';
const campaign = 'dog_skin_coat';
const reviewedDate = '2026-09-12';
const exactProductPolicy = 'No product in this public cohort has exact-product clinical efficacy established by this evidence review.';
const reviewerName = 'Hoàng Quốc Chính, PhD';
const reviewerScope = 'Scientific evidence methodology and ingredient/formula-level evidence review for VSH Dog Skin & Coat product comparison pages.';
const reviewerLimitation = 'This scientific review does not constitute veterinary clinical review or individualized veterinary advice.';

function loadJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, ''));
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;',
  })[character]);
}

function requireText(value, label) {
  if (typeof value !== 'string' || value.trim() === '') throw new Error(`${label} is blank`);
}

function canonical(route) {
  return `${canonicalOrigin}${route}`;
}

function analyticsScript(eventName, asin) {
  return `<script>
document.addEventListener('DOMContentLoaded', function () {
  if (window.VSHAnalytics) window.VSHAnalytics.track('${eventName}', { campaign: '${campaign}'${asin ? `, asin: '${asin}'` : ''} });
  document.querySelectorAll('[data-analytics-event]').forEach(function (link) {
    link.addEventListener('click', function () {
      if (window.VSHAnalytics) window.VSHAnalytics.track(link.dataset.analyticsEvent, { campaign: '${campaign}', asin: link.dataset.asin });
    });
  });
});
</script>`;
}

function siteHeader() {
  return `<header class="site-header"><div class="wrap header-row"><a class="brand" href="/">VSH <small>Product Compare</small></a><nav aria-label="Primary"><a href="/pet/dog-joint/">Dog Joint</a><a href="/pet/dog-skin-coat/" aria-current="page">Dog Skin &amp; Coat</a><a href="/scientific-methodology/">Scientific Methodology</a><a href="/how-we-evaluate-products/">How We Evaluate Products</a><a href="/editorial-policy/">Editorial Policy</a><a href="/contact">Contact</a></nav></div></header>`;
}

function siteFooter() {
  return `<footer><div class="wrap"><strong>Viện Sinh Hóa Đông Y Dược</strong> · VSH Product Compare<br><a href="/pet/dog-skin-coat/">Dog Skin &amp; Coat comparison</a> · <a href="/scientific-methodology/">Scientific Methodology</a> · <a href="/how-we-evaluate-products/">How We Evaluate Products</a> · <a href="/editorial-policy/">Editorial Policy</a> · <a href="/contact">Corrections &amp; contact</a> · <a href="/privacy">Privacy</a> · <a href="/terms">Terms / Disclaimer</a></div></footer>`;
}

function pageShell({ title, description, route, body, eventName, asin }) {
  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}">
<link rel="canonical" href="${escapeHtml(canonical(route))}">
<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
<link rel="icon" href="/images/favicon.png" type="image/png">
<link rel="stylesheet" href="/assets/css/dog-joint.css">
<script defer src="/analytics.js"></script>
</head><body>
${siteHeader()}
${body}
${siteFooter()}
${eventName ? analyticsScript(eventName, asin) : ''}
</body></html>\n`;
}

function popularityDisplay(product) {
  return product.customer_popularity_status === 'RANKED'
    ? `Rank #${product.customer_popularity_rank} of 285`
    : 'Popularity unavailable';
}

function renderComparison(products) {
  const priceOptions = [...new Set(products.map((x) => x.price_tier))].sort();
  const formOptions = [...new Set(products.map((x) => x.form_display))].sort();
  const scienceOptions = [...new Set(products.map((x) => x.scientific_evidence_status))].sort();
  const rows = products.map((x) => `<tr data-product-row data-price="${escapeHtml(x.price_tier)}" data-form="${escapeHtml(x.form_display)}" data-science="${escapeHtml(x.scientific_evidence_status)}" data-popularity="${escapeHtml(x.customer_popularity_status)}" data-search="${escapeHtml([x.asin, x.product_name, x.brand, x.ingredient_display, x.form_display, x.product_focus].join(' ').toLowerCase())}">
<td data-label="Product"><strong>${escapeHtml(x.product_name)}</strong><span class="sub">${escapeHtml(x.brand)} · ${escapeHtml(x.asin)}</span></td>
<td data-label="Ingredients / form">${escapeHtml(x.ingredient_display)}<span class="sub"><strong>Form:</strong> ${escapeHtml(x.form_display)}</span></td>
<td data-label="Product focus">${escapeHtml(x.product_focus)}</td>
<td data-label="Price tier"><span class="badge ${escapeHtml(x.price_tier)}">${escapeHtml(x.price_tier_display)}</span></td>
<td data-label="Customer popularity">${escapeHtml(popularityDisplay(x))}</td>
<td data-label="Scientific evidence"><span class="badge">${escapeHtml(x.scientific_evidence_status)}</span><span class="sub">${escapeHtml(x.scientific_evidence_brief)}</span></td>
<td data-label="Product"><a class="btn" href="${escapeHtml(x.target_url)}">Product details</a></td>
<td data-label="Full analysis"><a class="btn" data-analytics-event="full_analysis_click" data-asin="${escapeHtml(x.asin)}" href="${escapeHtml(x.scientific_evidence_url)}">Full evidence analysis</a></td>
<td data-label="Amazon"><a class="btn primary" data-analytics-event="amazon_click" data-asin="${escapeHtml(x.asin)}" href="${escapeHtml(x.amazon_url)}" target="_blank" rel="nofollow noopener">View on Amazon</a><span class="sub">Direct, non-affiliate link</span></td>
</tr>`).join('\n');
  const options = (values) => values.map((v) => `<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`).join('');
  const body = `<main><section class="hero"><div class="wrap">
<div class="eyebrow">Independent product and ingredient-level evidence comparison</div>
<h1>Dog Skin &amp; Coat Product Comparison</h1>
<p class="lede">Compare 285 approved dog skin and coat products by listed ingredients and form, product focus, campaign-relative price tier, relative customer popularity, and independently assessed scientific evidence.</p>
<p>VSH keeps listing facts, customer signals, and scientific evidence separate. Popularity is not Amazon Best Sellers Rank, quality, efficacy, or a recommendation. Missing popularity inputs are shown as unavailable.</p>
<div class="tools">
<input id="q" type="search" placeholder="Search product, brand, ASIN, ingredient, or focus" aria-label="Search products">
<select id="price" data-filter="price"><option value="">All price tiers</option>${options(priceOptions)}</select>
<select id="form" data-filter="form"><option value="">All forms</option>${options(formOptions)}</select>
<select id="science" data-filter="science"><option value="">All evidence statuses</option>${options(scienceOptions)}</select>
<select id="popularity" data-filter="popularity"><option value="">All popularity states</option><option value="RANKED">Ranked</option><option value="POPULARITY_UNAVAILABLE">Popularity unavailable</option></select>
</div>
<div id="count" class="results" aria-live="polite">Showing 285 of 285 products</div>
<div class="table-shell"><table><caption>Approved VSH Dog Skin &amp; Coat public cohort: 285 products</caption><thead><tr><th>Product / brand</th><th>Ingredients / form</th><th>Product focus</th><th>Price tier + range</th><th>Customer popularity</th><th>Scientific evidence status + brief</th><th>Product detail</th><th>Full analysis</th><th>Amazon destination</th></tr></thead><tbody id="tbody">${rows}</tbody></table></div>
<section class="article"><h2>How to interpret this comparison</h2><p>Price tiers and popularity ranks are relative to this campaign cohort. Scientific evidence is assessed separately at ingredient, active, or related-formulation level and does not establish exact-product efficacy.</p>
<h2>Scientific review</h2><p><strong>${escapeHtml(reviewerName)}</strong></p><p>${escapeHtml(reviewerScope)}</p><p><strong>${escapeHtml(reviewerLimitation)}</strong></p>
<p class="meta">Last reviewed: <time datetime="${reviewedDate}">September 12, 2026</time>. Read the <a href="/scientific-methodology/">Scientific Methodology</a>, <a href="/how-we-evaluate-products/">How We Evaluate Products</a>, and <a href="/editorial-policy/">Editorial Policy</a>. Submit listing, scientific, or editorial corrections and new studies through <a href="/contact">Contact</a>.</p></section>
</div></section></main>
<script defer src="/assets/js/dog-skin-coat.js"></script>`;
  return pageShell({ title: 'Dog Skin & Coat Product Comparison (285 Products) | VSH', description: 'Compare 285 dog skin and coat products by listed ingredients, form, focus, campaign-relative price tier, popularity rank, and independent scientific evidence status.', route: '/pet/dog-skin-coat/', body });
}

function renderProduct(product) {
  const body = `<main><article class="article">
<div class="eyebrow">Dog Skin &amp; Coat product detail</div><h1>${escapeHtml(product.product_name)}</h1>
<p class="lede">${escapeHtml(product.page_summary)}</p>
<div class="kv"><div>ASIN</div><div>${escapeHtml(product.asin)}</div><div>Brand</div><div>${escapeHtml(product.brand)}</div><div>Listed ingredients</div><div>${escapeHtml(product.ingredient_display)}</div><div>Form</div><div>${escapeHtml(product.form_display)}</div><div>Product focus</div><div>${escapeHtml(product.product_focus)}</div><div>Price tier</div><div>${escapeHtml(product.price_tier_display)}</div><div>Customer popularity</div><div>${escapeHtml(popularityDisplay(product))}</div><div>Scientific evidence status</div><div>${escapeHtml(product.scientific_evidence_status)}</div></div>
<h2>Scientific evidence brief</h2><p>${escapeHtml(product.scientific_evidence_brief)}</p>
<p><a class="btn" data-analytics-event="full_analysis_click" data-asin="${escapeHtml(product.asin)}" href="${escapeHtml(product.scientific_evidence_url)}">Read the full scientific evidence analysis</a></p>
<h2>Amazon destination</h2><p><a class="btn primary" data-analytics-event="amazon_click" data-asin="${escapeHtml(product.asin)}" href="${escapeHtml(product.amazon_url)}" target="_blank" rel="nofollow noopener">View on Amazon</a></p><p class="meta">Direct, non-affiliate destination from the approved listing capture.</p>
<h2>Interpretation and review</h2><p>${escapeHtml(exactProductPolicy)}</p><p><strong>Scientific review: ${escapeHtml(reviewerName)}</strong><br>${escapeHtml(reviewerScope)}<br><strong>${escapeHtml(reviewerLimitation)}</strong></p>
<p class="meta">Last reviewed: <time datetime="${reviewedDate}">September 12, 2026</time>. <a href="/pet/dog-skin-coat/">Back to all 285 products</a> · <a href="/scientific-methodology/">Scientific Methodology</a> · <a href="/editorial-policy/">Editorial Policy</a> · <a href="/contact">Corrections or new evidence</a></p>
</article></main>`;
  return pageShell({ title: product.seo_title, description: product.meta_description, route: product.target_url, body, eventName: 'product_detail_view', asin: product.asin });
}

function renderCitation(citation) {
  const fields = Object.entries(citation).filter(([, value]) => value !== '' && value !== null && value !== undefined);
  return `<li><dl>${fields.map(([key, value]) => {
    let shown = escapeHtml(value);
    if ((key === 'pubmed_url' || key === 'url') && /^https:\/\//.test(String(value))) shown = `<a href="${escapeHtml(value)}" target="_blank" rel="noopener">${escapeHtml(value)}</a>`;
    if (key === 'doi') shown = `<a href="https://doi.org/${escapeHtml(value)}" target="_blank" rel="noopener">${escapeHtml(value)}</a>`;
    return `<dt>${escapeHtml(key.replaceAll('_', ' '))}</dt><dd>${shown}</dd>`;
  }).join('')}</dl></li>`;
}

function renderSearchTrace(trace) {
  return `<li><dl>${Object.entries(trace).map(([key, value]) => `<dt>${escapeHtml(key.replaceAll('_', ' '))}</dt><dd>${escapeHtml(value)}</dd>`).join('')}</dl></li>`;
}

function renderEvidence(entry) {
  const product = entry.product;
  const evidence = entry.evidence_page;
  const citations = evidence.citations || [];
  const traces = evidence.evidence_search_trace || [];
  const sources = citations.length ? `<h2>Scientific citations</h2><ol class="citations">${citations.map(renderCitation).join('')}</ol>` : `<h2>Approved evidence search trace</h2><ol class="citations">${traces.map(renderSearchTrace).join('')}</ol>`;
  const body = `<main class="evidence-page"><article class="article">
<div class="eyebrow">Scientific evidence analysis · ${escapeHtml(entry.asin)}</div><h1>${escapeHtml(product.product_name)}: scientific evidence</h1>
<p class="lede"><strong>${escapeHtml(evidence.scientific_evidence_status)}</strong> — ${escapeHtml(evidence.scientific_evidence_brief)}</p>
<h2>What this status means</h2><p>${escapeHtml(evidence.scientific_evidence_meaning)}</p>
<h2>Evidence detail</h2><p>${escapeHtml(evidence.scientific_evidence_detail)}</p>
<h2>Scientific limitations</h2><p>${escapeHtml(evidence.scientific_limitations)}</p>
<div class="kv"><div>Evidence basis</div><div>${escapeHtml(evidence.evidence_basis)}</div><div>Product focus class</div><div>${escapeHtml(evidence.product_focus_class)}</div><div>Evidence mapping status</div><div>${escapeHtml(evidence.evidence_mapping_status)}</div><div>Exact-product efficacy proven</div><div>${escapeHtml(evidence.exact_product_efficacy_proven)}</div></div>
<aside><h2>Exact-product efficacy limitation</h2><p><strong>${escapeHtml(evidence.exact_product_efficacy_statement)}</strong></p><p>${escapeHtml(exactProductPolicy)}</p></aside>
${sources}
<h2>Product context from the approved listing capture</h2><p><strong>Brand:</strong> ${escapeHtml(product.brand)}<br><strong>Listed ingredients:</strong> ${escapeHtml(product.ingredient_display)}<br><strong>Form:</strong> ${escapeHtml(product.form)}<br><strong>Product focus:</strong> ${escapeHtml(product.product_focus)}</p>
<p><a class="btn primary" data-analytics-event="amazon_click" data-asin="${escapeHtml(entry.asin)}" href="${escapeHtml(product.amazon_url)}" target="_blank" rel="nofollow noopener">View on Amazon</a></p>
<h2>Scientific review</h2><p><strong>${escapeHtml(reviewerName)}</strong><br>${escapeHtml(reviewerScope)}<br><strong>${escapeHtml(reviewerLimitation)}</strong></p>
<p class="meta">Last reviewed: <time datetime="${reviewedDate}">September 12, 2026</time>. Read the <a href="/scientific-methodology/">Scientific Methodology</a>, <a href="/how-we-evaluate-products/">How We Evaluate Products</a>, and <a href="/editorial-policy/">Editorial Policy</a>. Submit a <a href="/contact">scientific or editorial correction or a new study</a>.</p>
<p><a href="/pet/dog-skin-coat/">Back to the Dog Skin &amp; Coat comparison</a></p>
</article></main>`;
  return pageShell({ title: `${product.product_name}: Scientific Evidence | VSH`, description: `${evidence.scientific_evidence_status}: ${evidence.scientific_evidence_brief}`, route: evidence.route, body, eventName: 'evidence_page_view', asin: entry.asin });
}

function validate(products, evidenceInput) {
  if (!Array.isArray(products) || products.length !== 285) throw new Error(`Expected 285 products, found ${products.length}`);
  if (!Array.isArray(evidenceInput.products) || evidenceInput.products.length !== 285) throw new Error(`Expected 285 evidence entries, found ${evidenceInput.products?.length}`);
  if (evidenceInput.evidence_policy.exact_product_efficacy_statement !== exactProductPolicy) throw new Error('Exact-product cohort policy changed');
  const required = ['asin', 'product_name', 'brand', 'slug', 'target_url', 'ingredient_display', 'form_display', 'product_focus', 'price_tier', 'price_tier_display', 'customer_popularity_status', 'scientific_evidence_status', 'scientific_evidence_brief', 'scientific_evidence_url', 'amazon_url', 'seo_title', 'meta_description', 'page_summary'];
  const asins = new Set();
  const science = {};
  for (const product of products) {
    for (const field of required) requireText(product[field], `${product.asin || 'UNKNOWN'} ${field}`);
    if (asins.has(product.asin)) throw new Error(`Duplicate ASIN ${product.asin}`);
    asins.add(product.asin);
    if (product.target_url !== `/pet/dog-skin-coat/products/${product.slug}/`) throw new Error(`${product.asin}: target URL mismatch`);
    if (product.scientific_evidence_url !== `/pet/dog-skin-coat/evidence/${product.asin.toLowerCase()}/`) throw new Error(`${product.asin}: evidence URL mismatch`);
    if (!/^https:\/\/www\.amazon\.com\/dp\/[A-Z0-9]{10}$/.test(product.amazon_url)) throw new Error(`${product.asin}: invalid Amazon URL`);
    if (product.affiliate_enabled || /[?&]tag=/i.test(product.amazon_url)) throw new Error(`${product.asin}: unexpected affiliate destination`);
    if (product.customer_popularity_status === 'RANKED' && !Number.isInteger(product.customer_popularity_rank)) throw new Error(`${product.asin}: ranked product has no rank`);
    if (product.customer_popularity_status === 'POPULARITY_UNAVAILABLE' && product.customer_popularity_rank !== null) throw new Error(`${product.asin}: unavailable product has a rank`);
    science[product.scientific_evidence_status] = (science[product.scientific_evidence_status] || 0) + 1;
  }
  const expectedScience = { VERIFIED_SUPPORTIVE: 74, MIXED: 201, INSUFFICIENT: 7, VERIFICATION_REQUIRED: 3 };
  for (const [status, count] of Object.entries(expectedScience)) if (science[status] !== count) throw new Error(`Science distribution changed: ${JSON.stringify(science)}`);
  for (const entry of evidenceInput.products) {
    const evidence = entry.evidence_page;
    if (!asins.has(entry.asin)) throw new Error(`${entry.asin}: evidence ASIN not in cohort`);
    for (const field of ['route', 'scientific_evidence_status', 'scientific_evidence_brief', 'scientific_evidence_meaning', 'scientific_evidence_detail', 'scientific_limitations', 'exact_product_efficacy_statement']) requireText(evidence[field], `${entry.asin} evidence ${field}`);
    if (evidence.exact_product_efficacy_proven !== 'NO') throw new Error(`${entry.asin}: exact-product efficacy changed`);
    if (!(evidence.citations || []).length && !(evidence.evidence_search_trace || []).length) throw new Error(`${entry.asin}: no citations or search trace`);
  }
}

function writeRoute(route, html) {
  const relative = route.replace(/^\//, '').replace(/\/$/, '');
  const directory = path.join(repoRoot, relative);
  if (!path.resolve(directory).startsWith(path.resolve(outputRoot))) throw new Error(`Refusing unexpected output route: ${route}`);
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(path.join(directory, 'index.html'), html, 'utf8');
}

const products = loadJson(productsPath);
const evidenceInput = loadJson(evidencePath);
validate(products, evidenceInput);
fs.mkdirSync(outputRoot, { recursive: true });
fs.writeFileSync(path.join(outputRoot, 'index.html'), renderComparison(products), 'utf8');
for (const product of products) writeRoute(product.target_url, renderProduct(product));
for (const entry of evidenceInput.products) writeRoute(entry.evidence_page.route, renderEvidence(entry));
console.log(`Generated comparison, ${products.length} product pages, and ${evidenceInput.products.length} evidence pages.`);
