SELECT
  ?communityLabel
  ?communityLabel_es
  ?capitalLabel
  ?capitalLabel_es
  ?iso2
WHERE {
  ?community wdt:P31 wd:Q10742;
           wdt:P300 ?iso2.

  OPTIONAL {
    ?community wdt:P36 ?capital.
    ?capital rdfs:label ?capitalLabel_es.
    FILTER (lang(?capitalLabel_es) = "es")
  }

  OPTIONAL {
    ?community rdfs:label ?communityLabel_es.
    FILTER (lang(?communityLabel_es) = "es")
  }

  SERVICE wikibase:label {
    bd:serviceParam wikibase:language "ja,en".
  }
}
ORDER BY ?iso2
