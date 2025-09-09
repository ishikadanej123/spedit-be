// controllers/stats.controller.js
const { Order, User } = require("../models");
const { Op } = require("sequelize");

const getStatsOverview = async (req, res) => {
  try {
    // Count all orders
    const totalOrders = await Order.count();

    // Sum of totalAmount column
    const totalIncome = Number((await Order.sum("totalAmount")) || 0);

    // Count all non-admin users
    const totalUsers = await User.count({
      where: { role: { [Op.ne]: "admin" } },
    });

    return res.status(200).json({
      success: true,
      cards: {
        totalUsers,
        totalOrders,
        totalIncome,
      },
      meta: {
        asOf: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error getting stats overview:", error);
    return res
      .status(500)
      .json({ success: false, msg: "Something went wrong", error });
  }
};

module.exports = { getStatsOverview };
