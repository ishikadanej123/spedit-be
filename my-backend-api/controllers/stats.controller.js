// controllers/stats.controller.js
const { Order, User, sequelize } = require("../models");
const { Op, fn, col, literal } = require("sequelize");

const getStatsOverview = async (req, res) => {
  try {
    // --------- KPI cards ----------
    const totalOrders = await Order.count({
      where: { paymentStatus: "completed" },
    });
    const totalIncome = Number((await Order.sum("finalTotal")) || 0);
    const totalUsers = await User.count({
      where: { role: { [Op.ne]: "admin" } },
    });

    // Current month income
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const monthlyIncome = Number(
      (await Order.sum("finalTotal", {
        where: {
          createdAt: { [Op.gte]: startOfMonth, [Op.lt]: endOfMonth },
        },
      })) || 0
    );

    // --------- Orders by Postcode ----------
    let ordersByPostcode = [];

    try {
      // First, let's examine the actual structure of one record
      const sampleOrder = await Order.findOne({
        attributes: ["userDetails"],
        where: { paymentStatus: "completed" },
        raw: true,
      });

      // Process all orders to extract postcodes
      const allOrders = await Order.findAll({
        attributes: ["id", "userDetails"],
        where: { paymentStatus: "completed" },
        raw: true,
      });

      const postcodeCounts = {};

      allOrders.forEach((order) => {
        try {
          let addressData;

          // Parse the shippingAddress field
          if (typeof order.userDetails === "string") {
            addressData = JSON.parse(order.userDetails);
          } else {
            addressData = order.userDetails;
          }

          // Debug: log the structure to understand it better
          // console.log(
          //   "Address data structure:",
          //   JSON.stringify(addressData, null, 2)
          // );

          // Extract postcode based on the structure from your image
          // The image shows: addresses: { city: "Surat", postcode: "125005" }
          let postcode = "UNKNOWN";

          if (addressData.addresses && addressData.addresses.postcode) {
            postcode = addressData.addresses.postcode;
          } else if (addressData.address && addressData.address.postcode) {
            postcode = addressData.address.postcode;
          } else if (addressData.postcode) {
            postcode = addressData.postcode;
          } else if (addressData.addresses) {
            // Try to handle case where addresses might be a string that needs parsing
            try {
              const parsedAddresses =
                typeof addressData.addresses === "string"
                  ? JSON.parse(addressData.addresses)
                  : addressData.addresses;

              if (parsedAddresses.postcode) {
                postcode = parsedAddresses.postcode;
              }
            } catch (e) {
              console.log("Could not parse addresses field as JSON");
            }
          }

          // Count by postcode
          if (postcodeCounts[postcode]) {
            postcodeCounts[postcode]++;
          } else {
            postcodeCounts[postcode] = 1;
          }
        } catch (error) {
          console.error("Error processing order:", order.id, error);
          if (postcodeCounts["ERROR_PROCESSING"]) {
            postcodeCounts["ERROR_PROCESSING"]++;
          } else {
            postcodeCounts["ERROR_PROCESSING"] = 1;
          }
        }
      });

      ordersByPostcode = Object.entries(postcodeCounts)
        .map(([postcode, count]) => ({ postcode, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
    } catch (error) {
      console.error("Error in postcode processing:", error);
      ordersByPostcode = [{ postcode: "ERROsR_PROCESSING", count: 0 }];
    }

    // --------- Revenue (last 12 months) ----------
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

    const dialect = sequelize.getDialect();
    let monthSelect;
    if (dialect === "postgres") {
      monthSelect = fn(
        "to_char",
        fn("date_trunc", "month", col("createdAt")),
        "YYYY-MM"
      );
    } else {
      monthSelect = fn("DATE_FORMAT", col("createdAt"), "%Y-%m");
    }

    const revenueRows = await Order.findAll({
      attributes: [
        [monthSelect, "ym"],
        [fn("COALESCE", fn("SUM", col("finalTotal")), 0), "revenue"],
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
      month: key,
      label: date.toLocaleString("en-US", { month: "short", year: "numeric" }),
      revenue: revenueMap.get(key) || 0,
    }));

    // --------- Recent orders ----------
    const recentOrdersRaw = await Order.findAll({
      where: { paymentStatus: "completed" },
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
        monthlyIncome,
      },
      charts: {
        revenueLast12Months,
      },
      tables: {
        recentOrdersRaw,
      },
      // Postcode statistics
      postcodeStats: {
        totalOrders,
        ordersByPostcode,
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
