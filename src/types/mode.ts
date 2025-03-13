import { Room as RoomInterface, User, User as UserInterface } from './type';

/**
 * User class with constructor for creating user objects
 */
export class UserImpl implements UserInterface {
    id: string;
    name: string;
    socketId: string;
    input: string;
    isReady: boolean;
    isDone?: boolean;
    wpm?: number;

    constructor({
        id,
        name,
        socketId = '',
        input = '',
        isReady = false,
        isDone = false,
        wpm
    }: {
        id: string;
        name: string;
        socketId?: string;
        input?: string;
        isReady?: boolean;
        isDone?: boolean;
        wpm?: number;
    }) {
        this.id = id;
        this.name = name;
        this.socketId = socketId;
        this.input = input;
        this.isReady = isReady;
        this.isDone = isDone;
        this.wpm = wpm;
    }

    /**
     * Create a user from just basic information
     */
    static fromBasicInfo(id: string, name: string): UserImpl {
        return new UserImpl({ id, name });
    }

    /**
     * Update user's typing progress
     */
    updateProgress(input: string, wpm: number, isDone: boolean): void {
        this.input = input;
        this.wpm = wpm;
        this.isDone = isDone;
    }

    /**
     * Mark user as ready to start the race
     */
    markAsReady(): void {
        this.isReady = true;
    }
}

/**
 * Room class with constructor for creating room objects
 */
export class RoomImpl implements RoomInterface {
    id: string;
    users: User[];
    isActive: boolean;
    createdAt: Date;
    startedAt?: Date;
    word: string;
    totalTime: number;

    constructor({
        id,
        users = [],
        isActive = false,
        createdAt = new Date(),
        startedAt,
        word,
        totalTime,
    }: {
        id: string;
        users?: User[];
        isActive?: boolean;
        createdAt?: Date;
        startedAt?: Date;
        word: string;
        totalTime: number;
    }) {
        this.id = id;
        this.users = users;
        this.isActive = isActive;
        this.createdAt = createdAt;
        this.startedAt = startedAt;
        this.word = word;
        this.totalTime = totalTime;
    }

    /**
     * Create a new empty room
     */
    static create(id: string, word: string, totalTime: number): RoomImpl {
        return new RoomImpl({ id, createdAt: new Date(), word: word, totalTime: totalTime });
    }

    /**
     * Add a user to the room
     */
    addUser(user: User): void {
        // Check if user is already in the room
        if (!this.users.some(u => u.id === user.id)) {
            this.users.push(user);
        }
    }

    /**
     * Remove a user from the room
     */
    removeUser(userId: string): void {
        this.users = this.users.filter(user => user.id !== userId);
    }

    /**
     * Start the race
     */
    startRace(): void {
        this.isActive = true;
        this.startedAt = new Date();
    }

    /**
     * Check if all users are ready
     */
    areAllUsersReady(): boolean {
        return this.users.length > 0 && this.users.every(user => user.isReady);
    }
}