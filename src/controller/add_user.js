const userService = require("../service/add_user");

exports.add_user = async (req, res) => {
  try {
    return res.render("add_user");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
};

exports.add_user_post = async (req, res) => {
  try {
    const result = await userService.add_user_post(req);

    // ❌ Failure
    if (!result.success) {
      req.flash("error", result.message);
      return res.redirect("/add_user");
    }

    // ✅ Success
    req.flash("success", "User created successfully");
    return res.redirect("/add_user"); // or dashboard
  } catch (error) {
    console.error("Add User POST Error:", error.message);

    req.flash("error", "Something went wrong");
    return res.redirect("/add_user");
  }
};

