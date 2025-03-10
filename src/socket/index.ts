import { Server } from 'socket.io';
import { setupRoomHandlers } from './roomHandler';
import { setupTypingHandlers } from '../service/typingService';


export const socketSetup = (io: Server) => {

    io.on('connection', (socket) => {
        console.log(`User connected with socket id: ${socket.id}`);
        socket.on('disconnect', () => {
            console.log('user disconnected');
        });

        // socker event handlers 
        setupRoomHandlers(io, socket);
        setupTypingHandlers(socket);



        socket.on('disconnect', () => {
            console.log('user disconnected');
        }
        );
    });

    
} 