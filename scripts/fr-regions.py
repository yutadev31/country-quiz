import json
import sys

import pandas as pd

# continent_map = {
#     "アジア": "asia",
#     "ヨーロッパ": "europe",
#     "アフリカ": "africa",
#     "北アメリカ": "north-america",
#     "南アメリカ": "south-america",
#     "オセアニア": "oceania",
#     "オセアニア島嶼部": "oceania",
# }


with open(sys.argv[1]) as f:
    data = json.load(f)

df = pd.DataFrame(data)

# # TLDが2文字のアルファベットのものだけを抽出
# df = df[df["tldLabel"].str.match(r"^\.[a-z]{2}$")]

# # 一部のTLDを削除
# df = df[~df["tldLabel"].isin([".gb", ".su"])]

# 首都と大陸をカンマ区切りに変換
df = df.groupby("regionLabel", as_index=False).agg(
    {
        "capitalLabel": lambda x: ",".join(dict.fromkeys(x.dropna())),
        "iso2": "first",
    }
)

# ISO2を小文字に変換
df["iso2"] = df["iso2"].str.lower()

# # 特定の国の名前を変換
# df["countryLabel"] = df["countryLabel"].replace(
#     {
#         "中華民国": "台湾",
#         "朝鮮民主主義人民共和国": "北朝鮮",
#     }
# )

# カラム名を変更
df = df.rename(
    columns={
        "regionLabel": "name",
        "capitalLabel": "capital",
        "iso2": "code",
    }
)

if not df[df.duplicated("name", keep=False)].empty:
    print("Duplicate country labels found")

df.to_json("src/data/fr-regions.json", orient="records", force_ascii=False)
