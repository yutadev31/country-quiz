#!/usr/bin/env python3
from utils import *

INPUT_PATH = "gen/data/de-states.json"
OUTPUT_PATH = "public/data/de-states.json"

data = load_json(INPUT_PATH)

df = transform_data(
    data,
    group_key="stateLabel",
    agg_map={
        "stateLabel_de": "first",
        "capitalLabel": join_unique_str,
        "capitalLabel_de": "first",
        "iso2": "first",
    },
    rename_map={
        "stateLabel": "name",
        "stateLabel_de": "nameNative",
        "capitalLabel": "capital",
        "capitalLabel_de": "capitalNative",
        "iso2": "id",
    },
)

save_and_format(df, OUTPUT_PATH)
