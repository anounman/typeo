import { formateInput } from "@/utils/helpers";
import { useCallback, useEffect, useState } from "react";
import { useCountdown } from "./useCountdown";
import { useCalculate } from "./useCalculate";
import { useNavigate } from "react-router-dom";

export const useType = (words: string, time: number) => {

  const [input, setInput] = useState<string>('');
  const [newTime, setNewTime] = useState<number>(time);
  const [isTyping, setIsTyping] = useState<boolean>(true);
  const { timeLeft, startCountdown, resetCountdown, setTimeLeft } = useCountdown(newTime);
  const { calculateWords, calculateAccuracy, calculateWPM, calculateRawWPM } = useCalculate(input, words, newTime);
  const navigate = useNavigate();
  const handelTyping = useCallback((e: KeyboardEvent) => {
    e.preventDefault();
    if (e.key === words.split("")[0]) {
      startCountdown();

    }
    if (isTyping) {
      formateInput(e, setInput, isTyping);
    }
  }, [isTyping, words, startCountdown]);

  useEffect(() => {
    setNewTime(time);
  }, [time])

  useEffect(() => {
    const wordsArray: Array<string> = words.split("");
    const inputArray: Array<string> = input.split("");
    wordsArray.forEach((_, index) => {
      const char = document.getElementById(`${index}`);
      if (char) char.className = " text-slate-500";
    });

    inputArray.forEach((inputChar, index) => {
      const char = document.getElementById(`${index}`);
      if (char) {
        //   console.log(
        //     `inputChar: ${inputChar}, wordsArray[index]: ${wordsArray[index]} ${
        //       inputChar === wordsArray[index]
        //     }`
        //   );
        if (inputChar === wordsArray[index]) {
          char.classList.replace("text-slate-500", "text-yellow-500");
        } else {
          char.classList.replace("text-slate-500", "text-red-500");
        }
      }
    });
  }, [input, words]);

  useEffect(() => {
    if (timeLeft === 0) {
      setIsTyping(false);
      navigate('/result', {
        state: {
          wpm: calculateWPM().toFixed(0),
          accuracy: calculateAccuracy().toFixed(0),
          words: calculateRawWPM().toFixed(0),
          characters: input.length,
          totalTime: newTime,
        }
      });
    }
  }, [newTime , isTyping, timeLeft, navigate, calculateWPM, calculateAccuracy, calculateWords, calculateRawWPM, input]);
  return { calculateWPM, calculateAccuracy, input, setInput, handelTyping, setIsTyping, timeLeft, resetCountdown, startCountdown, calculateWords, setTimeLeft };

};