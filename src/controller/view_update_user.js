const userModel = require("../model/user_model");
const userService = require("../service/view_update_user");

exports.view_all_users = async (req, res) => {
  try {
    const result = await userService.view_all_users(req);

    if (!result.success) {
      req.flash("error", result.message);
      return res.redirect("/");
    }

    return res.render("view_users", {
      users: result.data,
      infoMessage: result.message,
    });
  } catch (error) {
    console.error("Controller Error:", error.message);

    req.flash("error", "Something went wrong");
    return res.redirect("/");
  }
};

exports.update_user = async (req, res) => {
  try {
    const { user_id } = req.params;

    const user = await userModel.findOne({ user_id });

    if (!user) {
      req.flash("error", "User not found");
      return res.redirect("/add_user");
    }

    return res.render("update_user", {
      user_data: user,
    });
  } catch (error) {
    console.error("Update GET Error:", error.message);
    return res.status(500).send("Internal Server Error");
  }
};

exports.update_user_post = async (req, res) => {
  try {
    const result = await userService.update_user_post(req);

    if (!result.success) {
      req.flash("error", result.message);
      return res.redirect("back");
    }

    req.flash("success", result.message);
    return res.redirect("/view_users"); // or dashboard
  } catch (error) {
    console.error("Update POST Error:", error.message);

    req.flash("error", "Something went wrong");
    return res.redirect("back");
  }
};

exports.user_tree_viewer = async (req, res) => {
  try {
    const result = await userService.user_tree_viewer(req);

    if (!result.success) {
      req.flash("error", result.message);

      return res.redirect("/user_dashboard");
    }

    return res.render("user_tree_viewer", {
      admin_data: result.admin_data,
      user_data: result.user_data,
    });
  } catch (error) {
    console.error("USER TREE VIEWER ERROR :", error.message);

    req.flash("error", "Something went wrong");

    return res.redirect("/user_dashboard");
  }
};
