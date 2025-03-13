import { formateInput, generateWords } from "@/utils/helpers";
import { useCallback, useEffect, useState } from "react";
import { useCountdown } from "./useCountdown";
import { useCalculate } from "./useCalculate";
import { useNavigate } from "react-router-dom";
import { useInputContext } from "../components/input-provider";
import { BASE_WORDS_LENGTH } from "@/utils/global";
import { Room } from "@/types/type";

export const useType = (
  words: string,
  time: number,
  updateGeneratedWords: (newWords: string) => void,
  setRoom?: React.Dispatch<React.SetStateAction<Room>>,
  // updateRoomFn?: (room: Room) => Promise<void | Room>,
  isActive: boolean = true,
  room?: Room,
  isOnline: boolean = false
) => {
  const { input, setInput } = useInputContext();
  const [newTime, setNewTime] = useState<number>(time);
  const [isTyping, setIsTyping] = useState<boolean>(true);
  const { timeLeft, startCountdown, resetCountdown, setTimeLeft } = useCountdown(newTime);
  const { calculateWords, calculateAccuracy, calculateWPM, calculateRawWords } = useCalculate(input, words, newTime);
  const navigate = useNavigate();

  const handelTyping = useCallback((e: KeyboardEvent) => {
    // Check if an input field is focused
    const inputFocused = localStorage.getItem('inputFocused') === 'true';
    const isInputElement = document.activeElement?.tagName === 'INPUT' ||
      document.activeElement?.tagName === 'TEXTAREA';

    // Skip handling if we're typing in an input field
    if (inputFocused || isInputElement) {
      return;
    }

    // Proceed with normal typing game logic
    e.preventDefault();
    if (e.key === words.split("")[0] && isActive) {
      startCountdown();
    }

    if (isTyping) {
      formateInput(e, setInput, isTyping);
    }
  }, [isTyping, words, startCountdown, setInput, isActive]);

  //update the time
  useEffect(() => {
    setNewTime(time);
  }, [time, setRoom]);

  // Check if user is approaching the end of words and add more
  useEffect(() => {
    if (input.length >= words.length - 10 && timeLeft > 0) {
      const newWords = generateWords(BASE_WORDS_LENGTH); // Generate 5 new words
      updateGeneratedWords(newWords);
      if (setRoom) {
        setRoom((prev) => {
          const newRoom: Room = prev;
          newRoom.word = words;
          console.log(`Room updated localy new room ${newRoom}`);
          return newRoom;
        });
      }
    }
  }, [input, words, timeLeft, updateGeneratedWords, setRoom]);

  //check if the input is correct or not
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
        if (inputChar === wordsArray[index]) {
          char.classList.replace("text-slate-500", "text-yellow-500");
        } else {
          char.classList.replace("text-slate-500", "text-red-500");
        }
      }
    });
  }, [input, words]);

  useEffect(() => {
    if (timeLeft === 0 && isTyping) {
      setIsTyping(false);
      // TODO: must uncomment this line
      if (isOnline) {
        navigate('/room-result', {
          state: {
            room: room
          }
        });
      } else {
        navigate('/result', {
          state: {
            wpm: calculateWPM().toFixed(0),
            accuracy: calculateAccuracy().toFixed(0),
            words: calculateRawWords().toFixed(0),
            characters: input.length,
            totalTime: newTime,
          }
        });
      }
    }
  }, [newTime, isTyping, timeLeft, navigate, calculateWPM, calculateAccuracy, calculateWords, calculateRawWords, input, room, isOnline]);

  return { calculateWPM, calculateAccuracy, input, setInput, handelTyping, setIsTyping, timeLeft, resetCountdown, startCountdown, calculateWords, setTimeLeft };
};