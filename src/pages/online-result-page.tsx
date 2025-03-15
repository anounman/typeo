import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Trophy,
  Medal,
  Clock,
  Activity,
  Award,
  Home,
  RotateCcw,
  Keyboard,
  LineChart,
  BarChart2,
  Users,
} from "lucide-react";
import { Room, User } from "@/types/type";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const OnlineResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [room] = useState<Room>(location.state?.room);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    // If no room data was passed, go back to home
    if (!room) {
      navigate("/");
      return;
    }

    // Sort users by WPM (highest first)
    const sortedUsers = [...room.users].sort(
      (a, b) => (b.wpm || 0) - (a.wpm || 0)
    );

    setUsers(sortedUsers);

    // Select the winner by default
    if (sortedUsers.length > 0) {
      setSelectedUser(sortedUsers[0]);
    }
  }, [room, navigate]);

  // Get appropriate medal for position
  const getMedalIcon = (position: number) => {
    switch (position) {
      case 0:
        return <Trophy className="text-yellow-400" size={24} />;
      case 1:
        return <Medal className="text-slate-300" size={20} />;
      case 2:
        return <Medal className="text-amber-700" size={20} />;
      default:
        return <Award className="text-slate-500" size={18} />;
    }
  };

  // Create WPM comparison chart
  const wpmComparisonData = {
    labels: users.map((user) => user.name),
    datasets: [
      {
        label: "WPM",
        data: users.map((user) => Math.round(user.wpm || 0)),
        backgroundColor: users.map((_, i) =>
          i === 0
            ? "rgba(251, 191, 36, 0.7)"
            : i === 1
            ? "rgba(203, 213, 225, 0.7)"
            : i === 2
            ? "rgba(180, 83, 9, 0.7)"
            : "rgba(100, 116, 139, 0.6)"
        ),
        borderColor: users.map((_, i) =>
          i === 0
            ? "rgba(251, 191, 36, 1)"
            : i === 1
            ? "rgba(203, 213, 225, 1)"
            : i === 2
            ? "rgba(180, 83, 9, 1)"
            : "rgba(100, 116, 139, 1)"
        ),
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  // Generate performance chart for selected user
  const generatePerformanceChart = (user: User | null) => {
    if (!user || !user.performanceData || user.performanceData.length === 0) {
      return null;
    }

    const performanceData = [...user.performanceData].sort(
      (a, b) => b.timeRemaining - a.timeRemaining
    );

    const chartData = {
      labels: performanceData.map(
        (point) => `${room.totalTime - point.timeRemaining}s`
      ),
      datasets: [
        {
          label: "WPM",
          data: performanceData.map((point) => point.wpm),
          borderColor: "rgba(251, 191, 36, 1)",
          backgroundColor: "rgba(251, 191, 36, 0.2)",
          fill: true,
          tension: 0.4,
        },
      ],
    };

    const chartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: "top" as const,
          labels: {
            color: "rgba(255, 255, 255, 0.8)",
          },
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
          title: {
            display: true,
            text: "Words Per Minute",
            color: "rgba(255, 255, 255, 0.7)",
          },
          grid: {
            color: "rgba(255, 255, 255, 0.1)",
          },
          ticks: {
            color: "rgba(255, 255, 255, 0.7)",
          },
        },
        x: {
          title: {
            display: true,
            text: "Time (seconds)",
            color: "rgba(255, 255, 255, 0.7)",
          },
          grid: {
            display: false,
          },
          ticks: {
            color: "rgba(255, 255, 255, 0.7)",
          },
        },
      },
    };

    return (
      <div className="h-72">
        <Line data={chartData} options={chartOptions} />
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid gap-8"
      >
        {/* Header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center mb-3">
            <div className="bg-gradient-to-br from-yellow-500 to-amber-600 p-2 rounded-lg shadow-lg mr-3">
              <Keyboard size={28} className="text-slate-900" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Race Results
            </h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Competition completed in {room?.totalTime} seconds
          </p>
        </div>

        {/* Winner spotlight - only show if we have users */}
        {users.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gradient-to-b from-yellow-500/20 to-amber-700/10 rounded-xl p-6 border border-yellow-600/20 mb-8"
          >
            <div className="flex flex-col sm:flex-row items-center text-center sm:text-left">
              <div className="bg-yellow-500/20 p-3 rounded-full mb-3 sm:mb-0 sm:mr-6">
                <Trophy size={40} className="text-yellow-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  {users[0]?.name}
                </h2>
                <div className="text-yellow-400 font-medium text-lg mb-1">
                  {Math.round(users[0]?.wpm || 0)} WPM
                </div>
                <div className="text-slate-400 text-sm">Race Winner</div>
              </div>
              <div className="sm:ml-auto mt-3 sm:mt-0">
                <div className="bg-slate-800/60 px-5 py-3 rounded-lg">
                  <div className="text-sm text-gray-400 mb-1">Typing Grade</div>
                  <div className="text-3xl font-bold text-yellow-500">
                    {getTypingGrade(users[0]?.wpm || 0)}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Charts and Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Side A: WPM Comparison Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-1 bg-slate-800/60 rounded-xl p-4 shadow-lg border border-slate-700/50"
          >
            <h2 className="text-lg font-medium text-white mb-4 flex items-center">
              <BarChart2 size={18} className="text-blue-400 mr-2" />
              Speed Comparison
            </h2>
            <div className="h-[400px]">
              <Bar
                data={wpmComparisonData}
                options={{
                  indexAxis: "y", // Horizontal bar chart
                  responsive: true,
                  plugins: {
                    legend: {
                      display: false,
                    },
                    tooltip: {
                      backgroundColor: "rgba(15, 23, 42, 0.9)",
                      titleColor: "#fff",
                      bodyColor: "#fff",
                      callbacks: {
                        label: function (context) {
                          return `${context.parsed.x} WPM`;
                        },
                      },
                    },
                  },
                  scales: {
                    x: {
                      beginAtZero: true,
                      grid: {
                        color: "rgba(255, 255, 255, 0.1)",
                      },
                      ticks: {
                        color: "rgba(255, 255, 255, 0.7)",
                      },
                    },
                    y: {
                      grid: {
                        display: false,
                      },
                      ticks: {
                        color: "rgba(255, 255, 255, 0.7)",
                      },
                    },
                  },
                }}
              />
            </div>
          </motion.div>

          {/* Side B: Leaderboard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-2 bg-slate-800/60 rounded-xl shadow-lg border border-slate-700/50"
          >
            <div className="p-4 border-b border-slate-700/50">
              <h2 className="text-lg font-medium text-white flex items-center">
                <Users size={18} className="text-purple-400 mr-2" />
                Leaderboard
              </h2>
            </div>

            {/* Results table */}
            <div className="overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-700/30">
                    <th className="py-3 px-4 text-left text-sm text-slate-400 font-medium">
                      Rank
                    </th>
                    <th className="py-3 px-4 text-left text-sm text-slate-400 font-medium">
                      Player
                    </th>
                    <th className="py-3 px-4 text-right text-sm text-slate-400 font-medium">
                      <div className="flex items-center justify-end gap-1">
                        <Activity size={14} />
                        <span>WPM</span>
                      </div>
                    </th>
                    <th className="py-3 px-4 text-right text-sm text-slate-400 font-medium hidden sm:table-cell">
                      <div className="flex items-center justify-end gap-1">
                        <Clock size={14} />
                        <span>Progress</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/30">
                  {users.map((user, index) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * index }}
                      className={`
                        ${index === 0 ? "bg-yellow-500/10" : ""}
                        ${selectedUser?.id === user.id ? "bg-slate-700/30" : ""}
                        hover:bg-slate-700/20 cursor-pointer
                      `}
                      onClick={() => setSelectedUser(user)}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-700/50">
                            {getMedalIcon(index)}
                          </span>
                          <span className="text-slate-300 font-medium">
                            {index + 1}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-white">
                          {user.name}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-medium text-lg">
                        <span
                          className={`${
                            index === 0 ? "text-yellow-400" : "text-slate-300"
                          }`}
                        >
                          {Math.round(user.wpm || 0)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-slate-300 hidden sm:table-cell">
                        <div className="flex items-center justify-end">
                          <div className="w-32 bg-slate-700/50 rounded-full h-2 mr-2">
                            <div
                              className={`h-full rounded-full ${
                                index === 0 ? "bg-yellow-500" : "bg-blue-500"
                              }`}
                              style={{
                                width: `${Math.min(
                                  100,
                                  (user.input?.length || 0) / 3
                                )}%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-xs">
                            {Math.min(
                              100,
                              Math.round((user.input?.length || 0) / 3)
                            )}
                            %
                          </span>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>

        {/* Performance Chart for Selected User */}
        {selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-slate-800/60 grid justify-center rounded-xl p-4 md:p-6 mb-8 border border-slate-700/50"
          >
            <div className="mb-4">
              <h2 className="text-lg font-medium text-white flex items-center">
                <LineChart size={18} className="text-yellow-500 mr-2" />
                {selectedUser.name}'s Performance
              </h2>
              <p className="text-sm text-slate-400">
                Speed over time during the race
              </p>
            </div>

            {selectedUser.performanceData &&
            selectedUser.performanceData.length > 0 ? (
              generatePerformanceChart(selectedUser)
            ) : (
              <div className="bg-slate-700/30 rounded-lg p-4 text-center text-slate-400">
                No performance data available for this user
              </div>
            )}
          </motion.div>
        )}

        {/* Race Statistics Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-slate-800/40 rounded-lg p-4">
            <div className="text-gray-500 text-sm mb-1">Race Time</div>
            <div className="text-white font-medium">
              {room?.totalTime} seconds
            </div>
          </div>

          <div className="bg-slate-800/40 rounded-lg p-4">
            <div className="text-gray-500 text-sm mb-1">Participants</div>
            <div className="text-white font-medium">{users.length} players</div>
          </div>

          <div className="bg-slate-800/40 rounded-lg p-4">
            <div className="text-gray-500 text-sm mb-1">Avg. Speed</div>
            <div className="text-white font-medium">
              {Math.round(
                users.reduce((acc, user) => acc + (user.wpm || 0), 0) /
                  Math.max(1, users.length)
              )}{" "}
              WPM
            </div>
          </div>

          <div className="bg-slate-800/40 rounded-lg p-4">
            <div className="text-gray-500 text-sm mb-1">Winner's Lead</div>
            <div className="text-white font-medium">
              {users.length > 1
                ? `+${Math.round(
                    (users[0]?.wpm || 0) - (users[1]?.wpm || 0)
                  )} WPM`
                : "N/A"}
            </div>
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="flex flex-col sm:flex-row justify-center gap-4"
        >
          <button
            onClick={() => navigate("/")}
            className="px-8 py-3 rounded-full font-medium flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white transition-colors"
          >
            <Home size={18} />
            Back to Home
          </button>
          <button
            onClick={() => {
              // You can implement logic here to play again with the same room settings
              // For now, just navigate back to home
              navigate("/");
            }}
            className="px-8 py-3 rounded-full font-medium flex items-center justify-center gap-2 bg-yellow-500 text-slate-900 hover:bg-yellow-400 transition-colors"
          >
            <RotateCcw size={18} />
            Play Again
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

// Helper function to calculate typing grade based on WPM
function getTypingGrade(wpm: number): string {
  if (wpm >= 90) return "A+";
  if (wpm >= 80) return "A";
  if (wpm >= 70) return "B+";
  if (wpm >= 60) return "B";
  if (wpm >= 50) return "C+";
  if (wpm >= 40) return "C";
  if (wpm >= 30) return "D";
  return "E";
}

export default OnlineResultPage;
