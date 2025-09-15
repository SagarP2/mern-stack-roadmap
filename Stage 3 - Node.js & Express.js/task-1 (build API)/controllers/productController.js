const products = require("../data/products");

// @desc   Get all products
// @route  GET /api/products
const getProducts = (req, res) => {
  res.json(products);
};

// @desc   Get product by ID
// @route  GET /api/products/:id
const getProductById = (req, res) => {
  const product = products.find((p) => p.id === parseInt(req.params.id));
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: "Product not found" });
  }
};

module.exports = { getProducts, getProductById };
