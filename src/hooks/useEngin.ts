import { useEffect } from "react";
import { useType } from "./useType";
import { useWords } from "./useWrods";
import { useNavigate } from "react-router-dom";
import { BASE_WORDS_LENGTH, TOTAL_TIME } from "@/utils/global";
import { useState } from "react";
import { useInputContext } from "../components/input-provider";
import { Socket } from "socket.io-client";
import { getSocket } from "@/api/room-socket";


export const useEngin = () => {
    const { words, updateWords, updateGeneratedWords } = useWords(BASE_WORDS_LENGTH);
    const [totalTime, setTotalTime] = useState(TOTAL_TIME);
    const { input, setInput } = useInputContext();
    const { setTimeLeft,
        calculateWPM, calculateAccuracy, calculateWords, handelTyping, timeLeft, resetCountdown, setIsTyping , error , setError
    } = useType(words, totalTime, updateGeneratedWords);
    const navigate = useNavigate();
    const socketInstance = getSocket();
    const [socket, setSocket] = useState<Socket | null>(socketInstance);

    const getInitilizedSocket = () => {
        setSocket(socketInstance);
        return socket;
    };

    
    useEffect(() => {
        setInput('');
        resetCountdown();
        updateWords();
        setError(0);
    } , []);
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

    return { calculateAccuracy, words, restart, input, setInput, timeLeft, calculateWords, calculateWPM, setTimeLeft, setTotalTime, totalTime, handelTyping, socket, getInitilizedSocket , error };
};