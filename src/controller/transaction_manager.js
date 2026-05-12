let userService = require("../service/transaction_manager");

exports.transaction_manager = async (req, res) => {
  try {
    const result = await userService.transaction_manager(req, res);

    if (!result.success) {
      req.flash("error", result.message);

      return res.redirect("/user_dashboard");
    }

    return res.render("view_transactions", {
      admin_data: result.admin_data,

      transaction_data: result.transaction_data,

      // ================= FILTER VALUES =================

      filtername: req.query.filtername || "",

      filterfromuserid: req.query.filterfromuserid || "",

      filtertouserid: req.query.filtertouserid || "",

      filteramount: req.query.filteramount || "",

      filtertype: req.query.filtertype || "",
    });
  } catch (error) {
    console.log("TRANSACTION CONTROLLER ERROR :", error.message);

    req.flash("error", "Something went wrong");

    return res.redirect("/user_dashboard");
  }
};
