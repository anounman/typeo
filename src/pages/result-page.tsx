import { useEngin } from "@/hooks/useEngin";
import { Home, RotateCcw, Share, Keyboard, AlertCircle } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Filler,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function ResultPage() {
  const { restart } = useEngin();
  const location = useLocation();
  const navigate = useNavigate();

  // Get data from location state
  const accuracy = Number(location.state?.accuracy) || 0;
  const wpm = Number(location.state?.wpm) || 0;
  const words = Number(location.state?.words) || 0;
  const characters = Number(location.state?.characters) || 0;
  const time = location.state?.totalTime || 30;
  const performanceData = location.state?.performanceData || [];

  // Check if we have real performance data
  const hasPerformanceData =
    Array.isArray(performanceData) && performanceData.length > 2;

  // Create accuracy graph data - using a bar graph style breakdown
  const accuracyGraphData = {
    labels: ["Typing Accuracy"],
    datasets: [
      {
        label: "Correct Characters",
        data: [characters * (accuracy / 100)],
        backgroundColor: "rgba(72, 187, 120, 0.7)",
        borderColor: "rgba(72, 187, 120, 1)",
        borderWidth: 1,
      },
      {
        label: "Errors",
        data: [characters * ((100 - accuracy) / 100)],
        backgroundColor: "rgba(239, 68, 68, 0.6)",
        borderColor: "rgba(239, 68, 68, 0.8)",
        borderWidth: 1,
      },
    ],
  };

  // Options for the accuracy graph
  const accuracyGraphOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y" as const,
    scales: {
      x: {
        stacked: true,
        title: {
          display: true,
          text: "Characters",
          color: "rgba(255, 255, 255, 0.7)",
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.7)",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
      y: {
        stacked: true,
        ticks: {
          color: "rgba(255, 255, 255, 0.7)",
        },
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "rgba(255, 255, 255, 0.8)",
          padding: 20,
          font: { size: 12 },
        },
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        titleColor: "#fff",
        bodyColor: "#fff",
        callbacks: {
          label: function (context: any) {
            const value = Math.round(context.raw);
            return `${context.dataset.label}: ${value} characters (${Math.round(
              (value / characters) * 100
            )}%)`;
          },
        },
      },
    },
  };

  // Comparison chart showing WPM vs average typist
  const comparisonData = {
    labels: ["Your Speed", "Average Typist", "Professional"],
    datasets: [
      {
        label: "Words Per Minute",
        data: [wpm, 40, 75],
        backgroundColor: [
          "rgba(251, 191, 36, 0.7)",
          "rgba(59, 130, 246, 0.7)",
          "rgba(139, 92, 246, 0.7)",
        ],
        borderWidth: 0,
        borderRadius: 4,
      },
    ],
  };

  const comparisonOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        titleColor: "#fff",
        bodyColor: "#fff",
        padding: 12,
        cornerRadius: 4,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.7)",
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.7)",
        },
      },
    },
  };

  // Calculate Error Count
  const errorCount = Math.round((characters * (100 - accuracy)) / 100);

  // Calculate typing grade based on WPM and accuracy
  const getTypingGrade = () => {
    const score = wpm * 0.6 + accuracy * 0.4;

    if (score >= 90) return { grade: "A+", message: "Exceptional" };
    if (score >= 80) return { grade: "A", message: "Excellent" };
    if (score >= 70) return { grade: "B+", message: "Very Good" };
    if (score >= 60) return { grade: "B", message: "Good" };
    if (score >= 50) return { grade: "C+", message: "Above Average" };
    if (score >= 40) return { grade: "C", message: "Average" };
    if (score >= 30) return { grade: "D", message: "Below Average" };
    return { grade: "E", message: "Needs Practice" };
  };

  const typingGrade = getTypingGrade();

  // Generate performance trend graph if we have data - using the approach from online-result-page
  const renderPerformanceTrendGraph = () => {
    if (!hasPerformanceData) return null;

    // Sort data by timeRemaining (descending)
    const sortedData = [...performanceData].sort(
      (a, b) => b.timeRemaining - a.timeRemaining
    );

    // Create WPM dataset
    const wpmDataset = {
      label: "WPM",
      data: sortedData.map((point) => point.wpm),
      borderColor: "rgba(251, 191, 36, 1)",
      backgroundColor: "rgba(251, 191, 36, 0.2)",
      fill: true,
      tension: 0.4,
      yAxisID: "y",
    };

    // Create Accuracy dataset
    const accuracyDataset = {
      label: "Accuracy %",
      data: sortedData.map((point) => point.accuracy),
      borderColor: "rgba(72, 187, 120, 1)",
      backgroundColor: "rgba(72, 187, 120, 0)",
      borderDash: [5, 5],
      borderWidth: 2,
      fill: false,
      tension: 0.4,
      yAxisID: "y1",
    };

    // Create Errors dataset
    const errorsDataset = {
      label: "Errors",
      data: sortedData.map((point) => point.error),
      borderColor: "rgba(239, 68, 68, 1)",
      backgroundColor: "rgba(239, 68, 68, 0.4)",
      fill: true,
      tension: 0.4,
      yAxisID: "y2",
    };

    const chartData = {
      labels: sortedData.map((point) => `${time - point.timeRemaining}s`),
      datasets: [wpmDataset, accuracyDataset, errorsDataset],
    };

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index" as const,
        intersect: false,
      },
      plugins: {
        legend: {
          position: "top" as const,
          labels: {
            color: "rgba(255, 255, 255, 0.8)",
            usePointStyle: true,
            pointStyle: "circle",
          },
        },
        tooltip: {
          backgroundColor: "rgba(15, 23, 42, 0.9)",
          titleColor: "#fff",
          bodyColor: "#fff",
          padding: 12,
          cornerRadius: 4,
          callbacks: {
            label: function (context: any) {
              let label = context.dataset.label || "";
              if (label) {
                label += ": ";
              }
              if (context.parsed.y !== null) {
                if (label.includes("Accuracy")) {
                  label += context.parsed.y + "%";
                } else {
                  label += context.parsed.y;
                }
              }
              return label;
            },
          },
        },
      },
      scales: {
        y: {
          type: "linear" as const,
          display: true,
          position: "left" as const,
          title: {
            display: true,
            text: "Words Per Minute",
            color: "rgba(255, 255, 255, 0.7)",
          },
          ticks: {
            color: "rgba(251, 191, 36, 0.9)",
          },
          grid: {
            color: "rgba(255, 255, 255, 0.1)",
          },
        },
        y1: {
          type: "linear" as const,
          display: true,
          position: "right" as const,
          title: {
            display: true,
            text: "Accuracy (%)",
            color: "rgba(255, 255, 255, 0.7)",
          },
          ticks: {
            color: "rgba(72, 187, 120, 0.9)",
            min: 0,
            max: 100,
            callback: function (value: any) {
              return value + "%";
            },
          },
          grid: {
            drawOnChartArea: false,
          },
        },
        y2: {
          type: "linear" as const,
          display: false,
          position: "right" as const,
          grid: {
            drawOnChartArea: false,
          },
        },
        x: {
          title: {
            display: true,
            text: "Time (seconds)",
            color: "rgba(255, 255, 255, 0.7)",
          },
          grid: {
            color: "rgba(255, 255, 255, 0.1)",
          },
          ticks: {
            color: "rgba(255, 255, 255, 0.7)",
          },
        },
      },
    };

    return (
      <div className="bg-slate-800/60 rounded-xl p-4 md:p-6 border border-slate-700/50 mb-8">
        <h2 className="text-lg font-medium text-white mb-4">
          Performance Over Time
        </h2>
        <div className="h-72">
          <Line data={chartData} options={chartOptions} />
        </div>
        <div className="mt-3 text-xs text-slate-400 text-center">
          Track how your speed, accuracy, and error count changed throughout
          your typing session
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full text-gray-300 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center mb-3">
            <div className="bg-gradient-to-br from-yellow-500 to-amber-600 p-2 rounded-lg shadow-lg mr-3">
              <Keyboard size={28} className="text-slate-900" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Your Typing Results
            </h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Test completed in {time} seconds
          </p>
        </div>

        {/* Grade Badge */}
        <div className="flex justify-center mb-8">
          <div className="bg-slate-800/70 rounded-xl px-6 py-3 border border-slate-700/50 text-center">
            <div className="text-gray-500 uppercase text-sm mb-1">
              Your Typing Grade
            </div>
            <div className="text-5xl font-bold text-yellow-500 mb-1">
              {typingGrade.grade}
            </div>
            <div className="text-slate-300">{typingGrade.message}</div>
          </div>
        </div>

        {/* Main stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {/* WPM Card */}
          <div className="bg-slate-800/60 rounded-xl p-6 border border-slate-700/50 flex flex-col items-center justify-center transition-all hover:border-yellow-600/30 hover:bg-slate-800/80">
            <div className="text-gray-500 uppercase text-sm mb-1">Speed</div>
            <div className="text-4xl md:text-5xl font-bold text-yellow-500 mb-2">
              {wpm}
            </div>
            <div className="text-slate-400 text-sm">Words Per Minute</div>
          </div>

          {/* Accuracy Card */}
          <div className="bg-slate-800/60 rounded-xl p-6 border border-slate-700/50 flex flex-col items-center justify-center transition-all hover:border-blue-600/30 hover:bg-slate-800/80">
            <div className="text-gray-500 uppercase text-sm mb-1">Accuracy</div>
            <div className="text-4xl md:text-5xl font-bold text-blue-500 mb-2">
              {accuracy}%
            </div>
            <div className="text-slate-400 text-sm">Correct Characters</div>
          </div>

          {/* Words Card */}
          <div className="bg-slate-800/60 rounded-xl p-6 border border-slate-700/50 flex flex-col items-center justify-center transition-all hover:border-purple-600/30 hover:bg-slate-800/80">
            <div className="text-gray-500 uppercase text-sm mb-1">Words</div>
            <div className="text-4xl md:text-5xl font-bold text-purple-500 mb-2">
              {words}
            </div>
            <div className="text-slate-400 text-sm">Total Words Typed</div>
          </div>
        </div>

        {/* Performance Trend Graph (if we have data) - Show this first if available */}
        {hasPerformanceData && renderPerformanceTrendGraph()}

        {/* Charts Section - 2 Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Accuracy Graph */}
          <div className="bg-slate-800/60 rounded-xl p-4 md:p-6 border border-slate-700/50">
            <h2 className="text-lg font-medium text-white mb-4">
              Accuracy Breakdown
            </h2>
            <div className="h-64">
              <Bar data={accuracyGraphData} options={accuracyGraphOptions} />
            </div>
          </div>

          {/* WPM Comparison Chart */}
          <div className="bg-slate-800/60 rounded-xl p-4 md:p-6 border border-slate-700/50">
            <h2 className="text-lg font-medium text-white mb-4">
              Speed Comparison
            </h2>
            <div className="h-64">
              <Bar data={comparisonData} options={comparisonOptions} />
            </div>
          </div>
        </div>

        {/* Stats Details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/40 rounded-lg p-4">
            <div className="text-gray-500 text-sm mb-1">Test Type</div>
            <div className="text-white font-medium">Timed ({time}s)</div>
          </div>

          <div className="bg-slate-800/40 rounded-lg p-4">
            <div className="text-gray-500 text-sm mb-1">Characters</div>
            <div className="text-white font-medium">{characters}</div>
          </div>

          <div className="bg-slate-800/40 rounded-lg p-4">
            <div className="text-gray-500 text-sm mb-1">Errors</div>
            <div className="text-white font-medium">{errorCount}</div>
          </div>

          <div className="bg-slate-800/40 rounded-lg p-4">
            <div className="text-gray-500 text-sm mb-1">Character Rate</div>
            <div className="text-white font-medium">
              {Math.round(characters / (time / 60))} CPM
            </div>
          </div>
        </div>

        {/* Performance Data Notice */}
        {!hasPerformanceData && (
          <div className="bg-slate-800/40 rounded-lg p-4 mb-8 text-center flex items-center justify-center gap-3">
            <AlertCircle size={18} className="text-blue-400" />
            <p className="text-slate-300">
              Complete more typing tests to collect performance data over time.
            </p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="px-5 py-3 rounded-lg flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white transition-colors"
          >
            <Home size={18} />
            Home
          </button>

          <button
            onClick={restart}
            className="px-5 py-3 rounded-lg flex items-center gap-2 bg-yellow-600 hover:bg-yellow-500 text-white transition-colors"
          >
            <RotateCcw size={18} />
            Try Again
          </button>

          <button
            onClick={() => {
              // Share functionality
              if (navigator.share) {
                navigator.share({
                  title: "My Typing Test Results",
                  text: `I just typed at ${wpm} WPM with ${accuracy}% accuracy on TypeO!`,
                });
              } else {
                // Fallback - copy to clipboard
                navigator.clipboard.writeText(
                  `I just typed at ${wpm} WPM with ${accuracy}% accuracy on TypeO!`
                );
                alert("Results copied to clipboard!");
              }
            }}
            className="px-5 py-3 rounded-lg flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white transition-colors"
          >
            <Share size={18} />
            Share
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResultPage;
