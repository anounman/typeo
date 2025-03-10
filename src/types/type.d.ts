
export interface Room {
    id: string;
    users: User[];
    isActive: boolean; // Whether race is active
    createdAt: Date;
    startedAt?: Date;
}
export interface User {
    id: string;
    name: string;
    socketId: string;
    input: string; // User input
    isReady: boolean; // Whether user is ready to start the race
    isDone?: boolean; // Whether user has finished
    wpm?: number; // Words per minute
}


