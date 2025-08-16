const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  console.log("Authorization Header:", authHeader); // 🔍 debug

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  console.log("Extracted Token:", token); // 🔍 debug

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded JWT:", decoded); // 🔍 debug
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT Verify Error:", err.message); // 🔍 debug
    return res.status(403).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
