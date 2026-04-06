SELECT
  ?prefectureLabel
  ?capitalLabel
  ?iso2
WHERE {
  ?prefecture wdt:P31 wd:Q50337;
           wdt:P300 ?iso2.

  OPTIONAL { ?prefecture wdt:P36 ?capital. }

  SERVICE wikibase:label {
    bd:serviceParam wikibase:language "ja,en".
  }
}
ORDER BY ?iso2
