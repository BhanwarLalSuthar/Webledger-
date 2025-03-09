const express = require('express')
const router = express.Router()
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { register, login, getProfile} = require('../controllers/authController')



router.post('/register', register)
router.post('/login', login)
// Google OAuth Login Route
router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );
  
  // Google OAuth Callback Route
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login", session: false }),
  (req, res) => {
    try {
      
      if (!req.user) {
      console.error("No user found after Google authentication");
        return res.status(500).json({ error: "Authentication failed" });
      }
      const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      console.log("Google callback successful, redirecting with token:", token);
      res.redirect(`http://localhost:5173/oauth/callback?token=${token}`);
    } catch (error) {
      console.error("Error in Google callback:", err);
      res.status(500).json({ error: "Something went wrong!" });
    }
  }
);
  
router.get("/profile", getProfile);


module.exports= router