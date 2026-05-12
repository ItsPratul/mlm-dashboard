const express = require("express");
const router = express.Router();

const userController = require("../controller/balance_manager");
const user_auth = require("../../middleware/user_auth");

router.get("/add_balance", user_auth, userController.add_balance);
router.post("/add_balance_post", user_auth, userController.add_balance_post);

router.get("/withdraw_balance", user_auth, userController.withdraw_balance);
router.post(
  "/withdraw_balance_post",
  user_auth,
  userController.withdraw_balance_post,
);

module.exports = router;
