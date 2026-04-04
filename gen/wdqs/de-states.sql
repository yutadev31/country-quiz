SELECT
  ?stateLabel
  ?stateLabel_de
  ?capitalLabel
  ?iso2
WHERE {
  ?state wdt:P31 wd:Q1221156;
           wdt:P300 ?iso2.

  OPTIONAL { ?state wdt:P36 ?capital. }

  OPTIONAL {
    ?state rdfs:label ?stateLabel_de.
    FILTER (lang(?stateLabel_de) = "de")
  }

  SERVICE wikibase:label {
    bd:serviceParam wikibase:language "ja,en".
  }
}
ORDER BY ?iso2
