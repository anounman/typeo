import express, { } from "express";
import router from "./routes/index";
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { socketSetup } from "./socket";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"]
	}
});

const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(cors());
app.use(express.json());


//routes
app.use('/', router);



//Initilize socket connections 
socketSetup(io);

//start the server 
app.listen(PORT, () => {
	console.log(`Server is running on port http://localhost:${PORT}`);
});