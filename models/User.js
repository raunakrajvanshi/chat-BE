const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: "Required field.",
    },
    email: {
      type: String,
      required: "Required field.",
    },
    password: {
      type: String,
      required: "Required field.",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);