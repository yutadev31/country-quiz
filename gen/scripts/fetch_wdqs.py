#!/usr/bin/env python3
import argparse
import glob
import json
import sys
import time
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen


WDQS_ENDPOINT = "https://query.wikidata.org/sparql"
SCRIPT_DIR = Path(__file__).resolve().parent
GEN_DIR = SCRIPT_DIR.parent
WDQS_DIR = GEN_DIR / "wdqs"
DATA_DIR = GEN_DIR / "data"


def parse_args():
    parser = argparse.ArgumentParser(
        description="Run WDQS SQL files and save flattened JSON into gen/data.",
    )
    parser.add_argument(
        "modes",
        nargs="*",
        help="Mode ids to fetch, e.g. us-states. If omitted, fetch all queries.",
    )
    parser.add_argument(
        "--delay",
        type=float,
        default=1.0,
        help="Seconds to wait between requests when fetching multiple queries.",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Overwrite existing output files.",
    )
    return parser.parse_args()


def get_query_paths(modes: list[str]) -> list[Path]:
    if modes:
        return [WDQS_DIR / f"{mode}.sql" for mode in modes]
    return sorted(Path(path) for path in glob.glob(str(WDQS_DIR / "*.sql")))


def validate_query_paths(query_paths: list[Path]):
    missing_paths = [path for path in query_paths if not path.exists()]
    if not missing_paths:
        return

    for path in missing_paths:
        print(f"Query file not found: {path}", file=sys.stderr)
    raise SystemExit(1)


def flatten_binding(binding: dict[str, Any], vars_order: list[str]) -> dict[str, Any]:
    row = {}
    for key in vars_order:
        value = binding.get(key)
        row[key] = value.get("value") if value else None

    # Preserve any unexpected extra bindings after the declared vars.
    for key, value in binding.items():
        if key not in row:
            row[key] = value.get("value")
    return row


def run_query(query: str) -> list[dict[str, Any]]:
    payload = urlencode({"query": query}).encode("utf-8")
    request = Request(
        WDQS_ENDPOINT,
        data=payload,
        headers={
            "Accept": "application/sparql-results+json",
            "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
            "User-Agent": "country-quiz-wdqs-fetcher/1.0 (local script)",
        },
        method="POST",
    )

    with urlopen(request) as response:
        result = json.load(response)

    vars_order = result.get("head", {}).get("vars", [])
    bindings = result.get("results", {}).get("bindings", [])
    return [flatten_binding(binding, vars_order) for binding in bindings]


def save_json(path: Path, rows: list[dict[str, Any]]):
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as file:
        json.dump(rows, file, ensure_ascii=False, indent=2)
        file.write("\n")


def main():
    args = parse_args()
    query_paths = get_query_paths(args.modes)
    validate_query_paths(query_paths)

    if not query_paths:
        print("No query files found.", file=sys.stderr)
        raise SystemExit(1)

    for index, query_path in enumerate(query_paths):
        mode_id = query_path.stem
        output_path = DATA_DIR / f"{mode_id}.json"

        if output_path.exists() and not args.force:
            print(f"Skip existing: {output_path}")
            continue

        query = query_path.read_text(encoding="utf-8")
        print(f"Fetching: {mode_id}")

        try:
            rows = run_query(query)
        except HTTPError as error:
            detail = error.read().decode("utf-8", errors="replace")
            print(f"HTTP error for {mode_id}: {error.code}", file=sys.stderr)
            print(detail, file=sys.stderr)
            raise SystemExit(1) from error
        except URLError as error:
            print(f"Network error for {mode_id}: {error.reason}", file=sys.stderr)
            raise SystemExit(1) from error

        save_json(output_path, rows)
        print(f"Saved {len(rows)} rows to {output_path}")

        is_last = index == len(query_paths) - 1
        if not is_last and args.delay > 0:
            time.sleep(args.delay)


if __name__ == "__main__":
    main()
