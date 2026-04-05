SELECT
  ?stateLabel
  ?stateLabel_es
  ?capitalLabel
  ?iso2
WHERE {
  ?state wdt:P31 wd:Q15149663;
           wdt:P300 ?iso2.

  OPTIONAL { ?state wdt:P36 ?capital. }

  OPTIONAL {
    ?state rdfs:label ?stateLabel_es.
    FILTER (lang(?stateLabel_es) = "es")
  }

  SERVICE wikibase:label {
    bd:serviceParam wikibase:language "ja,en".
  }
}
ORDER BY ?iso2
