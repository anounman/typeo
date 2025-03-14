
export interface Room {
    id: string;
    name: string;
    users: User[];
    isActive: boolean; // Whether race is active
    createdAt: Date;
    startedAt?: Date;
    totalTime: number; // Total time for the
    word: string;
}
export interface User {
    id: string;
    name: string;
    socketId: string;
    input: string; // User input
    isReady: boolean; // Whether user is ready to start the race
    isDone?: boolean; // Whether user has finished      
    wpm?: number; // Words per minute
    isOwner?: boolean; // Whether user is the room owner
    performanceData?: PerformancePoint[];
}

export interface PerformancePoint {
    timeRemaining: number;
    wpm: number;
    accuracy: number;
    error: number;
    wordCount: number;
    characterCount: number;
}