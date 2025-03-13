const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const saltRounds = Number(process.env.SALT_ROUND);

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    res.json({ message: "User registered successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Registration failed", details: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !( await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
      message: "Login successful",
    });
  } catch (error) {
    res.status(500).json({ error: "Login failed", details: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Profile fetch failed", details: error.message });
  }
};
