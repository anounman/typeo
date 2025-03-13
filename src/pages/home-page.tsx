import RestartButton from "../components/restart-button";
import { CoundownTimer } from "../components/ui/countdown-timer";
import { GeneratedText } from "../components/ui/generated-text";
import Results from "../components/Results";
import { Typing } from "../components/typing";
import { useEngin } from "../hooks/useEngin";
import Time from "@/components/ui/time";
import { useState } from "react";
import JoinOrCreateRoom from "./join-or-create-room";
import { Keyboard, RefreshCw, Clock, Users, BarChart } from "lucide-react";

const HomePage = () => {
  const [showOnlineOptions, setShowOnlineOptions] = useState<boolean>(false);

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
      {/* Header with title and play online button */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <div className="flex items-center gap-3 mb-4 sm:mb-0">
          <div className="bg-gradient-to-br from-yellow-500 to-amber-600 p-2 rounded-lg shadow-lg">
            <Keyboard size={28} className="text-slate-900" />
          </div>
          <h1 className="text-3xl font-bold text-white">TypeO</h1>
        </div>

        <button
          onClick={() => setShowOnlineOptions(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-900 hover:from-yellow-400 hover:to-amber-400 transition-all transform hover:scale-105 shadow-md font-medium"
        >
          <Users size={18} />
          Play With Friends
        </button>
      </div>

      {/* Main Content */}
      <div className="grid gap-8">
        {/* Control Panel */}
        <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-slate-700/50">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Timer */}
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-slate-700/50">
              <RefreshCw size={18} className="text-yellow-500" />
              <CoundownTimer timeLeft={timeLeft} />
            </div>

            {/* Time Settings & Restart */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-700/50">
                <Clock size={18} className="text-yellow-500" />
                <Time totalTime={totalTime} setTotalTime={setTotalTime} />
              </div>

              <RestartButton
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-all"
                onRestart={restart}
              />
            </div>
          </div>
        </div>

        {/* Typing Area - untouched internals */}
        <div className="relative bg-gradient-to-b from-slate-800/60 to-slate-900/60 rounded-xl p-7 shadow-xl border border-slate-700/50">
          <div className="relative max-w-4xl mx-auto mt-3 break-all">
            <GeneratedText words={words} />
            <Typing
              words={words}
              input={input}
              className="absolute inset-0 text-4xl"
            />
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-slate-700/50">
          <div className="flex items-center gap-2 mb-5 justify-center">
            <BarChart size={20} className="text-yellow-500" />
            <h2 className="text-xl font-semibold text-white">Performance</h2>
          </div>

          <Results
            errors={0}
            accuracyPercentage={calculateAccuracy()}
            wordCount={calculateWords()}
            className="grid grid-cols-3 gap-4"
          />
        </div>
      </div>

      {/* Online modal when active */}
      {showOnlineOptions && (
        <JoinOrCreateRoom setShowOnlineOptions={setShowOnlineOptions} />
      )}
    </div>
  );
};

export default HomePage;
