const express = require("express");
const { getProducts, getProductById } = require("../controllers/productController");

const router = express.Router();

// GET all products
router.get("/", getProducts);

// GET single product by id
router.get("/:id", getProductById);

module.exports = router;
