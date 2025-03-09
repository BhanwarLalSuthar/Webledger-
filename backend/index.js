const express = require('express');
const passport = require("./src/config/passport");
const session = require("express-session");
const cors = require('cors');
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const MongoDBStore = require("connect-mongodb-session")(session);
const {connectDB} = require('./src/config/db');
const recipeRoutes = require('./src/routes/RecipeRoutes');
const authRoutes = require('./src/routes/AuthRoutes');
const dotenv = require('dotenv'); 
require('./src/config/passport'); // Import Passport configuration

dotenv.config();

// Validate environment variables
const requiredEnvVars = [
  "MONGO_URL",
  "JWT_SECRET",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

// Setup MongoDB session store
const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});
const app = express();

app.set("trust proxy", 1);

// Rate limiters
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { error: "Too many auth attempts, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

const recipeLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 200,
  message: { error: "Too many recipe requests, please slow down" },
  standardHeaders: true,
  legacyHeaders: false,
});

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
    methods: ["GET","POST","PUT","DELETE","OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);
  
app.use(helmet());
app.use(morgan("dev"));
  // Session Middleware (Required for Passport)
app.use(
  session({
    secret: process.env.JWT_SECRET, 
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,  //1d
    }
  })
);


app.use(passport.initialize());
app.use(passport.session());  

// Routes
app.use('/auth', authLimiter,authRoutes);
app.use('/recipes',recipeLimiter, recipeRoutes);

app.listen(3030, ()=>{
    try {
        console.log("Server is running on http://localhost:3030");
        connectDB();
    } catch (error) {
        console.log(error);
    }
});

process.on("SIGINT", () => server.close(() => process.exit(0)));
process.on("SIGTERM", () => server.close(() => process.exit(0)));