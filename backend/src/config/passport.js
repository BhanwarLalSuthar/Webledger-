const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User"); // Import User Model
const dotenv = require("dotenv");
const jwt = require('jsonwebtoken')
dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL, // Redirect URI from Google Console
      passReqToCallback: true,
      scope: ['profile', 'email'],
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
          // Create a new user if not found
          user = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            password: "", // No password needed for Google login
          });
          await user.save();
        }

         // 🔹 Generate JWT Token
         const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });
         // Attach token to the user object
         user = user.toObject(); // Convert Mongoose document to plain object
         user.accessToken = token; // Attach token

        // console.log(user, token)
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});
