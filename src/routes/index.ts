import express from 'express';
import { Router } from 'express';
import { index } from '../controller/engineContoller';
import * as roomController from '../controller/roomController';

// Import route handlers

const router: Router = express.Router();


// Basic Routes
router.get('/', index);

// Room Routes
router.post('/rooms', roomController.createRoom);
router.get('/rooms', roomController.getAllRooms);
router.get('/rooms/:roomId', roomController.getRoomById);


export default router;