import countries from "@/data/countries/countries.json";
import type { GameModeConfig } from "@/data/game-mode-types";

interface Item {
  code: string;
  name: string;
  nameNative: string[];
  capital: string | null;
  continent: string[];
  tld: string | null;
}

export interface Country {
  id: string;
  name: string;
  nameNative: string;
  capital: string | null;
  domain: string | null;
  flag: string;
  map: string;
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
      nameNative: country.nameNative,
      capital: country.capital,
      domain: country.tld,
      flag: `https://flagcdn.com/${country.code}.svg`,
      map: `/country-quiz/maps/${country.code}.png`,
    };
  });
}

export const countriesMode: GameModeConfig = {
  id: "countries",
  titleKey: "mode.countries.title",
  descriptionKey: "mode.countries.description",
  hasAreaSelection: true,
  questionOptions: [
    { labelKey: "content-type.name", value: "name" },
    { labelKey: "content-type.nameNative", value: "nameNative" },
    { labelKey: "content-type.capital", value: "capital" },
    { labelKey: "content-type.flag", value: "flag" },
    { labelKey: "content-type.domain", value: "domain" },
    { labelKey: "content-type.map", value: "map" },
  ],
  answerOptions: [
    { labelKey: "content-type.name", value: "name" },
    { labelKey: "content-type.nameNative", value: "nameNative" },
    { labelKey: "content-type.capital", value: "capital" },
    { labelKey: "content-type.flag", value: "flag" },
    { labelKey: "content-type.domain", value: "domain" },
  ],
  defaultQuestionField: "name",
  defaultAnswerField: "flag",
  fieldDisplayTypes: {
    id: "id",
    name: "text",
    nameNative: "text",
    capital: "text",
    domain: "text",
    flag: "img",
    map: "img",
  },
  getItems: ({ area }) => getCountries(area),
  normalizeQuestionField: (value) => {
    if (
      value === "capital" ||
      value === "nameNative" ||
      value === "flag" ||
      value === "domain" ||
      value === "map"
    ) {
      return value;
    }
    return "name";
  },
  normalizeAnswerField: (value) => {
    if (
      value === "name" ||
      value === "nameNative" ||
      value === "capital" ||
      value === "domain" ||
      value === "map"
    ) {
      return value;
    }
    return "flag";
  },
};
