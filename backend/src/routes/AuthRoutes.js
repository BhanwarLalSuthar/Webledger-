const express = require('express')
const router = express.Router()

const passport = require("passport");
const { register, login} = require('../controllers/authController')



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
      if (!req.user) {
        return res.status(401).json({ error: "Authentication failed" });
      }
  
      // Extract user & token from Passport.js
      const { accessToken, ...user } = req.user;
      // const isProduction = process.env.NODE_ENV === "production";
      //   res.cookie("jwtToken", accessToken, {
      //       httpOnly: true,    // Prevents JavaScript access
      //       secure: isProduction,      // Only send over HTTPS
      //       sameSite: isProduction ? "strict" : "lax", // Prevent CSRF
      //       maxAge: 24 * 60 * 60 * 1000 // 1 day
      //   });
  
      res.json({ message: "Google Login Successful", user, accessToken });
    }
  );
  
  // Logout Route
  router.get("/logout", (req, res) => {
    req.logout((err) => {
      if (err) return res.status(500).json({ message: "Logout failed" });
      res.json({ message: "User logged out" });
    });
  });


module.exports= router