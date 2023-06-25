const mongoose = require("mongoose");
const User = mongoose.model("User");
const sha256 = require("js-sha256");
const jwt = require("jwt-then");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  const emailRegex = /@gmail.com|@yahoo.com|@hotmail.com|@live.com/;

  if (!emailRegex.test(email))
    throw `Email should be from following domains ${emailRegex}`;
  if (password.length < 6) throw "Password must be atleast 6 characters long.";

  const userExists = await User.findOne({
    email,
  });

  if (userExists) throw "User already exists.";

  const user = new User({
    name,
    email,
    password: sha256(password + process.env.SALT),
  });

  await user.save();

  res.json({
    message: `User ${name} registered successfully!`,
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({
    email,
    password: sha256(password + process.env.SALT),
  });

  if (!user) throw "Invalid Credentials.";

  const token = await jwt.sign({ id: user.id }, process.env.SECRET);

  res.json({
    message: "User logged in successfully!",
    token,
  });
};

exports.getAvailableContacts = async (req, res) => {
  try {
    const id = req.payload.id;
    const userList = await User.find({ _id: { $ne: id } }, "name email");
    res.json(userList);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve user list" });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const id = req.payload.id;
    const user = await User.findById(id, "name email");
    if (!user) {
      throw "User not found.";
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve user details" });
  }
};