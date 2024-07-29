const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const cors = require("cors");
const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://localhost:3000",
  },
});

app.get("/", (req, res) => {
  res.send("Socket.IO server running");
});

io.on("connection", (socket) => {
  console.log(`a user connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`user ${socket.id} joined joined the room ${data}`);
  });

  socket.on("send_message", (messageData) => {
    socket.to(messageData.room).emit("receive_message", messageData);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

const PORT = 8001;
server.listen(PORT, () => {
  console.log("SERVER running on 192.168.100.103:8001");
});
