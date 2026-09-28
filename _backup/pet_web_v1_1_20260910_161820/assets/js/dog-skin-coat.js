const DATA_URL='/data/dog_skin_coat_72.json';
let all=[];
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
function unique(key){return [...new Set(all.map(x=>x[key]).filter(Boolean))].sort()}
function fill(id,key){const el=document.getElementById(id);for(const value of unique(key)){const option=document.createElement('option');option.value=value;option.textContent=value;el.appendChild(option)}}
function render(){
 const q=document.getElementById('q').value.toLowerCase().trim();
 const price=document.getElementById('price').value,need=document.getElementById('need').value,formula=document.getElementById('formula').value,form=document.getElementById('form').value;
 const rows=all.filter(x=>{
  const searchable=[x.asin,x.product_name,x.brand,x.primary_customer_need,x.formula_display,x.form_display,x.key_distinction,x.vsh_assessment,x.decision_question,x.scientific_evidence_status].join(' ').toLowerCase();
  return (!q||searchable.includes(q))&&(!price||x.price_tier===price)&&(!need||x.primary_customer_need===need)&&(!formula||x.formula_display===formula)&&(!form||x.form_display===form);
 });
 document.getElementById('count').textContent=`Showing ${rows.length} of ${all.length} products`;
 document.getElementById('tbody').innerHTML=rows.map(x=>`
 <tr>
  <td data-label="Product" class="product">${esc(x.product_name)}<span class="sub">${esc(x.brand)} · ${esc(x.asin)}</span></td>
  <td data-label="Formula / form" class="formula"><strong>${esc(x.formula_display)}</strong><span class="sub">${esc(x.form_display)}</span><span class="sub">${esc(x.key_distinction)}</span></td>
  <td data-label="Need / VSH assessment" class="take"><strong>${esc(x.primary_customer_need)}</strong><span class="sub">${esc(x.vsh_assessment)}</span><span class="sub"><strong>Key buying question:</strong> ${esc(x.decision_question)}</span></td>
  <td data-label="Price tier"><span class="badge ${esc(x.price_tier)}">${esc(x.price_tier)}</span></td>
  <td data-label="Evidence status"><span class="badge">${esc(x.scientific_evidence_status)}</span></td>
  <td data-label="Details"><a class="btn" href="${esc(x.target_url)}">View details</a></td>
  <td data-label="Amazon"><a class="btn primary" href="${esc(x.amazon_url)}" target="_blank" rel="nofollow noopener">View on Amazon</a><span class="sub">Direct, non-affiliate link</span></td>
 </tr>`).join('');
}
fetch(DATA_URL).then(response=>{if(!response.ok)throw new Error(`Dataset request failed: ${response.status}`);return response.json()}).then(data=>{
 all=data;
 fill('price','price_tier');fill('need','primary_customer_need');fill('formula','formula_display');fill('form','form_display');
 ['q','price','need','formula','form'].forEach(id=>document.getElementById(id).addEventListener('input',render));
 render();
}).catch(()=>{document.getElementById('count').textContent='The comparison data could not be loaded.'});
