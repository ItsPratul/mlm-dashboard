const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // ================= USER ID =================

    user_id: {
      type: Number,
      default: null,
    },

    // ================= BASIC DETAILS =================

    name: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
    },

    mobile: {
      type: String,
      trim: true,
    },

    password: {
      type: String,
    },

    // ================= PROFILE PHOTO =================

    profile_photo: {
      type: String,
      default: "/assets/img/profile-img.jpg",
    },

    // ================= WALLET =================

    wallet: {
      type: Number,
      default: 0,
    },

    // ================= MLM =================

    parent_id: {
      type: String,
      default: null,
    },

    position: {
      type: Number,
      default: null,
    },

    // ================= AUTH =================

    auth_key: {
      type: String,
      default: null,
    },

    // ================= PERSONAL DETAILS =================

    gender: {
      type: String,
    },

    date_of_birth: {
      type: Date,
    },

    address: {
      type: String,
    },

    city: {
      type: String,
    },

    state: {
      type: String,
    },
  },

  {
    timestamps: true,

    versionKey: false,
  },
);

module.exports = mongoose.model("User", userSchema);
