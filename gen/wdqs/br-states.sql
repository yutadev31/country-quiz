SELECT
  ?stateLabel
  ?stateLabel_pt
  ?capitalLabel
  ?capitalLabel_pt
  ?iso2
WHERE {
  ?state wdt:P31 wd:Q485258;
           wdt:P300 ?iso2.

  OPTIONAL {
    ?state wdt:P36 ?capital.
    ?capital rdfs:label ?capitalLabel_pt.
    FILTER (lang(?capitalLabel_pt) = "pt")
  }

  OPTIONAL {
    ?state rdfs:label ?stateLabel_pt.
    FILTER (lang(?stateLabel_pt) = "pt")
  }

  SERVICE wikibase:label {
    bd:serviceParam wikibase:language "ja,en".
  }
}
ORDER BY ?iso2
