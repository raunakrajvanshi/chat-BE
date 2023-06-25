const mongoose = require("mongoose");
const Chatroom = mongoose.model("Chatroom");
const Message = mongoose.model("Message");

exports.createChatroom = async (req, res) => {
  try {
    const { name } = req.body;

    const chatroomExists = await Chatroom.findOne({ name });

    if (chatroomExists) {
      return res.json({
        message: "Chatroom already exists.",
        data: chatroomExists,
      });
    }

    const chatroom = new Chatroom({
      name,
    });

    await chatroom.save();

    res.json({
      message: "Room created successfully!",
      data: chatroom,
    });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

exports.getChatroomByName = async (req, res) => {
  const { name } = req.query;

  const chatroom = await Chatroom.findOne({ name });

  if (!chatroom) {
    return res.status(404).json({ error: "Chatroom not found." });
  }

  res.json(chatroom);
};

exports.getChatroomMessages = async (req, res) => {
  try {
    const chatroomId = req.params.chatroomId;
    const messages = await Message.find({ chatroom: chatroomId });
    res.json(messages);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to retrieve chatroom messages" });
  }
};
