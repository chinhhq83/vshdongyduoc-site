const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const dataPath = path.join(repoRoot, 'data', 'dog_skin_coat_72.json');
const productsRoot = path.join(repoRoot, 'dog-skin-coat', 'products');
const expectedProductsRoot = path.resolve(repoRoot, 'dog-skin-coat', 'products');

const requiredFields = [
  'product_name',
  'brand',
  'asin',
  'slug',
  'formula_display',
  'form_display',
  'key_distinction',
  'primary_customer_need',
  'decision_question',
  'vsh_assessment',
  'price_tier',
  'scientific_evidence_status',
  'scientific_evidence_summary',
  'scientific_limitations',
  'amazon_url',
  'seo_title',
  'meta_description',
  'canonical_url',
];

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  })[character]);
}

function requireNonblank(row, field) {
  if (typeof row[field] !== 'string' || row[field].trim() === '') {
    throw new Error(`${row.asin || 'UNKNOWN ASIN'}: required field ${field} is blank`);
  }
}

function parseCitationField(raw, asin) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (typeof raw !== 'string') {
    throw new Error(`${asin}: scientific_evidence_citations must be an array or JSON string`);
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      throw new Error('parsed value is not an array');
    }
    return parsed;
  } catch (error) {
    throw new Error(`${asin}: scientific_evidence_citations is invalid JSON (${error.message})`);
  }
}

function renderSources(row) {
  const entries = [];

  if (typeof row.scientific_sources === 'string' && row.scientific_sources.trim()) {
    for (const source of row.scientific_sources.split(';').map((value) => value.trim()).filter(Boolean)) {
      const urlMatch = source.match(/https?:\/\/\S+$/);
      if (!urlMatch) {
        entries.push(`<li>${escapeHtml(source)}</li>`);
        continue;
      }

      const url = urlMatch[0];
      const label = source.slice(0, urlMatch.index).trim();
      entries.push(`<li>${label ? `${escapeHtml(label)} ` : ''}<a href="${escapeHtml(url)}" target="_blank" rel="noopener">${escapeHtml(url)}</a></li>`);
    }
  }

  for (const citation of parseCitationField(row.scientific_evidence_citations, row.asin)) {
    if (typeof citation === 'string') {
      entries.push(`<li>${escapeHtml(citation)}</li>`);
      continue;
    }

    if (!citation || typeof citation !== 'object') {
      throw new Error(`${row.asin}: invalid scientific citation entry`);
    }

    const label = citation.citation || citation.title || citation.url;
    if (!label) {
      throw new Error(`${row.asin}: scientific citation has no display text`);
    }

    if (citation.url) {
      entries.push(`<li><a href="${escapeHtml(citation.url)}" target="_blank" rel="noopener">${escapeHtml(label)}</a></li>`);
    } else {
      entries.push(`<li>${escapeHtml(label)}</li>`);
    }
  }

  return entries.length > 0
    ? `<ul>\n${entries.join('\n')}\n</ul>`
    : '<p>No scientific sources are listed in the current public dataset for this product.</p>';
}

function renderPage(row) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(row.seo_title)}</title>
<meta name="description" content="${escapeHtml(row.meta_description)}">
<link rel="canonical" href="${escapeHtml(row.canonical_url)}">
<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
<link rel="icon" href="/images/favicon.png" type="image/png">
<link rel="stylesheet" href="/assets/css/dog-joint.css">
</head>
<body>
<header class="site-header"><div class="wrap header-row"><a class="brand" href="/">VSH <small>Product Compare</small></a><nav aria-label="Primary"><a href="/pet/dog-joint">Dog Joint</a><a href="/dog-skin-coat" aria-current="page">Dog Skin &amp; Coat</a><a href="/methodology">Methodology</a><a href="/about">About VSH</a><a href="/contact">Contact</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a></nav></div></header>
<main><article class="article">
<div class="eyebrow">VSH decision-support analysis</div>
<h1>${escapeHtml(row.product_name)}</h1>

