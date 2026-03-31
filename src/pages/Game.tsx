import { useQueryState } from "nuqs";
import { useState } from "react";
import Game from "@/components/Game";
import type { Country } from "@/data/countries";
import getCountries from "@/data/countries";

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

  // eslint-disable-next-line react-hooks/purity
  const [seed, setSeed] = useState(Math.floor(Math.random() * 4096));

  const parseCount = (countries: Country[], count: string | undefined) => {
    if (count === undefined) {
      return 10;
    } else if (count === "all") {
      return countries.length;
    } else {
      return parseInt(count, 10);
    }
  };

  const parseTimeLimit = (timeLimit: string | null) => {
    if (timeLimit === null) {
      return null;
    } else {
      return parseInt(timeLimit, 10);
    }
  };

  let countries = getCountries(area || "");
  if (question === "domain" || choice === "domain") {
    countries = countries.filter((c) => c.tld);
  }

  return (
    <div className="mx-auto max-w-xl">
      <Game
        key={seed}
        seed={seed}
        next={() => {
          setSeed(Math.floor(Math.random() * 4096));
        }}
        data={countries}
        questionKind={question as keyof Country}
        choiceKind={choice as keyof Country}
        count={parseCount(countries, count || "10")}
        timeLimit={parseTimeLimit(timeLimit)}
        oneShotMode={oneShotMode === "on"}
        view={{
          id: "id",
          name: "text",
          capital: "text",
          tld: "text",
          flag: "img",
        }}
      />
    </div>
  );
}
