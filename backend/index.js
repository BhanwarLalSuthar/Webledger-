const express = require('express');
// const passport = require("passport");
// const session = require("express-session");
const cors = require('cors');
const {connectDB} = require('./src/config/db');
const recipeRoutes = require('./src/routes/recipeRoutes');
const authRoutes = require('./src/routes/AuthRoutes');
const dotenv = require('dotenv'); 
require('./src/config/passport'); // Import Passport configuration

dotenv.config();
const app = express();
app.use(express.json());

const allowedOrigins = [
    "http://localhost:5173",  // React frontend (local)
    "http://localhost:5174",  // React frontend (local)
    "http://localhost:3030",  // Another frontend (if applicable)
    "https://your-live-frontend.com" // Your deployed frontend
  ];
  
  app.use(
    cors({
      origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log("Blocked by CORS: ", origin);
            callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true, // Allow cookies and authentication headers
      methods: "GET,POST,PUT,DELETE",
      allowedHeaders: "Content-Type,Authorization",
    })
  );

// Session Middleware (Required for Passport)
// app.use(
//     session({
//       secret: "masai", 
//       resave: false,
//       saveUninitialized: true,
//     })
//   );

// app.use(passport.initialize());
// app.use(passport.session());  
// Routes
app.use('/auth', authRoutes);
app.use('/recipes', recipeRoutes);

app.listen(3030, ()=>{
    try {
        console.log("Server is running on http://localhost:3030");
        connectDB();
    } catch (error) {
        console.log(error);
    }
});