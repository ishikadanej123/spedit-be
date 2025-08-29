const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();
const cartController = require("../controllers/cart.controller");

router.post("/add-to-cart", authMiddleware, cartController.addToCart);
router.get("/:userId", cartController.getCart);
router.patch("/update-cart/:id", authMiddleware, cartController.updateCart);
router.delete("/:productId", authMiddleware, cartController.removeFromCart);

module.exports = router;
