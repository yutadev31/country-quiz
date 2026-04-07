#!/usr/bin/env python3
from utils import *

INPUT_PATH = "gen/data/es-communities.json"
OUTPUT_PATH = "public/data/es-communities.json"

data = load_json(INPUT_PATH)

df = transform_data(
    data,
    group_key="communityLabel",
    agg_map={
        "communityLabel_es": "first",
        "capitalLabel": join_unique_str,
        "capitalLabel_es": "first",
        "iso2": "first",
    },
    rename_map={
        "communityLabel": "name",
        "communityLabel_es": "nameNative",
        "capitalLabel": "capital",
        "capitalLabel_es": "capitalNative",
        "iso2": "id",
    },
)

save_and_format(df, OUTPUT_PATH)
