const mongoose = require("mongoose");

const chatroomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: "Chatroom name rquired.",
  },
});

module.exports = mongoose.model("Chatroom", chatroomSchema);