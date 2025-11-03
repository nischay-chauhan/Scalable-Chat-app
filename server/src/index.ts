import express from "express";
import http from 'http'
import {Server} from "socket.io"
import userRoutes from "./routes/userRoutes";
import roomRoutes from "./routes/roomRoutes";
import authRoutes from "./routes/authRoutes";
import cors from "cors";
const app = express()

app.use(express.json());
app.use(cors());
const server = http.createServer(app)
const io = new Server(server , {
    cors : {
        origin : "*"
    }
})

app.use("/api/users", userRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/auth", authRoutes);

io.on("connection" , (socket) => {
    console.log("New connection : " , socket.id);

    socket.on("message" , (msg) => {
        console.log("Message : " , msg)
        io.emit("message" , msg)
    });

    socket.on("disconnect" , () => {
        console.log("User disconnected : " , socket.id)
    });
});

const PORT = process.env.PORT || 8080

server.listen(PORT , () => {
    console.log(`Server is running on port ${PORT}`)
})