#!/usr/bin/env python3
from utils import *

INPUT_PATH = "gen/data/eg-governorates.json"
OUTPUT_PATH = "public/data/eg-governorates.json"

data = load_json(INPUT_PATH)

df = transform_data(
    data,
    group_key="governorateLabel",
    agg_map={
        "governorateLabel_ar": "first",
        "capitalLabel": join_unique_str,
        "capitalLabel_ar": "first",
        "iso2": "first",
    },
    rename_map={
        "governorateLabel": "name",
        "governorateLabel_ar": "nameNative",
        "capitalLabel": "capital",
        "capitalLabel_ar": "capitalNative",
        "iso2": "id",
    },
)

save_and_format(df, OUTPUT_PATH)
