import { useEffect, useState } from "react";
import { useType } from "./useType";
import { useWords } from "./useWrods";
import { useNavigate } from "react-router-dom";
import { TOTAL_TIME } from "@/utils/global";

export const useEngin = () => {
    const { words, updateWords } = useWords(10);
    const [totalTime, setTotalTime] = useState(TOTAL_TIME);
    const { setTimeLeft,
        calculateWPM, calculateAccuracy, calculateWords, input, setInput, handelTyping, timeLeft, resetCountdown, setIsTyping
    } = useType(words, totalTime);
    const navigate = useNavigate();

    // Reset countdown when totalTime changes
    useEffect(() => {
        resetCountdown();
        setTimeLeft(totalTime);
    }, [totalTime, resetCountdown, setTimeLeft]);

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

    return { calculateAccuracy, words, restart, input, setInput, timeLeft, calculateWords, calculateWPM, setTimeLeft, setTotalTime, totalTime };
};