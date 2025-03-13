// import { useEffect, useState } from "react";
import RestartButton from "../components/restart-button";
import { CoundownTimer } from "../components/ui/countdown-timer";
import { GeneratedText } from "../components/ui/generated-text";
import Results from "../components/Results";
import { Typing } from "../components/typing";
import { useEngin } from "../hooks/useEngin";
import Time from "@/components/ui/time";
import { useState } from "react";
import JoinOrCreateRoom from "./join-or-create-room";

const HomePage = () => {
  const [showOnlineOptions, setShowOnlineOptions] = useState<boolean>(true);

  const {
    calculateAccuracy,
    words,
    restart,
    input,
    timeLeft,
    calculateWords,
    totalTime,
    setTotalTime,
  } = useEngin();

  return (
    <>
      <div className="grid gap-10">
        <div className="flex flex-col justify-center">
          <div className="flex justify-between">
            <CoundownTimer timeLeft={timeLeft} />
            <Time totalTime={totalTime} setTotalTime={setTotalTime} />
          </div>
          <div className="relative max-w-4xl mt-3 break-all ">
            <GeneratedText words={words} />
            <Typing
              words={words}
              input={input}
              className="absolute inset-0 text-4xl"
            />
          </div>
        </div>
        <RestartButton
          className={``}
          onRestart={() => {
            restart();
          }}
        />

        <Results
          errors={0}
          accuracyPercentage={calculateAccuracy()}
          wordCount={calculateWords()}
          className={``}
        />
      </div>
      {showOnlineOptions && (
        <JoinOrCreateRoom setShowOnlineOptions={setShowOnlineOptions} />
      )}
    </>
  );
};

export default HomePage;
