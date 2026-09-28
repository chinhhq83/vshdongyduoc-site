from pathlib import Path
import json
import xml.etree.ElementTree as ET

ROOT = Path(r"G:\vshdongyduoc-site\vsh-landing-site")
SITEMAP = ROOT / "sitemap.xml"
PRODUCTS = ROOT / "data" / "dog-joint" / "products.json"

BASE = "https://www.vshdongyduoc.org"

with PRODUCTS.open("r", encoding="utf-8-sig") as f:
    products = json.load(f)

product_urls = [
    BASE + p["target_url"]
    for p in products
]

evidence_urls = [
    f"{BASE}/dog-joint/evidence/asu-avocado-soybean-dogs/",
    f"{BASE}/dog-joint/evidence/boswellia-curcumin-turmeric-dogs/",
    f"{BASE}/dog-joint/evidence/eggshell-membrane-dogs/",
    f"{BASE}/dog-joint/evidence/glucosamine-chondroitin-dogs/",
    f"{BASE}/dog-joint/evidence/green-lipped-mussel-dogs/",
    f"{BASE}/dog-joint/evidence/msm-hyaluronic-acid-dogs/",
    f"{BASE}/dog-joint/evidence/omega-3-fish-oil-dogs/",
    f"{BASE}/dog-joint/evidence/undenatured-type-ii-collagen-dogs/",
]

required_urls = [
    f"{BASE}/pet/dog-joint/",
    f"{BASE}/dog-joint/",
    f"{BASE}/dog-joint/evidence/",
    f"{BASE}/dog-joint/research/popularity-brand-scientific-evidence/",
    f"{BASE}/scientific-methodology/",
    f"{BASE}/how-we-evaluate-products/",
] + evidence_urls + product_urls

tree = ET.parse(SITEMAP)
root = tree.getroot()

ns = ""
if root.tag.startswith("{"):
    ns = root.tag.split("}")[0] + "}"

# Remove all existing dog-joint URLs
for url_node in list(root):
    loc = url_node.find(f"{ns}loc")
    if loc is None or not loc.text:
        continue

    u = loc.text.strip()

    if (
        "/dog-joint/" in u
        or u.rstrip("/") == f"{BASE}/pet/dog-joint"
        or u.rstrip("/") == f"{BASE}/scientific-methodology"
        or u.rstrip("/") == f"{BASE}/how-we-evaluate-products"
    ):
        root.remove(url_node)

# Add current approved URLs
for u in required_urls:
    url_node = ET.SubElement(root, f"{ns}url")
    loc = ET.SubElement(url_node, f"{ns}loc")
    loc.text = u

ET.indent(tree, space="  ")
tree.write(SITEMAP, encoding="utf-8", xml_declaration=True)

print("SITEMAP UPDATED")
print("PRODUCT URLS =", len(product_urls))
print("EVIDENCE URLS =", len(evidence_urls))
print("TOTAL ADDED =", len(required_urls))
