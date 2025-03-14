import { motion } from "framer-motion";
import { CheckCircle, AlertCircle, FileText, Timer } from "lucide-react";

const Results = ({
  errors,
  accuracyPercentage,
  wordCount,
  className,
  wpm,
}: {
  errors: number;
  accuracyPercentage: number;
  wordCount: number;
  className?: string;
  wpm?: number;
}) => {
  // Determine color for accuracy based on percentage
  const getAccuracyColor = () => {
    if (accuracyPercentage >= 98) return "text-emerald-500";
    if (accuracyPercentage >= 95) return "text-green-500";
    if (accuracyPercentage >= 90) return "text-yellow-500";
    if (accuracyPercentage >= 80) return "text-amber-500";
    return "text-red-500";
  };

  // Determine color for WPM based on speed
  const getWpmColor = () => {
    if (!wpm) return "text-blue-500";
    if (wpm >= 80) return "text-emerald-500";
    if (wpm >= 60) return "text-green-500";
    if (wpm >= 40) return "text-blue-500";
    if (wpm >= 20) return "text-yellow-500";
    return "text-amber-500";
  };

  return (
    <div className={className}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
        {/* Accuracy Card */}
        <motion.div
          className="bg-slate-800/80 backdrop-blur rounded-xl p-5 border border-slate-700/50 hover:border-slate-600/50 transition-all"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-slate-700/50 p-2 rounded-lg">
              <CheckCircle size={20} className="text-green-500" />
            </div>
            <h3 className="text-slate-300 font-medium">Accuracy</h3>
          </div>

          <div className={`text-3xl font-bold mb-2 ${getAccuracyColor()}`}>
            {accuracyPercentage.toFixed(0)}%
          </div>

          <div className="w-full bg-slate-700/30 rounded-full h-2 mt-3">
            <div
              className={`${getAccuracyColor()} h-2 rounded-full`}
              style={{ width: `${Math.min(100, accuracyPercentage)}%` }}
            ></div>
          </div>

          <div className="mt-2 text-xs text-slate-400">
            {accuracyPercentage >= 98
              ? "Perfect!"
              : accuracyPercentage >= 95
              ? "Excellent"
              : accuracyPercentage >= 90
              ? "Great"
              : accuracyPercentage >= 80
              ? "Good"
              : "Keep practicing"}
          </div>
        </motion.div>

        {/* Errors Card */}
        <motion.div
          className="bg-slate-800/80 backdrop-blur rounded-xl p-5 border border-slate-700/50 hover:border-slate-600/50 transition-all"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-slate-700/50 p-2 rounded-lg">
              <AlertCircle size={20} className="text-red-500" />
            </div>
            <h3 className="text-slate-300 font-medium">Errors</h3>
          </div>

          <div className="text-3xl font-bold mb-3 text-red-500">{errors}</div>

          <div className="w-full flex items-center justify-between gap-2 text-xs text-slate-400">
            <span>0</span>
            <div className="flex-grow h-2 bg-slate-700/30 rounded-full">
              <div
                className="bg-red-500/70 h-2 rounded-full"
                style={{ width: `${Math.min(100, errors * 5)}%` }}
              ></div>
            </div>
            <span>20+</span>
          </div>

          <div className="mt-2 text-xs text-slate-400">
            {errors === 0
              ? "Error-free typing!"
              : errors <= 2
              ? "Nearly perfect!"
              : errors <= 5
              ? "Good accuracy"
              : errors <= 10
              ? "Watch your typing"
              : "Room for improvement"}
          </div>
        </motion.div>

        {/* Word Count Card */}
        <motion.div
          className="bg-slate-800/80 backdrop-blur rounded-xl p-5 border border-slate-700/50 hover:border-slate-600/50 transition-all"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-slate-700/50 p-2 rounded-lg">
              <FileText size={20} className="text-purple-500" />
            </div>
            <h3 className="text-slate-300 font-medium">Words</h3>
          </div>

          <div className="text-3xl font-bold mb-3 text-purple-500">
            {wordCount}
          </div>

          <div className="w-full bg-slate-700/30 rounded-full h-2 mt-1">
            <div
              className="bg-purple-500 h-2 rounded-full"
              style={{ width: `${Math.min(100, (wordCount / 100) * 100)}%` }}
            ></div>
          </div>

          <div className="mt-2 text-xs text-slate-400">
            Total words typed in this session
          </div>
        </motion.div>

        {/* WPM Card */}
        {wpm !== undefined && (
          <motion.div
            className="bg-slate-800/80 backdrop-blur rounded-xl p-5 border border-slate-700/50 hover:border-slate-600/50 transition-all"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-slate-700/50 p-2 rounded-lg">
                <Timer size={20} className="text-blue-500" />
              </div>
              <h3 className="text-slate-300 font-medium">Speed</h3>
            </div>

            <div className={`text-3xl font-bold mb-3 ${getWpmColor()}`}>
              {wpm.toFixed(0)}{" "}
              <span className="text-sm text-slate-400">WPM</span>
            </div>

            <div className="w-full bg-slate-700/30 rounded-full h-2 mt-1">
              <div
                className={`${getWpmColor()} h-2 rounded-full`}
                style={{ width: `${Math.min(100, (wpm / 100) * 100)}%` }}
              ></div>
            </div>

            <div className="mt-2 text-xs text-slate-400">
              {wpm >= 80
                ? "Professional level"
                : wpm >= 60
                ? "Advanced typist"
                : wpm >= 40
                ? "Average speed"
                : wpm >= 20
                ? "Beginner level"
                : "Keep practicing"}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Results;
