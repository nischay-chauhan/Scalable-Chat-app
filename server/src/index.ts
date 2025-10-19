import express from "express";
import http from 'http'
import {Server} from "socket.io"

const app = express()
const server = http.createServer(app)
const io = new Server(server , {
    cors : {
        origin : "*"
    }
})

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
    