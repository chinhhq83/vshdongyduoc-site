const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const sourceRoot = path.resolve(process.argv[2] || 'E:\\ChatGPT\\amazon\\amazon-scraper\\dog_skin_coat\\runs\\stage2_2026-09-12T08-07-54-595Z_pxl73f\\WEB_READY_HANDOFF_DOG_SKIN_COAT_V1_3');
const load = (file) => JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));
const products = load(path.join(sourceRoot, 'web_data', 'WEB_READY_PRODUCTS.json'));
const evidenceInput = load(path.join(sourceRoot, 'evidence', 'EVIDENCE_PAGE_INPUT_V1.json'));
const read = (file) => fs.readFileSync(path.join(repoRoot, file), 'utf8');
const htmlEscape = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[character]);
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };

const comparison = read('pet/dog-skin-coat/index.html');
const productRoot = path.join(repoRoot, 'pet', 'dog-skin-coat', 'products');
const evidenceRoot = path.join(repoRoot, 'pet', 'dog-skin-coat', 'evidence');
const productPages = fs.readdirSync(productRoot).filter((name) => fs.existsSync(path.join(productRoot, name, 'index.html')));
const evidencePages = fs.readdirSync(evidenceRoot).filter((name) => fs.existsSync(path.join(evidenceRoot, name, 'index.html')));
assert(products.length === 285, `source product count ${products.length}`);
assert(new Set(products.map((x) => x.asin)).size === 285, 'source ASINs are not unique');
assert(productPages.length === 285, `rendered product route count ${productPages.length}`);
assert(evidencePages.length === 285, `rendered evidence route count ${evidencePages.length}`);
assert((comparison.match(/data-product-row/g) || []).length === 285, 'comparison does not contain 285 product rows');

