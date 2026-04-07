import type { GameModeConfig, QuizItem } from "@/data/game-mode-types";
import { loadQuizItems } from "@/data/public-data";

type Item = QuizItem & {
  name: string;
  nameNative: string[];
  capital: string | null;
  capitalNative: string[];
  continent: string[];
  domain: string | null;
  flag: string;
};

async function getCountries(area: string) {
  const countries = await loadQuizItems<Item>("countries.json");

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
    { labelKey: "content-type.countries.name", value: "name" },
    { labelKey: "content-type.countries.nameNative", value: "nameNative" },
    { labelKey: "content-type.countries.capital", value: "capital" },
    { labelKey: "content-type.countries.capitalNative", value: "capitalNative" },
    { labelKey: "content-type.countries.flag", value: "flag" },
    { labelKey: "content-type.countries.domain", value: "domain" },
  ],
  answerOptions: [
    { labelKey: "content-type.countries.name", value: "name" },
    { labelKey: "content-type.countries.nameNative", value: "nameNative" },
    { labelKey: "content-type.countries.capital", value: "capital" },
    { labelKey: "content-type.countries.capitalNative", value: "capitalNative" },
    { labelKey: "content-type.countries.flag", value: "flag" },
    { labelKey: "content-type.countries.domain", value: "domain" },
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
