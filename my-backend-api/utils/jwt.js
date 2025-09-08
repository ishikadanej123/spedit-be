// utils/jwt.js
const jwt = require("jsonwebtoken");

function signAppToken(user, opts = {}) {
  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role || "user",
  };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: opts.expiresIn || "7d",
  });
}

module.exports = { signAppToken };
