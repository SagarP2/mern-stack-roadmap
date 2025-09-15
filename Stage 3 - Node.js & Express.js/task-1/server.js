const express = require("express");
const path = require("path");

const productRoutes = require("./routes/productRoutes");

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/products", productRoutes);

// Optional: serve static HTML from public folder
app.use(express.static(path.join(__dirname, "public")));

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
