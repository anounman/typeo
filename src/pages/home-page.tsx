// import { useEffect, useState } from "react";
import RestartButton from "../components/restart-button";
import { CoundownTimer } from "../components/ui/countdown-timer";
import { GeneratedText } from "../components/ui/generated-text";
import Results from "../components/Results";
import { Typing } from "../components/typing";
import { useEngin } from "../hooks/useEngin";
import Time from "@/components/ui/time";
import useSocket from "@/hooks/useSocket";
import { useRef, useState } from "react";
import { createRoom, joinRoom } from "@/api/room-socket";
import { Room, User } from "@/types/type";
import { RoomImpl, UserImpl } from "@/types/mode";
import { v4 as uuid } from "uuid";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";

const HomePage = () => {
  const [user, setUser] = useState<User>();
  const navigator = useNavigate();
  const [roomId, setRoomId] = useState<string | null>(null);
  const roomIdInputRef = useRef<HTMLInputElement>(null);

  const {
    calculateAccuracy,
    words,
    restart,
    input,
    timeLeft,
    calculateWords,
    totalTime,
    setTotalTime,
    getInitilizedSocket,
  } = useEngin();

  const {
    // error : roomCreateError,
    fn: createRoomFn,
    // loading: createRoomLoading,
  } = useSocket(createRoom);

  const { fn: joinRoomFn } = useSocket(joinRoom);

  const handelCreateRoom = async () => {
    setUser(
      new UserImpl({
        id: uuid().toString(),
        name: "test",
        isReady: false,
      })
    );
    if (user) {
      const newRoom = new RoomImpl({
        id: uuid().toString(),
        users: [user],
        word: words,
        totalTime: totalTime,
      });
      console.log(`Creating room with user: ${user} and room: ${newRoom}`);

      const room: Room | void = await createRoomFn(newRoom, user);
      if (room) {
        navigator("/online", {
          state: {
            room,
            user,
          },
        });
      }
    }
  };

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
      <button onClick={handelCreateRoom}>Create Room</button>

      {/* Modified Input with ref and focused state handling */}
      <div className="relative">
        <Input
          ref={roomIdInputRef}
          onChange={(e) => {
            setRoomId(e.target.value);
          }}
          placeholder="Enter Room ID"
          // Add event handlers to temporarily disable keyboard capture
          onFocus={() => {
            localStorage.setItem("inputFocused", "true");
          }}
          onBlur={() => {
            // Remove the flag when input loses focus
            localStorage.removeItem("inputFocused");
          }}
        />
      </div>

      <button
        onClick={async () => {
          const user = new UserImpl({
            id: uuid().toString(),
            name: "user1",
            isReady: false,
          });
          if (roomId && user) {
            const room: Room | void = await joinRoomFn(roomId, user);

            if (room) {
              try {
                navigator("/online", {
                  state: {
                    room,
                    user,
                  },
                });
              } catch (error) {
                console.error(error);
                const socket = getInitilizedSocket();
                socket?.emit("room:leave", { roomId: room.id, user: user });
              }
            }
          }
        }}
      >
        Join Room
      </button>
    </div>
  );
};

export default HomePage;
