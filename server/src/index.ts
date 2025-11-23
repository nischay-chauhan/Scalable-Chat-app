import express from "express";
import http from 'http'
import { Server } from "socket.io"
import userRoutes from "./routes/userRoutes";
import roomRoutes from "./routes/roomRoutes";
import authRoutes from "./routes/authRoutes";
import cors from "cors";
import { addMemberToRoom, removeMemberFromRoom } from "./socket/user";
import { addMessage } from "./socket/messages";
import { ChatMessage } from "./socket/type";
import { pub, sub, subscribeToRoom, publishMessage } from "./services/redis";
const app = express()

app.use(express.json());
app.use(cors());
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "*"
    }
})

app.use("/api/users", userRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/auth", authRoutes);

sub.on("message", (channel, message) => {
    console.log(`Redis message on ${channel}:`, message);
    const roomId = channel.split(":")[1];
    if (roomId) {
        io.to(roomId).emit("message", JSON.parse(message));
    }
});

io.on("connection", (socket) => {
    console.log("New connection : ", socket.id);

    socket.on("join_room", async (data: { username: string, roomId: string }) => {
        const { username, roomId } = data;
        const result = await addMemberToRoom(username, roomId);
        if (result.success) {
            socket.join(roomId);
            subscribeToRoom(roomId); // Subscribe this server instance to the room channel
            console.log(`User ${username} joined room ${roomId}`);
            io.to(roomId).emit("user_joined", { username, roomId });
        } else {
            socket.emit("error", { message: result.error });
        }
    });

    socket.on("message", async (msg: ChatMessage) => {
        console.log("Message received: ", msg);
        const result = await addMessage(msg);
        if (result.success) {
            publishMessage(msg.room_id, msg);
        } else {
            console.error("Error adding message:", result.error);
            socket.emit("error", { message: "Failed to send message" });
        }
    });

    socket.on("leave_room", async (data: { username: string, roomId: string }) => {
        const { username, roomId } = data;
        const result = await removeMemberFromRoom(username, roomId);
        if (result.success) {
            socket.leave(roomId);
            console.log(`User ${username} left room ${roomId}`);
            io.to(roomId).emit("user_left", { username, roomId });
        }
    });

    socket.on("disconnect", () => {
        console.log("User disconnected : ", socket.id)
    });
});

const PORT = process.env.PORT || 8080

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})