const express = require("express");
const router = express.Router();
const passport = require("passport");
const {
  register,
  login,
  getProfile,
} = require("../controllers/authController");
const axios = require("axios");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

router.post("/register", register);
router.post("/login", login);
router.get("/profile", getProfile);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  (req, res) => {
    const { user, token } = req.user;
    res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
  },
);

// Kept for reference, but not used in this flow
router.post("/google/token", async (req, res) => {
  const { code } = req.body;
  try {
    if (!code) return res.status(400).json({ error: "No auth code provided" });

    const tokenResponse = await axios.post(
      "https://oauth2.googleapis.com/token",
      {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_CALLBACK_URL,
        grant_type: "authorization_code",
      },
    );

    const { access_token } = tokenResponse.data;
    const profileResponse = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      },
    );
    const profile = profileResponse.data;

    let user = await User.findOne({ googleId: profile.sub });
    if (!user) {
      const existingUser = await User.findOne({ email: profile.email });
      if (existingUser) {
        existingUser.googleId = profile.sub;
        await existingUser.save();
        user = existingUser;
      } else {
        user = new User({
          googleId: profile.sub,
          name: profile.name,
          email: profile.email,
        });
        await user.save();
      }
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error(
      "Google Token Exchange Error:",
      error.response?.data || error.message,
    );
    res
      .status(500)
      .json({ error: "Google auth failed", details: error.message });
  }
});

module.exports = router;
