SELECT
  ?countryLabel
  ?countryLabel_native
  ?capitalLabel
  ?capitalLabel_native
  ?iso2
  ?tldLabel
  ?continentLabel
WHERE {
  ?country wdt:P31 wd:Q3624078;
           wdt:P1705 ?countryLabel_native;
           wdt:P297 ?iso2;
           wdt:P78 ?tld;
           wdt:P30 ?continent.

  OPTIONAL {
    ?country wdt:P36 ?capital.
    OPTIONAL {
      ?capital rdfs:label ?capitalLabel_native.
      FILTER (lang(?capitalLabel_native) = lang(?countryLabel_native))
    }
  }

  SERVICE wikibase:label {
    bd:serviceParam wikibase:language "ja,en".
  }
}
ORDER BY ?iso2
