SELECT
  ?subjectLabel
  ?subjectLabel_ru
  ?capitalLabel
  ?capitalLabel_ru
  ?iso2
WHERE {
  ?subject wdt:P31 wd:Q43263;
           wdt:P300 ?iso2.

  OPTIONAL {
    ?subject wdt:P36 ?capital.
    ?capital rdfs:label ?capitalLabel_ru.
    FILTER (lang(?capitalLabel_ru) = "ru")
  }

  OPTIONAL {
    ?subject rdfs:label ?subjectLabel_ru.
    FILTER (lang(?subjectLabel_ru) = "ru")
  }

  SERVICE wikibase:label {
    bd:serviceParam wikibase:language "ja,en".
  }
}
ORDER BY ?iso2
