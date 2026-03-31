import { useQueryState } from "nuqs";
import { useState } from "react";
import Game from "@/components/Game";
import type { Country } from "@/data/countries";
import getCountries from "@/data/countries";
import getUSStates, { type USState } from "@/data/states";

export default function GamePage() {
  const [area] = useQueryState("area");
  const [modeParam] = useQueryState("mode");
  const [questionFieldParam] = useQueryState("question");
  const [answerFieldParam] = useQueryState("choice");
  const [countParam] = useQueryState("count");
  const [stopOnMistakeParam] = useQueryState("oneShotMode");
  const [timeLimitParam] = useQueryState("timeLimit");

  const [randomSeed, setRandomSeed] = useState(
    // eslint-disable-next-line react-hooks/purity
    Math.floor(Math.random() * 4096),
  );

  const parseCount = <T,>(items: T[], count: string | undefined) => {
    if (count === undefined) {
      return 10;
    } else if (count === "all") {
      return items.length;
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

  const mode = modeParam === "us-states" ? "us-states" : "countries";

  if (mode === "us-states") {
    const states = getUSStates();
    const questionField =
      questionFieldParam === "capital" || questionFieldParam === "flag"
        ? questionFieldParam
        : "name";
    const answerField =
      answerFieldParam === "name" ||
      answerFieldParam === "capital" ||
      answerFieldParam === "flag"
        ? answerFieldParam
        : "flag";

    return (
      <div className="mx-auto max-w-xl">
        <Game
          key={randomSeed}
          randomSeed={randomSeed}
          onRestart={() => {
            setRandomSeed(Math.floor(Math.random() * 4096));
          }}
          items={states}
          questionField={questionField as keyof USState}
          answerField={answerField as keyof USState}
          questionCount={parseCount(states, countParam || "10")}
          timeLimitSeconds={parseTimeLimit(timeLimitParam)}
          stopOnMistake={stopOnMistakeParam === "on"}
          fieldDisplayTypes={{
            id: "id",
            name: "text",
            capital: "text",
            flag: "img",
          }}
        />
      </div>
    );
  }

  let countries = getCountries(area || "");
  if (questionFieldParam === "domain" || answerFieldParam === "domain") {
    countries = countries.filter((c) => c.tld);
  }
  const questionField =
    questionFieldParam === "capital" ||
    questionFieldParam === "flag" ||
    questionFieldParam === "domain"
      ? questionFieldParam
      : "name";
  const answerField =
    answerFieldParam === "name" ||
    answerFieldParam === "capital" ||
    answerFieldParam === "flag" ||
    answerFieldParam === "domain"
      ? answerFieldParam
      : "flag";

  return (
    <div className="mx-auto max-w-xl">
      <Game
        key={randomSeed}
        randomSeed={randomSeed}
        onRestart={() => {
          setRandomSeed(Math.floor(Math.random() * 4096));
        }}
        items={countries}
        questionField={questionField as keyof Country}
        answerField={answerField as keyof Country}
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
