
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
const evidenceLabel=status=>status==='VERIFICATION_REQUIRED'?'Independent evidence check pending':status;
const asin=new URLSearchParams(location.search).get('asin');
fetch('/data/dog_joint_95.json').then(r=>r.json()).then(data=>{
 const x=data.find(p=>p.asin===asin);
 const root=document.getElementById('article');
 if(!x){root.innerHTML='<h1>Product not found</h1><p>Return to the comparison table.</p>';return}
 document.title=`${x.product_name} analysis | VSH Pet Product Compare`;
 document.querySelector('link[rel="canonical"]')?.setAttribute('href',`https://www.vshdongyduoc.org/pet/dog-joint/product?asin=${encodeURIComponent(x.asin)}`);
 root.innerHTML=`
 <div class="eyebrow">VSH decision-support analysis</div>
 <h1>${esc(x.product_name)}</h1>
 <p class="lede">${x.product_name_status==='VERIFIED'?'A practical summary of the product’s ingredients, format and main comparison points.':'The exact product name has not yet been confirmed from a reliable public source. This entry remains identified by ASIN.'}</p>
 <div class="notice"><strong>Evidence boundary:</strong> Seller/listing information describes captured product claims or composition. VSH analysis is a structured comparison, not evidence that a product works. Independent scientific evidence is assessed separately, and product-specific efficacy comparisons require appropriate supporting evidence.</div>
 <div class="kv"><div>ASIN</div><div>${esc(x.asin)}</div><div>Product name</div><div>${x.product_name_status==='VERIFIED'?'Verified':'Pending public-source verification'}</div><div>Primary need</div><div>${esc(x.primary_need)}</div><div>Price tier</div><div>${esc(x.price_tier)}</div><div>Ingredients</div><div>${esc(x.formula_display)}</div><div>Form</div><div>${esc(x.form_display)}</div></div>
 <h2>VSH assessment</h2><p>${esc(x.our_take)}</p>
 <h2>Decision question</h2><p>${esc(x.decision_question)}</p>
 <h2>Key feature</h2><p>${esc(x.key_distinction||'No clear differentiating feature has been confirmed.')}</p>
 <h2>Scientific evidence status</h2><p><strong>${esc(evidenceLabel(x.scientific_evidence_status))}</strong>. No independent source in the current dataset supports a product-specific efficacy comparison, so this page does not claim clinical superiority.</p>
 <p><a class="btn primary" target="_blank" rel="nofollow noopener" href="${esc(x.amazon_url)}">View on Amazon</a> <a class="btn" href="/pet/dog-joint">Back to all 95 products</a></p>`;
});
