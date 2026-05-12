const express = require("express");
const router = express.Router();

const userController = require("../controller/user_validation");
const user_auth = require("../../middleware/user_auth");

router.get("/", userController.user_login);
router.post("/user_login_save", userController.login);

router.post("/user_logout", userController.user_logout);

module.exports = router;
