
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");
  console.log("Authorization header:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.error("No valid Bearer token provided");
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  const token = authHeader.replace("Bearer ", "");
  console.log("Extracted token:", token);

  if (!token) {
    console.error("Token is empty after extraction");
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token payload:", decoded);
    req.user = decoded; // Ensure this sets { id: "..." }
    console.log("req.user set to:", req.user); // Confirm it’s set
    next();
  } catch (err) {
    console.error("Token verification failed:", err.message);
    res.status(400).json({ message: "Invalid Token" });
  }
};

module.exports = {authMiddleware};
