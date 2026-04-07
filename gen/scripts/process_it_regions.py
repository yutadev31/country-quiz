#!/usr/bin/env python3
from utils import *

INPUT_PATH = "gen/data/it-regions.json"
OUTPUT_PATH = "public/data/it-regions.json"

data = load_json(INPUT_PATH)

df = transform_data(
    data,
    group_key="regionLabel",
    agg_map={
        "regionLabel_it": "first",
        "capitalLabel": join_unique_str,
        "capitalLabel_it": "first",
        "iso2": "first",
    },
    rename_map={
        "regionLabel": "name",
        "regionLabel_it": "nameNative",
        "capitalLabel": "capital",
        "capitalLabel_it": "capitalNative",
        "iso2": "id",
    },
)

save_and_format(df, OUTPUT_PATH)
