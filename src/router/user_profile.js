const express = require("express");
const router = express.Router();
const userController = require("../controller/user_profile");
const profileService = require("../service/user_profile");
const user_auth = require("../../middleware/user_auth");

router.get(
  "/admin_profile",

  user_auth,

  userController.user_profile_get,
);

router.post(
  "/user_profile_update",

  user_auth,

  profileService.upload_profile_photo,

  userController.user_profile_update,
);

module.exports = router;
