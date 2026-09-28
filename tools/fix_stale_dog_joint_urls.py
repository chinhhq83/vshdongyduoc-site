import json
from pathlib import Path

ROOT = Path(r"G:\vshdongyduoc-site\vsh-landing-site")

current_path = ROOT / "data" / "dog-joint" / "products.json"

backups = sorted(
    (ROOT / "data" / "dog-joint").glob("products_before_slug_fix_*.json"),
    key=lambda p: p.stat().st_mtime,
    reverse=True
)

if not backups:
    raise SystemExit("STOP: no products_before_slug_fix backup found")

backup_path = backups[0]

current = json.loads(current_path.read_text(encoding="utf-8-sig"))
old = json.loads(backup_path.read_text(encoding="utf-8-sig"))

current_by_asin = {x["asin"]: x for x in current}
old_by_asin = {x["asin"]: x for x in old}

mapping = {}

for asin, old_row in old_by_asin.items():
    new_row = current_by_asin.get(asin)
    if not new_row:
        continue

    old_url = old_row.get("target_url")
    new_url = new_row.get("target_url")

    if old_url and new_url and old_url != new_url:
        mapping[old_url] = new_url

print("BACKUP =", backup_path.name)
print("URL MAPPINGS =", len(mapping))

targets = []

# Source evidence Markdown
targets += list(
    (
        ROOT
        / "data"
        / "web-ready"
        / "dog-joint-v1_3"
        / "evidence"
        / "evidence_pages"
    ).glob("*.md")
)

# Authority source
targets += list(
    (
        ROOT
        / "data"
        / "web-ready"
        / "dog-joint-v1_3"
        / "authority"
    ).rglob("*.md")
)

# Rendered evidence
targets += list(
    (ROOT / "dog-joint" / "evidence").rglob("*.html")
)

# Rendered research
targets += list(
    (ROOT / "dog-joint" / "research").rglob("*.html")
)

# Dog-joint HTML/JS
targets += list(
    (ROOT / "pet" / "dog-joint").rglob("*.html")
)

targets += list(
    (ROOT / "assets" / "js").glob("dog-joint*.js")
)

changed_files = 0
replacements = 0

for file in targets:
    try:
        text = file.read_text(encoding="utf-8-sig")
    except UnicodeDecodeError:
        continue

    original = text

    for old_url, new_url in mapping.items():
        count = text.count(old_url)

        if count:
            text = text.replace(old_url, new_url)
            replacements += count

    if text != original:
        file.write_text(text, encoding="utf-8")
        changed_files += 1
        print("UPDATED", file.relative_to(ROOT))

print()
print("CHANGED FILES =", changed_files)
print("REPLACEMENTS =", replacements)
