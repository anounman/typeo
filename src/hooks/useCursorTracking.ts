import { useEffect, useState } from "react";

export interface UserCursor {
  id: string;
  username: string;
  position: number; // Character position in the text
  wpm: number;
  accuracy: number;
  color: string;
}

export function useCursorTracking(
  currentUserInput: string,
  words: string,
  totalTime: number
) {
  // Current user's cursor data
  const [currentUserCursor, setCurrentUserCursor] = useState<UserCursor>({
    id: "current-user",
    username: "You",
    position: 0,
    wpm: 10,
    accuracy: 100,
    color: "bg-yellow-500" // Yellow for current user
  });

  // Mock other users (for testing)
  const [otherUsers, setOtherUsers] = useState<UserCursor[]>([
    {
      id: "user-1",
      username: "FastTyper",
      position: 0,
      wpm: 80,
      accuracy: 98,
      color: "bg-blue-500" // Blue
    },
    {
      id: "user-2",
      username: "SlowTyper",
      position: 0,
      wpm: 35,
      accuracy: 95,
      color: "bg-green-500" // Green
    }
  ]);

  // Update current user's cursor when input changes
  useEffect(() => {
    const accuracy = calculateAccuracy(currentUserInput, words);
    const wpm = calculateWPM(currentUserInput, totalTime);

    setCurrentUserCursor(prev => ({
      ...prev,
      position: currentUserInput.length,
      wpm,
      accuracy
    }));
  }, [currentUserInput, words, totalTime]);

  // Simulate other users' typing
  useEffect(() => {
    if (words.length === 0) return;

    const interval = setInterval(() => {
      setOtherUsers(users =>
        users.map(user => {
          // Calculate characters per minute based on WPM
          const charsPerMinute = user.wpm * 5;
          // Convert to characters per second
          const charsPerSecond = charsPerMinute / 60;
          // How many chars to advance in 100ms (our interval)
          const charsToAdvance = charsPerSecond * 0.1;

          let newPosition = user.position + charsToAdvance;

          // Cap at text length
          newPosition = Math.min(newPosition, words.length);

          return {
            ...user,
            position: newPosition
          };
        })
      );
    }, 100);

    return () => clearInterval(interval);
  }, [words]);

  return {
    currentUserCursor,
    otherUserCursors: otherUsers,
    allCursors: [currentUserCursor, ...otherUsers]
  };
}

// Helper functions
function calculateAccuracy(input: string, words: string): number {
  let correct = 0;
  for (let i = 0; i < input.length; i++) {
    if (input[i] === words[i]) correct++;
  }
  return input.length > 0 ? (correct / input.length) * 100 : 100;
}

function calculateWPM(input: string, totalTime: number): number {
  // Standard calculation: 5 characters = 1 word
  const elapsedMinutes = (totalTime - (totalTime - 1)) / 60; // Approximate time typing
  if (elapsedMinutes <= 0) return 0;

  const wordsTyped = input.length / 5;
  return wordsTyped / Math.max(0.01, elapsedMinutes); // Avoid division by zero
}