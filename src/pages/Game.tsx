import Game, { type ContentType } from "@/components/Game";
import type { Country } from "@/types/country";
import countries from "@/data/countries.json";
import { useQueryState } from "nuqs";

export interface Props {
  area: string;
  count: number;
  lang: string;
  oneShotMode: boolean;
  timeLimit: number | null;
}

export default function GamePage() {
  const [area] = useQueryState("area");
  const [question] = useQueryState("question");
  const [choice] = useQueryState("choice");
  const [count] = useQueryState("count");
  const [oneShotMode] = useQueryState("oneShotMode");
  const [timeLimit] = useQueryState("timeLimit");

  const parseCount = (countries: Country[], count: string | undefined) => {
    if (count === undefined) {
      return 10;
    } else if (count === "all") {
      return countries.length;
    } else {
      return parseInt(count);
    }
  };

  const parseTimeLimit = (timeLimit: string | null) => {
    if (timeLimit === null) {
      return null;
    } else {
      return parseInt(timeLimit);
    }
  };

  const filterRegion = (countries: Country[], region: string) =>
    countries.filter((country) => country.regions.indexOf(region) !== -1);

  const filter = (countries: Country[], area?: string) => {
    if (!area) return countries;
    return filterRegion(countries, area.replace(/-/g, " "));
  };

  let filteredCountries = filter(countries, area || "");
  if (!filteredCountries) {
    return <></>;
  }

  if (question === "domain" || choice === "domain") {
    filteredCountries = filteredCountries.filter((c) => c.tld);
  }

  return (
    <div className="mx-auto max-w-xl">
      <Game
        countries={filteredCountries}
        questionKind={question as ContentType}
        choiceKind={choice as ContentType}
        count={parseCount(filteredCountries, count || "10")}
        timeLimit={parseTimeLimit(timeLimit)}
        oneShotMode={oneShotMode === "on"}
      />
    </div>
  );
}
