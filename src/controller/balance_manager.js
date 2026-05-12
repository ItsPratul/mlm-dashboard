let userService = require("../service/balance_manager");

exports.add_balance = async (req, res) => {
  try {
    const result = await userService.add_balance(req, res);

    if (!result.success) {
      req.flash("error", result.message);

      return res.redirect("/user_dashboard");
    }

    return res.render("add_balance", {
      admin_data: result.admin_data,
    });
  } catch (error) {
    console.log("ADD BALANCE CONTROLLER ERROR :", error.message);

    req.flash("error", "Something went wrong");

    return res.redirect("/user_dashboard");
  }
};

// ====================== ADD BALANCE POST ======================

exports.add_balance_post = async (req, res) => {
  try {
    const result = await userService.add_balance_post(req, res);

    if (!result.success) {
      req.flash("error", result.message);

      return res.redirect("back");
    }

    req.flash("success", result.message);

    return res.redirect("/view_transactions");
  } catch (error) {
    console.log("ADD BALANCE POST CONTROLLER ERROR :", error.message);

    req.flash("error", "Something went wrong");

    return res.redirect("back");
  }
};

exports.withdraw_balance = async (req, res) => {
  try {
    const response = await userService.withdraw_balance(req, res);

    if (response.success) {
      return res.render("withdraw_balance", {
        admin_data: response.admin_data,
      });
    } else {
      req.flash("error", response.message);

      return res.redirect("back");
    }
  } catch (error) {
    console.log("WITHDRAW BALANCE CONTROLLER ERROR :", error);

    req.flash("error", "Something went wrong");

    return res.redirect("back");
  }
};

exports.withdraw_balance_post = async (req, res) => {
  try {
    const response = await userService.withdraw_balance_post(req, res);

    if (response.success) {
      req.flash("success", response.message);

      return res.redirect("/withdraw_balance");
    } else {
      req.flash("error", response.message);

      return res.redirect("back");
    }
  } catch (error) {
    console.log("WITHDRAW BALANCE POST CONTROLLER ERROR :", error);

    req.flash("error", "Something went wrong");

    return res.redirect("back");
  }
};
