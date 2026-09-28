const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({
  '&':'&amp;',
  '<':'&lt;',
  '>':'&gt;',
  '"':'&quot;',
  "'":'&#039;'
}[m]));

const asin=new URLSearchParams(location.search).get('asin');

function evidenceLabel(status){
  const map={
    VERIFIED_SUPPORTIVE:'Supportive evidence',
    MIXED:'Mixed evidence',
    INSUFFICIENT:'Insufficient evidence',
    VERIFICATION_REQUIRED:'Evidence verification required',
    NOT_ASSESSED:'Not assessed'
  };
  return map[status] || status || 'Not assessed';
}

fetch('/data/dog-joint/products.json',{cache:'no-store'})
  .then(r=>{
    if(!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  })
  .then(data=>{
    const rows=Array.isArray(data)?data:(data.products||data.items||data.data||[]);

    if(rows.length!==64){
      throw new Error(`Expected 64 products, got ${rows.length}`);
    }

    const x=rows.find(p=>p.asin===asin);
    const root=document.getElementById('article');

    if(!x){
      root.innerHTML=
        '<h1>Product not found</h1><p><a href="/pet/dog-joint">Return to the comparison table.</a></p>';
      return;
    }

    document.title=x.seo_title ||
      `${x.product_name} analysis | VSH Product Compare`;

    const canonical=document.querySelector('link[rel="canonical"]');
    if(canonical){
      canonical.setAttribute(
        'href',
        `https://www.vshdongyduoc.org/pet/dog-joint/product?asin=${encodeURIComponent(x.asin)}`
      );
    }

    const meta=document.querySelector('meta[name="description"]');
    if(meta && x.meta_description){
      meta.setAttribute('content',x.meta_description);
    }

    root.innerHTML=`
      <div class="eyebrow">VSH decision-support analysis</div>

      <h1>${esc(x.product_name)}</h1>

      <p class="lede">
        ${esc(x.page_summary)}
      </p>

      <div class="notice">
        <strong>Evidence boundary:</strong>
        Seller/listing information, VSH analysis and independent scientific evidence
        are separate layers. Ingredient- or formula-level evidence does not prove that
        this exact commercial product is effective.
      </div>

      <div class="kv">
        <div>ASIN</div><div>${esc(x.asin)}</div>
        <div>Brand</div><div>${esc(x.brand)}</div>
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
      <p>
        <strong>Evidence status:</strong>
        ${esc(evidenceLabel(x.scientific_evidence_status))}
      </p>

      <p>${esc(x.scientific_evidence_summary)}</p>

      <h2>What the evidence does not establish</h2>
      <p>${esc(x.scientific_limitations)}</p>

      <div class="notice">
        This scientific summary refers to relevant listed ingredients or formula
        categories. It is not evidence that this exact ASIN has been clinically tested.
      </div>

      <p>
        <a class="btn primary"
           target="_blank"
           rel="nofollow noopener noreferrer"
           href="${esc(x.amazon_url)}">
          View on Amazon
        </a>

        <a class="btn" href="/pet/dog-joint">
          Back to all ${rows.length} products
        </a>
      </p>
    `;
  })
  .catch(err=>{
    console.error(err);
    const root=document.getElementById('article');

    if(root){
      root.innerHTML=
        '<h1>Unable to load product analysis</h1><p><a href="/pet/dog-joint">Return to the comparison table.</a></p>';
    }
  });
