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

    const rows=Array.isArray(data)
      ? data
      : (data.products || data.items || data.data || []);

    const x=rows.find(p=>p.asin===asin);
    const root=document.getElementById('article');

    if(!x){
      root.innerHTML=`
        <h1>Product not found</h1>
        <p>
          <a href="/pet/dog-joint/">
            Return to the comparison table.
          </a>
        </p>`;
      return;
    }

    document.title=x.seo_title ||
      `${x.product_name} | VSH Product Compare`;

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

      <div class="eyebrow">
        VSH product decision support
      </div>

      <h1>${esc(x.product_name)}</h1>

      <p class="lede">
        ${esc(x.page_summary)}
      </p>

      <div class="notice">
        <strong>Evidence boundary:</strong>
        Amazon listing information, customer-popularity signals and independent
        scientific evidence are separate layers. Ingredient- or formula-level
        evidence does not prove that this exact commercial product is effective.
      </div>

      <div class="kv">

        <div>ASIN</div>
        <div>${esc(x.asin)}</div>

        <div>Brand</div>
        <div>${esc(x.brand)}</div>

        <div>Ingredients</div>
        <div>${esc(x.ingredient_display)}</div>

        <div>Form</div>
        <div>${esc(x.form_display)}</div>

        <div>Price tier</div>
        <div>${esc(x.price_tier_display)}</div>

        <div>Customer popularity</div>
        <div>
          ${esc(x.customer_popularity_display || 'Unavailable')}
        </div>

      </div>

      <h2>Product focus</h2>

      <p>
        ${esc(x.product_focus)}
      </p>

      <h2>Scientific evidence</h2>

      <p>
        <strong>Evidence status:</strong>
        ${esc(evidenceLabel(x.scientific_evidence_status))}
      </p>

      <p>
        ${esc(x.scientific_evidence_brief)}
      </p>

      <div class="notice">
        Scientific evidence refers to relevant listed ingredients or formula
        categories. Exact product dose, formulation, purity, bioavailability
        and co-ingredients may differ from studied interventions.
      </div>

      <p>
        ${x.scientific_evidence_url ? `
          <a class="btn"
             href="${esc(x.scientific_evidence_url)}">
             Read full scientific analysis
          </a>
        ` : ''}

        <a class="btn primary"
           target="_blank"
           rel="nofollow noopener noreferrer"
           href="${esc(x.amazon_url)}">
           View on Amazon
        </a>

        <a class="btn"
           href="/pet/dog-joint/">
           Back to all ${rows.length} products
        </a>
      </p>
    `;
  })
  .catch(err=>{

    console.error(err);

    const root=document.getElementById('article');

    if(root){
      root.innerHTML=`
        <h1>Unable to load product analysis</h1>
        <p>
          <a href="/pet/dog-joint/">
            Return to the comparison table.
          </a>
        </p>`;
    }
  });

document.addEventListener('DOMContentLoaded', function () {

  if (window.VSHAnalytics) {
    window.VSHAnalytics.track('product_detail_view', {
      asin: asin || 'unknown'
    });
  }

  document.addEventListener('click', function (event) {

    const link = event.target.closest('a');

    if (!link || !window.VSHAnalytics) return;

    if (link.href.includes('amazon.com')) {
      window.VSHAnalytics.track('amazon_click', {
        asin: asin || 'unknown'
      });
    }

    if (link.href.includes('/dog-joint/evidence/')) {
      window.VSHAnalytics.track('full_analysis_click', {
        asin: asin || 'unknown'
      });
    }
  });

});
