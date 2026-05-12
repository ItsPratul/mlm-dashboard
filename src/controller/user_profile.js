const userService = require("../service/user_profile");

exports.user_profile_get = async (req, res) => {
  try {
    const response = await userService.user_profile_get(req, res);

    if (response.success) {
      return res.render("admin_profile", {
        admin_data: response.admin_data,
      });
    } else {
      req.flash("error", response.message);

      return res.redirect("back");
    }
  } catch (error) {
    console.log("USER PROFILE GET CONTROLLER ERROR :", error);

    req.flash("error", "Something went wrong");

    return res.redirect("back");
  }
};

exports.user_profile_update = async (req, res) => {
  try {
    const response = await userService.user_profile_update(req, res);

    if (response.success) {
      req.flash("success", response.message);

      return res.redirect("/admin_profile");
    } else {
      req.flash("error", response.message);

      return res.redirect("back");
    }
  } catch (error) {
    console.log("USER PROFILE UPDATE CONTROLLER ERROR :", error);

    req.flash("error", "Something went wrong");

    return res.redirect("back");
  }
};
