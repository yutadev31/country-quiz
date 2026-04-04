SELECT
  ?stateLabel
  ?stateLabel_en
  ?capitalLabel
  ?iso2
WHERE {
  ?state wdt:P31 wd:Q35657;
           wdt:P300 ?iso2.

  OPTIONAL { ?state wdt:P36 ?capital. }

  OPTIONAL {
    ?state rdfs:label ?stateLabel_en.
    FILTER (lang(?stateLabel_en) = "en")
  }

  SERVICE wikibase:label {
    bd:serviceParam wikibase:language "ja,en".
  }
}
ORDER BY ?iso2
