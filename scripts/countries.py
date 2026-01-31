import json
import sys

import pandas as pd

continent_map = {
    "アジア": "asia",
    "ヨーロッパ": "europe",
    "アフリカ": "africa",
    "北アメリカ": "north-america",
    "南アメリカ": "south-america",
    "オセアニア": "oceania",
    "オセアニア島嶼部": "oceania",
}


def join_unique_ids(x):
    ids = [continent_map[v] for v in dict.fromkeys(x.dropna()) if v in continent_map]
    return list(dict.fromkeys(ids))


with open(sys.argv[1]) as f:
    data = json.load(f)

df = pd.DataFrame(data)

# TLDが2文字のアルファベットのものだけを抽出
df = df[df["tldLabel"].str.match(r"^\.[a-z]{2}$")]

# 一部のTLDを削除
df = df[~df["tldLabel"].isin([".gb", ".su"])]

# 首都と大陸をカンマ区切りに変換
df = df.groupby("countryLabel", as_index=False).agg(
    {
        "capitalLabel": lambda x: ",".join(dict.fromkeys(x.dropna())),
        "continentLabel": join_unique_ids,
        "iso2": "first",
        "tldLabel": "first",
    }
)

# ISO2を小文字に変換
df["iso2"] = df["iso2"].str.lower()

# 特定の国の名前を変換
df["countryLabel"] = df["countryLabel"].replace(
    {
        "中華民国": "台湾",
        "朝鮮民主主義人民共和国": "北朝鮮",
    }
)

# カラム名を変更
df = df.rename(
    columns={
        "countryLabel": "name",
        "capitalLabel": "capital",
        "continentLabel": "continent",
        "iso2": "code",
        "tldLabel": "tld",
    }
)

if not df[df.duplicated("name", keep=False)].empty:
    print("Duplicate country labels found")

df.to_json("src/data/countries.json", orient="records", force_ascii=False)

with open("src/data/areas.json", "w", encoding="utf-8") as f:
    json.dump(list(dict.fromkeys(continent_map.values())), f, ensure_ascii=False)
