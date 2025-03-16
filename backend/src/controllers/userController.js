const User = require("../models/User");
const bcrypt = require("bcrypt");
require("dotenv").config();

const saltRounds = Number(process.env.SALT_ROUND);

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.json({ message: "Server error", error });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.json({ message: "Server error", error });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const updatedData = { name, email };
    if (password) {
      updatedData.password = await bcrypt.hash(password, saltRounds);
    }
    const user = await User.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
    });
    res.json(user);
  } catch (error) {
    res.json({ message: "Server error", error });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.json({ message: "Server error", error });
  }
};
