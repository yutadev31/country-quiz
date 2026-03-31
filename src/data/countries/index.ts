import countries from "@/data/countries/countries.json";
import type { GameModeConfig } from "@/data/game-mode-types";

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
      domain: country.tld,
      flag: `https://flagcdn.com/${country.code}.svg`,
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
    { labelKey: "content-type.capital", value: "capital" },
    { labelKey: "content-type.flag", value: "flag" },
    { labelKey: "content-type.domain", value: "domain" },
  ],
  answerOptions: [
    { labelKey: "content-type.name", value: "name" },
    { labelKey: "content-type.capital", value: "capital" },
    { labelKey: "content-type.flag", value: "flag" },
    { labelKey: "content-type.domain", value: "domain" },
  ],
  defaultQuestionField: "name",
  defaultAnswerField: "flag",
  fieldDisplayTypes: {
    id: "id",
    name: "text",
    capital: "text",
    tld: "text",
    flag: "img",
  },
  getItems: ({ area }) => getCountries(area),
  normalizeQuestionField: (value) => {
    if (value === "capital" || value === "flag" || value === "domain") {
      return value;
    }
    return "name";
  },
  normalizeAnswerField: (value) => {
    if (
      value === "name" ||
      value === "capital" ||
      value === "flag" ||
      value === "domain"
    ) {
      return value;
    }
    return "flag";
  },
};
