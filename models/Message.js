const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  chatroom: {
    type: mongoose.Schema.Types.ObjectId,
    required: "Chatroom Required",
    ref: "Chatroom",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: "User Required",
    ref: "User",
  },
  message: {
    type: String,
    required: "Message Required",
  },
});

module.exports = mongoose.model("Message", messageSchema);