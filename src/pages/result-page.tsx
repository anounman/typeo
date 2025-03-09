import { useEngin } from "@/hooks/useEngin";
import {
  LineChart,
  RotateCcw,
  AlertTriangle,
  List,
  SkipBack,
  Image,
} from "lucide-react";
import { useLocation } from "react-router-dom";

// Updated mock data with accuracy values
const mockData = Array.from({ length: 15 }, (_, i) => ({
  x: i + 1,
  speed: Math.random() * 20 + 20,
  rawSpeed: Math.random() * 15 + 15,
  accuracy: Math.random() * 15 + 80, // Add accuracy data (80-95%)
}));

function ResultPage() {
  const { restart } = useEngin();
  const location = useLocation();
  const accuracy = location.state.accuracy;
  const wpm = location.state.wpm;
  const words = location.state.words;
  const characters = location.state.characters;
  const time = location.state.time;

  return (
    <div className="min-h-screen w-full text-gray-300 p-8">
      {/* Main container */}
      <div className="max-w-6xl mx-auto">
        {/* Main stats */}
        <div className="grid grid-cols-2 gap-8 mb-12">
          <div>
            <div className="text-gray-500 uppercase text-sm mb-2">wpm</div>
            <div className="text-6xl text-yellow-500">{wpm}</div>
          </div>
          <div>
            <div className="text-gray-500 uppercase text-sm mb-2">acc</div>
            <div className="text-6xl text-yellow-500">{accuracy}%</div>
          </div>
          <div>
            <div className="text-gray-500 uppercase text-sm mb-2">
              Raw Words
            </div>
            <div className="text-6xl text-yellow-500">{words}</div>
          </div>
        </div>

        {/* Graph */}
        <div className="h-64 mb-12 relative">
          <svg className="w-full h-full">
            {/* Grid lines */}
            {Array.from({ length: 6 }).map((_, i) => (
              <g key={`grid-${i}`}>
                {/* Horizontal grid lines */}
                <line
                  x1="0"
                  y1={`${i * 20}%`}
                  x2="100%"
                  y2={`${i * 20}%`}
                  stroke="#333"
                  strokeWidth="1"
                />
                {/* Vertical grid lines */}
                <line
                  x1={`${i * 20}%`}
                  y1="0"
                  x2={`${i * 20}%`}
                  y2="100%"
                  stroke="#333"
                  strokeWidth="1"
                />
                {/* WPM labels */}
                <text
                  x="-25"
                  y={`${i * 20}%`}
                  fill="#666"
                  fontSize="12"
                  dominantBaseline="middle"
                >
                  {50 - i * 10}
                </text>

                {/* Time labels at bottom */}
                <text
                  x={`${i * 20}%`}
                  y="100%"
                  fill="#666"
                  fontSize="12"
                  dominantBaseline="hanging"
                  textAnchor="middle"
                  dy="10"
                >
                  {i * 6}s
                </text>
              </g>
            ))}

            {/* Graph lines */}
            {mockData.map((point, i) => {
              if (i === 0) return null;
              return (
                <g key={i}>
                  {/* Speed line */}
                  <line
                    x1={(i - 1) * (100 / 14) + "%"}
                    y1={100 - mockData[i - 1].speed + "%"}
                    x2={i * (100 / 14) + "%"}
                    y2={100 - point.speed + "%"}
                    stroke="#666"
                    strokeWidth="2"
                  />
                  {/* Raw speed line */}
                  <line
                    x1={(i - 1) * (100 / 14) + "%"}
                    y1={100 - mockData[i - 1].rawSpeed + "%"}
                    x2={i * (100 / 14) + "%"}
                    y2={100 - point.rawSpeed + "%"}
                    stroke="#F59E0B"
                    strokeWidth="2"
                  />
                  {/* Accuracy line */}
                  <line
                    x1={(i - 1) * (100 / 14) + "%"}
                    y1={100 - mockData[i - 1].accuracy / 2 + "%"} // Scale to fit the graph
                    x2={i * (100 / 14) + "%"}
                    y2={100 - point.accuracy / 2 + "%"} // Scale to fit the graph
                    stroke="#3B82F6" // Blue color for accuracy
                    strokeWidth="2"
                  />
                </g>
              );
            })}
          </svg>

          {/* Legend */}
          <div className="flex justify-center gap-8 mt-4">
            <div className="flex items-center">
              <div className="w-4 h-1 bg-[#666] mr-2"></div>
              <span className="text-sm text-gray-400">WPM</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-1 bg-[#F59E0B] mr-2"></div>
              <span className="text-sm text-gray-400">Raw WPM</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-1 bg-[#3B82F6] mr-2"></div>
              <span className="text-sm text-gray-400">Accuracy</span>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-4 gap-8 mb-12">
          <div>
            <div className="text-gray-500 text-sm mb-1">test type</div>
            <div className="text-yellow-500">time {time}</div>
            {/* <div className="text-gray-500">english</div> */}
          </div>

          <div>
            <div className="text-gray-500 text-sm mb-1">characters</div>
            <div className="text-yellow-500">{characters}</div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-center gap-6 mb-8">
          <LineChart className="w-6 h-6 text-gray-500 hover:text-gray-300 cursor-pointer" />
          <RotateCcw
            className="w-6 h-6 text-gray-500 hover:text-gray-300 cursor-pointer"
            onClick={() => {
              restart();
            }}
          />
          <AlertTriangle className="w-6 h-6 text-gray-500 hover:text-gray-300 cursor-pointer" />
          <List className="w-6 h-6 text-gray-500 hover:text-gray-300 cursor-pointer" />
          <SkipBack className="w-6 h-6 text-gray-500 hover:text-gray-300 cursor-pointer" />
          <Image className="w-6 h-6 text-gray-500 hover:text-gray-300 cursor-pointer" />
        </div>
      </div>
    </div>
  );
}

export default ResultPage;
