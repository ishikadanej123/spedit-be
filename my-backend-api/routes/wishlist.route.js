const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();
const wishlistController = require("../controllers/wishlist.controller");

router.post(
  "/add-to-wishlist",
  authMiddleware,
  wishlistController.addToWishlist
);
router.get("/:userId", authMiddleware, wishlistController.getWishlist);
router.delete(
  "/:productId",
  authMiddleware,
  wishlistController.removeFromWishlist
);

module.exports = router;
