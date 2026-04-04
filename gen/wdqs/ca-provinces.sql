SELECT
  ?provinceLabel
  ?provinceLabel_en
  ?capitalLabel
  ?iso2
WHERE {
  ?province wdt:P31 wd:Q11828004;
           wdt:P300 ?iso2.

  OPTIONAL { ?province wdt:P36 ?capital. }

  OPTIONAL {
    ?province rdfs:label ?provinceLabel_en.
    FILTER (lang(?provinceLabel_en) = "en")
  }

  SERVICE wikibase:label {
    bd:serviceParam wikibase:language "ja,en".
  }
}
ORDER BY ?iso2
