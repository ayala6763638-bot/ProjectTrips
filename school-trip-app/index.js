import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import http from 'http';
import studentModel from './models/student.model.js';
import teacherModel from './models/teacher.model.js';
import studentRouter from './routers/student.router.js';
import teacherRouter from './routers/teacher.router.js';

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
    socket.on('simulateStudentUpdate', async (payload) => {
        const student = await studentModel.findOne({ id: payload.id });
        if (!student) return console.warn('Student not found:', payload.id);
        student.lastLocation = payload.lastLocation;
        await student.save();
        io.emit('studentLocationUpdated', student);
    });

    socket.on('simulateTeacherUpdate', async (payload) => {
        try {
            const teacher = await teacherModel.findOne({ id: payload.id });
            if (!teacher) return console.warn('Teacher not found for update:', payload.id);
            teacher.lastLocation = payload.lastLocation;
            await teacher.save();
            io.emit('teacherLocationInUpdate', teacher);
        } catch (err) {
            console.error('Error updating teacher in DB:', err);
        }
    });
});

app.set('socketio', io);
app.use('/students', studentRouter);
app.use('/teachers', teacherRouter);
const MONGO_URI = "mongodb://localhost:27017/SchoolTripsDB";
mongoose.connect(MONGO_URI).then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Connection error:", err));
const port = 5000;
server.listen(port, () => {
    console.log(`the app runing on http://localhost:${port}`);
});
