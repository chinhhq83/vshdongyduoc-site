const DATA_URL='/data/dog-joint/products.json';
let all=[];

const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({
  '&':'&amp;',
  '<':'&lt;',
  '>':'&gt;',
  '"':'&quot;',
  "'":'&#039;'
}[m]));

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

function unique(k){
  return [...new Set(all.map(x=>x[k]).filter(Boolean))].sort();
}

function fill(id,k){
  const el=document.getElementById(id);
  for(const v of unique(k)){
    const o=document.createElement('option');
    o.value=v;
    o.textContent=v;
    el.appendChild(o);
  }
}

  function compactEvidence(x) {
    const url = (x.scientific_evidence_url || '').toLowerCase();

    const map = [
      ['glucosamine-chondroitin-dogs', 'High certainty', 'Low / inconsistent support'],
      ['omega-3-fish-oil-dogs', 'High certainty', 'Supportive'],
      ['green-lipped-mussel-dogs', 'High certainty', 'Supportive'],
      ['undenatured-type-ii-collagen-dogs', 'High certainty', 'Supportive'],
      ['eggshell-membrane-dogs', 'Moderate certainty', 'Supportive'],
      ['boswellia-curcumin-turmeric-dogs', 'Moderate certainty', 'Supportive'],
      ['msm-hyaluronic-acid-dogs', 'Limited certainty', 'Limited support'],
      ['asu-avocado-soybean-dogs', 'Limited certainty', 'Limited support']
    ];

    for (const [key, certainty, support] of map) {
      if (url.includes(key)) {
        return { certainty, support };
      }
    }

    return {
      certainty: 'Evidence assessed',
      support: x.scientific_evidence_status || 'See analysis'
    };
  }

  function compactEvidenceHtml(x) {
    const e = compactEvidence(x);

    return `
      <div class="evidence-compact">
        <span class="evidence-signal">${esc(e.certainty)}</span>
        <span class="evidence-signal">${esc(e.support)}</span>

        ${x.scientific_evidence_url ? `
          <a class="action-link evidence-analysis-link"
             href="${esc(x.scientific_evidence_url)}">
             Full analysis
          </a>
        ` : ''}
      </div>
    `;
  }



function render(){
  const q=document.getElementById('q').value.toLowerCase().trim();
  const price=document.getElementById('price').value;
  const evidence=document.getElementById('evidence').value;
  const form=document.getElementById('form').value;

  const rows=all.filter(x=>{
    const searchable=[
      x.asin,
      x.product_name,
      x.brand,
      x.ingredient_display,
      x.form_display,
      x.product_focus,
      x.scientific_evidence_brief
    ].join(' ').toLowerCase();

    return (!q || searchable.includes(q)) &&
           (!price || x.price_tier===price) &&
           (!evidence || x.scientific_evidence_status===evidence) &&
           (!form || x.form_display===form);
  });

  document.getElementById('count').textContent =
    `Showing ${rows.length} of ${all.length} products`;

  document.getElementById('tbody').innerHTML=rows.map(x=>`
    <tr>

      <td data-label="Product" class="product">
        <a href="${esc(x.target_url)}">
          <strong>${esc(x.product_name)}</strong>
        </a>
        <span class="sub">${esc(x.brand)}  ${esc(x.asin)}</span>
      </td>

      <td data-label="Ingredients / Form">
        <strong>${esc(x.ingredient_display)}</strong>
        <span class="sub">${esc(x.form_display)}</span>
      </td>

      <td data-label="Product focus">
        ${esc(x.product_focus)}
      </td>

      <td data-label="Price tier">
        <span class="badge ${esc(String(x.price_tier).toLowerCase())}">
          ${esc(x.price_tier_display)}
        </span>
      </td>

      <td data-label="Customer popularity">
        <strong>${esc(x.customer_popularity_display || 'Unavailable')}</strong>
        <span class="sub">
          ${x.customer_popularity_confidence
            ? `Confidence: ${esc(x.customer_popularity_confidence)}`
            : ''}
        </span>
      </td>

      <td data-label="Scientific evidence" class="evidence-cell">
        ${compactEvidenceHtml(x)}
      </td>

      <td data-label="Amazon" class="amazon-cell">
        <a class="action-link amazon-link"
           href="${esc(x.amazon_url)}"
           target="_blank"
           rel="nofollow noopener noreferrer">
           View on Amazon
        </a>
      </td>

    </tr>
  `).join('');
}

fetch(DATA_URL,{cache:'no-store'})
  .then(r=>{
    if(!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  })
  .then(d=>{
    all=Array.isArray(d) ? d : (d.products || d.items || d.data || []);

    fill('price','price_tier');
    fill('evidence','scientific_evidence_status');
    fill('form','form_display');

    ['q','price','evidence','form'].forEach(id=>{
      document.getElementById(id).addEventListener('input',render);
    });

    render();
  })
  .catch(err=>{
    console.error(err);
    document.getElementById('tbody').innerHTML =
      '<tr><td colspan="7">Unable to load product data.</td></tr>';
  });

document.addEventListener('DOMContentLoaded', function () {

  if (window.VSHAnalytics) {
    window.VSHAnalytics.track('page_view', {
      page_type: 'dog_joint_comparison'
    });
  }

  document.addEventListener('click', function (event) {

    const amazon = event.target.closest('.amazon-link');

    if (amazon && window.VSHAnalytics) {
      window.VSHAnalytics.track('amazon_click', {
        page_type: 'comparison'
      });
    }

    const evidence = event.target.closest('a[href*="/dog-joint/evidence/"]');

    if (evidence && window.VSHAnalytics) {
      window.VSHAnalytics.track('full_analysis_click', {
        page_type: 'comparison'
      });
    }
  });

  ['q','price','evidence','form'].forEach(function(id){

    const el = document.getElementById(id);

    if (!el) return;

    el.addEventListener('change', function(){

      if (window.VSHAnalytics) {
        window.VSHAnalytics.track('filter_used', {
          filter: id
        });
      }
    });
  });

});

