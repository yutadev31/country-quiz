import Game, { type ContentType } from "@/components/Game";
import type { Country } from "@/types/country";
import countries from "@/data/countries.json";
import { useSearchParams } from "react-router";

export interface Props {
  area: string;
  count: number;
  lang: string;
  oneShotMode: boolean;
  timeLimit: number | null;
}

export default function GamePage() {
  const [searchParams] = useSearchParams();
  const area = searchParams.get("area");
  const question = searchParams.get("question");
  const choice = searchParams.get("choice");
  const count = searchParams.get("count");
  const oneShotMode = searchParams.get("oneShotMode");
  const timeLimit = searchParams.get("timeLimit");

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
