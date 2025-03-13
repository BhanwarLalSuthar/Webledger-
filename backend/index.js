const express = require("express");
const passport = require("./src/config/passport");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const { connectDB } = require("./src/config/db");
const recipeRoutes = require("./src/routes/RecipeRoutes");
const authRoutes = require("./src/routes/AuthRoutes");
require("dotenv").config();

const app = express();

app.set("trust proxy", 1);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { error: "Too many auth attempts, please try again later" },
});

const recipeLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 200,
  message: { error: "Too many recipe requests, please slow down" },
});

app.use(express.json());

const allowedOrigins = ["http://localhost:5173", "https://webledger-eight.vercel.app"];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(helmet()); // Default strict settings, no COOP relaxation needed
app.use(morgan("dev"));
app.use(passport.initialize());

app.use("/auth", authLimiter, authRoutes);
app.use("/recipes", recipeLimiter, recipeRoutes);

const server = app.listen(3030, () => {
  console.log("Server is running on http://localhost:3030");
  connectDB();
});

process.on("SIGINT", () => server.close(() => process.exit(0)));
process.on("SIGTERM", () => server.close(() => process.exit(0)));
