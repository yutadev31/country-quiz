import { useQueryState } from "nuqs";
import { useState } from "react";
import Game from "@/components/Game";
import { gameModes, isGameModeId } from "@/data/game-modes";

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

  const mode = isGameModeId(modeParam) ? modeParam : "countries";
  const modeConfig = gameModes[mode];
  const questionField = modeConfig.normalizeQuestionField(questionFieldParam);
  const answerField = modeConfig.normalizeAnswerField(answerFieldParam);
  const items = modeConfig.getItems({
    area: area || "",
    questionField,
    answerField,
  });

  return (
    <div className="mx-auto max-w-xl">
      <Game
        key={randomSeed}
        randomSeed={randomSeed}
        onRestart={() => {
          setRandomSeed(Math.floor(Math.random() * 4096));
        }}
        items={items}
        questionField={questionField}
        answerField={answerField}
        questionCount={parseCount(items, countParam || "10")}
        timeLimitSeconds={parseTimeLimit(timeLimitParam)}
        stopOnMistake={stopOnMistakeParam === "on"}
        fieldDisplayTypes={modeConfig.fieldDisplayTypes}
      />
    </div>
  );
}
