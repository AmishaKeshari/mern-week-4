// controllers/orderController.js - order management
const Order = require("../models/Order");
const Product = require("../models/Product");

// POST /api/orders  (protected) - place an order from cart items
// body: { items: [{ product, quantity }] }
exports.createOrder = async (req, res) => {
  try {
    const { items } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No order items provided" });
    }

    // Build order items from real product data (don't trust client prices)
    let totalPrice = 0;
    const orderItems = [];
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res
          .status(404)
          .json({ message: `Product not found: ${item.product}` });
      }
      const quantity = Math.max(1, Number(item.quantity) || 1);
      totalPrice += product.price * quantity;
      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity
      });
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalPrice: Math.round(totalPrice * 100) / 100
    });
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/orders/mine  (protected) - current user's orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/orders  (admin) - all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
