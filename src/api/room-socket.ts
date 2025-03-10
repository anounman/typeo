import { io, Socket } from 'socket.io-client';
import { User, Room } from '@/types/type';
import { HttpMethod } from '@/utils/config';
import { FetchApi } from '@/utils/fetchApi';

// Socket connection management
let socket: Socket | null = null;

// Initialize socket connection
export const initializeSocket = (serverUrl: string = import.meta.env.VITE_API_URL): Socket => {
  if (!socket) {
    socket = io(serverUrl);

    // Basic connection event handlers
    socket.on('connection', () => {
      console.log('Connected to server with ID:', socket?.id);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });
  } 

  return socket;
};

// Get the current socket instance
export const getSocket = (): Socket | null => socket;

// Create a room - Fixed return type




// Join a room - Explicit return type
export const joinRoom = (roomId: string, user: Omit<User, 'socketId'>): Promise<Room | void> => {
  return new Promise<Room | void>((resolve, reject) => {
    initializeSocket();
    if (!socket) {
      reject(new Error('Socket not initialized'));
      return;
    }

    // Add socket ID to user data
    const fullUser = {
      ...user,
      socketId: socket.id
    };

    socket.emit('room:join', { roomId, user: fullUser });

    // Set up a one-time listener for the response
    socket.once('room:joined', ({ room }: { room: Room }) => {
      resolve(room);
    });

    socket.once('room:join_error', ({ message }: { message: string }) => {
      reject(new Error(message));
    });

    // Timeout for response
    setTimeout(() => {
      reject(new Error('Room joining timed out'));
    }, 5000);
  });
};

export const createRoom = async (roomName: string , user: Omit<User ,  'socketId'>): Promise<Room | void> => {

  const req = new FetchApi().request;
  const response   = await req<Room | null>(HttpMethod.POST, '/rooms', { name: roomName });

  if (!response) {
    throw new Error('Failed to create room');
  }
  return joinRoom(response.id, user);
};




// Leave a room - Explicit generic type
export const leaveRoom = (roomId: string, userId: string): Promise<Room | void> => {
  return new Promise<Room | void>((resolve, reject) => {
    initializeSocket();
    if (!socket) {
      reject(new Error('Socket not initialized'));
      return;
    }

    socket.emit('room:leave', { roomId, userId });

    // Set up a one-time listener for the response
    socket.once('room:left', () => {
      resolve();
    });

    socket.once('room:leave_error', ({ message }: { message: string }) => {
      reject(new Error(message));
    });

    // Timeout for response
    setTimeout(() => {
      reject(new Error('Room leaving timed out'));
    }, 5000);
  });
};

// Mark user as ready - Explicit generic type
export const markAsReady = (roomId: string, userId: string): Promise<Room | void> => {
  return new Promise<Room | void>((resolve, reject) => {
    initializeSocket();
    if (!socket) {
      reject(new Error('Socket not initialized'));
      return;
    }

    socket.emit('room:ready', { roomId, userId });

    // Room will be returned when all users are ready and race starts
    socket.once('room:race_start', ({ room }: { room: Room }) => {
      resolve(room);
    });

    // User marked as ready
    socket.once('room:user_ready', ({ room }: { room: Room }) => {
      resolve(room);
    });

    socket.once('room:ready_error', ({ message }: { message: string }) => {
      reject(new Error(message));
    });

    // Timeout for response
    setTimeout(() => {
      reject(new Error('Ready status update timed out'));
    }, 5000);
  });
};

// Set up event listeners for room events (user joined, user left, etc.)
export const setupRoomEventListeners = (callbacks: {
  onUserJoined?: (room: Room, user: User) => void;
  onUserLeft?: (room: Room, userId: string) => void;
  onRaceStart?: (room: Room) => void;
}): void => {
  initializeSocket();
  if (!socket) return;

  if (callbacks.onUserJoined) {
    socket.on('room:user_joined', ({ room, user }: { room: Room, user: User }) => {
      callbacks.onUserJoined?.(room, user);
    });
  }

  if (callbacks.onUserLeft) {
    socket.on('room:user_left', ({ room, userId }: { room: Room, userId: string }) => {
      callbacks.onUserLeft?.(room, userId);
    });
  }

  if (callbacks.onRaceStart) {
    socket.on('room:race_start', ({ room }: { room: Room }) => {
      callbacks.onRaceStart?.(room);
    });
  }
};

// Clean up event listeners
export const cleanupRoomEventListeners = (): void => {
  if (!socket) return;

  socket.off('room:user_joined');
  socket.off('room:user_left');
  socket.off('room:race_start');
};

// Disconnect socket
export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};