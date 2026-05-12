const express = require("express");
const router = express.Router();

const userController = require("../controller/user_dashboard");
const user_auth = require("../../middleware/user_auth");

router.get("/user_dashboard", user_auth, userController.user_dashboard);

module.exports = router;
