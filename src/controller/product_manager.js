exports.add_product = async (req, res) => {
  try {
    return res.render("add_product", {
      admin_data: req.user,
    });
  } catch (error) {
    console.log("ADD PRODUCT PAGE ERROR :", error);

    return res.redirect("/user_dashboard");
  }
};

exports.view_products = async (req, res) => {
  try {
    return res.render("view_products", {
      admin_data: req.user,
    });
  } catch (error) {
    console.log("VIEW PRODUCT PAGE ERROR :", error);

    return res.redirect("/user_dashboard");
  }
};
