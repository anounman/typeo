import { useEffect } from "react";
import { useType } from "./useType";
import { useWords } from "./useWrods";
import { useNavigate } from "react-router-dom";
import { BASE_WORDS_LENGTH, TOTAL_TIME } from "@/utils/global";
import { useState } from "react";
import { useInputContext } from "../components/input-provider";

export const useEngin = () => {
    const { words, updateWords, updateGeneratedWords } = useWords(BASE_WORDS_LENGTH);
    const [totalTime, setTotalTime] = useState(TOTAL_TIME);
    const { input, setInput } = useInputContext();
    const { setTimeLeft,
        calculateWPM, calculateAccuracy, calculateWords, handelTyping, timeLeft, resetCountdown, setIsTyping
    } = useType(words, totalTime, updateGeneratedWords);
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