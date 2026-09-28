from pathlib import Path

path = Path(r"G:\vshdongyduoc-site\vsh-landing-site\data\web-ready\dog-joint-v1_3\authority\articles\DOG_JOINT_POPULARITY_BRAND_SCIENCE.md")

lines = path.read_text(encoding="utf-8-sig").splitlines()

out = []

for line in lines:
    if "|" in line and "Median popularity score" in line:
        parts = [x.strip() for x in line.split("|")]
        parts = [x for x in parts if x != "Median popularity score"]
        line = " | ".join(parts)

    elif "|" in line:
        parts = line.split("|")

        # Brand table rows have 4 meaningful columns:
        # Brand | Product families | Median score | Median rank
        meaningful = [x for x in parts if x.strip()]

        if len(meaningful) == 4:
            # remove the third meaningful cell
            idxs = [i for i,x in enumerate(parts) if x.strip()]
            del parts[idxs[2]]
            line = "|".join(parts)

    out.append(line)

path.write_text("\n".join(out) + "\n", encoding="utf-8")
