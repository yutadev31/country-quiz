import { useQueryState } from "nuqs";
import { useState } from "react";
import Game from "@/components/Game";
import type { Country } from "@/data/countries";
import getCountries from "@/data/countries";

export default function GamePage() {
  const [area] = useQueryState("area");
  const [questionFieldParam] = useQueryState("question");
  const [answerFieldParam] = useQueryState("choice");
  const [countParam] = useQueryState("count");
  const [stopOnMistakeParam] = useQueryState("oneShotMode");
  const [timeLimitParam] = useQueryState("timeLimit");

  const [randomSeed, setRandomSeed] = useState(
    // eslint-disable-next-line react-hooks/purity
    Math.floor(Math.random() * 4096),
  );

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
  if (questionFieldParam === "domain" || answerFieldParam === "domain") {
    countries = countries.filter((c) => c.tld);
  }

  return (
    <div className="mx-auto max-w-xl">
      <Game
        key={randomSeed}
        randomSeed={randomSeed}
        onRestart={() => {
          setRandomSeed(Math.floor(Math.random() * 4096));
        }}
        items={countries}
        questionField={questionFieldParam as keyof Country}
        answerField={answerFieldParam as keyof Country}
        questionCount={parseCount(countries, countParam || "10")}
        timeLimitSeconds={parseTimeLimit(timeLimitParam)}
        stopOnMistake={stopOnMistakeParam === "on"}
        fieldDisplayTypes={{
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
