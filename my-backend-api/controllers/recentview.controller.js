const { sanity } = require("../lib/sanity");
const groq = require("groq");
const { RecentView } = require("../models");

const addRecentView = async (req, res) => {
  const { productId } = req.body;

  try {
    const userId = req.user.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    await RecentView.destroy({ where: { userId, productId } });

    await RecentView.create({ userId, productId });

    const recentViews = await RecentView.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
      limit: 10,
      attributes: ["productId"],
    });

    const productIds = [...new Set(recentViews.map((rv) => rv.productId))];

    const sanityQuery = groq`
      *[_type == "product" && coalesce(id, _key) in $ids]{
        title,
        price,
        "resolvedId": coalesce(id, _key),
        "imageUrl": images[0].asset->url
      }
    `;

    const products = await sanity.fetch(sanityQuery, { ids: productIds });

    const orderedProducts = productIds.map((id) =>
      products.find((p) => p.resolvedId === id)
    );

    res.status(200).json(orderedProducts);
  } catch (err) {
    console.error("Error adding recent view:", err);
    res.status(500).json({ message: "Error adding recent view" });
  }
};

const getRecentViews = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const recentViews = await RecentView.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
      limit: 10,
      attributes: ["productId"],
    });

    const productIds = recentViews.map((rv) => rv.productId);

    if (!productIds.length) {
      return res.status(200).json([]);
    }

    const sanityQuery = groq`
      *[_type == "product"]{
        products[coalesce(id, _key) in $ids]{
          title,
          price,
          "resolvedId": coalesce(id, _key),
          "parentDocId": ^._id,
          "imageUrl": images[0].asset->url
        }
      }[].products[]
    `;

    const products = await sanity.fetch(sanityQuery, { ids: productIds });

    let orderedProducts = productIds.map((id) =>
      products.find((p) => p.resolvedId === id)
    );

    const seen = new Set();
    orderedProducts = orderedProducts.filter((product) => {
      if (!product) return false;
      if (seen.has(product.resolvedId)) return false;
      seen.add(product.resolvedId);
      return true;
    });

    res.status(200).json(orderedProducts);
  } catch (err) {
    console.error("Error fetching recent views:", err);
    res.status(500).json({ message: "Error fetching recent views" });
  }
};

const cleanArray = async (req, res) => {
  try {
    const userId = req.user.id;
    await RecentView.destroy({ where: { userId } });
    return res
      .status(200)
      .json({ message: "Recent views cleared successfully" });
  } catch (err) {
    console.error("Error clearing recent views:", error);
    return res.status(500).json({ error: "Failed to clear recent views" });
  }
};

module.exports = { addRecentView, getRecentViews, cleanArray };
