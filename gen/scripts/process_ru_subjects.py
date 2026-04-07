#!/usr/bin/env python3
from utils import *
import pandas as pd

EXCLUDED_SUBJECTS = {
    "ドネツク州",
    "ルガンスク州",
    "ザポリージャ州",
    "ヘルソン州",
    "セヴァストポリ",
    "クリミア共和国",
}


def post_process(df: pd.DataFrame):
    return df[~df["name"].isin(EXCLUDED_SUBJECTS)]

INPUT_PATH = "gen/data/ru-subjects.json"
OUTPUT_PATH = "src/data/ru-subjects/subjects.json"

data = load_json(INPUT_PATH)

df = transform_data(
    data,
    group_key="subjectLabel",
    agg_map={
        "subjectLabel_ru": "first",
        "capitalLabel": join_unique_str,
        "capitalLabel_ru": "first",
        "iso2": "first",
    },
    rename_map={
        "subjectLabel": "name",
        "subjectLabel_ru": "nameNative",
        "capitalLabel": "capital",
        "capitalLabel_ru": "capitalNative",
        "iso2": "id",
    },
    post_process=post_process,
)

save_and_format(df, OUTPUT_PATH)
