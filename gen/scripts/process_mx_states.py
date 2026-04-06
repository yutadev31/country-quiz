#!/usr/bin/env python3
from utils import *

INPUT_PATH = "gen/data/mx-states.json"
OUTPUT_PATH = "src/data/mx-states/states.json"

data = load_json(INPUT_PATH)

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

save_and_format(df, OUTPUT_PATH)
