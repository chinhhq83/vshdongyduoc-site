from pathlib import Path
import re

path = Path(r"G:\vshdongyduoc-site\vsh-landing-site\assets\js\dog-joint-table.js")

text = path.read_text(encoding="utf-8-sig")

helper = r'''
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

'''

if "function compactEvidence(" not in text:
    marker = re.search(r'(\s*function\s+render\s*\()', text)

    if not marker:
        raise SystemExit("STOP: function render() not found")

    pos = marker.start()
    text = text[:pos] + "\n" + helper + text[pos:]


pattern = re.compile(
    r'<td\s+data-label="Scientific evidence"[^>]*>.*?</td>\s*'
    r'(?=<td\s+data-label="Amazon")',
    re.DOTALL
)

replacement = '''<td data-label="Scientific evidence" class="evidence-cell">
        ${compactEvidenceHtml(x)}
      </td>

      '''

text, count = pattern.subn(replacement, text, count=1)

if count != 1:
    raise SystemExit(
        f"STOP: expected to replace 1 scientific evidence cell, replaced {count}"
    )

path.write_text(text, encoding="utf-8")

print("PATCHED dog-joint-table.js")
print("SCIENTIFIC EVIDENCE CELL =", count)
