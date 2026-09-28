import json
import re
from pathlib import Path

root = Path(r"G:\vshdongyduoc-site\vsh-landing-site")
path = root / "data" / "dog-joint" / "products.json"

data = json.loads(path.read_text(encoding="utf-8-sig"))

MAX_BASE_LEN = 88

def normalize_base(slug: str, asin: str) -> str:
    slug = (slug or "").strip().lower().strip("-")
    asin = asin.lower()

    # Remove an already appended full ASIN if present.
    if slug.endswith("-" + asin):
        slug = slug[:-(len(asin) + 1)]
    elif slug == asin:
        slug = ""

    # Clean repeated separators.
    slug = re.sub(r"-+", "-", slug).strip("-")

    # Reserve room conceptually for ASIN by truncating descriptive portion.
    if len(slug) > MAX_BASE_LEN:
        slug = slug[:MAX_BASE_LEN].rstrip("-")

    return slug

changed = 0

for row in data:
    asin = row["asin"].strip()
    old_slug = row.get("slug", "")

    base = normalize_base(old_slug, asin)

    if base:
        new_slug = f"{base}-{asin.lower()}"
    else:
        new_slug = asin.lower()

    new_target = f"/dog-joint/products/{new_slug}/"

    if old_slug != new_slug or row.get("target_url") != new_target:
        changed += 1

    row["slug"] = new_slug
    row["target_url"] = new_target

path.write_text(
    json.dumps(data, indent=2, ensure_ascii=False) + "\n",
    encoding="utf-8-sig"
)

print("ROWS =", len(data))
print("CHANGED =", changed)
print("UNIQUE SLUGS =", len({x["slug"] for x in data}))
print("UNIQUE TARGET URLS =", len({x["target_url"] for x in data}))


