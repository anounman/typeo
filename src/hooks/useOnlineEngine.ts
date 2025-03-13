import { useEffect } from "react";
import { useType } from "./useType";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useInputContext } from "../components/input-provider";
import { Socket } from "socket.io-client";
import { getSocket } from "@/api/room-socket";
import { useWords } from "./useWrods";
import { Room } from "@/types/type";


export const useOnlineEngine = ({ room, setRoom, setWord  , updateRoomFn}: { room: Room, setRoom: React.Dispatch<React.SetStateAction<Room>>, setWord: React.Dispatch<React.SetStateAction<string>>, updateRoomFn: (room: Room) => Promise<void | Room> }) => {
    const [totalTime, setTotalTime] = useState(room.totalTime);
    const { input, setInput } = useInputContext();
    const { words, updateWords, updateGeneratedWords } = useWords(0, room.word);

    const { setTimeLeft,
        calculateWPM, calculateAccuracy, calculateWords, handelTyping, timeLeft, resetCountdown, setIsTyping
    } = useType(words, totalTime, updateGeneratedWords, setRoom , updateRoomFn);
    const navigate = useNavigate();
    const socketInstance = getSocket();
    const [socket, setSocket] = useState<Socket | null>(socketInstance);

    const getInitilizedSocket = () => {
        setSocket(socketInstance);
        return socket;
    };

    useEffect(() => {
        setWord(words);
    }, [words, setWord])




    // Reset countdown when totalTime changes
    useEffect(() => {
        resetCountdown();
        setTimeLeft(totalTime);
    }, [totalTime, resetCountdown, setTimeLeft]);

    useEffect(() => {
        setSocket(socketInstance);
    }, [socketInstance]);
    const restart = () => {
        const url = window.location.pathname;
        if (url !== '/') {
            navigate('/');
        }
        updateWords();
        setInput('');
        resetCountdown();
        setIsTyping(true);
    }


    useEffect(() => {
        window.addEventListener("keydown", handelTyping);
        return () => {
            window.removeEventListener("keydown", handelTyping);
        }
    }, [handelTyping]);

    useEffect(() => {
        setIsTyping(room.isActive);
    }, [room.isActive, setIsTyping]);

    return { calculateAccuracy, words, restart, input, setInput, timeLeft, calculateWords, calculateWPM, setTimeLeft, setTotalTime, totalTime, handelTyping, socket, getInitilizedSocket };
};