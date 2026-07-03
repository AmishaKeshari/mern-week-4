// ============================================================
// seed.js - populates admin user + a realistic product catalog
// with real product photos. Run once:  npm run seed
// ============================================================
require("dotenv").config();
const connectDB = require("./config/db");
const User = require("./models/User");
const Product = require("./models/Product");

// Real product photos via Unsplash (free, direct URLs, no API key).
const img = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=600&q=80`;

const sampleProducts = [
  { name: "Sony WH-1000XM4 Wireless Headphones", brand: "Sony", category: "Electronics",
    description: "Industry-leading noise cancelling with 30-hour battery life and touch controls.",
    price: 248, originalPrice: 349, countInStock: 25, rating: 4.7, numReviews: 1284,
    image: img("1505740420928-5e560c06d30e") },
  { name: "Apple AirPods Pro (2nd Gen)", brand: "Apple", category: "Electronics",
    description: "Active noise cancellation, adaptive transparency, and personalized spatial audio.",
    price: 199, originalPrice: 249, countInStock: 40, rating: 4.8, numReviews: 3021,
    image: img("1600294037681-c80b4cb5b434") },
  { name: "Mechanical Gaming Keyboard RGB", brand: "Redragon", category: "Computers",
    description: "Hot-swappable switches, per-key RGB, aluminium frame. Built for speed.",
    price: 69.99, originalPrice: 99.99, countInStock: 60, rating: 4.5, numReviews: 842,
    image: img("1587829741301-dc798b83add3") },
  { name: "Logitech MX Master 3S Mouse", brand: "Logitech", category: "Computers",
    description: "Ergonomic wireless mouse with quiet clicks and 8K DPI tracking.",
    price: 99, originalPrice: 119, countInStock: 35, rating: 4.8, numReviews: 1567,
    image: img("1527864550417-7fd91fc51a46") },
  { name: "27-inch 4K UHD Monitor", brand: "LG", category: "Computers",
    description: "27-inch UHD IPS display with HDR10 and USB-C connectivity.",
    price: 329, originalPrice: 449, countInStock: 15, rating: 4.6, numReviews: 634,
    image: img("1527443224154-c4a3942d3acf") },
  { name: "Smart Watch Series 8", brand: "Apple", category: "Wearables",
    description: "Always-on Retina display, ECG, blood oxygen, and crash detection.",
    price: 379, originalPrice: 429, countInStock: 22, rating: 4.7, numReviews: 2210,
    image: img("1546868871-7041f2a55e12") },
  { name: "Instant Camera Mini 12", brand: "Fujifilm", category: "Photography",
    description: "Fun instant prints, automatic exposure, and a built-in selfie mirror.",
    price: 79, originalPrice: 99, countInStock: 48, rating: 4.6, numReviews: 987,
    image: img("1526170375885-4d8ecf77b99f") },
  { name: "Portable Bluetooth Speaker", brand: "JBL", category: "Electronics",
    description: "Bold sound, IP67 waterproof, 12 hours of playtime, party-pairing.",
    price: 89, originalPrice: 129, countInStock: 55, rating: 4.5, numReviews: 1743,
    image: img("1608043152269-423dbba4e7e1") },
  { name: "Running Shoes Ultraboost", brand: "Adidas", category: "Fashion",
    description: "Responsive cushioning and a breathable knit upper for daily runs.",
    price: 119, originalPrice: 180, countInStock: 70, rating: 4.6, numReviews: 2456,
    image: img("1542291026-7eec264c27ff") },
  { name: "Classic Leather Backpack", brand: "Herschel", category: "Fashion",
    description: "Water-resistant, padded laptop sleeve, timeless everyday carry.",
    price: 64.99, originalPrice: 89.99, countInStock: 42, rating: 4.4, numReviews: 728,
    image: img("1553062407-98eeb64c6a62") },
  { name: "Stainless Steel Water Bottle", brand: "Hydro Flask", category: "Home",
    description: "Keeps drinks cold 24h / hot 12h. Durable, BPA-free, 32oz.",
    price: 32.95, originalPrice: 44.95, countInStock: 90, rating: 4.8, numReviews: 3890,
    image: img("1602143407151-7111542de6e8") },
  { name: "Aromatherapy Essential Oil Diffuser", brand: "Vitruvi", category: "Home",
    description: "Ceramic ultrasonic diffuser with a soft ambient glow.",
    price: 119, originalPrice: 0, countInStock: 30, rating: 4.5, numReviews: 512,
    image: img("1608571423902-eed4a5ad8108") },
  { name: "Espresso Coffee Machine", brand: "Breville", category: "Home",
    description: "Barista-grade espresso with built-in grinder and milk frother.",
    price: 599, originalPrice: 699, countInStock: 12, rating: 4.7, numReviews: 1102,
    image: img("1495474472287-4d71bcdd2085") },
  { name: "Wireless Charging Pad", brand: "Anker", category: "Electronics",
    description: "Fast 15W Qi charging with a sleek non-slip surface.",
    price: 24.99, originalPrice: 39.99, countInStock: 120, rating: 4.4, numReviews: 1998,
    image: img("1586953208448-b95a79798f07") },
  { name: "Sunglasses Polarized Aviator", brand: "Ray-Ban", category: "Fashion",
    description: "Classic aviator frame with UV400 polarized lenses.",
    price: 154, originalPrice: 199, countInStock: 38, rating: 4.6, numReviews: 865,
    image: img("1511499767150-a48a237f0083") },
  { name: "Digital SLR Camera 24MP", brand: "Canon", category: "Photography",
    description: "24.1MP sensor, 4K video, Wi-Fi, and dual-pixel autofocus.",
    price: 649, originalPrice: 799, countInStock: 10, rating: 4.7, numReviews: 543,
    image: img("1502920917128-1aa500764cbd") }
];

const seed = async () => {
  try {
    await connectDB();

    // By default, only seed when the catalog is empty, so re-running this
    // doesn't wipe products and change their IDs (which would break saved carts).
    // Run "npm run seed -- --force" to force a full reset.
    const force = process.argv.includes("--force");
    const existing = await Product.countDocuments();

    if (existing > 0 && !force) {
      console.log(
        `Catalog already has ${existing} products. Skipping product seed.`
      );
      console.log('Use "npm run seed -- --force" to wipe and reseed.');
    } else {
      await Product.deleteMany();
      await Product.insertMany(sampleProducts);
      console.log(`Products inserted: ${sampleProducts.length}`);
    }

    const adminEmail = "admin@shop.com";
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      admin = await User.create({
        name: "Admin", email: adminEmail, password: "admin123", role: "admin"
      });
    }

    console.log("Seed complete.");
    console.log("Admin login -> email: admin@shop.com  password: admin123");
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
};

seed();
