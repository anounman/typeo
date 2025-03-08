import { useState } from "react";
import RestartButton from "../components/restart-button";
import { CoundownTimer } from "../components/ui/countdown-timer";
import { GeneratedText } from "../components/ui/generated-text";
import { faker } from "@faker-js/faker";
import Results from "../components/Results";
import { Typing } from "../components/typing";

const HomePage = () => {
  const [words, setWords] = useState(faker.lorem.words(40));
  const [input, setInput] = useState("");

  return (
    <div className="grid gap-10">
      <div className="flex flex-col justify-center">
        <CoundownTimer timeLeft={30} />
        <div className="relative max-w-4xl mt-3">
          <GeneratedText words={words} />
          <Typing
            words={words}
            input={input}
            setInput={setInput}
            className="absolute inset-0 text-4xl"
          />
        </div>
      </div>
      <RestartButton
        className={``}
        onRestart={() => {
          setWords(faker.lorem.words(10));
          setInput("");
        }}
      />
      <Results errors={0} accuracyPercentage={100} total={10} className={``} />
    </div>
  );
};

export default HomePage;
