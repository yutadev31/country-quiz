import json
from typing import Callable, Dict, Any
import subprocess

import pandas as pd


# ----------------------------
# 共通ユーティリティ
# ----------------------------
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
    df.to_json(path, orient="records", force_ascii=False)
    run_biome_format(path)


def check_duplicates(df: pd.DataFrame, key: str):
    if not df[df.duplicated(key, keep=False)].empty:
        print(f"Duplicate {key} found")


def join_unique_str(x):
    return ",".join(dict.fromkeys(x.dropna()))


def unique_list(x):
    return list(dict.fromkeys(x.dropna()))


# ----------------------------
# 汎用変換関数
# ----------------------------
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


# ----------------------------
# Countries
# ----------------------------
continent_map = {
    "アジア": "asia",
    "ヨーロッパ": "europe",
    "アフリカ": "africa",
    "北アメリカ": "north-america",
    "南アメリカ": "south-america",
    "オセアニア": "oceania",
    "オセアニア島嶼部": "oceania",
}


def join_continents(x):
    ids = [continent_map[v] for v in dict.fromkeys(x.dropna()) if v in continent_map]
    return list(dict.fromkeys(ids))


def process_countries(path: str):
    data = load_json(path)
    df = pd.DataFrame(data)

    # 前処理（ここだけ特殊）
    df = df[df["tldLabel"].str.match(r"^\.[a-z]{2}$")]
    df = df[~df["tldLabel"].isin([".gb", ".su"])]

    df = transform_data(
        df.to_dict("records"),
        group_key="countryLabel",
        agg_map={
            "capitalLabel": join_unique_str,
            "continentLabel": join_continents,
            "countryLabel_native": unique_list,
            "iso2": "first",
            "tldLabel": "first",
        },
        rename_map={
            "countryLabel": "name",
            "countryLabel_native": "nameNative",
            "capitalLabel": "capital",
            "continentLabel": "continent",
            "iso2": "id",
            "tldLabel": "domain",
        },
        post_process=lambda df: df.assign(
            name=df["name"].replace(
                {
                    "中華民国": "台湾",
                    "朝鮮民主主義人民共和国": "北朝鮮",
                }
            ),
            flag=df["id"].map(
                lambda country_id: f"https://flagcdn.com/{country_id}.svg"
            ),
        ),
    )

    save_and_format(df, "src/data/countries/countries.json")

    # areas.json
    with open("src/data/countries/areas.json", "w", encoding="utf-8") as f:
        json.dump(list(dict.fromkeys(continent_map.values())), f, ensure_ascii=False)
    run_biome_format("src/data/countries/areas.json")


# ----------------------------
# France Regions
# ----------------------------
def process_fr_regions(path: str):
    data = load_json(path)

    def post_process(df):
        # 名前の置換
        df["name"] = df["name"].replace(
            {
                "Franche-Comté": "フランシュ＝コンテ地域圏",
            }
        )

        # capitalの上書き
        df.loc[df["name"] == "オーヴェルニュ地域圏", "capital"] = "クレルモン＝フェラン"

        return df

    df = transform_data(
        data,
        group_key="regionLabel",
        agg_map={
            "regionLabel_fr": "first",
            "capitalLabel": join_unique_str,
            "iso2": "first",
        },
        rename_map={
            "regionLabel": "name",
            "regionLabel_fr": "nameNative",
            "capitalLabel": "capital",
            "iso2": "id",
        },
        post_process=post_process,
    )

    save_and_format(df, "src/data/fr-regions/regions.json")


# ----------------------------
# Germany States
# ----------------------------
def process_de_states(path: str):
    data = load_json(path)

    df = transform_data(
        data,
        group_key="stateLabel",
        agg_map={
            "stateLabel_de": "first",
            "capitalLabel": join_unique_str,
            "iso2": "first",
        },
        rename_map={
            "stateLabel": "name",
            "stateLabel_de": "nameNative",
            "capitalLabel": "capital",
            "iso2": "id",
        },
    )

    save_and_format(df, "src/data/de-states/states.json")


# ----------------------------
# US States
# ----------------------------
def process_us_states(path: str):
    data = load_json(path)

    df = transform_data(
        data,
        group_key="stateLabel",
        agg_map={
            "stateLabel_en": "first",
            "capitalLabel": join_unique_str,
            "iso2": "first",
        },
        rename_map={
            "stateLabel": "name",
            "stateLabel_en": "nameNative",
            "capitalLabel": "capital",
            "iso2": "id",
        },
        post_process=lambda df: df.assign(
            flag=df["id"].map(lambda state_id: f"https://flagcdn.com/{state_id}.svg")
        ),
    )

    save_and_format(df, "src/data/us-states/states.json")


# ----------------------------
# Canada Provinces
# ----------------------------
def process_ca_provinces(path: str):
    data = load_json(path)

    df = transform_data(
        data,
        group_key="provinceLabel",
        agg_map={
            "provinceLabel_en": "first",
            "capitalLabel": join_unique_str,
            "iso2": "first",
        },
        rename_map={
            "provinceLabel": "name",
            "provinceLabel_en": "nameNative",
            "capitalLabel": "capital",
            "iso2": "id",
        },
    )

    save_and_format(df, "src/data/ca-provinces/provinces.json")


# ----------------------------
# Mexico States
# ----------------------------
def process_mx_states(path: str):
    data = load_json(path)

    df = transform_data(
        data,
        group_key="stateLabel",
        agg_map={
            "stateLabel_es": "first",
            "capitalLabel": join_unique_str,
            "iso2": "first",
        },
        rename_map={
            "stateLabel": "name",
            "stateLabel_es": "nameNative",
            "capitalLabel": "capital",
            "iso2": "id",
        },
    )

    save_and_format(df, "src/data/mx-states/states.json")


# ----------------------------
# Brazil States
# ----------------------------
def process_br_states(path: str):
    data = load_json(path)

    df = transform_data(
        data,
        group_key="stateLabel",
        agg_map={
            "stateLabel_pt": "first",
            "capitalLabel": join_unique_str,
            "iso2": "first",
        },
        rename_map={
            "stateLabel": "name",
            "stateLabel_pt": "nameNative",
            "capitalLabel": "capital",
            "iso2": "id",
        },
    )

    save_and_format(df, "src/data/br-states/states.json")


# ----------------------------
# エントリポイント
# ----------------------------
if __name__ == "__main__":
    process_countries("gen/data/countries.json")
    process_fr_regions("gen/data/fr-regions.json")
    process_de_states("gen/data/de-states.json")
    process_us_states("gen/data/us-states.json")
    process_ca_provinces("gen/data/ca-provinces.json")
    process_mx_states("gen/data/mx-states.json")
    process_br_states("gen/data/br-states.json")
