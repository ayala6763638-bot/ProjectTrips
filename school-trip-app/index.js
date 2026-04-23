import express from 'express';
import studentRouter from './routers/student.router.js';
import cors from 'cors';
import mongoose from 'mongoose';
import teacherRouter from './routers/teacher.router.js';
import { Server } from 'socket.io';
import http from 'http';

const app = express();//object for the project
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});
app.use(cors());
app.use(express.json());
io.on('connection', (socket) => {
    console.log('the user connected', socket.id);
});
app.set('socketio', io);
app.use('/students', studentRouter);
app.use('/teachers', teacherRouter);

const MONGO_URI = "mongodb://localhost:27017/SchoolTripsDB";
mongoose.connect(MONGO_URI).then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Connection error:", err));
const port = 5000;
app.listen(port, () => {
    console.log(`the app runing on http://localhost:${port}`);
});
