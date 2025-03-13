import { useState } from "react";
import { Input } from "@/components/ui/input";
import { X, AlertCircle } from "lucide-react"; // Import X and AlertCircle icons
import useSocket from "@/hooks/useSocket";
import { createRoom, joinRoom } from "@/api/room-socket";
import { RoomImpl, UserImpl } from "@/types/mode";
import { Room } from "@/types/type";
import { v4 as uuid } from "uuid";
import { useWords } from "@/hooks/useWrods";
import { BASE_WORDS_LENGTH } from "@/utils/global";
import { useNavigate } from "react-router-dom";

const JoinOrCreateRoom = ({
  setShowOnlineOptions,
}: {
  setShowOnlineOptions: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  // State to track which view to show
  const [view, setView] = useState<"main" | "create" | "join">("main");
  const [roomName, setRoomName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [userName, setUserName] = useState("");
  const [selectedTime, setSelectedTime] = useState(60);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const { words } = useWords(BASE_WORDS_LENGTH);
  const navigator = useNavigate();

  const { fn: createRoomFn } = useSocket(createRoom);
  const { fn: joinRoomFn } = useSocket(joinRoom);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowOnlineOptions(false);
    }
  };

  // Available time options for room creation
  const timeOptions = [15, 30, 60, 120];

  // Validate create room form
  const validateCreateRoom = () => {
    const newErrors: { [key: string]: string } = {};

    if (!roomName.trim()) {
      newErrors.roomName = "Room name is required";
    }

    if (!userName.trim()) {
      newErrors.userName = "Your name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate join room form
  const validateJoinRoom = () => {
    const newErrors: { [key: string]: string } = {};

    if (!joinCode.trim()) {
      newErrors.joinCode = "Room code is required";
    }

    if (!userName.trim()) {
      newErrors.userName = "Your name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateRoom = async () => {
    if (!validateCreateRoom()) {
      return;
    }

    // Create user first to avoid async state issue
    const newUser = new UserImpl({
      id: uuid().toString(),
      name: userName,
      isReady: false,
    });

    const newRoom = new RoomImpl({
      id: uuid().toString(),
      users: [newUser],
      word: words,
      totalTime: selectedTime,
    });

    console.log(`Creating room: ${roomName} with user: ${userName}`);

    const room: Room | void = await createRoomFn(newRoom, newUser);
    if (room) {
      navigator("/online", {
        state: {
          room,
          user: newUser,
        },
      });
    } else {
      setErrors({ form: "Failed to create room. Please try again." });
    }
  };

  const handleJoinRoom = async () => {
    if (!validateJoinRoom()) {
      return;
    }

    // Create user
    const newUser = new UserImpl({
      id: uuid().toString(),
      name: userName,
      isReady: false,
    });

    try {
      const room = await joinRoomFn(joinCode, newUser);
      if (room) {
        navigator("/online", {
          state: {
            room,
            user: newUser,
          },
        });
      } else {
        setErrors({ joinCode: "Room not found or cannot be joined" });
      }
    } catch (error) {
      console.log(error);

      setErrors({ form: "Failed to join room. Please check room code." });
    }
  };

  // Content to show based on the current view
  const renderContent = () => {
    switch (view) {
      case "create":
        return (
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-semibold mb-2">Create Room</h2>

            <div className="flex flex-col gap-2">
              <label htmlFor="roomName" className="text-sm">
                Room Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="roomName"
                value={roomName}
                onChange={(e) => {
                  setRoomName(e.target.value);
                  setErrors({ ...errors, roomName: "" });
                }}
                placeholder="Enter room name"
                onFocus={() => localStorage.setItem("inputFocused", "true")}
                onBlur={() => localStorage.removeItem("inputFocused")}
                className={errors.roomName ? "border-red-500" : ""}
              />
              {errors.roomName && (
                <div className="text-red-500 text-xs flex items-center gap-1 mt-1">
                  <AlertCircle size={12} />
                  {errors.roomName}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="createUserName" className="text-sm">
                Your Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="createUserName"
                value={userName}
                onChange={(e) => {
                  setUserName(e.target.value);
                  setErrors({ ...errors, userName: "" });
                }}
                placeholder="Enter your name"
                onFocus={() => localStorage.setItem("inputFocused", "true")}
                onBlur={() => localStorage.removeItem("inputFocused")}
                className={errors.userName ? "border-red-500" : ""}
              />
              {errors.userName && (
                <div className="text-red-500 text-xs flex items-center gap-1 mt-1">
                  <AlertCircle size={12} />
                  {errors.userName}
                </div>
              )}
            </div>

            <div className="mt-2">
              <p className="text-sm mb-2">Time Limit</p>
              <div className="flex gap-2">
                {timeOptions.map((time) => (
                  <button
                    key={time}
                    className={`px-3 py-1 rounded ${
                      selectedTime === time
                        ? "bg-yellow-500 text-black"
                        : "bg-slate-700"
                    }`}
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}s
                  </button>
                ))}
              </div>
            </div>

            {errors.form && (
              <div className="text-red-500 text-sm flex items-center gap-1 mt-1 bg-red-500/10 p-2 rounded">
                <AlertCircle size={16} />
                {errors.form}
              </div>
            )}

            <div className="flex justify-between mt-4">
              <button
                className="bg-slate-700 px-4 py-2 rounded"
                onClick={() => {
                  setView("main");
                  setErrors({});
                }}
              >
                Back
              </button>
              <button
                className={`${
                  !roomName.trim() || !userName.trim()
                    ? "bg-yellow-500/50 cursor-not-allowed"
                    : "bg-yellow-500 hover:bg-yellow-600"
                } text-black px-4 py-2 rounded transition`}
                onClick={handleCreateRoom}
                disabled={!roomName.trim() || !userName.trim()}
              >
                Create
              </button>
            </div>
          </div>
        );

      case "join":
        return (
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-semibold mb-2">Join Room</h2>

            <div className="flex flex-col gap-2">
              <label htmlFor="joinUserName" className="text-sm">
                Your Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="joinUserName"
                value={userName}
                onChange={(e) => {
                  setUserName(e.target.value);
                  setErrors({ ...errors, userName: "" });
                }}
                placeholder="Enter your name"
                onFocus={() => localStorage.setItem("inputFocused", "true")}
                onBlur={() => localStorage.removeItem("inputFocused")}
                className={errors.userName ? "border-red-500" : ""}
              />
              {errors.userName && (
                <div className="text-red-500 text-xs flex items-center gap-1 mt-1">
                  <AlertCircle size={12} />
                  {errors.userName}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="joinCode" className="text-sm">
                Room Code <span className="text-red-500">*</span>
              </label>
              <Input
                id="joinCode"
                value={joinCode}
                onChange={(e) => {
                  setJoinCode(e.target.value);
                  setErrors({ ...errors, joinCode: "" });
                }}
                placeholder="Enter room code"
                onFocus={() => localStorage.setItem("inputFocused", "true")}
                onBlur={() => localStorage.removeItem("inputFocused")}
                className={errors.joinCode ? "border-red-500" : ""}
              />
              {errors.joinCode && (
                <div className="text-red-500 text-xs flex items-center gap-1 mt-1">
                  <AlertCircle size={12} />
                  {errors.joinCode}
                </div>
              )}
            </div>

            {errors.form && (
              <div className="text-red-500 text-sm flex items-center gap-1 mt-1 bg-red-500/10 p-2 rounded">
                <AlertCircle size={16} />
                {errors.form}
              </div>
            )}

            <div className="flex justify-between mt-4">
              <button
                className="bg-slate-700 px-4 py-2 rounded"
                onClick={() => {
                  setView("main");
                  setErrors({});
                }}
              >
                Back
              </button>
              <button
                className={`${
                  !joinCode.trim() || !userName.trim()
                    ? "bg-yellow-500/50 cursor-not-allowed"
                    : "bg-yellow-500 hover:bg-yellow-600"
                } text-black px-4 py-2 rounded transition`}
                onClick={handleJoinRoom}
                disabled={!joinCode.trim() || !userName.trim()}
              >
                Join
              </button>
            </div>
          </div>
        );

      default: // Main view
        return (
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-semibold mb-4">Play Online</h2>
            <button
              className="bg-yellow-500 text-black px-4 py-3 rounded text-lg w-full hover:bg-yellow-600 transition"
              onClick={() => setView("create")}
            >
              Create Room
            </button>
            <button
              className="bg-slate-700 px-4 py-3 rounded text-lg w-full hover:bg-slate-600 transition"
              onClick={() => setView("join")}
            >
              Join Room
            </button>
          </div>
        );
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-slate-800 p-8 rounded-lg shadow-lg w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-slate-700 transition-colors"
          onClick={() => setShowOnlineOptions(false)}
          aria-label="Close"
        >
          <X size={24} />
        </button>

        {renderContent()}
      </div>
    </div>
  );
};

export default JoinOrCreateRoom;
