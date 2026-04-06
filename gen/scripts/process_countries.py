#!/usr/bin/env python3
from utils import *
import json
import pandas as pd

INPUT_PATH = "gen/data/countries.json"
OUTPUT_PATH = "src/data/countries/countries.json"

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


data = load_json(INPUT_PATH)
df = pd.DataFrame(data)

df = df[df["tldLabel"].str.match(r"^\.[a-z]{2}$")]
df = df[~df["tldLabel"].isin([".gb", ".su"])]

df = transform_data(
    df.to_dict("records"),
    group_key="countryLabel",
    agg_map={
        "capitalLabel": join_unique_str,
        "capitalLabel_native": unique_list,
        "continentLabel": join_continents,
        "countryLabel_native": unique_list,
        "iso2": "first",
        "tldLabel": "first",
    },
    rename_map={
        "countryLabel": "name",
        "countryLabel_native": "nameNative",
        "capitalLabel": "capital",
        "capitalLabel_native": "capitalNative",
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
        flag=df["id"].map(lambda country_id: f"https://flagcdn.com/{country_id}.svg"),
    ),
)

save_and_format(df, OUTPUT_PATH)

# areas.json
with open("src/data/countries/areas.json", "w", encoding="utf-8") as f:
    json.dump(list(dict.fromkeys(continent_map.values())), f, ensure_ascii=False)
run_biome_format("src/data/countries/areas.json")
