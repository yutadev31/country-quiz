SELECT
  ?provinceLabel
  ?provinceLabel_en
  ?capitalLabel
  ?iso2
WHERE {
  ?province wdt:P31 ?type;
           wdt:P300 ?iso2.

  VALUES ?type { wd:Q11828004 wd:Q9357527 }

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
