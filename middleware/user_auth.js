require("dotenv").config();
const jwt = require("jsonwebtoken");
const userModel = require("../src/model/user_model");

const userAuth = async (req, res, next) => {
  try {
    // get token safely
    const token = req.cookies?.token;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // find user
    const user = await userModel
      .findById(decoded.id)
      .select("-password -auth_key");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // attach user to request
    req.user = user;

    next();
  } catch (error) {
    console.error("Auth Error:", error.message);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

module.exports = userAuth;
