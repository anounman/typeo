import { Room, User } from "@/types/type";
import { socket } from "./room-socket";

export const sendTypingProgress = (
    roomId: string,
    user: User,
): void => {
    if (!socket) {
        console.error("Socket not initialized in sendTypingProgress");
        return;
    }

    console.log(`SENDING typing progress for ${user.name}: ${user.input.length} chars`);

    // Match the server's expected format: roomId, userId, input, wpm, isDone
    socket.emit('typing:progress', {
        roomId,
        userId: user.id,
        input: user.input,
        wpm: user.wpm || 0,
        isDone: user.isDone || false
    });
};

// Make sure to properly implement this function
export const setupUserEventListener = (callbacks: {
    onUserType: (room: Room) => void;
}): void => {
    if (!socket) {
        console.error("Socket not initialized in setupUserEventListener");
        return;
    }

    console.log("Setting up typing:user_progress listener");

    // Remove existing listener first to prevent duplicates
    socket.off('typing:user_progress');

    // Server sends { room } in the response
    socket.on('typing:user_progress', (data: { room: Room }) => {
        console.log(`RECEIVED typing progress for room: ${data.room.id}`);
        console.log(`Users in room: ${data.room.users.map(u => `${u.name}: ${u.input?.length || 0} chars`).join(', ')}`);

        callbacks.onUserType(data.room);
    });
};

export const cleanupUserEventListeners = (): void => {
    if (!socket) return;

    console.log("Cleaning up typing:user_progress listener");
    socket.off('typing:user_progress');
};