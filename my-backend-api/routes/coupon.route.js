const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/isAdmin");
const router = express.Router();
const couponController = require("../controllers/coupon.controller");

router.post("/add-coupon", isAdmin, couponController.createCoupon);
router.get("/get-all-coupons", couponController.fetchAllCoupons);
router.patch("/:id/status", isAdmin, couponController.updateCouponStatus);

module.exports = router;
