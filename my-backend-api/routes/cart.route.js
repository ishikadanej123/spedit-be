const express = require("express");
const { Cart, User } = require("../models");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();
const cartController = require("../controllers/cart.controller");

router.post("/add-to-cart", authMiddleware, cartController.addtocart);

router.get("/:userId", cartController.getCart);

module.exports = router;
