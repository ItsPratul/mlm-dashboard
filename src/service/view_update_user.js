const userModel = require("../model/user_model");
const bcrypt = require("bcryptjs");

exports.view_all_users = async (req) => {
  try {
    const currentUserId = req.user.user_id;

    // ===== CHECK ADMIN =====
    const isAdmin = req.user.parent_id == null;

    // ===== FILTERS =====
    const filter = {};

    if (req.query.filtername) {
      filter.name = {
        $regex: req.query.filtername,
        $options: "i",
      };
    }

    if (req.query.filtermobile) {
      filter.mobile = req.query.filtermobile;
    }

    if (req.query.filteremail) {
      filter.email = {
        $regex: req.query.filteremail,
        $options: "i",
      };
    }

    // ===== MAIN QUERY =====
    let users;

    if (isAdmin) {
      users = await userModel.find(filter).select("-password -auth_key");
    } else {
      users = await userModel
        .find({ parent_id: currentUserId, ...filter })
        .select("-password -auth_key");
    }

    return {
      success: true,
      data: users,
      message: isAdmin ? "Showing all users" : "Showing users added by you",
    };
  } catch (error) {
    console.error("View Users Error:", error.message);

    return {
      success: false,
      data: [],
      message: "Internal Server Error",
    };
  }
};

exports.update_user_post = async (req) => {
  try {
    const { user_id, name, password, gender, address, city, state, mobile } =
      req.body;

    // ===== CHECK USER =====
    const existingUser = await userModel.findOne({ user_id });

    if (!existingUser) {
      return {
        success: false,
        message: "User not found",
      };
    }

    // ===== UPDATE OBJECT =====
    let updateFields = {
      name,
      gender,
      address,
      city,
      state,
      mobile,
    };

    // ===== PASSWORD UPDATE (ONLY IF PROVIDED) =====
    if (password && password.trim() !== "") {
      const hashPassword = await bcrypt.hash(password, 10);
      updateFields.password = hashPassword;
    }

    // ===== UPDATE USER =====
    const updatedUser = await userModel.findOneAndUpdate(
      { user_id },
      updateFields,
      { new: true }, // return updated document
    );

    return {
      success: true,
      message: "User Updated Successfully",
      data: updatedUser,
    };
  } catch (error) {
    console.error("Update User Error:", error.message);

    return {
      success: false,
      message: "Internal Server Error",
    };
  }
};

exports.user_tree_viewer = async (req, res) => {
  try {
    const admin_data = await userModel.findOne({
      user_id: req.user.user_id,
    });

    const user_data = await userModel.find().lean();

    if (admin_data) {
      return {
        user_data: user_data,
        admin_data: admin_data,
        message: "View All Users",
        success: true,
      };
    } else {
      return {
        message: "Admin Not Found",
        success: false,
      };
    }
  } catch (error) {
    console.log("SERVICE ERROR :", error);

    return {
      message: "Something Went Wrong",
      success: false,
    };
  }
};
