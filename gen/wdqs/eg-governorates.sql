SELECT
  ?governorateLabel
  ?governorateLabel_ar
  ?capitalLabel
  ?capitalLabel_ar
  ?iso2
WHERE {
  ?governorate wdt:P31 wd:Q204910;
           wdt:P300 ?iso2.

  OPTIONAL {
    ?governorate wdt:P36 ?capital.
    ?capital rdfs:label ?capitalLabel_ar.
    FILTER (lang(?capitalLabel_ar) = "ar")
  }

  OPTIONAL {
    ?governorate rdfs:label ?governorateLabel_ar.
    FILTER (lang(?governorateLabel_ar) = "ar")
  }

  SERVICE wikibase:label {
    bd:serviceParam wikibase:language "ja,en".
  }
}
ORDER BY ?iso2
