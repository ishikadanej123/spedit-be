const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { sanity, PRODUCTS_FLAT } = require("./lib/sanity");

const app = express();
const authroutes = require("./routes/auth.route");
const cartroutes = require("./routes/cart.route");
const wishlistroutes = require("./routes/wishlist.route");
const recentviewsroutes = require("./routes/recentview.route");
const orderrouter = require("./routes/order.route");
const statsRouter = require("./routes/stats.route");
const couponRouter = require("./routes/coupon.route");

const PORT = process.env.APP_PORT || 4000;
app.use(cors());
app.use(express.json());
console.log("PORT from env:", process.env.DB_PORT);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.get("/api/products", async (_req, res) => {
  try {
    const data = await sanity.fetch(PRODUCTS_FLAT);
    return res.json(data);
  } catch (error) {
    console.error("Error fetching products from Sanity:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

app.get("/", async (req, res) => {
  console.log("GET / called");
  res.status(200).send("hello world");
});

app.use("/", authroutes);
app.use("/cart", cartroutes);
app.use("/wishlist", wishlistroutes);
app.use("/recent-view", recentviewsroutes);
app.use("/order", orderrouter);
app.use("/stats", statsRouter);
app.use("/coupon", couponRouter);
