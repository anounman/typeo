import express from "express";
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import router from "./routes/index";
import { socketSetup } from "./socket";

const app = express();
const server = http.createServer(app);  // important for socket.io
const io = new Server(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"]
	}
});

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/', router);	

// Initialize Socket.IO
socketSetup(io);

// Make the HTTP server listen, instead of app.listen
server.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});