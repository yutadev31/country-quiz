#!/usr/bin/env python3
from utils import *

INPUT_PATH = "gen/data/us-states.json"
OUTPUT_PATH = "src/data/us-states/states.json"

data = load_json(INPUT_PATH)

df = transform_data(
    data,
    group_key="stateLabel",
    agg_map={
        "stateLabel_en": "first",
        "capitalLabel": join_unique_str,
        "capitalLabel_en": "first",
        "iso2": "first",
    },
    rename_map={
        "stateLabel": "name",
        "stateLabel_en": "nameNative",
        "capitalLabel": "capital",
        "capitalLabel_en": "capitalNative",
        "iso2": "id",
    },
    post_process=lambda df: df.assign(
        flag=df["id"].map(lambda state_id: f"https://flagcdn.com/{state_id}.svg")
    ),
)

save_and_format(df, OUTPUT_PATH)
