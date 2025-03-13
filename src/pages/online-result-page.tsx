import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Trophy, Medal, Clock, Activity, Award, Home, RotateCcw } from "lucide-react";
import { Room, User } from "@/types/type";

const OnlineResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [room] = useState<Room>(location.state?.room);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // If no room data was passed, go back to home
    if (!room) {
      navigate("/");
      return;
    }

    // Sort users by WPM (highest first)
    const sortedUsers = [...room.users].sort((a, b) => 
      (b.wpm || 0) - (a.wpm || 0)
    );
    setUsers(sortedUsers);
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

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid gap-8">
        {/* Header */}
        <div className="flex justify-center mb-4">
          <div className="flex flex-col items-center">
            <h1 className="text-3xl font-bold text-white mb-2">Race Results</h1>
            <p className="text-slate-400">The race has ended! Here's how everyone did:</p>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-slate-800/60 rounded-lg p-6 shadow-lg border border-slate-700">
          <h2 className="text-xl font-semibold mb-4 text-center text-slate-200">
            Leaderboard
          </h2>

          {/* Winner spotlight - only show if we have users */}
          {users.length > 0 && (
            <div className="bg-slate-700/50 rounded-lg p-4 mb-6 border border-slate-600/50 flex flex-col items-center">
              <div className="text-yellow-500 mb-1">
                <Trophy size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">{users[0].name}</h3>
              <div className="text-yellow-400 font-medium text-lg mb-1">
                {Math.round(users[0].wpm || 0)} WPM
              </div>
              <div className="text-slate-400 text-sm">Race Winner</div>
            </div>
          )}

          {/* Results table */}
          <div className="overflow-hidden rounded-lg border border-slate-700">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-800">
                  <th className="py-3 px-4 text-left text-sm text-slate-400 font-medium">Rank</th>
                  <th className="py-3 px-4 text-left text-sm text-slate-400 font-medium">Player</th>
                  <th className="py-3 px-4 text-right text-sm text-slate-400 font-medium">
                    <div className="flex items-center justify-end gap-1">
                      <Activity size={14} />
                      <span>WPM</span>
                    </div>
                  </th>
                  <th className="py-3 px-4 text-right text-sm text-slate-400 font-medium hidden sm:table-cell">
                    <div className="flex items-center justify-end gap-1">
                      <Clock size={14} />
                      <span>Time</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {users.map((user, index) => (
                  <tr 
                    key={user.id} 
                    className={`${index === 0 ? "bg-yellow-500/10" : ""} hover:bg-slate-700/30`}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-700/50">
                          {getMedalIcon(index)}
                        </span>
                        <span className="text-slate-300 font-medium">{index + 1}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-white">{user.name}</div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-medium text-lg">
                      <span className={`${index === 0 ? "text-yellow-400" : "text-slate-300"}`}>
                        {Math.round(user.wpm || 0)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-slate-400 hidden sm:table-cell">
                      {room.totalTime}s
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
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
        </div>
      </div>
    </div>
  );
};

export default OnlineResultPage;