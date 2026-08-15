#!/usr/bin/env python3
"""Check every external link in data/links.json and flag the broken ones.

    ./tools/check-links.py            # report only
    ./tools/check-links.py --write    # also update data/links.json

Links that fail get "status": "unreachable", which the site renders dimmed with
a marker. Working links carry no status key at all, so the file stays clean.

Bot protection (401/403/405/429/503) counts as working — those sites load fine
in a real browser and only refuse scripted requests. Pages that return 200 but
are parked, for sale, or a shutdown notice count as broken, because the
resource a visitor came for is not there.
"""
import json
import re
import subprocess
import sys
import datetime
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LINKS = ROOT / "data" / "links.json"

UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/126.0 Safari/537.36")

ALIVE_BUT_BLOCKED = {401, 403, 405, 406, 429, 503}

# 200-response bodies that mean the resource is gone anyway.
GONE = re.compile(
    r"(domain (is )?(for sale|may be for sale)|buy this domain|this domain (is|has) expired"
    r"|parked (free )?(at|by|courtesy)|domain parking|inquire about this domain"
    r"|sedoparking|hugedomains|afternic|dan\.com/buy-domain"
    r"|thanks from bittrex|has (ceased|discontinued) operations|winding down"
    r"|account suspended|website (is )?coming soon)", re.I)


def fetch(url, timeout=20):
    p = subprocess.run(
        ["curl", "-sSL", "--max-time", str(timeout), "--compressed", "-A", UA,
         "-H", "Accept-Language: en-US,en;q=0.9",
         "-w", "\n@@@%{http_code}@@@"],
        capture_output=True, text=True, errors="replace", input=None)
    return p


def probe(url, timeout=20):
    p = subprocess.run(
        ["curl", "-sSL", "--max-time", str(timeout), "--compressed", "-A", UA,
         "-H", "Accept-Language: en-US,en;q=0.9",
         "-w", "\n@@@%{http_code}@@@%{url_effective}@@@", url],
        capture_output=True, text=True, errors="replace")
    m = re.search(r"\n@@@(\d+)@@@(.*)@@@\s*$", p.stdout, re.S)
    if not m:
        return None, url, "", p.stderr.strip()[:120]
    return int(m.group(1)), m.group(2), p.stdout[: m.start()][:20000], ""


def classify(url):
    """Return (ok: bool, reason: str)."""
    code, eff, body, err = probe(url)
    if not code:
        code, eff, body, err = probe(url, timeout=30)  # one retry for blips
    if not code:
        return False, f"no response ({err})"
    if code in ALIVE_BUT_BLOCKED:
        return True, f"{code} bot protection"
    if 200 <= code < 300:
        hit = GONE.search(body)
        return (False, f"200 but {hit.group(0)[:40]!r}") if hit else (True, str(code))
    if 300 <= code < 400:
        return True, str(code)
    return False, str(code)


def main():
    write = "--write" in sys.argv
    data = json.loads(LINKS.read_text())

    jobs = []
    for cat, links in data.items():
        if cat.startswith("_") or not isinstance(links, list):
            continue
        for link in links:
            if link["link"].startswith("http"):
                jobs.append((cat, link))

    print(f"checking {len(jobs)} external links…", file=sys.stderr)
    with ThreadPoolExecutor(max_workers=12) as ex:
        verdicts = list(ex.map(lambda j: classify(j[1]["link"]), jobs))

    broken = 0
    for (cat, link), (ok, reason) in zip(jobs, verdicts):
        if ok:
            link.pop("status", None)
        else:
            link["status"] = "unreachable"
            broken += 1
            print(f"  BROKEN  {cat:14} {link['text']:26} {reason:34} {link['link']}")

    print(f"\n{len(jobs) - broken} ok, {broken} broken", file=sys.stderr)

    if write:
        data["_checked"] = datetime.date.today().isoformat()
        LINKS.write_text(render(data))
        print(f"updated {LINKS.relative_to(ROOT)}", file=sys.stderr)
    else:
        print("(run with --write to update data/links.json)", file=sys.stderr)


def render(data):
    """Serialize with one link per line, preserving key order."""
    out = ["{"]
    keys = list(data.keys())
    for i, key in enumerate(keys):
        val = data[key]
        tail = "" if i == len(keys) - 1 else ","
        if key == "_categories":
            out.append('  "_categories": {')
            cats = list(val.items())
            for j, (name, meta) in enumerate(cats):
                comma = "" if j == len(cats) - 1 else ","
                out.append(f"    {json.dumps(name)}: {json.dumps(meta)}{comma}")
            out.append("  }" + tail)
        elif isinstance(val, list):
            out.append(f"  {json.dumps(key)}: [")
            for j, link in enumerate(val):
                comma = "" if j == len(val) - 1 else ","
                out.append(f"    {json.dumps(link)}{comma}")
            out.append("  ]" + tail)
        else:
            out.append(f"  {json.dumps(key)}: {json.dumps(val)}{tail}")
    out.append("}")
    return "\n".join(out) + "\n"


if __name__ == "__main__":
    main()
