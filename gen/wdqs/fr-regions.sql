SELECT
  ?regionLabel
  ?regionLabel_fr
  ?capitalLabel
  ?capitalLabel_fr
  ?iso2
WHERE {
  ?region wdt:P31 wd:Q36784;
           wdt:P300 ?iso2.

  OPTIONAL {
    ?region wdt:P36 ?capital.
    ?capital rdfs:label ?capitalLabel_fr.
    FILTER (lang(?capitalLabel_fr) = "fr")
  }

  OPTIONAL {
    ?region rdfs:label ?regionLabel_fr.
    FILTER (lang(?regionLabel_fr) = "fr")
  }

  FILTER NOT EXISTS {
    ?region wdt:P31/wdt:P279* wd:Q1620908 .
  }

  SERVICE wikibase:label {
    bd:serviceParam wikibase:language "ja,en".
  }
}
ORDER BY ?iso2
