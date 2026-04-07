SELECT
  ?regionLabel
  ?regionLabel_it
  ?capitalLabel
  ?capitalLabel_it
  ?iso2
WHERE {
  ?region wdt:P31 wd:Q16110;
           wdt:P300 ?iso2.

  OPTIONAL {
    ?region wdt:P36 ?capital.
    ?capital rdfs:label ?capitalLabel_it.
    FILTER (lang(?capitalLabel_it) = "it")
  }

  OPTIONAL {
    ?region rdfs:label ?regionLabel_it.
    FILTER (lang(?regionLabel_it) = "it")
  }

  SERVICE wikibase:label {
    bd:serviceParam wikibase:language "ja,en".
  }
}
ORDER BY ?iso2