const science = {};
let ranked = 0;
let unavailable = 0;
for (const product of products) {
  science[product.scientific_evidence_status] = (science[product.scientific_evidence_status] || 0) + 1;
  if (product.customer_popularity_status === 'RANKED') ranked += 1; else unavailable += 1;
  const popularity = product.customer_popularity_status === 'RANKED' ? `Rank #${product.customer_popularity_rank} of 285` : 'Popularity unavailable';
  for (const value of [product.product_name, product.brand, product.ingredient_display, product.form_display, product.product_focus, product.price_tier_display, popularity, product.scientific_evidence_status, product.scientific_evidence_brief, product.target_url, product.scientific_evidence_url, product.amazon_url]) {
    assert(comparison.includes(htmlEscape(value)), `${product.asin}: comparison missing ${value}`);
  }
  const productFile = path.join(productRoot, product.slug, 'index.html');
  assert(fs.existsSync(productFile), `${product.asin}: product route missing`);
  if (fs.existsSync(productFile)) {
    const html = fs.readFileSync(productFile, 'utf8');
    for (const value of [product.product_name, product.brand, product.ingredient_display, product.form_display, product.product_focus, product.price_tier_display, popularity, product.scientific_evidence_status, product.scientific_evidence_brief, product.scientific_evidence_url, product.amazon_url]) assert(html.includes(htmlEscape(value)), `${product.asin}: product page missing ${value}`);
    assert(/<link rel="canonical" href="https:\/\/www\.vshdongyduoc\.org\/pet\/dog-skin-coat\/products\//.test(html), `${product.asin}: product canonical missing`);
    assert(/<meta name="description" content="[^"]+">/.test(html), `${product.asin}: product meta description missing`);
  }
}

for (const entry of evidenceInput.products) {
  const evidence = entry.evidence_page;
  const file = path.join(evidenceRoot, entry.asin.toLowerCase(), 'index.html');
  assert(fs.existsSync(file), `${entry.asin}: evidence route missing`);
  if (!fs.existsSync(file)) continue;
  const html = fs.readFileSync(file, 'utf8');
  for (const value of [evidence.scientific_evidence_status, evidence.scientific_evidence_brief, evidence.scientific_evidence_meaning, evidence.scientific_evidence_detail, evidence.scientific_limitations, evidence.exact_product_efficacy_statement]) assert(html.includes(htmlEscape(value)), `${entry.asin}: evidence page missing approved evidence text`);
  const records = (evidence.citations || []).length ? evidence.citations : evidence.evidence_search_trace;
  assert(records.length > 0, `${entry.asin}: source has no citation or trace`);
  for (const record of records) for (const value of Object.values(record).filter((x) => x !== '' && x !== null && x !== undefined)) assert(html.includes(htmlEscape(value)) || html.includes(encodeURI(String(value))), `${entry.asin}: evidence citation/trace value missing: ${value}`);
  assert(html.includes('Hoàng Quốc Chính, PhD'), `${entry.asin}: reviewer missing`);
  assert(html.includes('This scientific review does not constitute veterinary clinical review or individualized veterinary advice.'), `${entry.asin}: reviewer limitation missing`);
  assert(/<link rel="canonical" href="https:\/\/www\.vshdongyduoc\.org\/pet\/dog-skin-coat\/evidence\//.test(html), `${entry.asin}: evidence canonical missing`);
}

assert(JSON.stringify(science) === JSON.stringify({ VERIFIED_SUPPORTIVE: 74, MIXED: 201, INSUFFICIENT: 7, VERIFICATION_REQUIRED: 3 }), `science distribution ${JSON.stringify(science)}`);
assert(ranked === 247 && unavailable === 38, `popularity distribution ranked=${ranked} unavailable=${unavailable}`);
assert(!comparison.includes('Exact-product efficacy proven</div><div>YES'), 'exact-product efficacy YES rendered');

const editorial = read('editorial-policy/index.html');
const methodology = read('scientific-methodology/index.html');
const evaluation = read('how-we-evaluate-products/index.html');
const contact = read('contact.html');
const analytics = read('analytics.js');
const campaignJs = read('assets/js/dog-skin-coat.js');
const sitemap = read('sitemap.xml');
const vercel = load(path.join(repoRoot, 'vercel.json'));
assert(editorial.includes('<h1>Editorial Policy</h1>') && editorial.includes('rel="canonical"'), 'Editorial Policy route incomplete');
assert(methodology.includes('<h1>Scientific Methodology</h1>') && methodology.includes('Dog Skin &amp; Coat'), 'Scientific Methodology not generalized');
assert(evaluation.includes('<h1>How We Evaluate Products</h1>') && evaluation.includes('Dog Skin &amp; Coat'), 'How We Evaluate Products not generalized');
const inquiryValues = [...contact.matchAll(/<option value="([A-Z_]+)">/g)].map((match) => match[1]);
assert(JSON.stringify(inquiryValues) === JSON.stringify(['GENERAL', 'PRODUCT_LISTING_CORRECTION', 'SCIENTIFIC_EDITORIAL_CORRECTION', 'NEW_STUDY_EVIDENCE', 'BUSINESS_AFFILIATE']), `contact inquiry values ${JSON.stringify(inquiryValues)}`);
assert(contact.includes('result.success !== true') && contact.includes("track('contact_submit', { inquiry_type: inquiryType })"), 'contact_submit is not success-gated with allowed payload');
const contactPayload = contact.match(/track\('contact_submit',\s*\{([^}]*)\}\)/);
assert(contactPayload && /^\s*inquiry_type:\s*inquiryType\s*$/.test(contactPayload[1]), 'contact analytics may include disallowed data');
assert(analytics.includes('window.VSHAnalytics') && analytics.includes('/_vercel/insights/script.js'), 'analytics.js wrapper missing');
for (const event of ['page_view', 'product_detail_view', 'evidence_page_view', 'amazon_click', 'full_analysis_click', 'filter_used']) assert(comparison.includes(event) || campaignJs.includes(event) || [...productPages.slice(0, 1), ...evidencePages.slice(0, 1)].some(() => false) || read(path.join('pet', 'dog-skin-coat', 'products', productPages[0], 'index.html')).includes(event) || read(path.join('pet', 'dog-skin-coat', 'evidence', evidencePages[0], 'index.html')).includes(event), `${event} handler missing`);
assert(contact.includes('contact_submit'), 'contact_submit handler missing');
for (const route of ['/pet/dog-skin-coat/', '/editorial-policy/', ...products.map((x) => x.target_url), ...evidenceInput.products.map((x) => x.evidence_page.route)]) assert(sitemap.includes(`https://www.vshdongyduoc.org${route}`) || sitemap.includes(`https://www.vshdongyduoc.org${route.replace(/\/$/, '')}`), `sitemap missing ${route}`);
assert(vercel.redirects.some((x) => x.source === '/dog-skin-coat' && x.destination === '/pet/dog-skin-coat'), 'legacy comparison redirect missing');

const generatedFiles = [path.join(repoRoot, 'pet', 'dog-skin-coat', 'index.html'), ...productPages.map((name) => path.join(productRoot, name, 'index.html')), ...evidencePages.map((name) => path.join(evidenceRoot, name, 'index.html')), path.join(repoRoot, 'assets', 'js', 'dog-skin-coat.js')];
const generatedText = generatedFiles.map((file) => fs.readFileSync(file, 'utf8')).join('\n').toLowerCase();
for (const token of ['rating_value', 'review_count', 'bought_past_month_min', 'popularity_score', 'review_percentile', 'demand_percentile']) assert(!generatedText.includes(token), `restricted token rendered: ${token}`);
for (const schema of ['"@type":"product"', '"@type": "product"', '"@type":"offer"', '"@type": "offer"', 'aggregaterating']) assert(!generatedText.includes(schema), `restricted schema rendered: ${schema}`);

const samples = {
  productPages: [products.find((x) => x.form_display === 'LIQUID'), products.find((x) => x.form_display === 'CHEW' && x.scientific_evidence_status === 'MIXED'), products.find((x) => x.customer_popularity_status === 'POPULARITY_UNAVAILABLE')].map((x) => ({ asin: x.asin, form: x.form_display, status: x.scientific_evidence_status, route: x.target_url })),
  evidencePages: ['VERIFIED_SUPPORTIVE', 'MIXED', 'INSUFFICIENT', 'VERIFICATION_REQUIRED'].map((status) => { const x = evidenceInput.products.find((entry) => entry.evidence_page.scientific_evidence_status === status); return { asin: x.asin, status, route: x.evidence_page.route }; }),
};

if (failures.length) {
  console.error(JSON.stringify({ result: 'FAIL', failures: failures.slice(0, 100), failureCount: failures.length, samples }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ result: 'PASS', products: products.length, uniqueAsins: 285, renderedProductRoutes: productPages.length, renderedEvidenceRoutes: evidencePages.length, science, popularity: { ranked, unavailable }, exactProductEfficacyClaims: 0, samples }, null, 2));
