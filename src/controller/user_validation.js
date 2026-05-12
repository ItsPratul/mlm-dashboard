const userService = require("../service/user_validation");
const jwt = require("jsonwebtoken");

// Add user post
exports.signup = async (req, res) => {
  try {
    const result = await userService.user_signup_save(req);

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(201).json(result);
  } catch (error) {
    console.error("Signup Controller Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Login get
exports.user_login = (req, res) => {
  try {
    return res.render("user_login");
  } catch (error) {
    console.error("User Login Render Error:", error.message);

    return res.status(500).send("Internal Server Error");
  }
};

// Login post
exports.login = async (req, res) => {
  try {
    const result = await userService.user_logined(req, res);

    if (!result.success) {
      req.flash("error", result.message);
      console.log(result.message);
      return res.redirect("/");
    }

    req.flash("success", "Login successful");
    return res.redirect("/user_dashboard"); // or dashboard
  } catch (error) {
    console.error(error);

    req.flash("error", "Something went wrong");
    return res.redirect("/");
  }
};

exports.user_logout = async (req, res) => {
  try {
    res.clearCookie("token");

    req.flash("success", "Logout Successfully");

    return res.redirect("/");
  } catch (error) {
    console.log("LOGOUT ERROR :", error.message);

    req.flash("error", "Something went wrong");

    return res.redirect("back");
  }
};
