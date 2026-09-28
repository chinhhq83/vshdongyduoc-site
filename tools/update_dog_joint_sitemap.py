from pathlib import Path
import json
import xml.etree.ElementTree as ET

ROOT = Path(r"G:\vshdongyduoc-site\vsh-landing-site")
SITE = "https://www.vshdongyduoc.org"

products = json.loads(
    (ROOT / "data" / "dog-joint" / "products.json").read_text(encoding="utf-8-sig")
)

routes = {
    "/pet/dog-joint/",
    "/dog-joint/research/popularity-brand-scientific-evidence/",
}

for x in products:
    routes.add(x["target_url"])

for page in (ROOT / "dog-joint" / "evidence").glob("*/index.html"):
    routes.add(f"/dog-joint/evidence/{page.parent.name}/")

sitemap = ROOT / "sitemap.xml"

ns = "http://www.sitemaps.org/schemas/sitemap/0.9"
ET.register_namespace("", ns)

if sitemap.exists():
    tree = ET.parse(sitemap)
    root = tree.getroot()
else:
    root = ET.Element(f"{{{ns}}}urlset")
    tree = ET.ElementTree(root)

existing = set()

for node in root.findall(f"{{{ns}}}url"):
    loc = node.find(f"{{{ns}}}loc")
    if loc is not None and loc.text:
        existing.add(loc.text.strip())

added = 0

for route in sorted(routes):
    url = SITE + route

    if url in existing:
        continue

    u = ET.SubElement(root, f"{{{ns}}}url")
    loc = ET.SubElement(u, f"{{{ns}}}loc")
    loc.text = url
    added += 1

tree.write(
    sitemap,
    encoding="utf-8",
    xml_declaration=True
)

print("ROUTES REQUESTED =", len(routes))
print("ADDED =", added)
print("TOTAL =", len(root.findall(f'{{{ns}}}url')))
