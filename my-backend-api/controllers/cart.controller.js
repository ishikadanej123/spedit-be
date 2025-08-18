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
        price,
        "originalPrice": select(defined(originalPrice) => originalPrice, defined(origianlprice) => origianlprice),
        "resolvedId": coalesce(id, _key),
        "parentDocId": ^._id
      }`,
      { pid: productId }
    );

    if (!sanityProduct) {
      return res.status(404).json({ message: "Product not found in Sanity" });
    }
    const product = sanityProduct[0];

    const actualPriceRaw = product.price ?? product.originalPrice;
    const actualPrice = Number(actualPriceRaw);
    console.log("actualprice>>>>>>>--", actualPrice);

    if (!Number.isFinite(actualPrice) || actualPrice <= 0) {
      return res.status(400).json({
        message: "Product has no valid price in Sanity",
      });
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
        productId,
        productImage,
        quantity,
        size,
        productName,
        price: actualPrice,
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

    const sanityQuery = groq`*[_type == "product"].products[
        coalesce(id, _key) in $ids
        ]{
        "resolvedId": coalesce(id, _key),
        title,      
        "price": coalesce(price, originalPrice, origianlprice),
        "imageUrl": images[0].asset->url
        }`;

    const sanityResponse = await sanity.fetch(sanityQuery, { ids: productIds });

    const productMap = {};
    sanityResponse.forEach((p) => {
      productMap[p.resolvedId] = p;
    });

    const response = cartItems.map((item) => {
      const product = productMap[item.productId] || null;

      return {
        id: item.id,
        quantity: item.quantity,
        price: item.price,
        total: item.total,
        size: item.size,
        product: product
          ? {
              id: product.resolvedId,
              title: product.title,
              price: product.price ?? product.originalPrice,
              imageUrl: product.imageUrl,
            }
          : null,
      };
    });

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Error fetching cart" });
  }
};

module.exports = {
  addToCart,
  getCart,
};
