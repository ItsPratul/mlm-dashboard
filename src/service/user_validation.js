const userModel = require("../model/user_model");
const Transaction = require("../model/transaction_model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.user_logined = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validation
    if (!email || !password) {
      return {
        success: false,
        message: "Email and password are required",
      };
    }

    // find user
    const existingUser = await userModel.findOne({ email });

    if (!existingUser) {
      return {
        success: false,
        message: "User not found",
      };
    }

    // check password
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password,
    );

    if (!isPasswordValid) {
      return {
        success: false,
        message: "Invalid credentials",
      };
    }

    // generate token
    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true in production (HTTPS)
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // optional: store token in DB (your existing logic)
    await userModel.updateOne({ _id: existingUser._id }, { auth_key: token });

    return {
      success: true,
      message: "User logged in successfully",
    };
  } catch (error) {
    console.error("Login Error:", error.message);

    return {
      success: false,
      message: "Internal server error",
    };
  }
};
