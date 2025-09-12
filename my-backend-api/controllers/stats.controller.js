// controllers/stats.controller.js
const { Order, User, sequelize } = require("../models");
const { Op, fn, col, literal } = require("sequelize");

const getStatsOverview = async (req, res) => {
  try {
    // --------- KPI cards ----------
    const totalOrders = await Order.count();

    const totalIncome = Number((await Order.sum("totalAmount")) || 0);

    const totalUsers = await User.count({
      where: { role: { [Op.ne]: "admin" } },
    });

    // Current month income
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const monthlyIncome = Number(
      (await Order.sum("totalAmount", {
        where: {
          createdAt: { [Op.gte]: startOfMonth, [Op.lt]: endOfMonth },
        },
      })) || 0
    );

    // --------- Revenue (last 12 months) ----------
    // Build [YYYY-MM] keys for the last 12 months (inclusive of current month)
    const months = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
      months.push({ key, date: d });
    }

    const startRange = new Date(
      months[0].date.getFullYear(),
      months[0].date.getMonth(),
      1
    );
    const endRange = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const dialect = sequelize.getDialect(); // 'postgres' | 'mysql' | 'mariadb' | ...
    let monthSelect;
    if (dialect === "postgres") {
      // e.g. 2025-09 -> to_char(date_trunc('month', "createdAt"), 'YYYY-MM')
      monthSelect = fn(
        "to_char",
        fn("date_trunc", "month", col("createdAt")),
        "YYYY-MM"
      );
    } else {
      // MySQL/MariaDB: DATE_FORMAT(createdAt, '%Y-%m')
      monthSelect = fn("DATE_FORMAT", col("createdAt"), "%Y-%m");
    }

    const revenueRows = await Order.findAll({
      attributes: [
        [monthSelect, "ym"],
        [fn("COALESCE", fn("SUM", col("totalAmount")), 0), "revenue"],
      ],
      where: {
        createdAt: { [Op.gte]: startRange, [Op.lt]: endRange },
      },
      group: [literal("ym")],
      order: [[literal("ym"), "ASC"]],
      raw: true,
    });

    // Normalize into full 12-month series
    const revenueMap = new Map(
      revenueRows.map((r) => [r.ym, Number(r.revenue)])
    );
    const revenueLast12Months = months.map(({ key, date }) => ({
      month: key, // "YYYY-MM"
      label: date.toLocaleString("en-US", { month: "short", year: "numeric" }),
      revenue: revenueMap.get(key) || 0,
    }));

    // --------- Recent orders ----------
    const recentOrdersRaw = await Order.findAll({
      order: [["createdAt", "DESC"]],
      limit: 10,
    });

    // --------- Response ----------
    return res.status(200).json({
      success: true,
      cards: {
        totalUsers,
        totalOrders,
        totalIncome,
        monthlyIncome, // current month
      },
      charts: {
        revenueLast12Months, // [{ month: "2025-01", label: "Jan 2025", revenue: 1234 }, ...]
      },
      tables: {
        recentOrdersRaw, // [{ userId, name, email, role, ordersCount, totalSpent }, ...]
      },
      meta: {
        asOf: new Date().toISOString(),
        range: {
          revenueFrom: startRange.toISOString(),
          revenueToExclusive: endRange.toISOString(),
        },
      },
    });
  } catch (error) {
    console.error("Error getting stats overview:", error);
    return res.status(500).json({
      success: false,
      msg: "Something went wrong",
      error: error?.message || error,
    });
  }
};

module.exports = { getStatsOverview };
