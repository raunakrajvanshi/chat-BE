require("dotenv").config();
const mongoose = require("mongoose");

mongoose.connect(process.env.DATABASE, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

mongoose.connection.on("error", (err) => {
  console.log("Error in connection to MongoDB: " + err.message);
});

mongoose.connection.once("open", () => {
  console.log("Connected succesfully to MongoDB");
});

require("./models/User");
require("./models/Chatroom");
require("./models/Message");

const app = require("./app");

const server = app.listen(8000, () => {
  console.log("Server listening on port 8000");
});

const io = require("socket.io")(server, {
  allowEIO3: true,
  cors: {
    origin: true,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const jwt = require("jwt-then");

const Message = mongoose.model("Message");
const User = mongoose.model("User");

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.query.token;
    const payload = await jwt.verify(token, process.env.SECRET);
    socket.userId = payload.id;
    next();
  } catch (err) {}
});

io.on("connection", (socket) => {
  console.log("Connected: " + socket.userId);

  socket.on("disconnect", () => {
    console.log("Disconnected: " + socket.userId);
  });

  socket.on("joinRoom", ({ chatroomId }) => {
    socket.join(chatroomId);
    console.log("A user joined chatroom: " + chatroomId);
  });

  socket.on("leaveRoom", ({ chatroomId }) => {
    socket.leave(chatroomId);
    console.log("A user left chatroom: " + chatroomId);
  });

  socket.on("chatroomMessage", async ({ chatroomId, message }) => {
    if (message.trim().length > 0) {
      try {
        const user = await User.findOne({ _id: socket.userId });
        const newMessage = new Message({
          chatroom: chatroomId,
          user: socket.userId,
          message,
        });
        await newMessage.save();
        io.to(chatroomId).emit("newMessage", {
          message,
          chatroom: chatroomId,
          user: socket.userId,
          _id: newMessage._id,
        });
      } catch (error) {
        console.log("Error saving message:", error);
      }
    }
  });
});
