const userModel = require("../model/user_model");

exports.user_dashboard = async (req) => {
  try {
    const user = await userModel.findOne(
      { user_id: req.user.user_id },
      "-password -auth_key", // hide sensitive fields
    );

    if (!user) {
      return {
        success: false,
        message: "User not found",
        data: null,
      };
    }

    return {
      success: true,
      message: "Dashboard data fetched successfully",
      data: user,
    };
  } catch (error) {
    console.error("Dashboard Error:", error.message);

    return {
      success: false,
      message: "Internal server error",
      data: null,
    };
  }
};
