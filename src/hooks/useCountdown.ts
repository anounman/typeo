import { useCallback, useEffect, useRef, useState } from "react";

export const useCountdown = (seconds: number) => {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasTimerEnded = timeLeft <= 0;

  const startCountdown = useCallback(() => {
    if (hasTimerEnded || isRunning) return;

    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setTimeLeft((prevTimeLeft) => Math.max(0, prevTimeLeft - 1));
    }, 1000);
  }, [hasTimerEnded, isRunning]);

  const resetCountdown = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
    setTimeLeft(seconds);
  }, [seconds]);

  // When the countdown reaches 0, clear the countdown interval
  useEffect(() => {
    if (hasTimerEnded && isRunning) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsRunning(false);
    }
  }, [hasTimerEnded, isRunning]);

  // Clear interval when component unmounts
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return { timeLeft, startCountdown, resetCountdown, isRunning, setTimeLeft };
};

