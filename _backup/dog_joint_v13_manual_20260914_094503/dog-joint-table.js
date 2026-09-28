const DATA_URL='/data/dog-joint/products.json';
let all=[];

const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({
  '&':'&amp;',
  '<':'&lt;',
  '>':'&gt;',
  '"':'&quot;',
  "'":'&#039;'
}[m]));

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

function render(){
  const q=document.getElementById('q').value.toLowerCase().trim();
  const price=document.getElementById('price').value;
  const need=document.getElementById('need').value;
  const formula=document.getElementById('formula').value;
  const form=document.getElementById('form').value;

  const rows=all.filter(x=>{
    const searchable=[
      x.asin,
      x.product_name,
      x.brand,
      x.primary_customer_need,
      x.formula_display,
      x.form_display,
      x.key_distinction
    ].join(' ').toLowerCase();

    return (!q || searchable.includes(q)) &&
           (!price || x.price_tier===price) &&
           (!need || x.primary_customer_need===need) &&
           (!formula || x.formula_display===formula) &&
           (!form || x.form_display===form);
  });

  document.getElementById('count').textContent =
    `Showing ${rows.length} of ${all.length} products`;

  document.getElementById('tbody').innerHTML=rows.map(x=>`
    <tr>

      <td data-label="Product" class="product">
        <strong>${esc(x.product_name)}</strong>
        <span class="sub">${esc(x.asin)}</span>
      </td>

      <td data-label="Brand">
        ${esc(x.brand)}
      </td>

      <td data-label="Formula / Form" class="formula">
        <strong>${esc(x.formula_display)}</strong>
        <span class="sub">${esc(x.form_display)}</span>
      </td>

      <td data-label="Primary need">
        ${esc(x.primary_customer_need)}
      </td>

      <td data-label="Key distinction">
        ${esc(x.key_distinction)}
      </td>

      <td data-label="Price / evidence" class="evidence-cell">
        <span class="badge ${esc(x.price_tier)}">
          ${esc(x.price_tier)}
        </span>

        <span class="sub evidence-text">
          ${esc(evidenceLabel(x.scientific_evidence_status))}
        </span>
      </td>

      <td data-label="Details" class="details-cell">
        <a class="action-link"
           href="/pet/dog-joint/product?asin=${encodeURIComponent(x.asin)}">
          Read analysis
        </a>
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
    if(!r.ok){
      throw new Error(`HTTP ${r.status}`);
    }

    return r.json();
  })
  .then(d=>{

    all=Array.isArray(d)
      ? d
      : (d.products || d.items || d.data || []);

    if(all.length!==64){
      throw new Error(`Expected 64 products, got ${all.length}`);
    }

    fill('need','primary_customer_need');
    fill('formula','formula_display');
    fill('form','form_display');

    ['q','price','need','formula','form']
      .forEach(id=>{
        document
          .getElementById(id)
          .addEventListener('input',render);
      });

    render();
  })
  .catch(err=>{

    console.error(err);

    document.getElementById('tbody').innerHTML =
      '<tr><td colspan="8">Unable to load product data.</td></tr>';

  });
