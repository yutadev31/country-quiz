import json
from collections import defaultdict

# ファイル読み込み
with open("src/data/countries/countries.json", "r", encoding="utf-8") as f:
    data_a = json.load(f)

with open(
    "/home/yuta/Downloads/query-native-countries.json", "r", encoding="utf-8"
) as f:
    data_b = json.load(f)

# --- ① Bを集約（iso2ごとにnativeLabelをまとめる） ---
b_grouped = defaultdict(list)

for item in data_b:
    key = item["iso2"].lower()
    label = item.get("nativeLabel")

    if label:
        b_grouped[key].append(label)

# カンマ結合した辞書に変換
b_dict = {key: {"nameNative": labels} for key, labels in b_grouped.items()}

# --- ② Aとマージ ---
merged = []
for item in data_a:
    code = item.get("code")

    if code:
        key = code.lower()

        if key in b_dict:
            merged_item = {**item, **b_dict[key]}
            merged.append(merged_item)

# --- ③ 書き出し ---
with open("merged.json", "w", encoding="utf-8") as f:
    json.dump(merged, f, ensure_ascii=False, indent=2)
