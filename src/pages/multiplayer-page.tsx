import { CoundownTimer } from "@/components/ui/countdown-timer";
import { GeneratedText } from "@/components/ui/generated-text";
import { Room, User } from "@/types/type";
import { useLocation, useNavigate } from "react-router-dom";
import { Crown, Users, Code, Clock, Copy, Check } from "lucide-react"; // Added Copy and Check icons
import useSocket from "@/hooks/useSocket";
import {
  cleanupRoomEventListeners,
  markAsReady,
  setupRoomEventListeners,
  updateRoom,
} from "@/api/room-socket";
import { useEffect, useState } from "react";
import Cursor from "@/components/ui/cursor";
import { useOnlineEngine } from "@/hooks/useOnlineEngine";
import { sendTypingProgress, setupUserEventListener } from "@/api/user-socket";

const MultiPlayerPage = () => {
  const location = useLocation();
  const navigator = useNavigate();

  const [room, setRoom] = useState<Room>(location.state.room);
  const [words, setWord] = useState<string>(room.word);
  const [currentUser] = useState<User>(location.state.user);
  const [raceStart, setRaceStart] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false); // New state for copy feedback

  const { fn: fnMarkReady } = useSocket(markAsReady);
  const { fn: updateRoomFn } = useSocket(updateRoom);

  const { input, timeLeft, totalTime } = useOnlineEngine({
    room: room,
    setRoom: setRoom,
    setWord: setWord,
    raceStart: raceStart,
  });
  
  // Copy room code to clipboard
  const copyRoomCode = () => {
    navigator.clipboard.writeText(room.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
  };

  // if the room is null navigate to home page
  useEffect(() => {
    if (room) {
      updateRoomFn(room);
      setWord(room.word);
    } else {
      navigator("/");
    }
  }, [room, navigator, updateRoomFn]);

  // setup room socket event handeler
  useEffect(() => {
    // Define callbacks for room events
    const roomCallbacks = {
      onUserJoined: (updatedRoom: Room, newUser: User) => {
        console.log(`User joined: ${newUser.name}`);
        setRoom(updatedRoom);
      },

      onUserLeft: (updatedRoom: Room, userId: string) => {
        console.log(`User left: ${userId}`);
        setRoom(updatedRoom);
      },

      onRaceStart: (updatedRoom: Room) => {
        console.log("Race started!");
        setRaceStart(true);
        setRoom(updatedRoom);
      },
      onUserReady: (updatedRoom: Room, userId: string) => {
        console.log(`User Ready: ${userId}`);
        setRoom(updatedRoom);
      },
    };

    const userCallBacks = {
      onUserType: (updatedRoom: Room) => {
        if (updatedRoom.id === room?.id) {
          setRoom(updatedRoom);
        } else {
          console.log(
            "🔴 Not updating room - either wrong room or my own typing"
          );
        }
      },
    };

    // Set up the event listeners
    setupRoomEventListeners(roomCallbacks);
    setupUserEventListener(userCallBacks);

    // Clean up on unmount
    return () => {
      cleanupRoomEventListeners();
    };
  }, [raceStart, room?.id]);

  // Add this effect to watch for input changes
  useEffect(() => {
    if (room.isActive && currentUser) {
      // Calculate WPM
      const wpm = input.length / 5 / ((totalTime - timeLeft) / 60);
      const adjustedWpm = isNaN(wpm) || !isFinite(wpm) ? 0 : wpm;

      // Create a copy of the user with updated values
      const updatedUser = {
        ...currentUser,
        input: input,
        wpm: adjustedWpm,
      };

      // Send the typing progress
      sendTypingProgress(room.id, updatedUser);
    }
  }, [input, room.isActive, currentUser, room?.id, timeLeft, totalTime]);
  
  const isCurrentUserReady = room?.users.find((user) => user.id === currentUser.id)?.isReady || false;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Room info header */}
      <div className="bg-slate-800/60 rounded-lg p-4 mb-6 shadow-lg border border-slate-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-yellow-500 mb-2 md:mb-0">
            <Code size={18} />
            <h2 className="font-medium">Room Code: 
              <span className="text-slate-300 font-mono ml-2">{room?.id}</span>
              <button 
                onClick={copyRoomCode}
                className="ml-2 p-1 rounded-md hover:bg-slate-700/70 transition-colors"
                aria-label="Copy room code"
                title="Copy room code"
              >
                {copied ? (
                  <Check size={14} className="text-green-500" />
                ) : (
                  <Copy size={14} className="text-slate-400" />
                )}
              </button>
            </h2>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-slate-700/50">
            <Clock size={16} className="text-slate-400" />
            <span className="text-slate-300">{totalTime} seconds</span>
          </div>
        </div>
          
        {/* User list */}
        <div className="mt-3">
          <div className="flex items-center gap-1 text-slate-300 mb-2">
            <Users size={16} /> 
            <span className="text-sm font-medium">Players ({room?.users.length})</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {room?.users.map((user: User) => (
              <div
                key={user.id}
                className={`flex items-center gap-2 p-2 rounded-md ${
                  user.id === currentUser.id ? "bg-slate-700/70" : "bg-slate-800/30"
                }`}
              >
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <div className="font-medium">{user.name}</div>
                {user?.isOwner && (
                  <Crown size={14} className="text-yellow-500 ml-1" />
                )}
                <div className="ml-auto">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      user.isReady
                        ? "bg-green-500/20 text-green-400"
                        : "bg-slate-700 text-slate-400"
                    }`}
                  >
                    {user.isReady ? "Ready" : "Not Ready"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Countdown Timer */}
      <div className="mb-4">
        <CoundownTimer timeLeft={timeLeft} />
      </div>

      {/* Typing Area */}
      <div className="relative bg-slate-800/40 rounded-lg p-6 shadow-lg border border-slate-700/50 mb-6">
        <div className="relative max-w-4xl mt-3 break-all">
          <GeneratedText words={words} />
          {room?.users.map((user) => (
            <div key={user.id}>
              {user.id === currentUser.id ? (
                <div className="absolute inset-0 text-4xl">
                  {input.split("").map((_char, index) => {
                    return (
                      <span
                        id={index.toString()}
                        key={index}
                        className="text-slate-500"
                      >
                        {words.split("")[index]}
                      </span>
                    );
                  })}
                  <Cursor />
                </div>
              ) : (
                <div className="absolute inset-0 text-4xl">
                  {user.input?.split("").map((char, index) => {
                    return (
                      <span
                        id={char.toString()}
                        key={index}
                        className="text-transparent"
                      >
                        {words.split("")[index]}
                      </span>
                    );
                  })}
                  <Cursor color="bg-green-500" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Ready Button */}
      <div className="flex justify-center">
        <button
          onClick={() => {
            fnMarkReady(room?.id, currentUser.id);
          }}
          className={`px-8 py-3 rounded-full font-medium transition-all duration-300 text-center min-w-[120px] ${
            isCurrentUserReady 
              ? "bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30" 
              : "bg-yellow-500 text-slate-900 hover:bg-yellow-400"
          }`}
        >
          {isCurrentUserReady ? "Ready" : "Ready Up!"}
        </button>
      </div>
    </div>
  );
};

export default MultiPlayerPage;