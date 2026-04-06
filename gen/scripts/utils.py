import json
import os
from typing import Callable, Dict, Any
import subprocess
import pandas as pd


def load_json(path: str):
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def run_biome_format(path: str):
    try:
        subprocess.run(
            ["npx", "biome", "format", "--write", path],
            check=True,
        )
        print(f"Formatted: {path}")
    except subprocess.CalledProcessError as e:
        print(f"Biome format failed: {path}", e)


def save_and_format(df, path: str):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    df.to_json(path, orient="records", force_ascii=False)
    run_biome_format(path)


def check_duplicates(df: pd.DataFrame, key: str):
    if not df[df.duplicated(key, keep=False)].empty:
        print(f"Duplicate {key} found")


def join_unique_str(x):
    return ",".join(dict.fromkeys(x.dropna()))


def unique_list(x):
    return list(dict.fromkeys(x.dropna()))


def transform_data(
    data: list,
    group_key: str,
    agg_map: Dict[str, Any],
    rename_map: Dict[str, str],
    post_process: Callable[[pd.DataFrame], pd.DataFrame] = None,
):
    df = pd.DataFrame(data)

    df = df.groupby(group_key, as_index=False).agg(agg_map)

    # rename
    df = df.rename(columns=rename_map)

    # 共通処理
    if "id" in df.columns:
        df["id"] = df["id"].str.lower()

    # カスタム処理
    if post_process:
        df = post_process(df)

    check_duplicates(df, "name")

    return df
