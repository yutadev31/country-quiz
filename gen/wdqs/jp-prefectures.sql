SELECT
  ?prefectureLabel
  ?prefectureLabel_kana
  ?capitalLabel
  ?capitalLabel_kana
  ?iso2
WHERE {
  ?prefecture wdt:P31 wd:Q50337;
           wdt:P1814 ?prefectureLabel_kana;
           wdt:P300 ?iso2.

  OPTIONAL {
    ?prefecture wdt:P36 ?capital.
    ?capital wdt:P1814 ?capitalLabel_kana.
  }

  SERVICE wikibase:label {
    bd:serviceParam wikibase:language "ja,en".
  }
}
ORDER BY ?iso2
