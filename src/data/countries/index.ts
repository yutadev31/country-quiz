import countries from "@/data/countries/countries.json";

interface Item {
  code: string;
  name: string;
  capital: string | null;
  continent: string[];
  tld: string | null;
}

export interface Country {
  id: string;
  name: string;
  capital: string | null;
  tld: string | null;
  flag: string;
}

export default function getCountries(area: string) {
  const filterRegion = (countries: Item[], continent: string) =>
    countries.filter((country) => country.continent.indexOf(continent) !== -1);

  const filter = (countries: Item[], area: string) => {
    if (!area || area === "all") return countries;
    return filterRegion(countries, area);
  };

  return filter(countries, area).map((country) => {
    return {
      id: country.code,
      name: country.name,
      capital: country.capital,
      tld: country.tld,
      flag: `https://flagcdn.com/${country.code}.svg`,
    };
  });
}
