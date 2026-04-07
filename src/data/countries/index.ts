import type { GameModeConfig } from "@/data/game-mode-types";
import countries from "./countries.json";

interface Item {
  id: string;
  name: string;
  nameNative: string[];
  capital: string | null;
  capitalNative: string[];
  continent: string[];
  domain: string | null;
  flag: string;
}

const countryAreaMap = new Map(
  countries
    .filter((country) => country.continent.length > 0)
    .map((country) => [country.id, country.continent[0]]),
);

export function getCountryAreaById(id: string) {
  return countryAreaMap.get(id);
}

export default function getCountries(area: string) {
  const filterRegion = (countries: Item[], continent: string) =>
    countries.filter((country) => country.continent.indexOf(continent) !== -1);

  const filter = (countries: Item[], area: string) => {
    if (!area || area === "all") return countries;
    return filterRegion(countries, area);
  };

  return filter(countries, area).map((country) => ({
    ...country,
  }));
}

export const countriesMode: GameModeConfig = {
  id: "countries",
  titleKey: "mode.countries.title",
  questionOptions: [
    { labelKey: "content-type.name", value: "name" },
    { labelKey: "content-type.nameNative", value: "nameNative" },
    { labelKey: "content-type.capital", value: "capital" },
    { labelKey: "content-type.capitalNative", value: "capitalNative" },
    { labelKey: "content-type.flag", value: "flag" },
    { labelKey: "content-type.domain", value: "domain" },
  ],
  answerOptions: [
    { labelKey: "content-type.name", value: "name" },
    { labelKey: "content-type.nameNative", value: "nameNative" },
    { labelKey: "content-type.capital", value: "capital" },
    { labelKey: "content-type.capitalNative", value: "capitalNative" },
    { labelKey: "content-type.flag", value: "flag" },
    { labelKey: "content-type.domain", value: "domain" },
  ],
  defaultQuestionField: "name",
  defaultAnswerField: "flag",
  fieldDisplayTypes: {
    name: "text",
    nameNative: "text",
    capital: "text",
    capitalNative: "text",
    domain: "text",
    flag: "img",
  },
  getItems: ({ area }) => getCountries(area),
};
