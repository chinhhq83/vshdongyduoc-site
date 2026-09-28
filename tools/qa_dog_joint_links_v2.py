from pathlib import Path
from html.parser import HTMLParser
import urllib.request

ROOT = Path(r"G:\vshdongyduoc-site\vsh-landing-site")
BASE = "http://localhost:8000"

IGNORE_LOCAL_ONLY = {
    "/about",
    "/contact",
    "/methodology",
    "/privacy",
    "/terms",
}

files = [
    ROOT / "pet" / "dog-joint" / "index.html",
    ROOT / "dog-joint" / "research" / "popularity-brand-scientific-evidence" / "index.html",
]

files += list((ROOT / "dog-joint" / "evidence").rglob("index.html"))
files += list((ROOT / "dog-joint" / "products").rglob("index.html"))

class Parser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []

    def handle_starttag(self, tag, attrs):
        if tag != "a":
            return

        href = dict(attrs).get("href")

        if href and href.startswith("/"):
            self.links.append(href)

links = set()

for file in files:
    p = Parser()
    p.feed(file.read_text(encoding="utf-8"))

    links.update(p.links)

failed = []
ignored = []

for href in sorted(links):

    path_only = href.split("?")[0].rstrip("/")

    if path_only in IGNORE_LOCAL_ONLY:
        ignored.append(href)
        continue

    try:
        req = urllib.request.Request(
            BASE + href,
            headers={"User-Agent": "VSH-Local-QA"}
        )

        with urllib.request.urlopen(req) as r:
            print("PASS", r.status, href)

    except Exception as e:
        print("FAIL", href, "::", e)
        failed.append(href)

print()
print("LINKS =", len(links))
print("IGNORED VERCEL CLEANURL =", len(ignored))
print("FAILED =", len(failed))
