const { sanity } = require("../lib/sanity");
const groq = require("groq");
const { Wishlist, User } = require("../models");

const addToWishlist = async (req, res) => {
  const { productId, productImage, quantity, size, productName } = req.body;
  try {
    if (!productId) {
      return res.status(400).json({ message: "productId is required" });
    }
    if (!quantity || quantity <= 0) {
      return res
        .status(400)
        .json({ message: "Quantity must be greater than 0" });
    }
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const sanityProduct = await sanity.fetch(
      groq`*[_type == "product"].products[coalesce(id, _key) == $pid][0]{
        title,
        price,
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
    if (!Number.isFinite(actualPrice) || actualPrice <= 0) {
      return res
        .status(400)
        .json({ message: "Product has no valid price in Sanity" });
    }

    let wishlistItem = await Wishlist.findOne({
      where: { userId, productId, size: size || null },
    });

    if (wishlistItem) {
      wishlistItem.quantity += quantity;
      wishlistItem.price = actualPrice;
      await wishlistItem.save();
    } else {
      wishlistItem = await Wishlist.create({
        userId,
        productId,
        productImage,
        quantity,
        size,
        productName,
        price: actualPrice,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Product added to Wishlist successfully",
      data: wishlistItem,
    });
  } catch (err) {
    console.error("Error adding to Wishlist:", err);
    res.status(500).json({ error: err.message });
  }
};

const getWishlist = async (req, res) => {
  const { userId } = req.params;
  try {
    const wishlistItems = await Wishlist.findAll({
      where: { userId: Number(userId) },
    });
    if (!wishlistItems.length) {
      return res
        .status(200)
        .json({ message: "Wishlist is empty", wishlist: [] });
    }
    const productIds = wishlistItems.map((item) => item.productId);
    const sanityQuery = groq`*[_type == "product"].products[
    coalesce(id,_key) in $ids
    ]{
    "resolveId": coalesce(id,_key),
    title,
    price,
    "imageUrl": images[0].asset->url
    }`;

    const sanityResponse = await sanity.fetch(sanityQuery, { ids: productIds });
    const productMap = {};
    sanityResponse.forEach((p) => {
      productMap[p.resolveId] = p;
    });

    const response = wishlistItems.map((item) => {
      const product = productMap[item.productId] || null;
      return {
        id: item.id,
        price: item.price,
        size: item.size,
        product: product
          ? {
              id: product.resolveId,
              title: product.title,
              price: product.price,
              imageUrl: product.imageUrl,
            }
          : null,
      };
    });
    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching Wishlist:", error);
    res.status(500).json({ message: "Error fetching Wishlist" });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }
    const wishlistItem = await Wishlist.findOne({
      where: { userId, productId },
    });

    if (!wishlistItem) {
      return res.status(404).json({ message: "Product not found in wishlist" });
    }
    await wishlistItem.destroy();
    return res.status(200).json({
      success: true,
      message: "Product removed from Wishlist Successfully",
    });
  } catch (error) {
    console.error("Error Removing Product from Wishlist:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { addToWishlist, getWishlist, removeFromWishlist };
