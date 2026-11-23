#!/usr/bin/env python3
"""Build the single-file MYP 1 Year 7 practice companion."""
import base64
import re
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
SRC = HERE / "src"
TEMPLATE = HERE / "template.html"
OUT = ROOT / "myp1_maths_practice.html"
LOGO = ROOT / "etonhouse_logo.png"

ORDER = [
    "01_core.js",
    "02_units_number.js",
    "03_fractions_decimals.js",
    "04_integers_ratio_percent.js",
    "05_expressions_equations.js",
    "05b_diagrams.js",
    "06a_geometry_svgs.js",
    "06_geometry_measure.js",
    "07_data_probability.js",
    "08_myp_notes.js",
    "09_app.js",
]


def main():
    css = (SRC / "styles.css").read_text(encoding="utf-8")
    js = "\n\n".join((SRC / name).read_text(encoding="utf-8") for name in ORDER)
    html = TEMPLATE.read_text(encoding="utf-8")
    logo_b64 = base64.b64encode(LOGO.read_bytes()).decode("ascii")

    html = html.replace("__CSS__", css)
    html = html.replace("__JS__", js)
    html = html.replace("__LOGO__", "data:image/png;base64," + logo_b64)

    # Quick sanity checks.
    skill_ids = re.findall(r"S\('([^']+)',\s*'([^']+)'", js)
    ids = [unit + "-" + sid for unit, sid in skill_ids]
    dupes = sorted({i for i in ids if ids.count(i) > 1})
    if dupes:
        raise SystemExit("Duplicate skill ids: " + ", ".join(dupes))
    if "__CSS__" in html or "__JS__" in html or "__LOGO__" in html:
        raise SystemExit("Unreplaced placeholder remains")

    OUT.write_text(html, encoding="utf-8")
    print(f"Wrote {OUT.name}: {len(html):,} bytes, {len(ids)} skill definitions")


if __name__ == "__main__":
    main()
