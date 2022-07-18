const { port } = require("./config/vars");
const http = require("http");
const { Server: SocketServer } = require("socket.io");
const videoHandlers = require("./handlers/video.handlers");
const EVENTS = require("./const/EVENTS");
const { getRoom, createUser } = require("./services/room.service");

const data = [];

const server = http.createServer();
const io = new SocketServer(server, {
  transports: ["websocket"],
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  const room = getRoom();
  const users = room.users;
  let user, id;

  socket.on(EVENTS.USER_JOIN, () => {
    if (users.length < 4) {
      socket.join("default");
      id = socket.id;
      user = createUser(id);

      console.log(
        "connected",
        users.map((u) => u.id)
      );

      let streamIds = users
        .filter((u) => u.id != id)
        .map((u) => u.publishStream?.callId);

      socket.emit(EVENTS.USER_JOINED, { id, streamIds });
    } else {
      socket.emit(EVENTS.ROOM_IS_FULL);
    }
  });

  socket.on(EVENTS.GET_DATA, () => {
    socket.emit(EVENTS.GET_DATA, data);
  });

  socket.on(EVENTS.SEND_MESSAGE, (message) => {
    data.push(message);
    socket.broadcast.emit(EVENTS.RECEIVE_MESSAGE, message);
  });

  socket.on(EVENTS.PUBLISH, async (data, cb) => {
    await videoHandlers.publish(io, socket, user, data, cb);
  });

  socket.on(EVENTS.VIEW, async (data, cb) => {
    await videoHandlers.view(io, socket, user, data, cb);
  });

  socket.on(EVENTS.ICE_CANDIDATE, (data, cb) => {
    videoHandlers.iceCandidate(io, socket, user, data, cb);
  });

  socket.on("disconnect", async () => {
    videoHandlers.disconnect(io, socket, user, { id, room, users });
  });
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
