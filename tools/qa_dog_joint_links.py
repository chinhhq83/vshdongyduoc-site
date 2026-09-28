from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlparse
import urllib.request

ROOT = Path(r"G:\vshdongyduoc-site\vsh-landing-site")
BASE = "http://localhost:8000"

files = [
    ROOT / "pet" / "dog-joint" / "index.html",
    ROOT / "pet" / "dog-joint" / "product.html",
    ROOT / "dog-joint" / "research" / "popularity-brand-scientific-evidence" / "index.html",
]

files += list((ROOT / "dog-joint" / "evidence").rglob("index.html"))

class Parser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []

    def handle_starttag(self, tag, attrs):
        if tag != "a":
            return
        d = dict(attrs)
        href = d.get("href")
        if href:
            self.links.append(href)

links = set()

for file in files:
    text = file.read_text(encoding="utf-8")
    p = Parser()
    p.feed(text)

    for href in p.links:
        if href.startswith("/"):
            links.add(href)

failed = []

for href in sorted(links):
    url = BASE + href

    try:
        req = urllib.request.Request(
            url,
            headers={"User-Agent": "VSH-Local-QA"}
        )

        with urllib.request.urlopen(req) as r:
            code = r.status

        print(f"PASS {code} {href}")

    except Exception as e:
        print(f"FAIL {href} :: {e}")
        failed.append(href)

print()
print("INTERNAL LINKS =", len(links))
print("FAILED =", len(failed))

if failed:
    print("FAILED LINKS:")
    for x in failed:
        print(x)
