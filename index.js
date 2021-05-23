const express = require("express");
const app = express();

const server = require("http").createServer(app);
const io = require("socket.io")(server);

let connections = [];

io.on("connect", (socket) => {
  connections.push(socket);
  console.log(`${socket.id} has connected`);

  socket.on("draw", (data) => {
    connections.forEach((con) => {
      if (con.id !== socket.id) {
        con.emit("ondraw", { x: data.x, y: data.y });
      }
    });
  });

  socket.on("down", (data) => {
    connections.forEach((con) => {
      if (con.id !== socket.id) {
        con.emit("ondown", { x: data.x, y: data.y });
      }
    });
  });

  socket.on("disconnect", (reason) => {
    console.log(`${socket.id} is disconnected`);
    connections = connections.filter((con) => con.id !== socket.id);
  });
});

app.use(express.static("public"));

const PORT = process.env.PORT || 8000;

server.listen(PORT, console.log(`Server is running on port ${PORT}`));
