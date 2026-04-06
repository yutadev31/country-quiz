#!/usr/bin/env python3
from utils import *

INPUT_PATH = "gen/data/ca-provinces.json"
OUTPUT_PATH = "src/data/ca-provinces/provinces.json"

data = load_json(INPUT_PATH)

df = transform_data(
    data,
    group_key="provinceLabel",
    agg_map={
        "provinceLabel_en": "first",
        "capitalLabel": join_unique_str,
        "iso2": "first",
    },
    rename_map={
        "provinceLabel": "name",
        "provinceLabel_en": "nameNative",
        "capitalLabel": "capital",
        "iso2": "id",
    },
)

save_and_format(df, OUTPUT_PATH)
