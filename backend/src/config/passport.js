const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        if (!profile.id || !profile.emails || !profile.emails[0]?.value) {
          return done(new Error("Invalid profile data from Google"), null);
        }

        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          const existingUser = await User.findOne({
            email: profile.emails[0].value,
          });
          if (existingUser) {
            existingUser.googleId = profile.id;
            await existingUser.save();
            user = existingUser;
          } else {
            user = new User({
              googleId: profile.id,
              name: profile.displayName,
              email: profile.emails[0].value,
            });
            await user.save();
          }
        }

        const token = jwt.sign(
          { id: user._id, email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: "1h" },
        );

        return done(null, { user, token });
      } catch (error) {
        console.error("Google OAuth error:", error);
        return done(error, null);
      }
    },
  ),
);

passport.serializeUser((data, done) => done(null, data));
passport.deserializeUser((data, done) => done(null, data));

module.exports = passport;
