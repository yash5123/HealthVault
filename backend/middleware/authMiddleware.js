const jwt = require("jsonwebtoken");

exports.protect = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  // Expecting format: Bearer TOKEN
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Invalid token format" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Store only user id cleanly
    req.user = { id: decoded.id };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};