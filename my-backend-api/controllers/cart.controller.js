const express = require("express");
const { Cart, User } = require("../models");

const addtocart = async (req, res) => {
  const { productId, productImage, quantity, size, productName, price } =
    req.body;
  try {
    const userId = req.user.userId;
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
};

const getCart = async (req, res) => {
  const { userId } = req.params;
  try {
    // Fetch cart items from DB
    const cartItems = await Cart.findAll({ where: { userId: userId } });

    if (!cartItems.length) {
      return res.status(200).json({ message: "Cart is empty", cart: [] });
    }

    const productIds = cartItems.map((item) => item.product_id);

    console.log("productss>>>>>>>---------------", productIds);
    const sanityQuery = `*[_type == "product" && _id in ${JSON.stringify(
      productIds
    )}]{
      _id,
      title,
      price,
      "imageUrl": image.asset->url
    }`;

    const sanityResponse = await fetch(
      `https://${
        process.env.SANITY_PROJECT_ID
      }.api.sanity.io/v2021-10-21/data/query/${
        process.env.SANITY_DATASET
      }?query=${encodeURIComponent(sanityQuery)}`
    ).then((res) => res.json());

    const productMap = {};
    sanityResponse.result.forEach((p) => {
      productMap[p._id] = p;
    });

    // Merge DB cart + Sanity product info
    const response = cartItems.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      price: item.price,
      product: productMap[item.product_id] || null,
    }));

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching cart" });
  }
};

module.exports = {
  addtocart,
  getCart,
};
