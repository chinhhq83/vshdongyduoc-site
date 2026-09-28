const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const sourceRoot = path.resolve(process.argv[2] || 'E:\\ChatGPT\\amazon\\amazon-scraper\\dog_skin_coat\\runs\\stage2_2026-09-12T08-07-54-595Z_pxl73f\\WEB_READY_HANDOFF_DOG_SKIN_COAT_V1_3');
const products = JSON.parse(fs.readFileSync(path.join(sourceRoot, 'web_data', 'WEB_READY_PRODUCTS.json'), 'utf8').replace(/^\uFEFF/, ''));
const evidence = JSON.parse(fs.readFileSync(path.join(sourceRoot, 'evidence', 'EVIDENCE_PAGE_INPUT_V1.json'), 'utf8').replace(/^\uFEFF/, ''));
const sitemapPath = path.join(repoRoot, 'sitemap.xml');
let sitemap = fs.readFileSync(sitemapPath, 'utf8');

const routes = [
  '/pet/dog-skin-coat/',
  '/editorial-policy/',
  ...products.map((product) => product.target_url),
  ...evidence.products.map((entry) => entry.evidence_page.route),
];
const uniqueRoutes = [...new Set(routes)];
if (uniqueRoutes.length !== 572) throw new Error(`Expected 572 intended routes, found ${uniqueRoutes.length}`);

const additions = [];
for (const route of uniqueRoutes) {
  const url = `https://www.vshdongyduoc.org${route}`;
  const normalized = url.replace(/\/$/, '');
  if (sitemap.includes(`<ns0:loc>${url}</ns0:loc>`) || sitemap.includes(`<ns0:loc>${normalized}</ns0:loc>`)) continue;
  additions.push(`  <ns0:url>\n    <ns0:loc>${url}</ns0:loc>\n    <ns0:lastmod>2026-09-12</ns0:lastmod>\n  </ns0:url>`);
}

const closingTag = '</ns0:urlset>';
if (!sitemap.includes(closingTag)) throw new Error('Unexpected sitemap root');
sitemap = sitemap.replace(closingTag, `${additions.join('\n')}\n${closingTag}`);
fs.writeFileSync(sitemapPath, sitemap, 'utf8');
console.log(`Added ${additions.length} Dog Skin & Coat and trust routes; preserved existing sitemap entries.`);
