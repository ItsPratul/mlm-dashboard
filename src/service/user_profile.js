const multer = require("multer");
const path = require("path");
let userModel = require("../model/user_model");
const { log } = require("console");

// ================= MULTER STORAGE =================

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/profile_photo");
  },

  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

// ================= FILE FILTER =================

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;

  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase(),
  );

  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  }

  cb(new Error("Only JPG, PNG and WEBP files are allowed"));
};

// ================= MULTER =================

exports.upload_profile_photo = multer({
  storage: storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: fileFilter,
}).single("profile_photo");

// ================= GET PROFILE =================

exports.user_profile_get = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    const admin_data = await userModel.findOne({
      user_id: user_id,
    });

    if (!admin_data) {
      return {
        success: false,

        message: "User not found",
      };
    }

    return {
      success: true,

      admin_data,

      message: "View Your Profile",
    };
  } catch (error) {
    console.log("USER PROFILE GET ERROR :", error);

    return {
      success: false,

      message: "Something went wrong",
    };
  }
};

// ================= UPDATE PROFILE =================

exports.user_profile_update = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    // ================= FORM DATA =================

    const name = req.body.name?.trim();

    const mobile = req.body.mobile?.trim();

    const gender = req.body.gender?.trim();

    const city = req.body.city?.trim();

    const state = req.body.state?.trim();

    const address = req.body.address?.trim();

    // ================= VALIDATION =================

    if (!name || !mobile) {
      return {
        success: false,

        message: "Name and mobile are required",
      };
    }

    // ================= CHECK USER =================

    const existingUser = await userModel.findOne({
      user_id: user_id,
    });

    if (!existingUser) {
      return {
        success: false,

        message: "User not found",
      };
    }

    // ================= DUPLICATE MOBILE =================

    const mobileExists = await userModel.findOne({
      mobile: mobile,

      user_id: {
        $ne: user_id,
      },
    });

    if (mobileExists) {
      return {
        success: false,

        message: "Mobile number already exists",
      };
    }

    // ================= UPDATE DATA =================

    let updateData = {
      name: name,

      mobile: mobile,

      gender: gender,

      city: city,

      state: state,

      address: address,
    };

    // ================= PROFILE PHOTO =================

    if (req.file) {
      updateData.profile_photo = "/uploads/profile_photo/" + req.file.filename;
    }

    // ================= UPDATE USER =================

    await userModel.findOneAndUpdate(
      {
        user_id: user_id,
      },

      {
        $set: updateData,
      },
    );

    // ================= SUCCESS =================

    return {
      success: true,

      message: "Profile updated successfully",
    };
  } catch (error) {
    console.log("USER PROFILE UPDATE ERROR :", error);

    return {
      success: false,

      message: "Something went wrong",
    };
  }
};
