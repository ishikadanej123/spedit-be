const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/isAdmin");
const router = express.Router();
const statsController = require("../controllers/stats.controller");

router.get(
  "/overview",
  authMiddleware,
  isAdmin,
  statsController.getStatsOverview
);

module.exports = router;
