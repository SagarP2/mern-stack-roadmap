const express = require("express");
const router = express.Router();

// Example API routes
router.get("/", (req, res) => {
  res.send("📦 List of products");
});

router.post("/", (req, res) => {
  res.status(201).send("✅ Product created");
});

module.exports = router;
