const groq = require("groq");
const { sanity } = require("../lib/sanity");
const { Cart, User } = require("../models");

const addToCart = async (req, res) => {
  const { productId, productImage, quantity, size, productName } = req.body;

  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!quantity || quantity <= 0) {
      return res
        .status(400)
        .json({ message: "Quantity must be greater than 0" });
    }

    const sanityProduct = await sanity.fetch(
      groq`*[_type == "product"].products[coalesce(id, _key) == $pid][0]{
        title,
        "price": coalesce(price, originalPrice)
      }`,
      { pid: productId }
    );

    if (!sanityProduct) {
      return res.status(404).json({ message: "Product not found in Sanity" });
    }

    const actualPrice = Number(sanityProduct.price);
    if (!Number.isFinite(actualPrice) || actualPrice <= 0) {
      return res
        .status(400)
        .json({ message: "Product has no valid price in Sanity" });
    }

    let cartItem = await Cart.findOne({
      where: { userId, productId, size: size || null },
    });

    if (cartItem) {
      cartItem.quantity += quantity;
      cartItem.total = actualPrice * cartItem.quantity;
      await cartItem.save();
    } else {
      cartItem = await Cart.create({
        userId,
        productId, // this is the array item id (coalesce(id, _key))
        productImage,
        quantity,
        size,
        productName,
        price: actualPrice, // never null now
        total: actualPrice * quantity,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Product added to cart successfully",
      data: cartItem,
    });
  } catch (err) {
    console.error("Error adding to cart:", err);
    res.status(500).json({ error: err.message });
  }
};

const getCart = async (req, res) => {
  const { userId } = req.params;
  try {
    const cartItems = await Cart.findAll({ where: { userId: Number(userId) } });

    if (!cartItems.length) {
      return res.status(200).json({ message: "Cart is empty", cart: [] });
    }

    const productIds = cartItems.map((item) => item.productId);

    const sanityQuery = `*[_type == "product" && _id in $ids]{
      _id,
      title,
      price,
      "imageUrl": images[0].asset->url
    }`;

    const sanityResponse = await sanity.fetch(sanityQuery, { ids: productIds });

    const productMap = {};
    sanityResponse.forEach((p) => {
      productMap[p._id] = p;
    });

    const response = cartItems.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      price: item.price,
      total: item.total,
      product: productMap[item.productId] || null,
    }));

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching cart" });
  }
};

module.exports = {
  addToCart,
  getCart,
};
