import io from "socket.io-client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOCKET_URL = "http://localhost:5000";
const MINUTES = 3 * 1000; 

const file = path.join(__dirname, "wayOfStudents.json");
if (!fs.existsSync(file)) {
    console.error("Missing wayOfStudents.json in simulator/");
    process.exit(1);
}
const entitiesRaw = JSON.parse(fs.readFileSync(file, "utf8"));

const state = entitiesRaw.map(e => ({ ...e, idx: 0 }));

const socket = io(SOCKET_URL, { reconnectionAttempts: 5 });
socket.on("connect", () => console.log("Simulator connected:", socket.id));
socket.on("connect_error", (err) => console.error("Simulator connect_error:", err));

function decimalToDMS(dec) {
    const abs = Math.abs(dec);
    const deg = Math.floor(abs);
    const minFloat = (abs - deg) * 60;
    const min = Math.floor(minFloat);
    const sec = Math.round((minFloat - min) * 60);
    return { degrees: String(deg), minutes: String(min), seconds: String(sec) };
}

function sendUpdate(e) {
    const wp = e.path[e.idx];
    if (!wp) return;
    const lat = wp.lat;
    const lng = wp.lng;
    const payload = {
        id: e.id,
        firstName: e.firstName,
        lastName: e.lastName,
        lastLocation: {
            coordinates: {
                latitude: decimalToDMS(lat),
                longitude: decimalToDMS(lng)
            },
            time: new Date().toISOString()
        }
    };
    if (e.type === "teacher") {
        socket.emit("simulateTeacherUpdate", payload);
        console.log("Sim sending to server:", payload.id);
        console.log("emit simulateTeacherUpdate:", e.id, "idx=", e.idx);
    } else {
        socket.emit("simulateStudentUpdate", payload);
        console.log("Sim sending to server:", payload.id);
        console.log("emit simulateStudentUpdate:", e.id, "idx=", e.idx);
    }
    e.idx = (e.idx + 1) % e.path.length;
}
const timer = setInterval(() => {
    state.forEach(sendUpdate);
}, MINUTES);
process.on("SIGINT", () => {
    console.log("Simulator shutting down");
    clearInterval(timer);
    socket.close();
    process.exit(0);
});