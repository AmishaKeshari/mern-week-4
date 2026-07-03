// ============================================================
// server.js - E-Commerce backend entry point (Week 4 Capstone)
// ============================================================
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.json({
    message: "MERN Week 4 E-Commerce API running",
    endpoints: {
      auth: "/api/auth (register, login, profile)",
      products: "/api/products (public read, admin write)",
      orders: "/api/orders (place order, my orders, all orders [admin])"
    }
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

app.use((req, res) => res.status(404).json({ message: "Route not found" }));
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
