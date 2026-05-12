const express = require("express");

const router = express.Router();

const user_auth = require("../../middleware/user_auth");

const { transaction_manager } = require("../controller/transaction_manager");

router.get("/view_transactions", user_auth, transaction_manager);

module.exports = router;
