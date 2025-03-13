import RestartButton from "../components/restart-button";
import { CoundownTimer } from "../components/ui/countdown-timer";
import { GeneratedText } from "../components/ui/generated-text";
import Results from "../components/Results";
import { Typing } from "../components/typing";
import { useEngin } from "../hooks/useEngin";
import Time from "@/components/ui/time";
import { useState } from "react";
import JoinOrCreateRoom from "./join-or-create-room";
import { Keyboard, RefreshCw, Clock } from "lucide-react"; // Import icons

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
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid gap-10 ">
        {/* Header with title */}
        <div className="flex justify-center mb-4">
          <div className="flex items-center gap-3">
            <Keyboard size={28} className="text-yellow-500" />
            <h1 className="text-3xl font-bold text-white">TypeO</h1>
          </div>
        </div>

        <div className="flex flex-col justify-center">
          {/* Timer and Settings Panel */}
          <div className="bg-slate-800/60 rounded-lg p-4 mb-4 flex justify-between items-center shadow-lg border border-slate-700">
            <div className="flex items-center gap-2">
              <RefreshCw size={18} className="text-slate-400" />
              <CoundownTimer timeLeft={timeLeft} />
            </div>
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-slate-400" />
              <Time totalTime={totalTime} setTotalTime={setTotalTime} />
            </div>
          </div>

          {/* Typing Area */}
          <div className="relative bg-slate-800/40 rounded-lg p-6 shadow-lg border border-slate-700/50 mb-6">
            <div className="relative max-w-4xl mt-3 break-all">
              <GeneratedText words={words} />
              <Typing
                words={words}
                input={input}
                className="absolute inset-0 text-4xl"
              />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex w-full items-center justify-center">
          <div className="px-8 py-3 rounded-full font-medium transition-all duration-300 text-center  w-min bg-blue-600 hover:bg-blue-500 text-white">
            <RestartButton
              className="text-white"
              onRestart={() => {
                restart();
              }}
            />
          </div>
        </div>

        {/* Results Section */}
        <div className="flex flex-col items-center justify-center bg-slate-800/60 rounded-lg p-6 shadow-lg border border-slate-700">
          <h2 className="text-xl font-semibold mb-4 text-center text-slate-200">
            Results
          </h2>
          <Results
            errors={0}
            accuracyPercentage={calculateAccuracy()}
            wordCount={calculateWords()}
          />
        </div>

        {/* Play Online Button */}
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setShowOnlineOptions(true)}
            className="px-8 py-3 rounded-full font-medium bg-yellow-500 text-slate-900 hover:bg-yellow-400 transition-colors"
          >
            Play Online
          </button>
        </div>
      </div>

      {showOnlineOptions && (
        <JoinOrCreateRoom setShowOnlineOptions={setShowOnlineOptions} />
      )}
    </div>
  );
};

export default HomePage;
