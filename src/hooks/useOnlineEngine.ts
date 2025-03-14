import { useEffect } from "react";
import { useType } from "./useType";
import { useState } from "react";
import { useInputContext } from "../components/input-provider";
import { Socket } from "socket.io-client";
import { getSocket } from "@/api/room-socket";
import { useWords } from "./useWrods";
import { Room, User } from "@/types/type";

export const useOnlineEngine = ({
    room,
    setRoom,
    setWord,
    raceStart,
    user
}: {
    raceStart: boolean,
    room: Room,
    setRoom: React.Dispatch<React.SetStateAction<Room>>,
    setWord: React.Dispatch<React.SetStateAction<string>>,
    user : User
}) => {
    const [totalTime, setTotalTime] = useState(room.totalTime);
    const { input, setInput } = useInputContext();
    const { words, updateGeneratedWords } = useWords(0, room.word);

    const {
        setTimeLeft,
        calculateWPM,
        calculateAccuracy,
        calculateWords,
        handelTyping,
        timeLeft,
        setIsTyping,
        startCountdown,
        error,
    } = useType(words, totalTime, updateGeneratedWords, setRoom, raceStart, room, true , user.id);

    const socketInstance = getSocket();
    const [socket, setSocket] = useState<Socket | null>(socketInstance);

    // Reset input and reinitialize everything when component mounts
    useEffect(() => {
        // Clear any previous input
        setInput("");

        // Reset other state if needed
        setTimeLeft(totalTime);
        setIsTyping(false);

        // Return cleanup function to clear input when component unmounts
        return () => {
            setInput("");
        };
    },  []);

    const getInitilizedSocket = () => {
        setSocket(socketInstance);
        return socket;
    };

    useEffect(() => {
        setWord(words);
        setRoom((prev) => {
            const newRoom = prev;
            newRoom.word = words;
            return newRoom;
        });
    }, [words, setWord, setRoom]);

    useEffect(() => {
        if (raceStart) {
            startCountdown();
        }
    }, [raceStart, startCountdown]);

    useEffect(() => {
        setSocket(socketInstance);
    }, [socketInstance]);

    useEffect(() => {
        window.removeEventListener("keydown", handelTyping);
        window.addEventListener("keydown", handelTyping);
        return () => {
            window.removeEventListener("keydown", handelTyping);
        }
    }, [handelTyping]);

    useEffect(() => {
        setIsTyping(room.isActive);
    }, [room.isActive, setIsTyping]);

    return {
        calculateAccuracy,
        words,
        input,
        setInput,
        timeLeft,
        calculateWords,
        calculateWPM,
        setTimeLeft,
        setTotalTime,
        totalTime,
        handelTyping,
        socket,
        getInitilizedSocket,
        error
    };
};