// import { useEffect, useState } from "react";
import RestartButton from "../components/restart-button";
import { CoundownTimer } from "../components/ui/countdown-timer";
import { GeneratedText } from "../components/ui/generated-text";
import Results from "../components/Results";
import { Typing } from "../components/typing";
import { useEngin } from "../hooks/useEngin";
import Time from "@/components/ui/time";
import useSocket from "@/hooks/useSocket";
import { useState } from "react";
import { createRoom } from "@/api/room-socket";
import { User } from "@/types/type";
import { UserImpl } from "@/types/mode";
import { v4 as uuid } from "uuid";

const HomePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [roomName] = useState<string>("test");

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

  const {
    // error : roomCreateError,
    fn: createRoomFn,
    // loading: createRoomLoading,
  } = useSocket(createRoom);

  return (
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
      <button
        onClick={async () => {
          setUser(new UserImpl({ id: uuid().toString(), name: "test" }));
          await createRoomFn(roomName, user!);
        }}
      >
        Create Room
      </button>
    </div>
  );
};

export default HomePage;
