#!/usr/bin/env python3
from utils import *
import pandas as pd

INPUT_PATH = "gen/data/jp-prefectures.json"
OUTPUT_PATH = "public/data/jp-prefectures.json"

data = load_json(INPUT_PATH)

df = pd.DataFrame(data)

df = df[~df["prefectureLabel_kana"].isin(["ふくをかけん"])]


def post_process(df: pd.DataFrame):
    df.loc[df["name"] == "愛知県", "capital"] = "名古屋市"
    df.loc[df["name"] == "愛知県", "capitalKana"] = "なごやし"
    return df


df = transform_data(
    df.to_dict("records"),
    group_key="prefectureLabel",
    agg_map={
        "prefectureLabel_kana": "first",
        "capitalLabel": join_unique_str,
        "capitalLabel_kana": "first",
        "iso2": "first",
    },
    rename_map={
        "prefectureLabel": "name",
        "prefectureLabel_kana": "nameKana",
        "capitalLabel": "capital",
        "capitalLabel_kana": "capitalKana",
        "iso2": "id",
    },
    post_process=post_process,
)

save_and_format(df, OUTPUT_PATH)
