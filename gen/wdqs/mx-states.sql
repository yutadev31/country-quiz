SELECT
  ?stateLabel
  ?stateLabel_es
  ?capitalLabel
  ?capitalLabel_es
  ?iso2
WHERE {
  ?state wdt:P31 wd:Q15149663;
           wdt:P300 ?iso2.

  OPTIONAL {
    ?state wdt:P36 ?capital.
    ?capital rdfs:label ?capitalLabel_es.
    FILTER (lang(?capitalLabel_es) = "es")
  }

  OPTIONAL {
    ?state rdfs:label ?stateLabel_es.
    FILTER (lang(?stateLabel_es) = "es")
  }

  SERVICE wikibase:label {
    bd:serviceParam wikibase:language "ja,en".
  }
}
ORDER BY ?iso2
