#!/usr/bin/env python3
from utils import *


def post_process(df):
    df["name"] = df["name"].replace(
        {
            "Franche-Comté": "フランシュ＝コンテ地域圏",
        }
    )

    df.loc[df["name"] == "オーヴェルニュ地域圏", "capital"] = "クレルモン＝フェラン"

    return df


INPUT_PATH = "gen/data/fr-regions.json"
OUTPUT_PATH = "src/data/fr-regions/regions.json"

data = load_json(INPUT_PATH)

df = transform_data(
    data,
    group_key="regionLabel",
    agg_map={
        "regionLabel_fr": "first",
        "capitalLabel": join_unique_str,
        "capitalLabel_fr": "first",
        "iso2": "first",
    },
    rename_map={
        "regionLabel": "name",
        "regionLabel_fr": "nameNative",
        "capitalLabel": "capital",
        "capitalLabel_fr": "capitalNative",
        "iso2": "id",
    },
    post_process=post_process,
)

save_and_format(df, OUTPUT_PATH)
