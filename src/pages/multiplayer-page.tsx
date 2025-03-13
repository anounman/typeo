import { CoundownTimer } from "@/components/ui/countdown-timer";
import { GeneratedText } from "@/components/ui/generated-text";
import Time from "@/components/ui/time";
import { Room, User } from "@/types/type";
import { useLocation, useNavigate } from "react-router-dom";
import { Crown } from "lucide-react";
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

  const { fn: fnMarkReady } = useSocket(markAsReady);
  const { fn: updateRoomFn } = useSocket(updateRoom);

  const { input, timeLeft, totalTime, setTotalTime } = useOnlineEngine({
    room: room,
    setRoom: setRoom,
    setWord: setWord,
    raceStart: raceStart,
  });

  //if the room is null navigate to home page
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

  // // Add this effect to watch for input changes
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

  return (
    <div className="grid gap-10">
      <div className="flex flex-col justify-center">
        <div className="flex flex-col justify-center items-start py-5">
          <div className="text-1xl text-center">
            Join Code:{" "}
            <span className="text-bold text-slate-500">{room?.id}</span>
          </div>
          <div className=" flex flex-col text-1xl items-start">
            Users{" "}
            <span className="text-bold text-slate-500">
              {room?.users.map((user: User) => (
                <div
                  className="flex flex-row text-center justify-center items-center gap-1"
                  key={user.id}
                >
                  <div className="items-center ">{user.name} </div>
                  <span className="">
                    {user?.isOwner ? (
                      <span>
                        <Crown size={20} color="#ffd500" />
                      </span>
                    ) : (
                      <span></span>
                    )}{" "}
                  </span>{" "}
                  <div className="text-green-500 text-sm items-center">
                    {user.isReady ? "Ready" : "Not Ready"}
                  </div>
                </div>
              ))}
            </span>
          </div>
        </div>
        <div className="flex justify-between">
          <CoundownTimer timeLeft={timeLeft} />
          <Time totalTime={totalTime} setTotalTime={setTotalTime} />
        </div>
        <div className="relative max-w-4xl mt-3 break-all">
          <GeneratedText words={words} />
          {room?.users.map((user) => (
            <>
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
                  {user.input.split("").map((char, index) => {
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
            </>
          ))}
        </div>
      </div>
      {room?.users.find((prevUser) => prevUser.id === currentUser.id)
        ?.isReady ? (
        <div className="flex justify-center items-center text-green-500 ">
          <button
            onClick={() => {
              fnMarkReady(room?.id, currentUser.id);
            }}
          >
            Ready
          </button>
        </div>
      ) : (
        <div className="flex justify-center items-center text-red-500">
          <button
            onClick={async () => {
              console.log(`Room ID: ${room?.id}, User ID: ${currentUser?.id}`);
              fnMarkReady(room!.id, currentUser.id);
              // if (updatedRoom) setRoom(updatedRoom);
            }}
          >
            No Ready
          </button>
        </div>
      )}
    </div>
  );
};

export default MultiPlayerPage;
