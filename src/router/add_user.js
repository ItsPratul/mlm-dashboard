const express = require("express");
const router = express.Router();

const userController = require("../controller/add_user");
const user_auth = require("../../middleware/user_auth");

router.get("/add_user", user_auth, userController.add_user);
router.post("/add_user_post", user_auth, userController.add_user_post);

module.exports = router;
