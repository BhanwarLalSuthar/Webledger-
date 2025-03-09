const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User"); // Import User Model
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL, // Redirect URI from Google Console
      passReqToCallback: true,
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Validate profile data
        if (!profile.id || !profile.emails || !profile.emails[0]?.value) {
          return done(new Error("Invalid profile data from Google"), null);
        }

        // Find or create user
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

        // Optional: Generate JWT token
        const token = jwt.sign(
          { id: user._id, email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        return done(null, user, { token }); // Pass token as additional info
      } catch (error) {
        console.error("Google OAuth error:", error);
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    console.error("Deserialize user error:", error);
    done(error, null);
  }
});

module.exports = passport;
