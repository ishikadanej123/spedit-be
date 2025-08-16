const express = require("express");
const { Cart, User } = require("../models");

const router = express.Router();

router.post("/add-to-cart", async (req, res) => {
  const {
    userId,
    productId,
    productImage,
    quantity,
    size,
    productName,
    price,
  } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let cartItem = await Cart.findOne({
      where: { userId, productId, size },
    });

    if (cartItem) {
      cartItem.quantity += quantity;
      cartItem.total = cartItem.price * cartItem.quantity;
      await cartItem.save();
    } else {
      cartItem = await Cart.create({
        userId,
        productId,
        productImage,
        quantity,
        size,
        productName,
        price,
        total: price * quantity,
      });
    }

    return res.status(201).json({
      message: "Product added to cart successfully",
      cartItem,
    });
  } catch (err) {
    console.error("Error adding to cart:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const cartItems = await Cart.findAll({
      where: { userId },
      include: [
        {
          model: Product,
          attributes: ["id", "name", "price", "imageUrl"],
        },
      ],
    });

    if (!cartItems || cartItems.length === 0) {
      return res.status(404).json({ message: "No items found in cart" });
    }

    res.status(200).json({ userId, cart: cartItems });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Error fetching cart", error });
  }
});

module.exports = router;
