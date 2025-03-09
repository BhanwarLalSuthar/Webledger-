const express = require("express");
const router = express.Router();
const passport = require("passport");
const { register, login, getProfile } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login", session: false }),
  (req, res) => {
    try {
      if (!req.user) {
        console.error("No user found after Google authentication");
        return res.status(500).json({ error: "Authentication failed" });
      }
      const token = req.authInfo.token; // Token from Google Strategy
      res.redirect`(http://localhost:5173/oauth/callback?token=${token})` ;
    } catch (error) {
      console.error("Error in Google callback:", error);
      res.status(500).json({ error: "Something went wrong!" });
    }
  }
);

router.get("/profile", getProfile);

module.exports = router;