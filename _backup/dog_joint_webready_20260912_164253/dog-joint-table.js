const DATA_URL='/data/dog_joint_95.json';
let all=[];
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
function unique(k){return [...new Set(all.map(x=>x[k]).filter(Boolean))].sort()}
function fill(id,k){const el=document.getElementById(id); for(const v of unique(k)){const o=document.createElement('option');o.value=v;o.textContent=v;el.appendChild(o)}}
function evidenceLabel(status){return status==='VERIFICATION_REQUIRED'?'Independent evidence check pending':status}
function render(){
 const q=document.getElementById('q').value.toLowerCase().trim();
 const price=document.getElementById('price').value,
       need=document.getElementById('need').value,
       formula=document.getElementById('formula').value,
       form=document.getElementById('form').value;

 const rows=all.filter(x=>{
  const searchable=[
    x.asin,x.product_name,x.primary_customer_need,x.formula_display,
    x.form_display,x.key_distinction,x.vsh_assessment
  ].join(' ').toLowerCase();

  return (!q||searchable.includes(q)) &&
         (!price||x.price_tier===price) &&
         (!need||x.primary_customer_need===need) &&
         (!formula||x.formula_display===formula) &&
         (!form||x.form_display===form);
 });

 document.getElementById('count').textContent=`Showing ${rows.length} of ${all.length} products`;

 document.getElementById('tbody').innerHTML=rows.map(x=>`
 <tr>
  <td data-label="Product" class="product${x.product_name_status==='VERIFIED'?'':' unresolved'}">
    ${esc(x.product_name)}
    <span class="sub">${esc(x.asin)} · ${x.product_name_status==='VERIFIED'?'Name verified':'Exact name pending verification'}</span>
  </td>
  <td data-label="Ingredients / form" class="formula">
    <strong>${esc(x.formula_display)}</strong>
    <span class="sub">${esc(x.form_display)}${x.key_distinction?` · ${esc(x.key_distinction)}`:''}</span>
  </td>
  <td data-label="VSH assessment" class="take">
    ${esc(x.vsh_assessment)}
    <span class="sub">${esc(x.primary_customer_need)}</span>
  </td>
  <td data-label="Price tier">
    <span class="badge ${esc(x.price_tier)}">${esc(x.price_tier)}</span>
  </td>
  <td data-label="Analysis">
    <a class="btn" href="/pet/dog-joint/product?asin=${encodeURIComponent(x.asin)}">Read VSH analysis</a>
    <span class="sub">${esc(evidenceLabel(x.scientific_evidence_status))}</span>
  </td>
  <td data-label="Amazon">
    <a class="btn primary" href="${esc(x.amazon_url)}" target="_blank" rel="nofollow noopener">View on Amazon</a>
    <span class="sub">Direct, non-affiliate link</span>
  </td>
 </tr>`).join('');
}

fetch(DATA_URL)
 .then(r=>{if(!r.ok) throw new Error(`HTTP ${r.status}`); return r.json()})
 .then(d=>{
   all=Array.isArray(d)?d:(d.products||d.items||d.data||[]);
   fill('need','primary_customer_need');
   fill('formula','formula_display');
   fill('form','form_display');
   ['q','price','need','formula','form'].forEach(id=>document.getElementById(id).addEventListener('input',render));
   render();
 })
 .catch(err=>{
   console.error(err);
   document.getElementById('tbody').innerHTML='<tr><td colspan="6">Unable to load product data.</td></tr>';
 });
