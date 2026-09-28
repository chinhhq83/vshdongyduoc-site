const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
const evidenceLabel=status=>status==='VERIFICATION_REQUIRED'?'Independent evidence check pending':status;
const asin=new URLSearchParams(location.search).get('asin');

function parseCitations(raw){
  if(!raw) return [];
  if(Array.isArray(raw)) return raw;
  try{
    const parsed=JSON.parse(raw);
    return Array.isArray(parsed)?parsed:[];
  }catch{
    return [];
  }
}

function scopeLabel(scope){
  return scope==='INGREDIENT_LEVEL_ONLY' ? 'Ingredient-level evidence only' : (scope||'Evidence scope not specified');
}

fetch('/data/dog_joint_95.json',{cache:'no-store'})
 .then(r=>{if(!r.ok) throw new Error(`HTTP ${r.status}`); return r.json()})
 .then(data=>{
  const rows=Array.isArray(data)?data:(data.products||data.items||data.data||[]);
  const x=rows.find(p=>p.asin===asin);
  const root=document.getElementById('article');

  if(!x){
    root.innerHTML='<h1>Product not found</h1><p><a href="/pet/dog-joint">Return to the comparison table.</a></p>';
    return;
  }

  document.title=x.seo_title || `${x.product_name} analysis | VSH Pet Product Compare`;

  const canonical=document.querySelector('link[rel="canonical"]');
  if(canonical){
    canonical.setAttribute('href', x.canonical_url || `https://www.vshdongyduoc.org/pet/dog-joint/product?asin=${encodeURIComponent(x.asin)}`);
  }

  const meta=document.querySelector('meta[name="description"]');
  if(meta && x.meta_description){
    meta.setAttribute('content',x.meta_description);
  }

  const citations=parseCitations(x.scientific_evidence_citations);
  const citationsHtml=citations.length
    ? `<ul>${citations.map(c=>`<li><a href="${esc(c.url)}" target="_blank" rel="noopener">${esc(c.citation)}</a></li>`).join('')}</ul>`
    : (x.scientific_sources
        ? `<p>${String(x.scientific_sources).split(';').map(u=>u.trim()).filter(Boolean).map(u=>`<a href="${esc(u)}" target="_blank" rel="noopener">${esc(u)}</a>`).join('<br>')}</p>`
        : '<p>No independent scientific citation is available in the current public handoff.</p>');

  root.innerHTML=`
  <div class="eyebrow">VSH decision-support analysis</div>
  <h1>${esc(x.product_name)}</h1>

  <p class="lede">${esc(x.page_summary || 'A practical comparison summary of this product’s formula, format, buying considerations and independent ingredient-level evidence.')}</p>

  <div class="notice">
    <strong>Evidence boundary:</strong>
    Seller/listing information, VSH structured analysis and independent scientific evidence are separate layers.
    The studies cited below evaluate listed ingredients, specific ingredient preparations or defined study combinations;
    they do not test this exact commercial formula or ASIN unless explicitly stated.
  </div>

  <div class="kv">
    <div>ASIN</div><div>${esc(x.asin)}</div>
    <div>Brand</div><div>${esc(x.brand)}</div>
    <div>Product name</div><div>${x.product_name_status==='VERIFIED'?'Verified':'Pending public-source verification'}</div>
    <div>Primary need</div><div>${esc(x.primary_customer_need)}</div>
    <div>Price tier</div><div>${esc(x.price_tier)}</div>
    <div>Formula</div><div>${esc(x.formula_display)}</div>
    <div>Form</div><div>${esc(x.form_display)}</div>
  </div>

  <h2>VSH assessment</h2>
  <p>${esc(x.vsh_assessment)}</p>

  <h2>Decision question</h2>
  <p>${esc(x.decision_question)}</p>

  <h2>Key distinction</h2>
  <p>${esc(x.key_distinction)}</p>

  <h2>Scientific evidence</h2>
  <p><strong>Evidence status:</strong> ${esc(evidenceLabel(x.scientific_evidence_status))}</p>
  <p><strong>Evidence scope:</strong> ${esc(scopeLabel(x.scientific_evidence_scope))}</p>
  <p>${esc(x.scientific_evidence_summary)}</p>

  <h3>Sources</h3>
  ${citationsHtml}

  <h2>What the evidence does not show</h2>
  <p>${esc(x.scientific_limitations)}</p>

  <p>
    <a class="btn primary" target="_blank" rel="nofollow noopener" href="${esc(x.amazon_url)}">View on Amazon</a>
    <a class="btn" href="/pet/dog-joint">Back to all ${rows.length} products</a>
  </p>`;
 })
 .catch(err=>{
   console.error(err);
   const root=document.getElementById('article');
   if(root) root.innerHTML='<h1>Unable to load product analysis</h1><p><a href="/pet/dog-joint">Return to the comparison table.</a></p>';
 });
