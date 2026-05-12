const userService = require("../service/user_dashboard");

exports.user_dashboard = async (req, res) => {
  try {
    return res.render("user_dashboard");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
};
