import { Socket } from 'socket.io';
import * as roomService from '../service/roomService';

export function setupTypingHandlers(socket: Socket) {
    // Update typing progress
    socket.on('typing:progress', ({
        roomId,
        userId,
        input,
        wpm = 0,
        isDone = false
    }: {
        roomId: string;
        userId: string;
        input: string;
        wpm?: number;
        isDone?: boolean;
    }) => {
        try {
            const room = roomService.updateUserProgress(roomId, userId, input);

            if (!room) {
                return;
            }

            // Broadcast progress to other users in the room
            socket.to(roomId).emit('typing:user_progress', {
                roomId,
                userId,
                wpm,
                input,
                isDone
            });

            if (isDone) {
                // Check if all users are done
                const userIndex = room.users.findIndex(user => user.id === userId);
                room.users[userIndex].isDone = true;
                room.users[userIndex].wpm = wpm;
                room.users[userIndex].doneAt = new Date(Date.now());

                const allDone = room.users.length > 1 && room.users.every(user => user.isDone);

                if (allDone) {
                    room.isActive = false;
                    room.finishedAt = new Date();
                }
            }

        } catch (error) {
            console.error('Error updating typing progress:', error);
        }
    });

}