<div class="kv">
<div>ASIN</div><div>${escapeHtml(row.asin)}</div>
<div>Brand</div><div>${escapeHtml(row.brand)}</div>
<div>Formula</div><div>${escapeHtml(row.formula_display)}</div>
<div>Form</div><div>${escapeHtml(row.form_display)}</div>
<div>Primary customer need</div><div>${escapeHtml(row.primary_customer_need)}</div>
<div>Price tier</div><div>${escapeHtml(row.price_tier)}</div>
</div>

<h2>Key distinction</h2>
<p>${escapeHtml(row.key_distinction)}</p>

<h2>Decision question</h2>
<p>${escapeHtml(row.decision_question)}</p>

<h2>VSH assessment</h2>
<p>${escapeHtml(row.vsh_assessment)}</p>

<h2>Scientific evidence</h2>
<p><strong>Evidence status:</strong> ${escapeHtml(row.scientific_evidence_status)}</p>
<p>${escapeHtml(row.scientific_evidence_summary)}</p>

<h3>Scientific sources</h3>
${renderSources(row)}

<h2>Scientific limitations</h2>
<p>${escapeHtml(row.scientific_limitations)}</p>

<h2>View on Amazon</h2>
<p><a href="${escapeHtml(row.amazon_url)}" target="_blank" rel="nofollow noopener">${escapeHtml(row.amazon_url)}</a></p>

<h2>Back to comparison</h2>
<p><a href="/dog-skin-coat">Back to the VSH dog skin &amp; coat comparison</a></p>
</article></main>
<footer><div class="wrap"><strong>Viện Sinh Hóa Đông Y Dược</strong> · VSH Product Compare · <a href="mailto:vs.hd@vshdongyduoc.org">vs.hd@vshdongyduoc.org</a> · <a href="tel:+84938575161">+84 938 575 161</a><br><a href="/dog-skin-coat">Dog Skin &amp; Coat comparison</a> · <a href="/methodology">Methodology</a> · <a href="/about">About VSH</a> · <a href="/contact">Contact</a> · <a href="/privacy">Privacy Policy</a> · <a href="/terms">Terms / Disclaimer</a><br>Decision support, not veterinary diagnosis or individualized veterinary advice.</div></footer>
</body>
</html>
`;
}

const dataset = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
if (!Array.isArray(dataset)) {
  throw new Error('Dog Skin & Coat dataset must be a JSON array');
}

const products = dataset.filter((row) => row.publication_status === 'PUBLISH_READY');
if (products.length !== 52) {
  throw new Error(`Expected exactly 52 current public products, found ${products.length}`);
}

const asins = new Set();
const slugs = new Set();
for (const row of products) {
  for (const field of requiredFields) requireNonblank(row, field);

  if (asins.has(row.asin)) throw new Error(`Duplicate ASIN: ${row.asin}`);
  if (slugs.has(row.slug)) throw new Error(`Duplicate slug: ${row.slug}`);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(row.slug)) throw new Error(`${row.asin}: unsafe slug ${row.slug}`);
  if (/[?&]tag=/i.test(row.amazon_url)) throw new Error(`${row.asin}: amazon_url contains an affiliate tag`);

  const expectedCanonical = `https://www.vshdongyduoc.org/dog-skin-coat/products/${row.slug}/`;
  if (row.canonical_url !== expectedCanonical) {
    throw new Error(`${row.asin}: canonical_url does not match the route contract`);
  }

  asins.add(row.asin);
  slugs.add(row.slug);
  renderSources(row);
}

if (path.resolve(productsRoot) !== expectedProductsRoot) {
  throw new Error(`Refusing to rebuild unexpected path: ${productsRoot}`);
}

fs.rmSync(productsRoot, { recursive: true, force: true });
fs.mkdirSync(productsRoot, { recursive: true });

for (const row of products) {
  const productDirectory = path.join(productsRoot, row.slug);
  fs.mkdirSync(productDirectory, { recursive: true });
  fs.writeFileSync(path.join(productDirectory, 'index.html'), renderPage(row), 'utf8');
}

console.log(`Generated ${products.length} Dog Skin & Coat static detail pages.`);
