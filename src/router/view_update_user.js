const express = require("express");
const router = express.Router();

const userController = require("../controller/view_update_user");
const user_auth = require("../../middleware/user_auth");

router.get("/view_users", user_auth, userController.view_all_users);

router.get("/update_user/:user_id", user_auth, userController.update_user);
router.post("/update_user_post", user_auth, userController.update_user_post);

router.get("/user_tree_viewer", user_auth, userController.user_tree_viewer);

module.exports = router;
