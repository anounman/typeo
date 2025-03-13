# Typo Backend: Real-Time Typing Race Application

## Project Overview

Typo is a real-time typing race application where users can create rooms, join existing rooms, and compete in typing races against each other. This document outlines the backend architecture and how to integrate it with a React TypeScript frontend.

## System Architecture

- **Backend**: Node.js with Express and TypeScript
- **Real-time Communication**: Socket.IO
- **Data Storage**: MongoDB (to be integrated later)

## API Endpoints

### Base Endpoint

- `GET /` - Health check endpoint

### Room Management

- `POST /rooms` - Create a new room
- `GET /rooms` - Get all available rooms
- `GET /rooms/:roomId` - Get a specific room by ID

## Socket.IO Events

### Connection Events

- `connection` - Triggered when a user connects
- `disconnect` - Triggered when a user disconnects

### Room Events

- **Client to Server:**

  - `room:join` - Join a room with user data
  - `room:leave` - Leave a room
  - `room:ready` - Mark user as ready to start race

- **Server to Client:**
  - `room:joined` - Confirmation after joining a room
  - `room:user_joined` - Notify other users when someone joins
  - `room:left` - Confirmation after leaving a room
  - `room:user_left` - Notify other users when someone leaves
  - `room:user_ready` - Notify when a user is ready
  - `room:race_start` - Notify all users when race starts
  - `room:join_error` - Error when joining a room
  - `room:leave_error` - Error when leaving a room
  - `room:ready_error` - Error when marking as ready

### Typing Events

- **Client to Server:**

  - `typing:progress` - Send typing progress updates

- **Server to Client:**
  - `typing:user_progress` - Broadcast typing progress to other users

## Data Models

### User

```typescript
interface User {
  id: string;
  name: string;
  socketId: string;
  isReady: boolean;
  input?: string;
  isDone?: boolean;
  wpm?: number;
  doneAt?: Date;
}
```

### Room

```typescript
interface Room {
  id: string;
  users: User[];
  isActive: boolean;
  createdAt: Date;
  startedAt?: Date;
  finishedAt?: Date;
}
```

## Integration with React.js (TypeScript)

### Setting up Socket.IO Client

```typescript
// In your React app
import { io, Socket } from "socket.io-client";

const socket: Socket = io("http://localhost:3000");
```

### Room Management Example

```typescript
import React, { useState } from "react";
import { Room, User } from "../types";

// Types for events
interface RoomJoinedEvent {
  room: Room;
}

interface UserJoinedEvent {
  room: Room;
  user: User;
}

// Component example
const RoomComponent: React.FC = () => {
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [raceActive, setRaceActive] = useState<boolean>(false);

  // Create or join a room
  const joinRoom = (roomId: string, user: User): void => {
    socket.emit("room:join", { roomId, user });
  };

  React.useEffect(() => {
    // Listen for successful join
    socket.on("room:joined", ({ room }: RoomJoinedEvent) => {
      // Update your React state with room data
      setCurrentRoom(room);
    });

    // Listen for other users joining
    socket.on("room:user_joined", ({ room }: UserJoinedEvent) => {
      // Update room state with new user
      setCurrentRoom(room);
    });

    // Listen for race start
    socket.on("room:race_start", ({ room }: RoomJoinedEvent) => {
      // Start the race in your UI
      setRaceActive(true);
    });

    return () => {
      // Cleanup listeners
      socket.off("room:joined");
      socket.off("room:user_joined");
      socket.off("room:race_start");
    };
  }, []);

  // Mark user as ready to start
  const markAsReady = (roomId: string, userId: string): void => {
    socket.emit("room:ready", { roomId, userId });
  };

  // Component render...
};
```

### Typing Race Example

```typescript
// Types for typing events
interface TypingProgress {
  roomId: string;
  userId: string;
  input: string;
  wpm: number;
  isDone: boolean;
}

const TypingComponent: React.FC<{ roomId: string; userId: string }> = ({
  roomId,
  userId,
}) => {
  const [userProgress, setUserProgress] = useState<
    Record<string, { input: string; wpm: number; isDone: boolean }>
  >({});

  // Send typing progress
  const updateTypingProgress = (
    input: string,
    wpm: number,
    isDone: boolean
  ): void => {
    socket.emit("typing:progress", {
      roomId,
      userId,
      input,
      wpm,
      isDone,
    });
  };

  React.useEffect(() => {
    // Listen for other users' progress
    socket.on(
      "typing:user_progress",
      ({ userId, input, wpm, isDone }: TypingProgress) => {
        // Update other users' progress in your UI
        setUserProgress((prev) => ({
          ...prev,
          [userId]: { input, wpm, isDone },
        }));
      }
    );

    return () => {
      socket.off("typing:user_progress");
    };
  }, []);

  // Component render...
};
```

## Setup and Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. For production: `npm start`

## Environment Variables

- `PORT`: Server port (default: 3000)
- `MONGODB_URI`: MongoDB connection string (for future integration)

## Notes for Frontend Implementation

- The backend handles room creation, joining, and real-time progress updates
- Users can join rooms, mark themselves as ready, and compete in typing races
- Progress is tracked in real-time with words per minute (WPM) calculation
- Race completes when all users finish typing
- MongoDB integration will be added later for persistent storage
