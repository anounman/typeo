import { formateInput, generateWords } from "@/utils/helpers";
import { useCallback, useEffect, useRef, useState } from "react";
import { useCountdown } from "./useCountdown";
import { useCalculate } from "./useCalculate";
import { useNavigate } from "react-router-dom";
import { useInputContext } from "../components/input-provider";
import { BASE_WORDS_LENGTH } from "@/utils/global";
import { PerformancePoint, Room } from "@/types/type";

// Define performance data point type


export const useType = (
  words: string,
  time: number,
  updateGeneratedWords: (newWords: string) => void,
  setRoom?: React.Dispatch<React.SetStateAction<Room>>,
  isActive: boolean = true,
  room?: Room,
  isOnline: boolean = false,
  userId?: string
) => {
  const { input, setInput } = useInputContext();
  const [newTime, setNewTime] = useState<number>(time);
  const [isTyping, setIsTyping] = useState<boolean>(true);
  const { timeLeft, startCountdown, resetCountdown, setTimeLeft } = useCountdown(newTime);
  const { calculateWords, calculateAccuracy, calculateWPM, calculateRawWords, error, setError } = useCalculate(input, words, newTime);
  const navigate = useNavigate();

  // Track performance over time
  const performanceDataRef = useRef<PerformancePoint[]>([]);
  const performanceIntervalRef = useRef<NodeJS.Timeout | null>(null);



  // Start tracking performance once user begins typing
  const startPerformanceTracking = useCallback(() => {
    // Clear any existing interval
    if (performanceIntervalRef.current) {
      clearInterval(performanceIntervalRef.current);
    }

    // Sample performance metrics every second
    performanceIntervalRef.current = setInterval(() => {
      if (timeLeft > 0 && isTyping) {
        const dataPoint: PerformancePoint = {
          timeRemaining: timeLeft,
          wpm: calculateWPM(),
          error: error,
          accuracy: calculateAccuracy(),
          wordCount: calculateRawWords(),
          characterCount: input.length
        };
        performanceDataRef.current = [...performanceDataRef.current, dataPoint];
      }
    }, 1000); // Sample every second
  }, [timeLeft, isTyping, calculateWPM, calculateAccuracy, calculateRawWords, input.length, error]);

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
      startPerformanceTracking(); // Start tracking once typing begins
    }

    if (isTyping) {
      formateInput(e, setInput, isTyping);
    }
  }, [isTyping, words, startCountdown, setInput, isActive, startPerformanceTracking]);

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

      // Clean up performance tracking
      if (performanceIntervalRef.current) {
        clearInterval(performanceIntervalRef.current);
      }

      // Navigate with performance data
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
            error: error,
            performanceData: performanceDataRef.current.map(point => ({
              time: newTime - point.timeRemaining,
              wpm: Math.round(point.wpm * 10) / 10, // Round to 1 decimal
              accuracy: Math.round(point.accuracy),
              error: error,
              wordCount: point.wordCount,
              characterCount: point.characterCount
            }))
          }
        });
      }
    }
  }, [newTime, isTyping, timeLeft, navigate, calculateWPM, calculateAccuracy, calculateRawWords, input, room, isOnline, error]);


  // if the user is in multiplayer mode and the room is active and user is typing it will set the performance data to the perticular user on the room
  useEffect(() => {
    if (isOnline && room && userId && isTyping) {
      const dataPoint: PerformancePoint = {
        timeRemaining: timeLeft,
        wpm: calculateWPM(),
        accuracy: calculateAccuracy(),
        wordCount: calculateRawWords(),
        characterCount: input.length,
        error: error
      };
      const user = room.users.find((user) => user.id === userId);
      const userIndex = room.users.findIndex((user) => user.id === userId);
      if (user) {
        user.performanceData = [...user.performanceData ?? [], dataPoint];
        room.users[userIndex] = user;
        setRoom!(room);
      }

    }
  }, [isOnline, room, userId, isTyping, timeLeft, calculateWPM, calculateAccuracy, calculateRawWords, input, setRoom, error
  ]);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (performanceIntervalRef.current) {
        clearInterval(performanceIntervalRef.current);
      }
    };
  }, []);


  return { calculateWPM, calculateAccuracy, input, setInput, handelTyping, setIsTyping, timeLeft, resetCountdown, startCountdown, calculateWords, setTimeLeft, error, setError };
};