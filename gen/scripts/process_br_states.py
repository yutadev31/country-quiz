#!/usr/bin/env python3
from utils import *

INPUT_PATH = "gen/data/br-states.json"
OUTPUT_PATH = "src/data/br-states/states.json"

data = load_json(INPUT_PATH)

df = transform_data(
    data,
    group_key="stateLabel",
    agg_map={
        "stateLabel_pt": "first",
        "capitalLabel": join_unique_str,
        "capitalLabel_pt": "first",
        "iso2": "first",
    },
    rename_map={
        "stateLabel": "name",
        "stateLabel_pt": "nameNative",
        "capitalLabel": "capital",
        "capitalLabel_pt": "capitalNative",
        "iso2": "id",
    },
)

save_and_format(df, OUTPUT_PATH)
