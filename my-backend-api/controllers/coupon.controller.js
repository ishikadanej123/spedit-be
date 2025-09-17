const { Coupon } = require("../models");

const createCoupon = async (req, res) => {
  const { code, discountPercentage, maxDiscountAmount, expiryDate } = req.body;
  try {
    if (!code || !discountPercentage) {
      return res.status(400).json({
        message: "Code, discountPercentage, and expiryDate are required.",
      });
    }
    const existingCoupon = await Coupon.findOne({ where: { code } });
    if (existingCoupon) {
      return res.status(400).json({ message: "Coupon code already exists." });
    }
    const newCoupon = await Coupon.create({
      code,
      discountPercentage,
      maxDiscountAmount,
      expiryDate,
    });

    return res
      .status(201)
      .json({ message: "Coupon created successfully", data: newCoupon });
  } catch (err) {
    console.error("Error creating coupon:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const fetchAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.findAll({});
    return res
      .status(200)
      .json({ message: "coupons fetched successfully", data: coupons });
  } catch (err) {
    console.error("Error fetching coupons", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateCouponStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status: adminStatus } = req.body;

    if (!["active", "inactive"].includes(adminStatus)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const coupon = await Coupon.findByPk(id);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    const now = new Date();
    if (coupon.expiryDate < now) {
      coupon.status = "inactive";
    } else {
      coupon.status = adminStatus;
    }
    await coupon.save();
    return res.json({ success: true, coupon });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { createCoupon, fetchAllCoupons, updateCouponStatus };
