const express = require("express");
const router = express.Router();
const productController = require("../controller/product_manager");
const user_auth = require("../../middleware/user_auth");

router.get("/add_product", user_auth, productController.add_product);

router.get("/view_products", user_auth, productController.view_products);

module.exports = router;
